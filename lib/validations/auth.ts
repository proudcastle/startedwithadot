import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Username needs at least 3 characters. Even the dot has standards.")
  .max(20, "20 characters max. Keep it tight.")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Letters, numbers, hyphens, underscores. That's the alphabet here."
  );

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: usernameSchema,
});

export type SignUpInput = z.infer<typeof signUpSchema>;
