import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect } from 'react'

type Product = {
  short_name: string
}

export function useProducts() {
  const [data, setData] = useState<Product[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()
  
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('short_name')
        .order('short_name')
      
      if (!error) setData(data)
      setIsLoading(false)
    }
    
    fetchProducts()
  }, [])
  
  return { data, isLoading }
} 