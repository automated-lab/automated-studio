import { ReactNode } from "react";

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="w-full max-w-3xl bg-background p-6 md:p-8 rounded-lg shadow-sm">
        {children}
      </div>
    </div>
  )
} 