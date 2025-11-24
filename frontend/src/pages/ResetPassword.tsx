import { useSearchParams, Link } from "react-router-dom";
import {
  Container,
  Flex,
  Link as ChakraLink,
  VStack,
  Box,
  Text,
} from "@chakra-ui/react";
import ResetPasswordForm from "../components/ResetPasswordForm";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const exp = Number(searchParams.get("exp"));
  const now = Date.now();
  const linkIsValid = code && exp && exp > now;

  return (
    <Flex minH="100vh" justify="center" bg="black">
      <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
        {linkIsValid ? (
          <ResetPasswordForm code={code} />
        ) : (
          <VStack alignItems="center" gap={6}>
            <Box
              p={4}
              bg="red.500"
              w="fit-content"
              borderRadius={12}
              color="white"
            >
              Invalid Link
            </Box>
            <Text color="gray.400">The link is either invalid or expired.</Text>
            <ChakraLink asChild>
              <Link to="/password/forgot" replace>
                Request a new password reset link
              </Link>
            </ChakraLink>
          </VStack>
        )}
      </Container>
    </Flex>
  );
};
export default ResetPassword;
