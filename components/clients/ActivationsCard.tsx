import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import React from 'react'

export default function ActivationCard() {
    const ProductActivationCard = ({ product }) => (
        <Dialog open={activeDialog === product.id} onOpenChange={() => setActiveDialog(null)}>
          <DialogTrigger asChild>
            <Card className={`cursor-pointer transition-all hover:shadow-lg ${  
              product.active ? 'border-green-200 bg-green-50' : 'hover:border-blue-200'
            }`}>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-full ${
                      product.active ? 'bg-green-500' : 'bg-gray-200'
                    }`}>
                      <div className="text-white">
                        {product.icon}
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </div>
                  </div>
                  {product.active ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <Button 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => setActiveDialog(product.id)}
                    >
                      Activate
                      <ArrowRight    className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Key Benefits:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.benefits.map((benefit, index) => (
                        <Badge key={index} variant="secondary">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-lg font-bold text-muted-foreground">
                    {product.price}
                  </p>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Activate {product.name}</DialogTitle>
              <DialogDescription>
                Complete the form below to activate {product.name} for this client.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* This is where your activation form will be embedded */}
              <div className="rounded-lg border p-4 text-center text-muted-foreground">
                Activation form will be embedded here
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) 
}
