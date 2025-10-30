import { z } from "zod";

const emailSchema = z.string().email().min(1).max(255);
const passwordSchema = z.string().min(7).max(255);

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(7).max(255),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export { loginSchema, registerSchema };
