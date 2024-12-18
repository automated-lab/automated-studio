'use client'

import { Product } from '@/types/database'
import { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { NewProductDialog } from './new-product-dialog'

interface ProductsTabProps {
  initialProducts: Product[]
}

export function ProductsTab({ initialProducts }: ProductsTabProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || [])

  const refreshProducts = async () => {
    const res = await fetch('/api/products')
    const data = await res.json()
    if (!Array.isArray(data)) return
    setProducts(data)
  }

  useEffect(() => {
    refreshProducts()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Products</h2>
        <NewProductDialog onSuccess={refreshProducts} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                 <TableHead>Suggested Price</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>${product.suggested_price}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.features.map((feature, i) => (
                        <Badge key={i} variant="secondary">{feature}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 