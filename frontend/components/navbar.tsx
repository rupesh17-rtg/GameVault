'use client'

import { useState, useEffect } from 'react'
import { Search, User, Sun, Moon, LogOut } from 'lucide-react'

interface NavbarProps {
  username?: string | null
  onLogout?: () => void
  currentView?: 'home' | 'collection'
  onViewChange?: (view: 'home' | 'collection') => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export function Navbar({ 
  username, 
  onLogout,
  currentView = 'home',
  onViewChange,
  searchQuery = '',
  onSearchChange
}: NavbarProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const defaultTheme = prefersDark ? 'dark' : 'light'
      setTheme(defaultTheme)
      if (defaultTheme === 'dark') {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    localStorage.setItem('theme', nextTheme)
    
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <nav className="fixed top-0 w-full glass z-50 border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 select-none cursor-pointer" onClick={() => onViewChange?.('home')}>
          <div className="text-2xl">🎮</div>
          <span className="text-2xl font-black text-foreground tracking-tight">
            GameVault
          </span>
        </div>

        <div className="flex items-center gap-6">
          {username && (
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => onViewChange?.('home')}
                className={`transition-all font-semibold text-sm cursor-pointer ${
                  currentView === 'home'
                    ? 'text-foreground border-b-2 border-foreground pb-0.5'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onViewChange?.('collection')}
                className={`transition-all font-semibold text-sm cursor-pointer ${
                  currentView === 'collection'
                    ? 'text-foreground border-b-2 border-foreground pb-0.5'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                Collection
              </button>
            </div>
          )}

          <div className="flex items-center gap-3.5">
            {/* Search */}
            {username && (
              <div className="flex items-center gap-2">
                {isSearchOpen && (
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder="Search games..."
                    className="glass-input py-1.5 px-3.5 text-xs w-44 rounded-xl transition-all duration-300 animate-scale-up"
                    autoFocus
                  />
                )}
                <button 
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen)
                    if (isSearchOpen) onSearchChange?.('') // Clear query on close
                  }}
                  className={`p-2 hover:bg-foreground/5 rounded-xl transition-colors cursor-pointer ${
                    isSearchOpen ? 'text-foreground bg-foreground/5' : 'text-foreground/85'
                  }`}
                  title="Search Games"
                >
                  <Search size={18} />
                </button>
              </div>
            )}

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-foreground/5 rounded-xl transition-colors cursor-pointer text-foreground/85"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User Profile */}
            {username && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 p-1.5 pr-3 hover:bg-foreground/5 rounded-xl transition-colors select-none">
                  <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-foreground/80 hidden sm:inline">
                    {username}
                  </span>
                </div>

                {/* Logout Button */}
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="p-2 hover:bg-destructive/10 text-foreground/70 hover:text-destructive rounded-xl transition-colors cursor-pointer"
                    title="Log Out"
                  >
                    <LogOut size={18} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}