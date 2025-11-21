import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuth } from '@/auth/AuthContext'
import { requestReset } from '@/services/authService'
import toast from 'react-hot-toast'
import { LABELS, MESSAGES, ROUTES } from '@/constants'

const schema = z.object({ 
  email: z.string()
    .min(1, 'El email es requerido')
    .email(MESSAGES.AUTH.INVALID_EMAIL)
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate(ROUTES.FLIGHTS, { replace: true })
    }
  }, [user, navigate])

  const onSubmit = async (data: FormData) => {
    try {
      await requestReset(data.email)
      toast.success(MESSAGES.AUTH.PASSWORD_RESET_SENT)
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? MESSAGES.AUTH.PASSWORD_RESET_ERROR)
    }
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-semibold mb-3">{LABELS.AUTH.FORGOT_PASSWORD_TITLE}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input 
            label={LABELS.AUTH.EMAIL} 
            type="email" 
            {...register('email', {
              setValueAs: (value) => value?.trim() || ''
            })} 
            error={errors.email?.message} 
          />
          <Button type="submit" loading={isSubmitting} className="w-full">{LABELS.AUTH.SEND}</Button>
        </form>
      </Card>
    </div>
  )
}