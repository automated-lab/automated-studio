'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Progress } from "@/components/ui/progress"
import { createClient } from '@/libs/supabase/client'
import Step1BasicInfo from './steps/step1-basic-info'
import Step2CompanyDetails from './steps/step2-company-details'
import Step3AdditionalInfo from './steps/step3-additional-info'
import Step4FinalSetup from './steps/step4-final-setup'
import type { OnboardingData } from '@/types'
import { toast } from 'sonner'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<OnboardingData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const handleNext = (stepData: Partial<OnboardingData>) => {
    setFormData(prev => ({ ...prev, ...stepData }))
    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    // setStep(prev => prev - 1)
  }

  const handleComplete = async (finalData: Partial<OnboardingData>) => {
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const completeData = { 
        ...formData, 
        ...finalData,
        linkedin_url: finalData.linkedin_url || null,
        facebook_url: finalData.facebook_url || null,
        twitter_url: finalData.twitter_url || null
      }
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...completeData
        })

      if (error) throw error
      
      toast.success('Profile updated successfully!')
      
      // Force refresh the session before redirect
      await supabase.auth.getSession()
      window.location.href = '/dashboard'
    } catch (error: any) {
      console.error('Error saving profile:', error)
      toast.error(error.message || 'Failed to save profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Complete Your Profile</h1>
        <p className="text-muted-foreground">
          Step {step} of {totalSteps}
        </p>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="mt-8">
        {step === 1 && (
          <Step1BasicInfo 
            data={formData} 
            onNext={handleNext} 
          />
        )}
        {step === 2 && (
          <Step2CompanyDetails 
            data={formData} 
            onNext={handleNext} 
            onBack={handleBack}
          />
        )}
        {step === 3 && (
          <Step3AdditionalInfo 
            data={formData} 
            onNext={handleNext} 
            onBack={handleBack}
          />
        )}
        {step === 4 && (
          <Step4FinalSetup 
            data={formData} 
            onBack={handleBack}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  )
} 