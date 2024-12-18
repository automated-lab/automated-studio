'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ArrowRight, CheckCircle2, Settings, Star, Share2, MessageSquare, ArrowUpRight } from 'lucide-react'
import { ClientProduct } from '@/types/database'
import { toast } from 'sonner'
import React from 'react'
import { Progress } from "@/components/ui/progress"
import { ActivateProductDialog } from './ActivateProductDialog'


interface ProductsTabProps {
  clientId: string
  clientProducts: ClientProduct[]
}

const PRODUCT_ICONS: Record<string, React.ReactNode> = {
  'Reviewr - Reputation Management': <Star className="h-6 w-6" />,
  'Snappy - Website Chatbots': <MessageSquare className="h-6 w-6" />,
  'Snappy - Social Media Bots': <Share2 className="h-6 w-6" />,
  'default': <Settings className="h-6 w-6" />
}

export function ProductsTab({ clientId, clientProducts }: ProductsTabProps) {
  const [activeProduct, setActiveProduct] = useState<ClientProduct | null>(null)
  const [showFilloutForm, setShowFilloutForm] = useState(false)
  const [activeTab, setActiveTab] = useState('')
  
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
      setShowFilloutForm(true)
    } catch (error) {
      toast.error('Failed to activate product')
    }
  }

  const ProductCard = ({ clientProduct }: { clientProduct: ClientProduct }) => {
    const { product, is_active, price: clientPrice } = clientProduct
    
    return (
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${
          is_active ? 'border-green-200 bg-green-50' : 'hover:border-blue-200'
        }`}
      >
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-full ${
                is_active ? 'bg-green-500' : 'bg-gray-200'
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
              <Button 
                variant="outline" 
                onClick={() => window.open(product.platform_url, '_blank')}
              >
                Visit Platform
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
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
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm font-medium">Features:</p>
              <div className="flex flex-wrap gap-2">
                {product.features.map((feature, i) => (
                  <Badge key={i} variant="secondary">{feature}</Badge>
                ))}
              </div>
            </div>
            <p className="text-lg font-bold text-muted-foreground">
              {is_active ? (
                `Subscribed at:  $${clientPrice}/mo`
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
      <div className="grid gap-4 md:grid-cols-2">
        {clientProducts.map((clientProduct) => (
          <ProductCard key={clientProduct.product_id} clientProduct={clientProduct} />
        ))}
        <Card className="mt-4 col-span-2">
          <CardHeader>
            <CardTitle className='text-xl'>Revenue Opportunity</CardTitle>
            <CardDescription>
              Potential additional monthly revenue from inactive products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${clientProducts
                .filter(cp => !cp.is_active)
                .reduce((sum, cp) => sum + cp.product.suggested_price, 0)
                }/mo
            </div>
            <Progress 
              value={
                (clientProducts.filter(cp => cp.is_active).length / 
                clientProducts.length) * 100
              } 
              className="mt-2" 
            />
            <p className="text-sm text-muted-foreground mt-2">
              {clientProducts.filter(cp => cp.is_active).length} of {clientProducts.length} products activated
            </p>
          </CardContent>
        </Card>
      </div>

      <ActivateProductDialog
        isOpen={activeProduct !== null}
        onClose={() => setActiveProduct(null)}
        onActivate={handleActivate}
        productName={activeProduct?.product.name ?? ''}
        suggestedPrice={activeProduct?.product.suggested_price ?? 0}
        filloutFormId={activeProduct?.product.fillout_form_id ?? ''}
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
              src={`https://forms.fillout.com/t/${activeProduct?.product.fillout_form_id}`}
              className="w-full h-[calc(100%-60px)] border-0"
            />
            <Button 
              className="w-full" 
              onClick={async () => {
                setShowFilloutForm(false)
                setActiveProduct(null)
                // Force refresh with products tab
                window.location.href = `${window.location.pathname}?tab=products`
              }}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 