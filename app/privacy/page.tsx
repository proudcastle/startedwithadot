import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy | startedwithadot",
  description: "Privacy policy for It All Started With a Dot.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <h1 className="font-[family-name:var(--font-press-start-2p)] text-xl text-foreground mb-6">
        Privacy
      </h1>
      <p className="text-muted-foreground mb-6">
        This page exists because lawyers exist. We collect your email and your
        opinions about a dot. That&apos;s it.
      </p>
      <Link
        href="/"
        className="text-foreground underline underline-offset-4"
      >
        Back to the dot
      </Link>
    </div>
  );
}
