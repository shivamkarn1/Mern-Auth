import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
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
import { register } from "../lib/api";
import queryClient from "../config/queryClient";
import { AUTH } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    mutate: createAccount,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: register,
    onSuccess: async () => {
      // Refetch the auth query to load user data
      await queryClient.refetchQueries({ queryKey: [AUTH] });
      navigate("/", {
        replace: true,
      });
    },
  });
  return (
    <Flex minH="100vh" align="center" justify="center" bg="black">
      <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
        <Heading fontSize="4xl" mb={6} color="white">
          Create an account
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
              {error?.message || "An error occurred"}
            </Box>
          )}
          <Stack gap={4}>
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
            <Box>
              <Text mb={2} color="gray.300" textAlign="left">
                Password
              </Text>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <Text color="text.muted" fontSize="xs" textAlign="left" mt={2}>
                - Must be at least 6 characters long.
              </Text>
            </Box>
            <Box>
              <Text mb={2} color="gray.300" textAlign="left">
                Confirm Password
              </Text>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  createAccount({ email, password, confirmPassword })
                }
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
              disabled={
                !email || password.length < 6 || password !== confirmPassword
              }
              onClick={() =>
                createAccount({ email, password, confirmPassword })
              }
              colorScheme="blue"
              size="lg"
              w="full"
            >
              Create Account
            </Button>
            <Text textAlign="center" fontSize="sm" color="gray.400">
              Already have an account?{" "}
              <ChakraLink
                asChild
                color="blue.400"
                _hover={{ color: "blue.300" }}
              >
                <Link to="/login">Sign in</Link>
              </ChakraLink>
            </Text>
          </Stack>
        </Box>
      </Container>
    </Flex>
  );
};
export default Register;
