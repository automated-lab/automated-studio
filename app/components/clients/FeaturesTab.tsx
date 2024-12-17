import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Client } from "@/types/database"

interface FeaturesTabProps {
  client: Client
}

export function FeaturesTab({ client }: FeaturesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Features</CardTitle>
        <CardDescription>Overview of enabled features for this client</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Feature content */}
      </CardContent>
    </Card>
  )
}
