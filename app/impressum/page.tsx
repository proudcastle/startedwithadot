import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum | startedwithadot",
  description: "Legal disclosure for It All Started With a Dot.",
};

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <h1 className="font-[family-name:var(--font-press-start-2p)] text-xl text-foreground mb-6">
        Impressum
      </h1>
      <p className="text-muted-foreground mb-6">
        Legally required disclosure: someone made this. A dot was involved.
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
