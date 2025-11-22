import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  Badge,
  Code,
  Button,
  Input,
} from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { logout, sendPasswordResetEmail } from "../lib/api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import queryClient from "../config/queryClient";

interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  protected: boolean;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resetEmail, setResetEmail] = useState("");

  const { mutate: handleLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries();
      navigate("/login", { replace: true });
    },
  });

  const {
    mutate: handlePasswordReset,
    isPending: isSendingReset,
    isSuccess: resetSuccess,
  } = useMutation({
    mutationFn: sendPasswordResetEmail,
    onSuccess: () => {
      setResetEmail("");
    },
  });

  const apiEndpoints: APIEndpoint[] = [
    {
      method: "POST",
      path: "/auth/register",
      description: "Register a new user account",
      protected: false,
    },
    {
      method: "POST",
      path: "/auth/login",
      description: "Login with email and password",
      protected: false,
    },
    {
      method: "GET",
      path: "/auth/logout",
      description: "Logout from current session",
      protected: true,
    },
    {
      method: "GET",
      path: "/auth/refresh",
      description: "Refresh access token",
      protected: false,
    },
    {
      method: "GET",
      path: "/auth/email/verify/:code",
      description: "Verify email with verification code",
      protected: false,
    },
    {
      method: "POST",
      path: "/auth/password/forgot",
      description: "Send password reset email",
      protected: false,
    },
    {
      method: "POST",
      path: "/auth/password/reset",
      description: "Reset password with verification code",
      protected: false,
    },
    {
      method: "GET",
      path: "/user",
      description: "Get current user information",
      protected: true,
    },
    {
      method: "GET",
      path: "/sessions",
      description: "Get all active sessions for current user",
      protected: true,
    },
    {
      method: "DELETE",
      path: "/sessions/:id",
      description: "Delete a specific session",
      protected: true,
    },
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "green";
      case "POST":
        return "blue";
      case "DELETE":
        return "red";
      case "PUT":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      py={12}
    >
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }

          .fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }

          .slide-in-left {
            animation: slideInLeft 0.5s ease-out forwards;
          }

          .stagger-1 { animation-delay: 0.1s; opacity: 0; }
          .stagger-2 { animation-delay: 0.2s; opacity: 0; }
          .stagger-3 { animation-delay: 0.3s; opacity: 0; }
          .stagger-4 { animation-delay: 0.4s; opacity: 0; }
          .stagger-5 { animation-delay: 0.5s; opacity: 0; }
          .stagger-6 { animation-delay: 0.6s; opacity: 0; }

          .card-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          }

          .endpoint-card {
            transition: all 0.3s ease;
            border-left: 3px solid transparent;
          }

          .endpoint-card:hover {
            transform: translateX(4px);
            border-left-color: #667eea;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          }
        `}
      </style>

      <Container maxW="1200px">
        <VStack gap={10} align="stretch">
          {/* Welcome Section with Logout */}
          <Box textAlign="center" color="white" className="fade-in-up">
            <Heading size="2xl" mb={4} fontWeight="700" letterSpacing="tight">
              Welcome to MERN Auth Dashboard
            </Heading>
            {user && (
              <VStack gap={4}>
                <HStack
                  justify="center"
                  gap={2}
                  fontSize="lg"
                  className="fade-in stagger-1"
                >
                  <Text opacity={0.9}>Logged in as:</Text>
                  <Code
                    colorScheme="whiteAlpha"
                    px={3}
                    py={1}
                    borderRadius="md"
                    fontSize="md"
                    bg="whiteAlpha.300"
                    color="white"
                  >
                    {user.email}
                  </Code>
                </HStack>
                <Button
                  colorScheme="red"
                  size="lg"
                  onClick={() => handleLogout()}
                  loading={isLoggingOut}
                  px={8}
                >
                  Logout
                </Button>
              </VStack>
            )}
          </Box>

          {/* Password Reset Section */}
          <Card.Root
            p={8}
            bg="white"
            shadow="2xl"
            borderRadius="xl"
            className="card-hover fade-in-up stagger-1"
          >
            <Heading size="lg" mb={6} color="gray.800" fontWeight="600">
              Password Reset
            </Heading>
            <VStack gap={4} align="stretch">
              <Text color="gray.600" fontSize="md">
                Enter your email address to receive a password reset link
              </Text>
              <HStack gap={3}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  size="lg"
                  bg="gray.50"
                />
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={() => handlePasswordReset(resetEmail)}
                  loading={isSendingReset}
                  disabled={!resetEmail || isSendingReset}
                  px={8}
                >
                  Send Reset Link
                </Button>
              </HStack>
              {resetSuccess && (
                <Text color="green.600" fontSize="sm" fontWeight="500">
                  ✓ Password reset email sent successfully! Check your inbox.
                </Text>
              )}
            </VStack>
          </Card.Root>

          {/* Features Section */}
          <Card.Root
            p={8}
            bg="white"
            shadow="2xl"
            borderRadius="xl"
            className="card-hover fade-in-up stagger-2"
          >
            <Heading size="lg" mb={6} color="gray.800" fontWeight="600">
              Quick Actions
            </Heading>
            <VStack align="stretch" gap={4}>
              <HStack gap={3} flexWrap="wrap">
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={() => navigate("/settings")}
                  flex="1"
                  minW="200px"
                >
                  📧 View Sessions
                </Button>
                <Button
                  colorScheme="purple"
                  size="lg"
                  onClick={() => navigate("/profile")}
                  flex="1"
                  minW="200px"
                >
                  👤 My Profile
                </Button>
                <Button
                  colorScheme="teal"
                  size="lg"
                  onClick={() => navigate("/password/forgot")}
                  flex="1"
                  minW="200px"
                >
                  🔑 Reset Password
                </Button>
              </HStack>
              <Text color="gray.600" fontSize="sm" mt={2}>
                Access all authentication features and manage your account
              </Text>
            </VStack>
          </Card.Root>

          {/* API Endpoints Section */}
          <Card.Root
            p={8}
            bg="white"
            shadow="2xl"
            borderRadius="xl"
            className="card-hover fade-in-up stagger-3"
          >
            <Heading size="lg" mb={2} color="gray.800" fontWeight="600">
              API Endpoints
            </Heading>
            <HStack mb={6} gap={2}>
              <Text color="gray.600" fontSize="sm">
                Base URL:
              </Text>
              <Code
                colorScheme="gray"
                px={3}
                py={1}
                borderRadius="md"
                fontSize="sm"
              >
                http://localhost:4000
              </Code>
            </HStack>

            <VStack gap={3} align="stretch">
              {apiEndpoints.map((endpoint, index) => (
                <Card.Root
                  key={index}
                  p={4}
                  bg="gray.50"
                  borderRadius="lg"
                  shadow="sm"
                  className={`endpoint-card slide-in-left stagger-${
                    (index % 6) + 1
                  }`}
                >
                  <HStack
                    justify="space-between"
                    align="start"
                    flexWrap="wrap"
                    gap={2}
                  >
                    <HStack gap={3} flex="1" minW="250px">
                      <Badge
                        colorScheme={getMethodColor(endpoint.method)}
                        px={3}
                        py={1}
                        borderRadius="md"
                        fontSize="xs"
                        fontWeight="700"
                        letterSpacing="wide"
                      >
                        {endpoint.method}
                      </Badge>
                      <Code
                        fontSize="sm"
                        px={2}
                        py={1}
                        borderRadius="md"
                        bg="white"
                        color="gray.700"
                        fontWeight="500"
                      >
                        {endpoint.path}
                      </Code>
                      {endpoint.protected && (
                        <Badge
                          colorScheme="orange"
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontSize="xs"
                          fontWeight="600"
                        >
                          🔒 Protected
                        </Badge>
                      )}
                    </HStack>
                    <Text
                      color="gray.600"
                      fontSize="sm"
                      textAlign="right"
                      flex="1"
                      minW="200px"
                    >
                      {endpoint.description}
                    </Text>
                  </HStack>
                </Card.Root>
              ))}
            </VStack>
          </Card.Root>

          {/* Tech Stack Section */}
          <Card.Root
            p={8}
            bg="white"
            shadow="2xl"
            borderRadius="xl"
            className="card-hover fade-in-up stagger-4"
          >
            <Heading size="lg" mb={6} color="gray.800" fontWeight="600">
              Tech Stack
            </Heading>
            <HStack gap={4} justify="center" flexWrap="wrap">
              {[
                { name: "MongoDB", color: "green" },
                { name: "Express.js", color: "gray" },
                { name: "React", color: "cyan" },
                { name: "Node.js", color: "green" },
                { name: "TypeScript", color: "blue" },
                { name: "Chakra UI", color: "teal" },
              ].map((tech, idx) => (
                <Badge
                  key={idx}
                  colorScheme={tech.color}
                  px={5}
                  py={2}
                  borderRadius="full"
                  fontSize="md"
                  fontWeight="600"
                  shadow="sm"
                  className={`fade-in stagger-${idx + 1}`}
                  _hover={{
                    transform: "scale(1.05)",
                    transition: "transform 0.2s",
                  }}
                >
                  {tech.name}
                </Badge>
              ))}
            </HStack>
          </Card.Root>
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard;
