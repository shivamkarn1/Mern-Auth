import { Box, Button, Center, Heading, Spinner, Text } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import { resendVerificationEmail } from "../lib/api";

const Profile = () => {
  const { user, isPending } = useAuth();
  const {
    mutate: resendEmail,
    isPending: isResending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: resendVerificationEmail,
  });

  if (isPending) {
    return (
      <Center mt={16}>
        <Spinner />
      </Center>
    );
  }

  if (!user) {
    return (
      <Center mt={16}>
        <Text color="red.400">Unable to load user data</Text>
      </Center>
    );
  }

  const { email, verified, createdAt } = user;

  return (
    <Center mt={16} flexDir="column" color="white">
      <Heading mb={4} color="white">
        My Account
      </Heading>
      {!verified && (
        <Box mb={4} textAlign="center">
          <Box
            p={4}
            bg="yellow.500"
            w="fit-content"
            borderRadius={12}
            mb={3}
            color="black"
            mx="auto"
          >
            Please verify your email
          </Box>
          {isSuccess && (
            <Text color="green.400" mb={2} fontSize="sm">
              Verification email sent! Check your inbox.
            </Text>
          )}
          {isError && (
            <Text color="red.400" mb={2} fontSize="sm">
              Failed to send email. Please try again.
            </Text>
          )}
          <Button
            onClick={() => resendEmail()}
            loading={isResending}
            colorScheme="blue"
            size="sm"
          >
            Resend Verification Email
          </Button>
        </Box>
      )}
      <Text color="white" mb={2}>
        Email:{" "}
        <Text as="span" color="gray.300">
          {email}
        </Text>
      </Text>
      <Text color="white">
        Created on{" "}
        <Text as="span" color="gray.300">
          {new Date(createdAt).toLocaleDateString("en-US")}
        </Text>
      </Text>
    </Center>
  );
};
export default Profile;
