export default function Loading() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-lg border p-6">
            <div className="h-6 w-1/4 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
