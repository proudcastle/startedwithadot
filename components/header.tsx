import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/8bit/button";
import { LogoutButton } from "./logout-button";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();
    username = profile?.username ?? null;
  }

  return (
    <header className="w-full bg-card border-b border-border h-16 flex items-center">
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center px-5">
        <Link
          href="/"
          className="font-[family-name:var(--font-press-start-2p)] text-sm"
        >
          startedwithadot
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/proposals"
            className="font-[family-name:var(--font-press-start-2p)] text-sm text-muted-foreground hover:text-foreground"
          >
            Proposals
          </Link>
          {user ? (
            <>
              {username && (
                <span className="text-sm text-muted-foreground">
                  {username}
                </span>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="font-[family-name:var(--font-press-start-2p)] text-sm text-muted-foreground hover:text-foreground"
              >
                Log In
              </Link>
              <Link
                href="/auth/sign-up"
                className="font-[family-name:var(--font-press-start-2p)] text-sm text-muted-foreground hover:text-foreground"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
