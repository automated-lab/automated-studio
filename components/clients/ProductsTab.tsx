'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ArrowRight, CheckCircle2, Settings, Star, Share2, MessageSquare, ArrowUpRight, MoreVertical, Pencil, Power } from 'lucide-react'
import { ClientProduct } from '@/types/database'
import { toast } from 'sonner'
import React from 'react'
import { Progress } from "@/components/ui/progress"
import { ActivateProductDialog } from './ActivateProductDialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DialogDescription, DialogFooter } from "@/components/ui/dialog"
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { Trophy } from 'lucide-react'

interface ProductsTabProps {
  clientId: string
  clientProducts: ClientProduct[]
  onUpdate?: () => void
}

const PRODUCT_ICONS: Record<string, React.ReactNode> = {
  'Reviewr - Reputation Management': <Star className="h-6 w-6" />,
  'Snappy - Website Chatbots': <MessageSquare className="h-6 w-6" />,
  'Snappy - Social Media Bots': <Share2 className="h-6 w-6" />,
  'default': <Settings className="h-6 w-6" />
}

export function ProductsTab({ clientId, clientProducts, onUpdate }: ProductsTabProps) {
  const [activeProduct, setActiveProduct] = useState<ClientProduct | null>(null)
  const [showFilloutForm, setShowFilloutForm] = useState(false)
  const [activeTab, setActiveTab] = useState('')
  const [editingProduct, setEditingProduct] = useState<ClientProduct | null>(null)
  const [deactivatingProduct, setDeactivatingProduct] = useState<ClientProduct | null>(null)
  const [activatedProductName, setActivatedProductName] = useState<string>('')
  const [filloutFormId, setFilloutFormId] = useState<string>('')
  const { width, height } = useWindowSize()
  const allProductsActive = clientProducts.every(cp => cp.is_active)
  const activeCount = clientProducts.filter(cp => cp.is_active).length
  const totalCount = clientProducts.length
  const [showConfetti, setShowConfetti] = useState(false)
  
  console.log('ProductsTab render:', { clientId, clientProducts })
  
  useEffect(() => {
    console.log('activeProduct changed:', activeProduct)
  }, [activeProduct])
  
  useEffect(() => {
    console.log('Form ID:', activeProduct?.product.fillout_form_id)
  }, [activeProduct])
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tabParam = params.get('tab')
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [])
  
  useEffect(() => {
    console.log('allProductsActive:', allProductsActive)
  }, [allProductsActive])
  
  if (!clientProducts?.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No products found for this client
        </CardContent>
      </Card>
    )
  }

  const handleActivate = async (price: number) => {
    if (!activeProduct) return
    
    try {
      const res = await fetch('/api/client-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          product_id: activeProduct.product_id,
          is_active: true,
          price
        })
      })

      if (!res.ok) throw new Error('Failed to activate product')
      setActivatedProductName(activeProduct.product.name)
      setFilloutFormId(activeProduct.product.fillout_form_id)
      setActiveProduct(null)
      await onUpdate?.()
      setShowFilloutForm(true)
    } catch (error) {
      toast.error('Failed to activate product')
    }
  }

  const handlePriceUpdate = async (productId: string, newPrice: number) => {
    try {
      const res = await fetch('/api/client-products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          product_id: productId,
          price: newPrice
        })
      })
      if (!res.ok) throw new Error('Failed to update price')
      toast.success('Price updated successfully')
      setEditingProduct(null)
      onUpdate?.()
    } catch (error) {
      toast.error('Failed to update price')
    }
  }

  const handleDeactivate = async (productId: string) => {
    try {
      const res = await fetch('/api/client-products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          product_id: productId,
          is_active: false
        })
      })
      if (!res.ok) throw new Error('Failed to deactivate product')
      toast.success('Product deactivated successfully')
      onUpdate?.()
    } catch (error) {
      toast.error('Failed to deactivate product')
    }
  }

  const ProductCard = ({ clientProduct }: { clientProduct: ClientProduct }) => {
    const { product, is_active, price: clientPrice } = clientProduct
    
    return (
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${
          is_active 
            ? 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20' 
            : 'hover:border-blue-200 dark:hover:border-blue-800'
        }`}
      >
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-full ${
                is_active ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                <div className="text-white">
                  {PRODUCT_ICONS[product.name] || PRODUCT_ICONS.default}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">{product.name}</CardTitle>
                {is_active && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              </div>
            </div>
            {is_active ? (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(product.platform_url, '_blank')}
                >
                  Go to Platform
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingProduct(clientProduct)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Price
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDeactivate(clientProduct.product_id)}
                    >
                      <Power className="h-4 w-4 mr-2" />
                      Deactivate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button 
                variant="outline"
                onClick={() => setActiveProduct(clientProduct)}
              >
                Activate
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          <CardDescription className="dark:text-gray-400">{product.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm font-medium">Features:</p>
              <div className="flex flex-wrap gap-2">
                {product.features.map((feature, i) => (
                  <Badge key={i} variant="secondary" className="dark:bg-gray-800">{feature}</Badge>
                ))}
              </div>
            </div>
            <p className="text-lg font-bold text-muted-foreground">
              {is_active ? (
                `Subscribed at: $${clientPrice}/mo`
              ) : (
                `Suggested: $${product.suggested_price}/mo`
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 mt-6">
        {clientProducts.map((clientProduct) => (
          <ProductCard 
            key={clientProduct.product_id} 
            clientProduct={clientProduct} 
          />
        ))}
        <Card className="mt-4 col-span-2">
          <CardHeader>
            <CardTitle className='text-xl'>Revenue Opportunity</CardTitle>
            <CardDescription>
              {allProductsActive 
                ? "🎉 All products activated! Maximum revenue achieved!"
                : "Potential additional monthly revenue from inactive products"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allProductsActive ? (
              <div className="text-center py-6">
                <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <div className="text-2xl font-bold text-green-600 mb-2">
                  Congratulations!
                </div>
                <p className="text-muted-foreground">
                  You&apos;ve unlocked the full potential of our product suite
                </p>
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold text-green-600">
                  ${clientProducts
                    .filter(cp => !cp.is_active)
                    .reduce((sum, cp) => sum + cp.product.suggested_price, 0)
                    }/mo
                </div>
                <Progress 
                  value={(activeCount / totalCount) * 100} 
                  className="mt-2" 
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {activeCount} of {totalCount} products activated
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}

      <ActivateProductDialog
        isOpen={activeProduct !== null}
        onClose={() => setActiveProduct(null)}
        onActivate={handleActivate}
        productName={activeProduct?.product.name ?? ''}
        suggestedPrice={activeProduct?.product.suggested_price ?? 0}
        filloutFormId={filloutFormId}
      />

      <Dialog 
        open={showFilloutForm} 
        onOpenChange={setShowFilloutForm}
      >
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Complete Setup Information</DialogTitle>
          </DialogHeader>
          <div className="h-[700px] space-y-4">
            <iframe 
              src={`https://forms.fillout.com/t/${filloutFormId}`}
              className="w-full h-[calc(100%-60px)] border-0"
            />
            <Button 
              className="w-full" 
              onClick={async () => {
                await onUpdate?.()
                setShowFilloutForm(false)
                setShowConfetti(true)
                toast.success(`${activatedProductName} activated successfully`)
                setActivatedProductName('')
                setTimeout(() => setShowConfetti(false), 5500)
              }}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Price - {editingProduct?.product.name}</DialogTitle>
            <DialogDescription>
              Update the monthly price for this product
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <span className="text-lg">$</span>
              <Input
                type="number"
                value={editingProduct?.price}
                onChange={(e) => setEditingProduct(editingProduct ? {
                  ...editingProduct,
                  price: parseFloat(e.target.value)
                } : null)}
                placeholder="Enter price"
              />
              <span className="text-lg">/mo</span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingProduct(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingProduct) {
                  handlePriceUpdate(editingProduct.product_id, editingProduct.price)
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 