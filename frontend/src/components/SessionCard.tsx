import { Box, Button, Flex, Text } from "@chakra-ui/react";
import useDeleteSession from "../hooks/useDeleteSession";
import type { Session } from "../types";

const SessionCard = ({ session }: { session: Session }) => {
  const { _id, createdAt, userAgent, isCurrent } = session;

  const { deleteSession, isPending, isError } = useDeleteSession(_id);

  const handleDelete = () => {
    console.log("Attempting to delete session:", _id);
    deleteSession();
  };

  return (
    <Flex
      p={3}
      borderWidth="1px"
      borderRadius="md"
      borderColor="gray.700"
      bg="#0a0a0a"
    >
      <Box flex={1}>
        <Text fontWeight="bold" fontSize="sm" mb={1} color="white">
          {new Date(createdAt).toLocaleString("en-US")}
          {isCurrent && " (current session)"}
        </Text>
        <Text color="gray.400" fontSize="xs">
          {userAgent}
        </Text>
        {isError && (
          <Text color="red.400" fontSize="xs" mt={1}>
            Failed to delete session
          </Text>
        )}
      </Box>
      {!isCurrent && (
        <Button
          size="sm"
          variant="ghost"
          ml={4}
          alignSelf="center"
          fontSize="xl"
          color="red.400"
          title="Delete Session"
          onClick={handleDelete}
          loading={isPending}
        >
          &times;
        </Button>
      )}
    </Flex>
  );
};
export default SessionCard;
