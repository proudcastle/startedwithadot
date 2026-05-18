import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function UserInfo() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <p className="text-sm text-muted-foreground">
      You are logged in as {user.email}.
    </p>
  );
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-[family-name:var(--font-press-start-2p)] text-xl mb-4">
          Protected page
        </h2>
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
          <UserInfo />
        </Suspense>
      </div>
    </div>
  );
}
