export default function Loading() {
  return (
    <div className="container mx-auto py-10 flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-2 animate-in fade-in duration-300">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
} 