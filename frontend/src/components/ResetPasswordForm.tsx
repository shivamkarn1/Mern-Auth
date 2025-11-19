import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";
import { resetPassword } from "../lib/api";

const ResetPasswordForm = ({ code }: { code: string }) => {
  const [password, setPassword] = useState("");
  const {
    mutate: resetUserPassword,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: resetPassword,
  });
  return (
    <>
      <Heading fontSize="4xl" mb={8} color="white">
        Change your password
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
        {isSuccess ? (
          <Box>
            <Box p={4} bg="green.500" borderRadius={12} mb={3} color="white">
              Password updated successfully!
            </Box>
            <ChakraLink asChild color="blue.400" _hover={{ color: "blue.300" }}>
              <Link to="/login" replace>
                Sign in
              </Link>
            </ChakraLink>
          </Box>
        ) : (
          <Stack gap={4}>
            <Box>
              <Text mb={2} color="gray.300" textAlign="left">
                New Password (minimum 7 characters)
              </Text>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  password.length >= 7 &&
                  resetUserPassword({ password, verificationCode: code })
                }
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
              disabled={password.length < 7}
              onClick={() =>
                resetUserPassword({
                  password,
                  verificationCode: code,
                })
              }
              colorScheme="blue"
              size="lg"
              w="full"
            >
              Reset Password
            </Button>
          </Stack>
        )}
      </Box>
    </>
  );
};
export default ResetPasswordForm;
