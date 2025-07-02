import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    throwOnError: false, // Prevent unhandled promise rejections
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
