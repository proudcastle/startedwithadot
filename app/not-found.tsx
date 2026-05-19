import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
      <h1 className="font-[family-name:var(--font-press-start-2p)] text-4xl mb-4">
        404
      </h1>
      <p className="text-muted-foreground mb-6">
        This page doesn&apos;t exist. Much like this game&apos;s roadmap.
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
