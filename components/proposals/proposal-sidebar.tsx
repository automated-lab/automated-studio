import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useProposal } from "@/contexts/ProposalContext";
import { WebsiteAnalyzer } from "@/components/proposals/website-analyzer";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

import { Download, Link, Send, Sparkles, Plus } from "lucide-react";

export function ProposalSidebar() {
  const { state, dispatch } = useProposal();

  const handleAISettingChange = (key: string, value: any) => {
    dispatch({
      type: "UPDATE_AI_SETTINGS",
      payload: { [key]: value },
    });
  };

  const handleGenerate = async () => {
    if (!state.websiteData) {
      toast.error("Please analyze a website first");
      return;
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteData: state.websiteData,
          settings: state.aiSettings,
        }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      dispatch({ type: "SET_GENERATED_PROPOSAL", payload: data.proposal });
      toast.success("Proposal generated!");
    } catch (error) {
      console.error("Generation failed:", error);
      toast.error("Failed to generate proposal");
    }
  };

  return (
    <div className="w-[400px] border-r h-[calc(100vh-8rem)] bg-background flex justify-center">
      <div className="w-[360px] px-8 py-4 space-y-8 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-semibold mb-3">
            Data Collection
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <WebsiteAnalyzer />
            <div className="mt-4">
              <Label>Analysis Results</Label>
              <div className="space-y-2 mt-4">
                {state.websiteData ? (
                  <>
                    {/* Core Tech Stack */}
                    <div className="p-4 border rounded-lg space-y-3">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <span className="h-2 w-2 bg-blue-500 rounded-full" />
                        Technology Stack
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {state.websiteData.technologies.map((tech) => (
                          <Button
                            key={tech}
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() =>
                              dispatch({
                                type: "ADD_TO_PROPOSAL_CONTEXT",
                                payload: { type: "technology", value: tech },
                              })
                            }
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            {tech}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="p-4 border rounded-lg space-y-3">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <span className="h-2 w-2 bg-green-500 rounded-full" />
                        Performance
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Speed Score</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() =>
                                dispatch({
                                  type: "ADD_TO_PROPOSAL_CONTEXT",
                                  payload: {
                                    type: "performance",
                                    value: `Speed Score: ${state.websiteData.performance.speedScore}%`,
                                  },
                                })
                              }
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              {state.websiteData.performance.speedScore}%
                            </Button>
                          </div>
                          <Progress
                            value={state.websiteData.performance.speedScore}
                            className="h-2 mb-3"
                          />
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() =>
                                dispatch({
                                  type: "ADD_TO_PROPOSAL_CONTEXT",
                                  payload: {
                                    type: "performance",
                                    value: `Load Time: ${state.websiteData.performance.loadTime}s`,
                                  },
                                })
                              }
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              Load: {state.websiteData.performance.loadTime}s
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() =>
                                dispatch({
                                  type: "ADD_TO_PROPOSAL_CONTEXT",
                                  payload: {
                                    type: "performance",
                                    value: `First Paint: ${state.websiteData.performance.firstContentfulPaint}s`,
                                  },
                                })
                              }
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              FCP:{" "}
                              {
                                state.websiteData.performance
                                  .firstContentfulPaint
                              }
                              s
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SEO & Accessibility */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg space-y-3">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <span className="h-2 w-2 bg-purple-500 rounded-full" />
                          SEO
                        </h3>
                        <div className="space-y-3">
                          <Progress
                            value={state.websiteData.seo.score}
                            className="h-2"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs w-full"
                            onClick={() =>
                              dispatch({
                                type: "ADD_TO_PROPOSAL_CONTEXT",
                                payload: {
                                  type: "seo",
                                  value: `SEO Score: ${state.websiteData.seo.score}%`,
                                },
                              })
                            }
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Score: {state.websiteData.seo.score}%
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg space-y-3">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <span className="h-2 w-2 bg-orange-500 rounded-full" />
                          Accessibility
                        </h3>
                        <div className="space-y-3">
                          <Progress
                            value={state.websiteData.accessibility.score}
                            className="h-2"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs w-full"
                            onClick={() =>
                              dispatch({
                                type: "ADD_TO_PROPOSAL_CONTEXT",
                                payload: {
                                  type: "accessibility",
                                  value: `Accessibility Score: ${state.websiteData.accessibility.score}%`,
                                },
                              })
                            }
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Score: {state.websiteData.accessibility.score}%
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Security & Analytics */}
                    <div className="p-4 border rounded-lg space-y-3">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <span className="h-2 w-2 bg-red-500 rounded-full" />
                        Security & Analytics
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">SSL Security</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() =>
                              dispatch({
                                type: "ADD_TO_PROPOSAL_CONTEXT",
                                payload: {
                                  type: "security",
                                  value: `SSL: ${
                                    state.websiteData.security.ssl
                                      ? "Secure"
                                      : "Not Secure"
                                  }`,
                                },
                              })
                            }
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            <div
                              className={`${
                                state.websiteData.security.ssl
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              {state.websiteData.security.ssl
                                ? "Secure"
                                : "Not Secure"}
                            </div>
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Analytics</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() =>
                              dispatch({
                                type: "ADD_TO_PROPOSAL_CONTEXT",
                                payload: {
                                  type: "analytics",
                                  value: `Analytics: ${
                                    state.websiteData.analytics.hasAnalytics
                                      ? state.websiteData.analytics.provider
                                      : "Missing"
                                  }`,
                                },
                              })
                            }
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            <div
                              className={`${
                                state.websiteData.analytics.hasAnalytics
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              {state.websiteData.analytics.hasAnalytics
                                ? state.websiteData.analytics.provider
                                : "Missing"}
                            </div>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No website analyzed yet
                  </div>
                )}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>
    </div>
  );
}
