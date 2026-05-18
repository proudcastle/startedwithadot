"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/8bit/input";
import { SubmitButton } from "@/components/submit-button";
import { submitProposal } from "@/actions/proposals";
import { toast } from "sonner";
import Link from "next/link";

interface ProposalInputProps {
  isAuthenticated: boolean;
  isVerified: boolean;
}

const MAX_CHARS = 140;

function getMilestoneMessage(remaining: number): string | null {
  if (remaining === MAX_CHARS) return "140 characters. Make them count.";
  if (remaining <= 0) return "That's it. Submit or trim.";
  if (remaining <= 20) return "Almost out. Choose wisely.";
  if (remaining <= 50) return "Getting tight...";
  return null;
}

export function ProposalInput({
  isAuthenticated,
  isVerified,
}: ProposalInputProps) {
  const [state, formAction, isPending] = useActionState(
    submitProposal,
    undefined
  );
  const [text, setText] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const remaining = MAX_CHARS - text.length;
  const milestoneMessage = getMilestoneMessage(remaining);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setText("");
      formRef.current?.reset();
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">
          Got an idea?{" "}
          <Link
            href="/auth/sign-up"
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
          >
            Sign up to tell the dot.
          </Link>
        </p>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">
          Verify your email first. The dot needs to know you&apos;re real.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            name="text"
            type="text"
            placeholder="What should the dot do next?"
            maxLength={MAX_CHARS}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isPending}
          />
        </div>
        <SubmitButton isPending={isPending} pendingText="Sending...">
          Submit Proposal
        </SubmitButton>
      </div>
      <div className="flex items-center justify-between">
        <p
          className={`text-sm ${remaining <= 20 ? "text-foreground" : "text-muted-foreground"}`}
        >
          {remaining}
        </p>
        {milestoneMessage && (
          <p
            className={`text-sm ${remaining <= 20 ? "text-foreground" : "text-muted-foreground"}`}
          >
            {milestoneMessage}
          </p>
        )}
      </div>
    </form>
  );
}
