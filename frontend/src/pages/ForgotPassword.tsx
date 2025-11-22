import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Flex,
  Box,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  Link as ChakraLink,
  Container,
} from "@chakra-ui/react";
import { sendPasswordResetEmail } from "../lib/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const {
    mutate: sendPasswordReset,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: sendPasswordResetEmail,
  });

  return (
    <Flex minH="100vh" align="center" justify="center" bg="black">
      <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
        <Heading fontSize="4xl" mb={8} color="white">
          Reset your password
        </Heading>
        <Box
          rounded="lg"
          bg="#0a0a0a"
          boxShadow="2xl"
          border="1px"
          borderColor="gray.800"
          p={8}
        >
          {isError && (
            <Box mb={3} color="red.400">
              {error.message || "An error occurred"}
            </Box>
          )}
          <Stack gap={4}>
            {isSuccess ? (
              <Box p={4} bg="green.500" borderRadius={12} color="white">
                Email sent! Check your inbox for further instructions.
              </Box>
            ) : (
              <>
                <Box>
                  <Text mb={2} color="gray.300" textAlign="left">
                    Email address
                  </Text>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    bg="black"
                    border="1px"
                    borderColor="gray.700"
                    color="white"
                    _hover={{ borderColor: "blue.500" }}
                    _focus={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                    }}
                  />
                </Box>
                <Button
                  my={2}
                  loading={isPending}
                  disabled={!email}
                  onClick={() => sendPasswordReset(email)}
                  colorScheme="blue"
                  size="lg"
                  w="full"
                >
                  Reset Password
                </Button>
              </>
            )}
            <Text textAlign="center" fontSize="sm" color="gray.400">
              Go back to{" "}
              <ChakraLink
                asChild
                color="blue.400"
                _hover={{ color: "blue.300" }}
              >
                <Link to="/login" replace>
                  Sign in
                </Link>
              </ChakraLink>
              &nbsp;or&nbsp;
              <ChakraLink
                asChild
                color="blue.400"
                _hover={{ color: "blue.300" }}
              >
                <Link to="/register" replace>
                  Sign up
                </Link>
              </ChakraLink>
            </Text>
          </Stack>
        </Box>
      </Container>
    </Flex>
  );
};
export default ForgotPassword;
