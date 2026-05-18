import { z } from "zod";

export const proposalSchema = z.object({
  text: z
    .string()
    .min(1, "The dot is waiting. Say something.")
    .max(140, "140 characters. That's all you get."),
});

export type ProposalInput = z.infer<typeof proposalSchema>;

export const versionSchema = z.object({
  versionNumber: z
    .string()
    .min(1, "Every version needs a number.")
    .max(20, "Keep it short."),
  title: z
    .string()
    .min(1, "Give this version a name.")
    .max(100, "Shorter title, please."),
});

export type VersionInput = z.infer<typeof versionSchema>;
