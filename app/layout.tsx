import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Viewport } from "next";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/shipfast/LayoutClient";
import { ThemeProvider } from "@/components/shipfast/theme-provider";
import config from "@/config";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { Toaster } from "sonner"
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";


const font = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
	// Will use the primary color of your theme to show a nice theme color in the URL bar of supported browsers
	themeColor: config.colors.main,
	width: "device-width",
	initialScale: 1,
};

export const metadata = getSEOTags();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme={config.colors.theme} className={font.className}>
      {config.domainName && (
        <head>
          <script
            defer
            data-domain={config.domainName}
            src="https://plausible.io/js/script.js"
          ></script>
        </head>
      )}
      <body>
      <CopilotKit publicApiKey={process.env.NEXT_PUBLIC_COPILOT_API_KEY}> 
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader 
            color="#287150"
            height={2}
            showSpinner={false}
          />
          <ClientLayout>{children}</ClientLayout>
          <Toaster />
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
        </CopilotKit>
      </body>
    </html>
  );
}
