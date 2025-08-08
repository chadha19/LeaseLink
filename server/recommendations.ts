import { Property, User, Swipe } from "@shared/schema";

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

export class RecommendationService {
  static async generateRecommendations(
    user: User,
    properties: Property[],
    userSwipes: Swipe[] = []
  ): Promise<Property[]> {
    if (!properties.length) return properties;

    try {
      // Extract user preferences
      const preferences = this.extractUserPreferences(user);
      
      // Score properties using preference matching algorithm
      const scoredProperties = this.scorePropertiesByPreferences(
        preferences,
        properties,
        userSwipes
      );
      
      // Sort by score and return
      return this.sortPropertiesByScore(properties, scoredProperties);
    } catch (error) {
      console.error("Recommendation error:", error);
      // Return properties sorted by most recently added
      return properties.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
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

  private static scorePropertiesByPreferences(
    preferences: UserPreferences,
    properties: Property[],
    userSwipes: Swipe[]
  ): PropertyScore[] {
    const likedProperties = userSwipes
      .filter(s => s.direction === "right")
      .map(s => properties.find(p => p.id === s.propertyId))
      .filter(Boolean) as Property[];

    return properties.map(property => {
      let score = 50; // Base score
      let reasoning = [];

      // Budget scoring (30 points max)
      const budgetScore = this.scoreBudgetFit(property.price, preferences.budget);
      score += budgetScore;
      if (budgetScore > 20) reasoning.push("good budget fit");
      else if (budgetScore < 10) reasoning.push("outside budget range");

      // Location scoring (25 points max)
      if (preferences.location.length > 0) {
        const locationScore = preferences.location.includes(property.zipCode) ? 25 : 0;
        score += locationScore;
        if (locationScore > 0) reasoning.push("preferred location");
      }

      // Bedroom/bathroom scoring (20 points max)
      if (preferences.bedrooms && property.bedrooms === preferences.bedrooms) {
        score += 15;
        reasoning.push("ideal bedroom count");
      }
      if (preferences.bathrooms && property.bathrooms >= preferences.bathrooms) {
        score += 10;
        reasoning.push("sufficient bathrooms");
      }

      // Pet-friendly scoring (10 points max)
      if (preferences.petFriendly && property.amenities?.includes("Pet Friendly")) {
        score += 10;
        reasoning.push("pet-friendly");
      }

      // Similar to liked properties (15 points max)
      if (likedProperties.length > 0) {
        const similarityScore = this.scoreSimilarityToLiked(property, likedProperties);
        score += similarityScore;
        if (similarityScore > 8) reasoning.push("similar to liked properties");
      }

      return {
        propertyId: property.id,
        score: Math.min(100, Math.max(1, score)),
        reasoning: reasoning.join(", ") || "basic match"
      };
    });
  }

  private static scoreBudgetFit(price: number, budget: { min: number; max: number }): number {
    if (price >= budget.min && price <= budget.max) {
      // Perfect fit - full points
      return 30;
    } else if (price < budget.min) {
      // Under budget - good but maybe too cheap
      const underBy = budget.min - price;
      const underPercentage = underBy / budget.min;
      return Math.max(0, 30 - (underPercentage * 20));
    } else {
      // Over budget - penalize based on how much over
      const overBy = price - budget.max;
      const overPercentage = overBy / budget.max;
      return Math.max(0, 30 - (overPercentage * 40));
    }
  }

  private static scoreSimilarityToLiked(property: Property, likedProperties: Property[]): number {
    let similarityScore = 0;
    const avgLikedPrice = likedProperties.reduce((sum, p) => sum + p.price, 0) / likedProperties.length;
    const commonBedrooms = this.getMostCommon(likedProperties.map(p => p.bedrooms));
    
    // Price similarity (5 points max)
    const priceDiff = Math.abs(property.price - avgLikedPrice);
    const pricePercentDiff = priceDiff / avgLikedPrice;
    if (pricePercentDiff < 0.2) similarityScore += 5;
    else if (pricePercentDiff < 0.4) similarityScore += 3;

    // Bedroom similarity (5 points max)
    if (property.bedrooms === commonBedrooms) similarityScore += 5;

    // Amenity overlap (5 points max)
    const commonAmenities = this.getMostCommonAmenities(likedProperties);
    const amenityOverlap = (property.amenities || []).filter(a => commonAmenities.includes(a)).length;
    similarityScore += Math.min(5, amenityOverlap * 2);

    return similarityScore;
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