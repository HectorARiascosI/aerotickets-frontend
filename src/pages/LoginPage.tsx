import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { useAuth } from '@/auth/AuthContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaPlane, FaEnvelope, FaLock } from 'react-icons/fa'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(4, 'Mínimo 4 caracteres')
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/flights'

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password)
      // Usar replace para evitar que el usuario vuelva al login con el botón atrás
      navigate(from, { replace: true })
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'No fue posible iniciar sesión')
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo animado */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block bg-gradient-hero p-4 rounded-2xl shadow-glow mb-4"
          >
            <FaPlane className="text-4xl text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text">Bienvenido de vuelta</h1>
          <p className="text-gray-600 mt-2">Inicia sesión para continuar tu viaje</p>
        </motion.div>

        <Card className="shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-10 text-gray-400" />
              <Input 
                label="Email" 
                type="email" 
                {...register('email')} 
                error={errors.email?.message}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <FaLock className="absolute left-3 top-10 text-gray-400" />
              <Input 
                label="Contraseña" 
                type="password" 
                {...register('password')} 
                error={errors.password?.message}
                className="pl-10"
              />
            </div>

            <Button 
              type="submit" 
              loading={isSubmitting} 
              className="w-full !bg-gradient-hero hover:shadow-glow !py-3 !text-base"
            >
              Iniciar sesión
            </Button>
          </form>
          
          <div className="text-sm mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <Link className="text-primary-600 hover:text-primary-700 font-medium" to="/register">
                Crear cuenta nueva
              </Link>
              <Link className="text-gray-600 hover:text-gray-700" to="/forgot-password">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
        </Card>

        {/* Link a landing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
            ← Volver al inicio
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}