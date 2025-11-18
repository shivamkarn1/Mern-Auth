import { Route, Routes } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AppContainer from "./components/AppContainer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import useAuth from "./hooks/useAuth";

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If user is logged in, show the dashboard
  if (user) {
    return <Dashboard />;
  }

  // Otherwise show the landing page
  return (
    <Box
      minH="100vh"
      bg="black"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="4xl" textAlign="center" py={20}>
        <VStack gap={8}>
          <Heading
            fontSize={{ base: "4xl", md: "6xl" }}
            fontWeight="bold"
            bgGradient="to-r"
            gradientFrom="blue.400"
            gradientTo="blue.600"
            bgClip="text"
          >
            Welcome to MERN Auth
          </Heading>
          <Text fontSize={{ base: "lg", md: "xl" }} color="gray.300" maxW="2xl">
            A secure authentication system built with MongoDB, Express, React,
            and Node.js. Featuring email verification, password reset, and
            session management.
          </Text>
          <Box mt={8}>
            <VStack gap={4}>
              <Button
                size="lg"
                colorScheme="blue"
                onClick={() => navigate("/login")}
                px={12}
              >
                Sign In
              </Button>
              <Button
                size="lg"
                variant="outline"
                borderColor="blue.500"
                color="blue.400"
                _hover={{ bg: "blue.900" }}
                onClick={() => navigate("/register")}
                px={12}
              >
                Create Account
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

function App() {
  return (
    <Box bg="black" minH="100vh">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset" element={<ResetPassword />} />
        <Route path="/email/verify/:code" element={<VerifyEmail />} />

        <Route element={<AppContainer />}>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
