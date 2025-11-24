import { Container, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import useSessions from "../hooks/useSession";
import SessionCard from "../components/SessionCard";
import type { Session } from "../types";

const Settings = () => {
  const { sessions, isPending, isSuccess, isError } = useSessions();

  console.log("Sessions data:", { sessions, isPending, isSuccess, isError });

  return (
    <Container mt={16} color="white">
      <Heading mb={6} color="white">
        My Sessions
      </Heading>
      {isPending && <Spinner />}
      {isError && <Text color="red.400">Failed to get sessions.</Text>}
      {isSuccess && Array.isArray(sessions) && sessions.length > 0 && (
        <VStack gap={3} alignItems="flex-start">
          {sessions.map((session: Session) => (
            <SessionCard key={session._id} session={session} />
          ))}
        </VStack>
      )}
      {isSuccess && Array.isArray(sessions) && sessions.length === 0 && (
        <Text color="gray.400">You have no active sessions.</Text>
      )}
    </Container>
  );
};
export default Settings;
