import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-[480px]">
        <Card>
          <CardHeader>
            <CardTitle className="font-[family-name:var(--font-press-start-2p)] text-xl leading-relaxed">
              Check your email.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We sent you a verification link. Click it. The dot is waiting.
            </p>
            <Link
              href="/auth/login"
              className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              Back to Log In
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
