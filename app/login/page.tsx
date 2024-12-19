export const dynamic = 'force-dynamic'

import { GalleryVerticalEnd } from "lucide-react"
import Image from "next/image"

import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-zinc-900 lg:block">
    <div className="absolute inset-0 flex items-center justify-center">
        <Image 
          src="/login-logo-w.png" 
          alt="Logo"
          width={200}
          height={100}
          className="h-auto w-auto"
          />
        </div>
      </div>
    </div>
  )
}
