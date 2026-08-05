'use client'

import { useState } from 'react'
import { Key, User, ArrowRight } from 'lucide-react'

interface LoginViewProps {
  onLoginSuccess: (token: string, username: string) => void
}

export function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }

    setIsLoading(true)
    try {
      const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register'
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed.')
      }

      onLoginSuccess(data.token, data.username)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 relative flex flex-col gap-6 shadow-2xl border border-foreground/10 animate-fade-in animate-scale-up">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="text-4xl inline-block mb-2">🎮</div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            {isLoginMode ? 'Welcome to GameVault' : 'Create Account'}
          </h1>
          <p className="text-sm text-foreground/50">
            {isLoginMode
              ? 'Sign in to access your game collection'
              : 'Sign up to start tracking your games'}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm font-semibold p-3.5 rounded-2xl border border-destructive/10 text-center animate-shake">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-foreground/70 text-xs font-semibold uppercase tracking-wider pl-1">
              Username
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-foreground/40">
                <User size={16} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="glass-input w-full pl-11 py-3 text-sm font-medium"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-foreground/70 text-xs font-semibold uppercase tracking-wider pl-1">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-foreground/40">
                <Key size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="glass-input w-full pl-11 py-3 text-sm font-medium"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="glow-button w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
            ) : isLoginMode ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Footer toggling */}
        <div className="text-center pt-2 border-t border-foreground/10 text-sm">
          <span className="text-foreground/50">
            {isLoginMode
              ? "Don't have an account? "
              : 'Already have an account? '}
          </span>
          <button
            onClick={() => {
              setIsLoginMode(!isLoginMode)
              setError(null)
              setUsername('')
              setPassword('')
            }}
            disabled={isLoading}
            className="text-foreground font-bold hover:underline cursor-pointer disabled:opacity-50"
          >
            {isLoginMode ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}