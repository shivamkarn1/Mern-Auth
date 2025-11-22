import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSession } from "../lib/api";
import { SESSIONS } from "./useSession";
import type { Session } from "../types";

const useDeleteSession = (sessionId: string) => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation({
    mutationFn: () => deleteSession(sessionId),
    onSuccess: () => {
      queryClient.setQueryData<{ sessions: Session[] }>(
        [SESSIONS],
        (cache) => ({
          sessions:
            cache?.sessions.filter((session) => session._id !== sessionId) ||
            [],
        })
      );
    },
    onError: (error: any) => {
      console.error("Failed to delete session:", error);
      console.error("Session ID:", sessionId);
      console.error("Error details:", error.response?.data);
    },
  });

  return { deleteSession: mutate, ...rest };
};

export default useDeleteSession;
