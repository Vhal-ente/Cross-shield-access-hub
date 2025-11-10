import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword() {
  const { forgotPassword } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return

    const trimmed = email.trim()
    if (!trimmed) {
      toast.error('Enter your email')
      return
    }

    setLoading(true)
    try {
      await forgotPassword(trimmed)
      toast.success('Reset link sent to your email')
      navigate('/login')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-b from-background to-muted/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md border rounded-2xl">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl">Forgot password</CardTitle>
          <p className="text-sm text-muted-foreground">A reset link will be sent to your email.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-4 mb-6">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
            <div className="flex justify-end">
            <Button
              type="button"
              variant="link"
              className="px-0 text-xs"
              onClick={() => navigate('/reset-password')}
              disabled={loading}
            >
              Reset password
            </Button>
          </div>
            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Back to home
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
