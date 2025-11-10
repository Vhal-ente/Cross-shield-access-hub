
import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    const email = formData.email.trim()
    const password = formData.password

    if (!email || !password) {
      toast.error('Enter email and password')
      return
    }

    setIsLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
      toast.success('Login successful')
      onSuccess?.()
    } catch (error: any) {
      toast.error(error?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Sign in to Cross Shield</CardTitle>
        <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              disabled={isLoading}
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                disabled={isLoading}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">Toggle password visibility</span>
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="link"
              className="px-0 text-xs"
              onClick={() => navigate('/forgot-password')}
              disabled={isLoading}
            >
              Forgot password
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
          </Button>

          {onSwitchToRegister && (
            <div className="text-center text-sm">
              <span className="text-muted-foreground">No account yet? </span>
              <Button type="button" variant="link" onClick={onSwitchToRegister} className="px-1">
                Register
              </Button>
            </div>
          )}

          <div className="mt-2 rounded-md border p-3">
            <p className="text-xs text-muted-foreground mb-2">Demo accounts</p>
            <div className="text-xs grid gap-1">
              <p>
                <strong>Doctor:</strong> doctor@crossshield.com / password123
              </p>
              <p>
                <strong>Supplier:</strong> supplier@crossshield.com / password123
              </p>
              <p>
                <strong>Diaspora:</strong> diaspora@crossshield.com / password123
              </p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
