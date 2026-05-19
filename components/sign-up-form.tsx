"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/8bit/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import { Input } from "@/components/ui/8bit/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { signUpSchema, usernameSchema } from "@/lib/validations/auth";
import { signUp } from "@/actions/auth";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const serverError = searchParams.get("error");

  const checkUsernameAvailability = useCallback(async (value: string) => {
    const result = usernameSchema.safeParse(value);
    if (!result.success) return;

    setUsernameStatus("checking");
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .ilike("username", value)
        .limit(1);

      setUsernameStatus(data && data.length > 0 ? "taken" : "available");
    } catch {
      setUsernameStatus("idle");
    }
  }, []);

  const validateField = (field: string, value: string) => {
    const errors = { ...fieldErrors };

    if (field === "username") {
      const result = usernameSchema.safeParse(value);
      if (!result.success) {
        errors.username = result.error.issues[0].message;
      } else {
        delete errors.username;
      }
    }

    setFieldErrors(errors);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const data = { email, password, username };
    const result = signUpSchema.safeParse(data);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    // Submit via server action
    const formData = new FormData();
    formData.set("username", username);
    formData.set("email", email);
    formData.set("password", password);

    try {
      await signUp(formData);
    } catch {
      // Server action redirects on both success and error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-[480px] mx-auto">
        <CardHeader className="space-y-2">
          <CardTitle className="font-[family-name:var(--font-press-start-2p)] text-xl leading-relaxed">
            Join the experiment.
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Pick a username. It&apos;s permanent. Choose wisely.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="your-username"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (e.target.value.length >= 3) {
                      validateField("username", e.target.value);
                    }
                  }}
                  onBlur={() => {
                    validateField("username", username);
                    if (!fieldErrors.username && username.length >= 3) {
                      checkUsernameAvailability(username);
                    }
                  }}
                />
                {fieldErrors.username && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.username}
                  </p>
                )}
                {usernameStatus === "checking" && (
                  <p className="text-sm text-muted-foreground">Checking...</p>
                )}
                {usernameStatus === "available" && !fieldErrors.username && (
                  <p className="text-sm text-green-500">Available</p>
                )}
                {usernameStatus === "taken" && (
                  <p className="text-sm text-destructive">
                    That username is taken. The dot got here first.
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {fieldErrors.email && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.email}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="at least 6 characters"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {fieldErrors.password && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.password}
                  </p>
                )}
              </div>
              {serverError && (
                <p className="text-sm text-destructive">{serverError}</p>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Account"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                href="/auth/login"
                className="text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                Log In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
