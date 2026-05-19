import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>&copy; 2026 Made by nobody. Shaped by everybody.</p>
        <nav className="flex gap-4">
          <Link href="/changelog" className="hover:text-foreground">
            Changelog
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/impressum" className="hover:text-foreground">
            Impressum
          </Link>
        </nav>
      </div>
    </footer>
  );
}
