import { useState, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProposalContext } from "@/contexts/ProposalContext";

export function WebsiteAnalyzer() {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const { dispatch } = useContext(ProposalContext);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      dispatch({ type: "SET_WEBSITE_DATA", payload: data });
    } catch (error) {
      toast.error("Failed to analyze website");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <form onSubmit={handleAnalyze} className="space-y-4">
      <Input
        className="w-full"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={analyzing}
      />
      <Button
        type="submit"
        disabled={analyzing || !url.trim()}
        className="w-full"
      >
        {analyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze"
        )}
      </Button>
    </form>
  );
}
