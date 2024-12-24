import { useProposal } from "@/contexts/ProposalContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Loader2, Wand2, Download, Link, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/hooks/use-products";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export function ProposalContent() {
  const { state, dispatch } = useProposal();
  const [generating, setGenerating] = useState(false);
  const [businessContext, setBusinessContext] = useState({
    businessName: "",
    industry: "",
    productTypes: [] as string[],
    otherProductTypes: "",
    mainServices: "",
    uniqueSellingPoints: "",
    budget: "",
  });
  const { data: products, isLoading } = useProducts();

  const handleGenerate = async () => {
    if (!state.websiteData) {
      toast.error("Please analyze a website first");
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteData: state.websiteData,
          settings: state.aiSettings,
          businessContext,
        }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      dispatch({ type: "SET_GENERATED_PROPOSAL", payload: data.proposal });
      toast.success("Proposal generated!");
    } catch (error) {
      console.error("Generation failed:", error);
      toast.error("Failed to generate proposal");
    } finally {
      setGenerating(false);
    }
  };

  const suggestFromWebsite = async (field: string) => {
    if (!state.websiteData) {
      toast.error("Please analyze a website first");
      return;
    }

    try {
      const response = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field,
          websiteData: state.websiteData,
          existingContext: businessContext,
        }),
      });

      if (!response.ok) throw new Error("Suggestion failed");

      const data = await response.json();
      setBusinessContext((prev) => ({
        ...prev,
        [field]: data.suggestion,
      }));

      toast.success("Added suggestion!");
    } catch (error) {
      toast.error("Failed to get suggestion");
    }
  };

  const handleAISettingChange = (key: string, value: any) => {
    dispatch({
      type: "UPDATE_AI_SETTINGS",
      payload: { [key]: value },
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Context</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={businessContext.businessName}
                    onChange={(e) =>
                      setBusinessContext((prev) => ({
                        ...prev,
                        businessName: e.target.value,
                      }))
                    }
                    placeholder="e.g., Acme Corp"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={businessContext.industry}
                    onChange={(e) =>
                      setBusinessContext((prev) => ({
                        ...prev,
                        industry: e.target.value,
                      }))
                    }
                    placeholder="e.g., Digital Marketing"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Product Types</Label>
                  <div className="border rounded-md p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {isLoading ? (
                        <div>Loading products...</div>
                      ) : (
                        <>
                          {products?.map((product: { short_name: string }) => (
                            <div
                              key={product.short_name}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={product.short_name}
                                checked={businessContext.productTypes.includes(
                                  product.short_name
                                )}
                                onCheckedChange={(checked) =>
                                  setBusinessContext((prev) => ({
                                    ...prev,
                                    productTypes: checked
                                      ? [...prev.productTypes, product.short_name]
                                      : prev.productTypes.filter(
                                          (type) => type !== product.short_name
                                        ),
                                  }))
                                }
                              />
                              <Label htmlFor={product.short_name}>
                                {product.short_name}
                              </Label>
                            </div>
                          ))}
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="other"
                              checked={businessContext.productTypes.includes(
                                "other"
                              )}
                              onCheckedChange={(checked) =>
                                setBusinessContext((prev) => ({
                                  ...prev,
                                  productTypes: checked
                                    ? [...prev.productTypes, "other"]
                                    : prev.productTypes.filter(
                                        (type) => type !== "other"
                                      ),
                                  otherProductTypes: !checked
                                    ? ""
                                    : prev.otherProductTypes,
                                }))
                              }
                            />
                            <Label htmlFor="other">Other</Label>
                          </div>
                        </>
                      )}
                    </div>
                    {businessContext.productTypes.includes("other") && (
                      <Input
                        className="mt-4"
                        placeholder="Specify other product types"
                        value={businessContext.otherProductTypes}
                        onChange={(e) =>
                          setBusinessContext((prev) => ({
                            ...prev,
                            otherProductTypes: e.target.value,
                          }))
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="mainServices">Main Services/Products</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => suggestFromWebsite("mainServices")}
                      className="h-8"
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      Suggest from website
                    </Button>
                  </div>
                  <Textarea
                    id="mainServices"
                    value={businessContext.mainServices}
                    onChange={(e) =>
                      setBusinessContext((prev) => ({
                        ...prev,
                        mainServices: e.target.value,
                      }))
                    }
                    placeholder="List your main services or products"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="uniqueSellingPoints">
                    Unique Selling Points
                  </Label>
                  <Textarea
                    id="uniqueSellingPoints"
                    value={businessContext.uniqueSellingPoints}
                    onChange={(e) =>
                      setBusinessContext((prev) => ({
                        ...prev,
                        uniqueSellingPoints: e.target.value,
                      }))
                    }
                    placeholder="What makes your business unique?"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Input
                    id="budget"
                    value={businessContext.budget}
                    onChange={(e) =>
                      setBusinessContext((prev) => ({
                        ...prev,
                        budget: e.target.value,
                      }))
                    }
                    placeholder="e.g., $1,000 - $5,000/month"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="ai-model">AI Model</Label>
                  <Select
                    value={state.aiSettings.model}
                    onValueChange={(value) =>
                      handleAISettingChange("model", value)
                    }
                  >
                    <SelectTrigger id="ai-model" className="bg-background">
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
                      <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-2">Claude 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="creativity">Creativity</Label>
                      <span className="text-sm text-muted-foreground">
                        {state.aiSettings.creativity}%
                      </span>
                    </div>
                    <Slider
                      id="creativity"
                      min={0}
                      max={100}
                      step={1}
                      value={[state.aiSettings.creativity]}
                      onValueChange={([value]: number[]) =>
                        handleAISettingChange("creativity", value)
                      }
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="tone">Tone</Label>
                      <span className="text-sm text-muted-foreground">
                        Professional
                      </span>
                    </div>
                    <Select>
                      <SelectTrigger id="tone">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="persuasive">Persuasive</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex justify-end pt-4 gap-2">
                      <Button
                        onClick={handleGenerate}
                        disabled={!state.websiteData}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Proposal
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Generated Proposal</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-4rem)]">
                {generating ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Generating proposal...</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} />
                    </div>
                  </div>
                ) : state.generatedProposal ? (
                  <div className="prose prose-sm max-w-none">
                    {state.generatedProposal.split("\n").map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <p>Your AI-generated proposal will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
