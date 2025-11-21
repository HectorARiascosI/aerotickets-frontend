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

const schema = z.object({
  username: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(4, 'Mínimo 4 caracteres')
})
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const { register: registerField, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })
  const { register: registerUser, user } = useAuth()
  const navigate = useNavigate()

  // Si el usuario ya está autenticado, redirigir a flights
  useEffect(() => {
    if (user) {
      navigate('/flights', { replace: true })
    }
  }, [user, navigate])

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data)
      toast.success('Cuenta creada, ahora inicia sesión')
      // Usar replace para evitar que el usuario vuelva al registro con el botón atrás
      navigate('/login', { replace: true })
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'No fue posible crear la cuenta')
    }
  }

  // No renderizar el formulario si el usuario ya está autenticado
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 gradient-text">Crear cuenta</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Usuario" {...registerField('username')} error={errors.username?.message} />
          <Input label="Email" type="email" {...registerField('email')} error={errors.email?.message} />
          <Input label="Contraseña" type="password" {...registerField('password')} error={errors.password?.message} />
          <Button 
            type="submit" 
            loading={isSubmitting} 
            className="w-full !bg-gradient-hero hover:shadow-glow"
          >
            Registrar
          </Button>
        </form>
        <div className="text-sm mt-4 text-center">
          <Link className="text-primary-600 hover:text-primary-700 font-medium" to="/login">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </Card>
    </div>
  )
}