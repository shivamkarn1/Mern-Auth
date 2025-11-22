import { useQuery } from "@tanstack/react-query";
import { getSessions } from "../lib/api";
import type { Session } from "../types";

export const SESSIONS = "sessions";

const useSessions = (opts: any = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: [SESSIONS],
    queryFn: getSessions,
    ...opts,
  });

  // Handle both array response and object with sessions property
  const sessions = Array.isArray(data) ? data : (data as any)?.sessions || [];

  return { sessions, ...rest };
};
export default useSessions;
