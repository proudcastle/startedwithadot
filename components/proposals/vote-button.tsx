"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { DotCounter } from "./dot-counter";
import { toast } from "sonner";

interface VoteButtonProps {
  proposalId: string;
  userId: string | null;
  initialVoted: boolean;
  initialCount: number;
}

export function VoteButton({
  proposalId,
  userId,
  initialVoted,
  initialCount,
}: VoteButtonProps) {
  const [voted, setVoted] = useState(initialVoted);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);

  const toggleVote = useCallback(async () => {
    if (!userId || pending) return;
    setPending(true);

    // Capture current state for rollback
    const prevVoted = voted;
    const prevCount = count;

    // Optimistic update
    const newVoted = !voted;
    setVoted(newVoted);
    setCount(newVoted ? count + 1 : count - 1);

    const supabase = createClient();

    if (newVoted) {
      const { error } = await supabase
        .from("votes")
        .insert({ user_id: userId, proposal_id: proposalId });
      if (error) {
        setVoted(prevVoted);
        setCount(prevCount);
        toast.error("Vote failed. Try again.");
      }
    } else {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("user_id", userId)
        .eq("proposal_id", proposalId);
      if (error) {
        setVoted(prevVoted);
        setCount(prevCount);
        toast.error("Vote failed. Try again.");
      }
    }

    setPending(false);
  }, [voted, count, userId, proposalId, pending]);

  return (
    <button
      onClick={toggleVote}
      disabled={!userId || pending}
      className={`min-w-[44px] min-h-[44px] flex items-center justify-center ${
        userId ? "cursor-pointer" : "cursor-default"
      }`}
      aria-label={voted ? "Remove vote" : "Vote for this proposal"}
    >
      <DotCounter count={count} voted={voted} />
    </button>
  );
}
