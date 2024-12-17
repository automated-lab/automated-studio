import { Badge } from "@/components/ui/badge";
import type { Client } from "@/types/database";

interface ClientHeaderProps {
  client: Client;
}

export function ClientHeader({ client }: ClientHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">{client.company_name}</h1>
        <p className="text-muted-foreground">Client Dashboard</p>
      </div>
      <Badge variant={client.status === 'ACTIVE' ? 'default' : 'secondary'}>
        {client.status}
      </Badge>
    </div>
  )
}
