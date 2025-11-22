import { useQuery } from "@tanstack/react-query";
import { getUser } from "../lib/api";
import type { User } from "../types";

export const AUTH = "auth";

const useAuth = (opts = {}) => {
  const { data: user, ...rest } = useQuery<User | null>({
    queryKey: [AUTH],
    queryFn: async () => {
      try {
        const userData = await getUser();
        return userData;
      } catch (error) {
        return null;
      }
    },
    staleTime: Infinity,
    retry: 1,
    retryDelay: 1000,
    ...opts,
  });
  return {
    user: user === null ? undefined : user,
    ...rest,
  };
};

export default useAuth;
