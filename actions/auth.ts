"use server";

import { createClient } from "@/lib/supabase/server";
import { signUpSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signUp(formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    username: formData.get("username") as string,
  };

  const result = signUpSchema.safeParse(rawData);

  if (!result.success) {
    const firstError = result.error.issues[0];
    return redirect(
      `/auth/sign-up?error=${encodeURIComponent(firstError.message)}`
    );
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") || "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: { username: result.data.username },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    // Handle username constraint violation from DB trigger
    if (
      error.message.includes("duplicate key") ||
      error.message.includes("profiles_username_lower_idx") ||
      error.message.includes("username")
    ) {
      return redirect(
        `/auth/sign-up?error=${encodeURIComponent("That username is taken. The dot got here first.")}`
      );
    }
    return redirect(
      `/auth/sign-up?error=${encodeURIComponent("Something went wrong. Try again -- the dot believes in you.")}`
    );
  }

  return redirect("/auth/sign-up-success");
}
