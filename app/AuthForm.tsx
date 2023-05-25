'use client'

import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { BsGithub, BsGoogle } from 'react-icons/bs'
import { signIn, useSession } from 'next-auth/react'

import Input from '@/components/inputs/Input'
import Button from '@/components/Button'
import AuthSocialButton from './AuthSocialButton'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

enum Variant {
  LOGIN,
  RESISTER
}

export default function AuthForm() {
  const session = useSession()
  const router = useRouter()
  const [variant, setVariant] = useState<Variant>(Variant.LOGIN)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session.status === 'authenticated') {
      router.push('/users')
    }
  }, [session.status, router])

  const toggleVariant = useCallback(() => {
    if (variant === Variant.LOGIN) {
      setVariant(Variant.RESISTER)
    } else {
      setVariant(Variant.LOGIN)
    }
  }, [variant])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = data => {
    setIsLoading(true)

    if (variant === Variant.RESISTER) {
      axios
        .post('/api/register', data)
        .then(() => signIn('credentials', data))
        .catch(() => toast.error('Something went wrong.'))
        .finally(() => setIsLoading(false))
    }
    if (variant === Variant.LOGIN) {
      signIn('credentials', {
        ...data,
        redirect: false
      })
        .then(callback => {
          if (callback?.error) {
            toast.error('Invalid credentials')
          }

          if (callback?.ok && !callback.error) {
            toast.success('Logged in')
            router.push('/users')
          }
        })
        .finally(() => setIsLoading(false))
    }
  }

  const socialAction = (action: string) => {
    setIsLoading(true)

    signIn(action, { redirect: false })
      .then(callback => {
        if (callback?.error) {
          toast.error('Invalid Credentials')
        }

        if (callback?.ok && !callback.error) {
          toast.success('Logged in!')
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === Variant.RESISTER && (
            <Input
              id="name"
              label="Name"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            id="email"
            label="Email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === Variant.LOGIN ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-white">
                or continue with
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
          </div>

          <div className="flex justify-center gap-2 px-2 mt-6 text-sm text-gray-500">
            <div>
              {variant === Variant.LOGIN
                ? 'New to Messenger?'
                : 'Already have an account?'}
            </div>
            <div onClick={toggleVariant} className="underline cursor-pointer">
              {variant === Variant.LOGIN ? 'Create an account' : 'Login'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
