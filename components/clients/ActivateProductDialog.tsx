import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface ActivateProductDialogProps {
  isOpen: boolean
  onClose: () => void
  onActivate: (price: number) => Promise<void>
  productName: string
  suggestedPrice: number
  filloutFormId: string
}

export function ActivateProductDialog({
  isOpen,
  onClose,
  onActivate,
  productName,
  suggestedPrice,
  filloutFormId
}: ActivateProductDialogProps) {
  const [price, setPrice] = useState(suggestedPrice.toString())

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Activate {productName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Monthly Price</label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={`Suggested: $${suggestedPrice}`}
            />
          </div>
          <Button 
            className="w-full" 
            onClick={() => onActivate(parseFloat(price))}
          >
            Activate and Continue to Setup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 