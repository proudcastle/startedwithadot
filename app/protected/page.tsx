import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/8bit/badge";
import { Suspense } from "react";

async function UserInfo() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch username from profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  const username = profile?.username ?? user.user_metadata?.username ?? "user";
  const isVerified = !!user.email_confirmed_at;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <p className="text-muted-foreground">
          Welcome, <span className="text-foreground">{username}</span>.
        </p>
        {!isVerified && (
          <Badge variant="destructive">Unverified</Badge>
        )}
      </div>
      {!isVerified && (
        <p className="text-sm text-muted-foreground">
          Verify your email to unlock the fun stuff. Check your inbox.
        </p>
      )}
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="font-[family-name:var(--font-press-start-2p)] text-xl leading-relaxed">
        You&apos;re in.
      </h1>
      <Suspense
        fallback={
          <p className="text-sm text-muted-foreground">Loading...</p>
        }
      >
        <UserInfo />
      </Suspense>
    </div>
  );
}
