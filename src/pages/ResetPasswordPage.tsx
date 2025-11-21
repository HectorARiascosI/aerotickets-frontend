import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuth } from '@/auth/AuthContext'
import { resetPassword } from '@/services/authService'
import toast from 'react-hot-toast'
import { LABELS, MESSAGES, ROUTES } from '@/constants'

const schema = z.object({ 
  password: z.preprocess(
    (val) => typeof val === 'string' ? val.trim() : val,
    z.string()
      .min(1, 'La contraseña es requerida')
      .min(4, MESSAGES.AUTH.MIN_PASSWORD_LENGTH)
  )
})
type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      navigate(ROUTES.FLIGHTS, { replace: true })
    }
  }, [user, navigate])

  const onSubmit = async (data: FormData) => {
    try {
      await resetPassword(token!, data.password)
      toast.success(MESSAGES.AUTH.PASSWORD_RESET_SENT)
      navigate(ROUTES.LOGIN, { replace: true })
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
          <Input label={LABELS.AUTH.PASSWORD} type="password" {...register('password')} error={errors.password?.message} />
          <Button type="submit" loading={isSubmitting} className="w-full">{LABELS.AUTH.SEND}</Button>
        </form>
      </Card>
    </div>
  )
}
