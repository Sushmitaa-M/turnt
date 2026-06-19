'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

const INITIAL_LOGIN = { email: '', password: '' }
const INITIAL_SIGNUP = {
  fullName: '',
  username: '',
  email: '',
  password: '',
  whatsapp: '',
  instagram: '',
}

function validateField(name, value) {
  switch (name) {
    case 'email':
      if (!value.trim()) return 'Email is required'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email'
      return ''
    case 'password':
      if (!value) return 'Password is required'
      if (value.length < 6) return 'At least 6 characters'
      return ''
    case 'fullName':
      if (!value.trim()) return 'Full name is required'
      return ''
    case 'username':
      if (!value.trim()) return 'Username is required'
      if (value.length < 3) return 'At least 3 characters'
      return ''
    case 'whatsapp':
      if (!value.trim()) return 'WhatsApp number is required'
      return ''
    default:
      return ''
  }
}

export default function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/'

  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')

  const [loginForm, setLoginForm] = useState(INITIAL_LOGIN)
  const [signupForm, setSignupForm] = useState(INITIAL_SIGNUP)

  const [loginErrors, setLoginErrors] = useState({})
  const [signupErrors, setSignupErrors] = useState({})
  const [touched, setTouched] = useState({})

  const resetForms = () => {
    setLoginForm(INITIAL_LOGIN)
    setSignupForm(INITIAL_SIGNUP)
    setLoginErrors({})
    setSignupErrors({})
    setTouched({})
    setServerError('')
    setSuccess('')
  }

  const toggleMode = () => {
    resetForms()
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'))
  }

  const handleLoginChange = useCallback((e) => {
    const { name, value } = e.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      setLoginErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    }
  }, [touched])

  const handleSignupChange = useCallback((e) => {
    const { name, value } = e.target
    setSignupForm((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      setSignupErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    }
  }, [touched])

  const handleLoginBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setLoginErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSignupBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setSignupErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setServerError('')
    setSuccess('')

    const fields = ['email', 'password']
    const newErrors = {}
    let hasError = false
    fields.forEach((field) => {
      const err = validateField(field, loginForm[field])
      if (err) hasError = true
      newErrors[field] = err
    })
    setTouched((prev) => ({ ...prev, email: true, password: true }))
    setLoginErrors(newErrors)
    if (hasError) return

    setLoading(true)
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      })

      if (authError) {
        setServerError(authError.message)
        return
      }

      if (data.user) {
        router.push(returnTo)
      }
    } catch {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setServerError('')
    setSuccess('')

    const fields = ['fullName', 'username', 'email', 'password', 'whatsapp']
    const newErrors = {}
    let hasError = false
    fields.forEach((field) => {
      const err = validateField(field, signupForm[field])
      if (err) hasError = true
      newErrors[field] = err
    })
    const allTouched = {}
    fields.forEach((f) => { allTouched[f] = true })
    setTouched((prev) => ({ ...prev, ...allTouched }))
    setSignupErrors(newErrors)
    if (hasError) return

    setLoading(true)
    try {
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', signupForm.username)
        .maybeSingle()

      if (existingUser) {
        setServerError('This username is already taken.')
        return
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
        options: {
          data: {
            full_name: signupForm.fullName,
            username: signupForm.username,
            whatsapp_number: signupForm.whatsapp,
            instagram_handle: signupForm.instagram,
          },
        },
      })

      if (authError) {
        setServerError(authError.message)
        return
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: signupForm.fullName,
            username: signupForm.username,
            whatsapp_number: signupForm.whatsapp,
            instagram_handle: signupForm.instagram || null,
          })

        if (profileError) {
          console.error('Profile insert failed:', profileError.message, profileError.details)
          setServerError('Account created but profile setup failed. Please contact support.')
          return
        }

        if (data.user.identities && data.user.identities.length === 0) {
          setServerError('An account with this email already exists.')
          return
        }

        router.push(returnTo)
      }
    } catch (err) {
      console.error('Signup error:', err)
      setServerError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputBase = 'w-full bg-[#0A0A0A] border rounded-xl px-4 py-3.5 text-[#FFF7ED] text-sm placeholder-[rgba(255,244,230,0.25)] focus:outline-none transition-all duration-200 cursor-text'
  const inputNormal = `${inputBase} border-[rgba(255,196,107,0.1)] focus:border-[#F26A0A] focus:shadow-[0_0_0_3px_rgba(242,106,10,0.15)]`
  const inputError = `${inputBase} border-[#EF4444] focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]`
  const labelClass = 'block text-xs font-semibold tracking-widest uppercase text-[rgba(255,244,230,0.5)] mb-2'
  const errorText = 'mt-1.5 text-xs text-[#EF4444]'

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1
            className="text-6xl font-bold tracking-tight mb-2"
            style={{
              fontFamily: "'Jorgey', sans-serif",
              textShadow: '0 0 40px rgba(242,106,10,0.3), 0 0 80px rgba(242,106,10,0.1)',
            }}
          >
            <span className="bg-gradient-to-r from-[#F26A0A] to-[#FFC46B] bg-clip-text text-transparent">
              TURNT
            </span>
          </h1>
          <p className="text-xs text-[rgba(255,244,230,0.4)] tracking-[0.3em] uppercase font-medium">
            High Energy · Good Vibes
          </p>
        </div>

        <div className="bg-[#0D0A09] border border-[rgba(255,196,107,0.06)] rounded-3xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
          <div className="flex mb-8 bg-[#050505] rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => { if (mode !== 'login') toggleMode() }}
              className={`flex-1 py-3 px-4 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer ${mode === 'login'
                  ? 'bg-gradient-to-r from-[#F26A0A] to-[#FF8B14] text-white shadow-[0_4px_20px_rgba(255,107,0,0.35)]'
                  : 'text-[rgba(255,244,230,0.35)] hover:text-[rgba(255,244,230,0.6)]'
                }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { if (mode !== 'signup') toggleMode() }}
              className={`flex-1 py-3 px-4 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer ${mode === 'signup'
                  ? 'bg-gradient-to-r from-[#F26A0A] to-[#FF8B14] text-white shadow-[0_4px_20px_rgba(255,107,0,0.35)]'
                  : 'text-[rgba(255,244,230,0.35)] hover:text-[rgba(255,244,230,0.6)]'
                }`}
            >
              Sign Up
            </button>
          </div>

          {serverError && (
            <div role="alert" className="mb-6 p-4 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl text-[#EF4444] text-sm">
              {serverError}
            </div>
          )}

          {success && (
            <div role="status" className="mb-6 p-4 bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)] rounded-xl text-[#22C55E] text-sm">
              {success}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} noValidate className="space-y-5">
              <div>
                <label htmlFor="login-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  onBlur={handleLoginBlur}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={touched.email && loginErrors.email ? inputError : inputNormal}
                />
                {touched.email && loginErrors.email && (
                  <p className={errorText} role="alert">{loginErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="login-password" className={labelClass}>
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  onBlur={handleLoginBlur}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={touched.password && loginErrors.password ? inputError : inputNormal}
                />
                {touched.password && loginErrors.password && (
                  <p className={errorText} role="alert">{loginErrors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#F26A0A] to-[#FF8B14] text-white font-bold text-xs tracking-widest uppercase py-4 rounded-xl transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(255,107,0,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} noValidate className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="signup-fullName" className={labelClass}>
                    Full Name *
                  </label>
                  <input
                    id="signup-fullName"
                    type="text"
                    name="fullName"
                    value={signupForm.fullName}
                    onChange={handleSignupChange}
                    onBlur={handleSignupBlur}
                    placeholder="John Doe"
                    autoComplete="name"
                    className={touched.fullName && signupErrors.fullName ? inputError : inputNormal}
                  />
                  {touched.fullName && signupErrors.fullName && (
                    <p className={errorText} role="alert">{signupErrors.fullName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="signup-username" className={labelClass}>
                    Username *
                  </label>
                  <input
                    id="signup-username"
                    type="text"
                    name="username"
                    value={signupForm.username}
                    onChange={handleSignupChange}
                    onBlur={handleSignupBlur}
                    placeholder="johndoe"
                    autoComplete="username"
                    className={touched.username && signupErrors.username ? inputError : inputNormal}
                  />
                  {touched.username && signupErrors.username && (
                    <p className={errorText} role="alert">{signupErrors.username}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className={labelClass}>
                  Email *
                </label>
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  value={signupForm.email}
                  onChange={handleSignupChange}
                  onBlur={handleSignupBlur}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={touched.email && signupErrors.email ? inputError : inputNormal}
                />
                {touched.email && signupErrors.email && (
                  <p className={errorText} role="alert">{signupErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="signup-password" className={labelClass}>
                  Password *
                </label>
                <input
                  id="signup-password"
                  type="password"
                  name="password"
                  value={signupForm.password}
                  onChange={handleSignupChange}
                  onBlur={handleSignupBlur}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  className={touched.password && signupErrors.password ? inputError : inputNormal}
                />
                {touched.password && signupErrors.password && (
                  <p className={errorText} role="alert">{signupErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="signup-whatsapp" className={labelClass}>
                  WhatsApp Number *
                </label>
                <input
                  id="signup-whatsapp"
                  type="tel"
                  name="whatsapp"
                  value={signupForm.whatsapp}
                  onChange={handleSignupChange}
                  onBlur={handleSignupBlur}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  className={touched.whatsapp && signupErrors.whatsapp ? inputError : inputNormal}
                />
                {touched.whatsapp && signupErrors.whatsapp && (
                  <p className={errorText} role="alert">{signupErrors.whatsapp}</p>
                )}
              </div>

              <div>
                <label htmlFor="signup-instagram" className={labelClass}>
                  Instagram Handle <span className="text-[rgba(255,244,230,0.2)]">(optional)</span>
                </label>
                <input
                  id="signup-instagram"
                  type="text"
                  name="instagram"
                  value={signupForm.instagram}
                  onChange={handleSignupChange}
                  placeholder="@yourhandle"
                  autoComplete="off"
                  className={inputNormal}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#F26A0A] to-[#FF8B14] text-white font-bold text-xs tracking-widest uppercase py-4 rounded-xl transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(255,107,0,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-[rgba(255,244,230,0.35)] text-sm hover:text-[#F26A0A] transition-colors duration-200 cursor-pointer"
            >
              {mode === 'login' ? (
                <>New here? <span className="font-semibold text-[#FF8B14]">Sign up</span></>
              ) : (
                <>Already have an account? <span className="font-semibold text-[#FF8B14]">Sign in</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
