"use client";

import { Button } from "@/components/ui/8bit/button";
import { type ComponentProps } from "react";

type SubmitButtonProps = ComponentProps<typeof Button> & {
  pendingText?: string;
  isPending?: boolean;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  isPending = false,
  ...props
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={isPending} {...props}>
      {isPending ? pendingText : children}
    </Button>
  );
}
