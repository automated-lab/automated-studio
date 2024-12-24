"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useProposal } from "@/contexts/ProposalContext";

export function Header({
  generating,
  onGenerate,
}: {
  generating: boolean;
  onGenerate: () => void;
}) {
  const { state } = useProposal();

  return (
    <div className="border-b bg-background p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Your Proposal</h2>
        <Button
          size="lg"
          onClick={onGenerate}
          disabled={!state.websiteData || generating}
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Proposal
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
