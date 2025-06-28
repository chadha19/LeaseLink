import OpenAI from "openai";
import { Property, User, Swipe } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface UserPreferences {
  budget: { min: number; max: number };
  location: string[];
  bedrooms: number | null;
  bathrooms: number | null;
  petFriendly: boolean;
  lifestyle: string;
}

interface PropertyScore {
  propertyId: string;
  score: number;
  reasoning: string;
}

export class AIRecommendationService {
  static async generateRecommendations(
    user: User,
    properties: Property[],
    userSwipes: Swipe[] = []
  ): Promise<Property[]> {
    if (!properties.length) return properties;

    try {
      // Extract user preferences
      const preferences = this.extractUserPreferences(user);
      
      // Get swipe history insights
      const swipeInsights = this.analyzeSwipeHistory(userSwipes, properties);
      
      // Score properties using AI
      const scoredProperties = await this.scoreProperties(
        preferences,
        properties,
        swipeInsights
      );
      
      // Sort by score and return
      return this.sortPropertiesByScore(properties, scoredProperties);
    } catch (error) {
      console.error("AI recommendation error:", error);
      // Fallback to original order if AI fails
      return properties;
    }
  }

  private static extractUserPreferences(user: User): UserPreferences {
    return {
      budget: {
        min: user.budgetMin || 0,
        max: user.budgetMax || 999999
      },
      location: user.preferredZipCodes || [],
      bedrooms: user.preferredBedrooms,
      bathrooms: user.preferredBathrooms,
      petFriendly: user.petFriendly || false,
      lifestyle: this.inferLifestyle(user)
    };
  }

  private static inferLifestyle(user: User): string {
    const income = user.monthlyIncome || 0;
    const creditScore = user.creditScore || 0;
    
    if (income > 8000 && creditScore > 750) return "luxury";
    if (income > 5000 && creditScore > 700) return "professional";
    if (income > 3000) return "moderate";
    return "budget-conscious";
  }

  private static analyzeSwipeHistory(swipes: Swipe[], properties: Property[]): string {
    if (!swipes.length) return "No previous swipe history";

    const likes = swipes.filter(s => s.direction === "right");
    const dislikes = swipes.filter(s => s.direction === "left");

    if (!likes.length) return "No liked properties yet";

    const likedProperties = properties.filter(p => 
      likes.some(like => like.propertyId === p.id)
    );

    const avgLikedPrice = likedProperties.reduce((sum, p) => sum + p.price, 0) / likedProperties.length;
    const commonBedrooms = this.getMostCommon(likedProperties.map(p => p.bedrooms));
    const commonAmenities = this.getMostCommonAmenities(likedProperties);

    return `User tends to like properties around $${avgLikedPrice.toFixed(0)}, ${commonBedrooms} bedrooms, with amenities: ${commonAmenities.join(", ")}`;
  }

  private static getMostCommon<T>(array: T[]): T {
    const counts = array.reduce((acc, item) => {
      acc[item as string] = (acc[item as string] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts).reduce((a, b) => 
      counts[a] > counts[b] ? a : b
    ) as T;
  }

  private static getMostCommonAmenities(properties: Property[]): string[] {
    const allAmenities = properties.flatMap(p => p.amenities || []);
    const counts = allAmenities.reduce((acc, amenity) => {
      acc[amenity] = (acc[amenity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([amenity]) => amenity);
  }

  private static async scoreProperties(
    preferences: UserPreferences,
    properties: Property[],
    swipeInsights: string
  ): Promise<PropertyScore[]> {
    const propertyData = properties.map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      zipCode: p.zipCode,
      amenities: p.amenities || [],
      address: p.address
    }));

    const prompt = `
You are a real estate recommendation AI. Score properties from 1-100 based on user preferences and behavior.

User Preferences:
- Budget: $${preferences.budget.min} - $${preferences.budget.max}
- Preferred locations: ${preferences.location.join(", ") || "Any"}
- Bedrooms: ${preferences.bedrooms || "Any"}
- Bathrooms: ${preferences.bathrooms || "Any"}
- Pet friendly: ${preferences.petFriendly}
- Lifestyle: ${preferences.lifestyle}

User Behavior Insights:
${swipeInsights}

Properties to score:
${JSON.stringify(propertyData, null, 2)}

Return a JSON array of objects with propertyId, score (1-100), and brief reasoning.
Focus on: budget fit, location match, size preferences, lifestyle compatibility, and past behavior patterns.

Format: [{"propertyId": "id", "score": 85, "reasoning": "Perfect budget fit, matches preferred area"}]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a real estate recommendation expert. Provide property scores in valid JSON format only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0].message.content || "[]");
    return Array.isArray(result) ? result : result.scores || [];
  }

  private static sortPropertiesByScore(
    properties: Property[],
    scores: PropertyScore[]
  ): Property[] {
    const scoreMap = new Map(scores.map(s => [s.propertyId, s.score]));
    
    return properties
      .map(property => ({
        property,
        score: scoreMap.get(property.id) || 50 // Default score if not found
      }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.property);
  }
}