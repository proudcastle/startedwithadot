"use server";

import { createClient } from "@/lib/supabase/server";
import { proposalSchema } from "@/lib/validations/proposals";
import { revalidatePath } from "next/cache";

type ActionState = { message: string; success: boolean } | undefined;

export async function submitProposal(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "You need to log in first.", success: false };
  }

  if (!user.email_confirmed_at) {
    return {
      message: "Verify your email first. The dot needs to know you're real.",
      success: false,
    };
  }

  const text = formData.get("text") as string;
  const result = proposalSchema.safeParse({ text });

  if (!result.success) {
    return { message: result.error.issues[0].message, success: false };
  }

  // Rate limit check: 3 proposals per UTC day
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("proposals")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", todayStart.toISOString());

  if ((count ?? 0) >= 3) {
    return {
      message: "Three ideas a day. That's the limit. Quality over quantity.",
      success: false,
    };
  }

  const { error } = await supabase
    .from("proposals")
    .insert({ user_id: user.id, text: result.data.text });

  if (error) {
    return {
      message: "Something broke. The dot is investigating.",
      success: false,
    };
  }

  revalidatePath("/proposals");
  return { message: "Proposal submitted. The dot is listening.", success: true };
}

export async function updateProposalStatus(
  proposalId: string,
  newStatus: "accepted" | "rejected" | "implemented"
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not authenticated." };
  }

  const { error } = await supabase
    .from("proposals")
    .update({ status: newStatus })
    .eq("id", proposalId);

  if (error) {
    return {
      success: false,
      message: "Failed to update status. The dot is confused.",
    };
  }

  revalidatePath("/proposals");
  return { success: true, message: `Proposal marked as ${newStatus}.` };
}

export async function deleteProposal(
  proposalId: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not authenticated." };
  }

  const { error } = await supabase
    .from("proposals")
    .delete()
    .eq("id", proposalId);

  if (error) {
    return {
      success: false,
      message: "Failed to delete proposal. It clings to existence.",
    };
  }

  revalidatePath("/proposals");
  return { success: true, message: "Proposal deleted. Gone forever." };
}
