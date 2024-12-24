import { createContext, useContext, useReducer } from "react";
import type { WebsiteAnalysis } from "@/services/analysis/website";

export interface WebsiteData {
  technologies: string[];
  seoScore: number;
  socialProfiles: string[];
  performance: {
    loadTime: number;
    firstContentfulPaint: number;
    speedScore: number;
  };
  security: {
    ssl: boolean;
    headers: string[];
    vulnerabilities: string[];
  };
  content: {
    wordCount: number;
    pageCount: number;
    lastUpdated: string;
    hasContactForm: boolean;
  };
  accessibility: {
    score: number;
    issues: string[];
  };
  analytics: {
    hasAnalytics: boolean;
    provider: string;
  };
  hosting: {
    provider: string;
    location: string;
  };
}

type ProposalContextItem = {
  type:
    | "technology"
    | "seo"
    | "social"
    | "performance"
    | "hosting"
    | "accessibility"
    | "security"
    | "analytics";
  value: string | number;
};

type ProposalContextType = {
  type:
    | "technology"
    | "seo"
    | "social"
    | "performance"
    | "hosting"
    | "accessibility"
    | "security"
    | "analytics";
  value: string;
};

interface ProposalState {
  websiteData: WebsiteAnalysis | null;
  aiSettings: {
    model: string;
    creativity: number;
    tone: string;
    maxTokens: number;
  };
  generatedProposal: string | null;
  selectedContext: ProposalContextItem[];
}

const initialState: ProposalState = {
  websiteData: null,
  aiSettings: {
    model: "gpt-4",
    creativity: 50,
    tone: "professional",
    maxTokens: 2000,
  },
  generatedProposal: null,
  selectedContext: [],
};

type Action =
  | { type: "SET_WEBSITE_DATA"; payload: WebsiteAnalysis }
  | {
      type: "UPDATE_AI_SETTINGS";
      payload: Partial<ProposalState["aiSettings"]>;
    }
  | { type: "SET_GENERATED_PROPOSAL"; payload: string }
  | { type: "ADD_TO_PROPOSAL_CONTEXT"; payload: ProposalContextItem }
  | { type: "REMOVE_FROM_PROPOSAL_CONTEXT"; payload: ProposalContextItem };

function proposalReducer(state: ProposalState, action: Action): ProposalState {
  switch (action.type) {
    case "SET_WEBSITE_DATA":
      return { ...state, websiteData: action.payload };
    case "UPDATE_AI_SETTINGS":
      return {
        ...state,
        aiSettings: { ...state.aiSettings, ...action.payload },
      };
    case "SET_GENERATED_PROPOSAL":
      return { ...state, generatedProposal: action.payload };
    case "ADD_TO_PROPOSAL_CONTEXT":
      return {
        ...state,
        selectedContext: [...state.selectedContext, action.payload],
      };
    case "REMOVE_FROM_PROPOSAL_CONTEXT":
      return {
        ...state,
        selectedContext: state.selectedContext.filter(
          (item) =>
            !(
              item.type === action.payload.type &&
              item.value === action.payload.value
            )
        ),
      };
    default:
      return state;
  }
}

export const ProposalContext = createContext<{
  state: ProposalState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export function ProposalProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(proposalReducer, initialState);

  return (
    <ProposalContext.Provider value={{ state, dispatch }}>
      {children}
    </ProposalContext.Provider>
  );
}

export const useProposal = () => useContext(ProposalContext);
