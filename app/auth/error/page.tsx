import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import Link from "next/link";
import { Suspense } from "react";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <p className="text-sm text-muted-foreground">
      {params?.error
        ? params.error
        : "Something went wrong. Try again -- the dot believes in you."}
    </p>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-[480px]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="font-[family-name:var(--font-press-start-2p)] text-xl leading-relaxed">
                Something went wrong.
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Suspense>
                <ErrorContent searchParams={searchParams} />
              </Suspense>
              <Link
                href="/auth/login"
                className="inline-block text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                Try Again
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
