"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/8bit/button";
import { Input } from "@/components/ui/8bit/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/8bit/dialog";

import { updateProposalStatus, deleteProposal } from "@/actions/proposals";
import { createVersion } from "@/actions/versions";

interface AdminMenuProps {
  proposalId: string;
  proposalStatus: string;
}

export function AdminMenu({ proposalId, proposalStatus }: AdminMenuProps) {
  const [versionDialogOpen, setVersionDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleStatusChange(
    newStatus: "accepted" | "rejected" | "implemented"
  ) {
    setIsLoading(true);
    const result = await updateProposalStatus(proposalId, newStatus);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this proposal? This can't be undone."
    );
    if (!confirmed) return;

    setIsLoading(true);
    const result = await deleteProposal(proposalId);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  async function handleCreateVersion(formData: FormData) {
    setIsLoading(true);
    const result = await createVersion(proposalId, formData);
    setIsLoading(false);

    if (result.success) {
      setVersionDialogOpen(false);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isLoading}>
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Admin actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {proposalStatus === "open" && (
            <>
              <DropdownMenuItem onClick={() => handleStatusChange("accepted")}>
                Accept
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("rejected")}>
                Reject
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {proposalStatus === "accepted" && (
            <>
              <DropdownMenuItem onClick={() => setVersionDialogOpen(true)}>
                Mark Implemented
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={handleDelete}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={versionDialogOpen} onOpenChange={setVersionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle font="retro">Create Version</DialogTitle>
          </DialogHeader>
          <form action={handleCreateVersion} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="versionNumber"
                className="text-sm text-muted-foreground"
              >
                Version Number
              </label>
              <Input
                id="versionNumber"
                name="versionNumber"
                placeholder="e.g. 0.2"
                maxLength={20}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm text-muted-foreground">
                Title
              </label>
              <Input
                id="title"
                name="title"
                placeholder="What the dot learned to do"
                maxLength={100}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Version"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
