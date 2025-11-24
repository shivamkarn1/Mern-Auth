import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Flex,
  Link as ChakraLink,
  Spinner,
  Text,
  Box,
  VStack,
} from "@chakra-ui/react";
import { verifyEmail } from "../lib/api";

const VerifyEmail = () => {
  const { code } = useParams();
  const { isPending, isSuccess, isError } = useQuery({
    queryKey: ["emailVerification", code],
    queryFn: () => verifyEmail(code!),
    enabled: !!code,
  });

  return (
    <Flex minH="100vh" justify="center" mt={12} bg="black">
      <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
        {isPending ? (
          <Spinner />
        ) : (
          <VStack alignItems="center" gap={6}>
            <Box
              p={4}
              bg={isSuccess ? "green.500" : "red.500"}
              w="fit-content"
              borderRadius={12}
              color="white"
            >
              {isSuccess ? "Email Verified!" : "Invalid Link"}
            </Box>
            {isError && (
              <Text color="gray.400">
                The link is either invalid or expired.{" "}
                <ChakraLink
                  asChild
                  color="blue.400"
                  _hover={{ color: "blue.300" }}
                >
                  <Link to="/password/forgot" replace>
                    Get a new link
                  </Link>
                </ChakraLink>
              </Text>
            )}
            <ChakraLink asChild color="blue.400" _hover={{ color: "blue.300" }}>
              <Link to="/" replace>
                Back to home
              </Link>
            </ChakraLink>
          </VStack>
        )}
      </Container>
    </Flex>
  );
};
export default VerifyEmail;
