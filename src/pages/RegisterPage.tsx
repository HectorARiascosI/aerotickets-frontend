import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { useAuth } from '@/auth/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LABELS, MESSAGES, ROUTES } from '@/constants'

const schema = z.object({
  username: z.string()
    .min(1, 'El nombre es requerido')
    .min(2, MESSAGES.AUTH.MIN_USERNAME_LENGTH),
  email: z.string()
    .min(1, 'El email es requerido')
    .email(MESSAGES.AUTH.INVALID_EMAIL),
  password: z.string()
    .min(1, 'La contraseña es requerida')
    .min(4, MESSAGES.AUTH.MIN_PASSWORD_LENGTH)
})
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const { register: registerField, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })
  const { register: registerUser, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate(ROUTES.FLIGHTS, { replace: true })
    }
  }, [user, navigate])

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data)
      toast.success(MESSAGES.AUTH.REGISTER_SUCCESS)
      navigate(ROUTES.LOGIN, { replace: true })
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? MESSAGES.AUTH.REGISTER_ERROR)
    }
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 gradient-text">{LABELS.AUTH.REGISTER_TITLE}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input 
            label={LABELS.AUTH.USERNAME} 
            {...registerField('username', {
              setValueAs: (value) => value?.trim() || ''
            })} 
            error={errors.username?.message} 
          />
          <Input 
            label={LABELS.AUTH.EMAIL} 
            type="email" 
            {...registerField('email', {
              setValueAs: (value) => value?.trim() || ''
            })} 
            error={errors.email?.message} 
          />
          <Input 
            label={LABELS.AUTH.PASSWORD} 
            type="password" 
            {...registerField('password', {
              setValueAs: (value) => value?.trim() || ''
            })} 
            error={errors.password?.message} 
          />
          <Button 
            type="submit" 
            loading={isSubmitting} 
            className="w-full !bg-gradient-hero hover:shadow-glow"
          >
            {LABELS.AUTH.REGISTER_BUTTON}
          </Button>
        </form>
        <div className="text-sm mt-4 text-center">
          <Link className="text-primary-600 hover:text-primary-700 font-medium" to={ROUTES.LOGIN}>
            {LABELS.AUTH.HAVE_ACCOUNT}
          </Link>
        </div>
      </Card>
    </div>
  )
}