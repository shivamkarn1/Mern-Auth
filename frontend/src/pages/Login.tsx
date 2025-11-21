import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { login } from "../lib/api";
import queryClient from "../config/queryClient";
import { AUTH } from "../hooks/useAuth";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const redirectUrl = location.state?.redirectUrl || "/";

  const {
    mutate: signIn,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      console.log("Login successful, invalidating and fetching user...");
      // Invalidate and fetch user data
      await queryClient.invalidateQueries({ queryKey: [AUTH] });
      await queryClient.prefetchQuery({
        queryKey: [AUTH],
        queryFn: async () => {
          const { getUser } = await import("../lib/api");
          return await getUser();
        },
      });
      const userData = queryClient.getQueryData([AUTH]);
      console.log("User data after fetch:", userData);
      navigate(redirectUrl, {
        replace: true,
      });
    },
    onError: (err) => {
      console.error("Login error:", err);
    },
  });

  return (
    <Flex minH="100vh" align="center" justify="center" bg="black">
      <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
        <Heading fontSize="4xl" mb={8} color="white">
          Sign in to your account
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
              {(error as any)?.response?.data?.message ||
                (error as any)?.message ||
                "Invalid email or password"}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && email && password.length >= 6) {
                    signIn({ email, password });
                  }
                }}
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

            <ChakraLink
              asChild
              fontSize="sm"
              textAlign={{
                base: "center",
                sm: "right",
              }}
              color="blue.400"
              _hover={{ color: "blue.300" }}
            >
              <Link to="/password/forgot">Forgot password?</Link>
            </ChakraLink>
            <Button
              my={2}
              loading={isPending}
              disabled={!email || password.length < 6}
              onClick={() => signIn({ email, password })}
              colorScheme="blue"
              size="lg"
              w="full"
            >
              Sign in
            </Button>
            <Text textAlign="center" fontSize="sm" color="gray.400">
              Don&apos;t have an account?{" "}
              <ChakraLink
                asChild
                color="blue.400"
                _hover={{ color: "blue.300" }}
              >
                <Link to="/register">Sign up</Link>
              </ChakraLink>
            </Text>
          </Stack>
        </Box>
      </Container>
    </Flex>
  );
};
export default Login;
