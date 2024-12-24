"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { Header } from "@/components/proposals/header";
import { ProposalSidebar } from "@/components/proposals/proposal-sidebar";
import { ProposalContent } from "@/components/proposals/proposal-content";
import { ProposalProvider } from "@/contexts/ProposalContext";

export default function ProposalsPage() {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // Move generation logic here from ProposalContent
      // Or pass down a callback
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ProposalProvider>
      <div className="flex flex-col w-full">
        <Header generating={generating} onGenerate={handleGenerate} />
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full">
            <ProposalSidebar />
            <div className="flex-1">
              <ProposalContent />
            </div>
          </div>
        </div>
      </div>
    </ProposalProvider>
  );
}
