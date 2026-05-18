"use server";

import { createClient } from "@/lib/supabase/server";
import { versionSchema } from "@/lib/validations/proposals";
import { revalidatePath } from "next/cache";

export async function createVersion(
  proposalId: string,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not authenticated." };
  }

  const rawData = {
    versionNumber: formData.get("versionNumber") as string,
    title: formData.get("title") as string,
  };

  const result = versionSchema.safeParse(rawData);

  if (!result.success) {
    return { success: false, message: result.error.issues[0].message };
  }

  const { error: insertError } = await supabase.from("versions").insert({
    version_number: result.data.versionNumber,
    title: result.data.title,
    proposal_id: proposalId,
    created_by: user.id,
  });

  if (insertError) {
    return {
      success: false,
      message: "Failed to create version. The dot resists change.",
    };
  }

  // Mark the proposal as implemented
  const { error: updateError } = await supabase
    .from("proposals")
    .update({ status: "implemented" as const })
    .eq("id", proposalId);

  if (updateError) {
    return {
      success: false,
      message:
        "Version created but failed to update proposal status. Check the dashboard.",
    };
  }

  revalidatePath("/proposals");
  return { success: true, message: "Version created. The dot evolves." };
}
