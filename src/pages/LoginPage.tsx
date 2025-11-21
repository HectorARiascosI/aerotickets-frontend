import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { useAuth } from '@/auth/AuthContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaPlane, FaEnvelope, FaLock } from 'react-icons/fa'
import { LABELS, MESSAGES, ROUTES } from '@/constants'

const schema = z.object({
  email: z.string()
    .min(1, 'El email es requerido')
    .email(MESSAGES.AUTH.INVALID_EMAIL),
  password: z.string()
    .min(1, 'La contraseña es requerida')
    .min(4, MESSAGES.AUTH.MIN_PASSWORD_LENGTH)
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || ROUTES.FLIGHTS

  useEffect(() => {
    if (user) {
      navigate(ROUTES.FLIGHTS, { replace: true })
    }
  }, [user, navigate])

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password)
      navigate(from, { replace: true })
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? MESSAGES.AUTH.LOGIN_ERROR)
    }
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
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
          <h1 className="text-3xl font-bold gradient-text">{LABELS.AUTH.LOGIN_TITLE}</h1>
          <p className="text-gray-600 mt-2">{LABELS.AUTH.LOGIN_SUBTITLE}</p>
        </motion.div>

        <Card className="shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-10 text-gray-400" />
              <Input 
                label={LABELS.AUTH.EMAIL}
                type="email" 
                {...register('email', {
                  setValueAs: (value) => value?.trim() || ''
                })} 
                error={errors.email?.message}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <FaLock className="absolute left-3 top-10 text-gray-400" />
              <Input 
                label={LABELS.AUTH.PASSWORD}
                type="password" 
                {...register('password', {
                  setValueAs: (value) => value?.trim() || ''
                })} 
                error={errors.password?.message}
                className="pl-10"
              />
            </div>

            <Button 
              type="submit" 
              loading={isSubmitting} 
              className="w-full !bg-gradient-hero hover:shadow-glow !py-3 !text-base"
            >
              {LABELS.AUTH.LOGIN_BUTTON}
            </Button>
          </form>
          
          <div className="text-sm mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <Link className="text-primary-600 hover:text-primary-700 font-medium" to={ROUTES.REGISTER}>
                {LABELS.AUTH.CREATE_ACCOUNT}
              </Link>
              <Link className="text-gray-600 hover:text-gray-700" to={ROUTES.FORGOT_PASSWORD}>
                {LABELS.AUTH.FORGOT_PASSWORD}
              </Link>
            </div>
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <Link to={ROUTES.HOME} className="text-gray-600 hover:text-primary-600 transition-colors">
            ← {LABELS.AUTH.BACK_TO_HOME}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}