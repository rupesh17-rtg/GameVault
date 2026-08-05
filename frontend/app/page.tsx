'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Stats } from '@/components/stats'
import { AddGameForm } from '@/components/add-game-form'
import { GameCollection } from '@/components/game-collection'
import { EditGameModal } from '@/components/edit-game-modal'
import { LoginView } from '@/components/login-view'

interface Game {
  id: string
  title: string
  platform: string
  completed: boolean
}

export default function Page() {
  const [token, setToken] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [currentView, setCurrentView] = useState<'home' | 'collection'>('home')
  const [searchQuery, setSearchQuery] = useState('')

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUsername = localStorage.getItem('username')
    if (savedToken && savedUsername) {
      setToken(savedToken)
      setUsername(savedUsername)
    }
  }, [])

  // Fetch games when token is set/changed
  useEffect(() => {
    if (!token) return

    async function fetchGames() {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`${API_URL}/api/games`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.status === 401) {
          handleLogout()
          throw new Error('Session expired. Please log in again.')
        }

        if (!response.ok) {
          throw new Error('Failed to fetch games')
        }
        const data = await response.json()
        setGames(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Something went wrong while fetching games.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchGames()
  }, [token, API_URL])

  const handleLoginSuccess = (newToken: string, newUsername: string) => {
    setToken(newToken)
    setUsername(newUsername)
    localStorage.setItem('token', newToken)
    localStorage.setItem('username', newUsername)
  }

  const handleLogout = () => {
    setToken(null)
    setUsername(null)
    setGames([])
    localStorage.removeItem('token')
    localStorage.removeItem('username')
  }

  const handleAddGame = async (newGameData: { title: string; platform: string; completed: boolean }) => {
    if (!token) return
    try {
      const { title, platform, completed } = newGameData
      const response = await fetch(`${API_URL}/api/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, platform, completed }),
      })

      if (response.status === 401) {
        handleLogout()
        alert('Session expired. Please log in again.')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to add game')
      }
      const createdGame = await response.json()
      setGames((prevGames) => [createdGame, ...prevGames])
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Could not add game')
    }
  }

  const handleDeleteGame = async (id: string) => {
    if (!token) return
    try {
      const response = await fetch(`${API_URL}/api/games/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.status === 401) {
        handleLogout()
        alert('Session expired. Please log in again.')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to delete game')
      }
      setGames((prevGames) => prevGames.filter((game) => game.id !== id))
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Could not delete game')
    }
  }

  const handleEditGame = (id: string) => {
    const game = games.find((g) => g.id === id)
    if (game) {
      setEditingGame(game)
    }
  }

  const handleUpdateGame = async (id: string, updatedFields: Omit<Game, 'id'>) => {
    if (!token) return
    try {
      const response = await fetch(`${API_URL}/api/games/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedFields),
      })

      if (response.status === 401) {
        handleLogout()
        alert('Session expired. Please log in again.')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to update game')
      }
      const updatedGame = await response.json()
      setGames((prevGames) =>
        prevGames.map((game) => (game.id === id ? updatedGame : game))
      )
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Could not update game')
      throw err
    }
  }

  const totalGames = games.length
  const completedGames = games.filter((game) => game.completed).length
  const remainingGames = totalGames - completedGames

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="min-h-screen w-full pb-20">
      <Navbar 
        username={username} 
        onLogout={handleLogout}
        currentView={currentView}
        onViewChange={setCurrentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      {!token ? (
        <div className="pt-24">
          <LoginView onLoginSuccess={handleLoginSuccess} />
        </div>
      ) : (
        /* Dashboard Container */
        <div className="max-w-7xl mx-auto px-6 pt-28 flex flex-col gap-8">
          
          {/* Header Section */}
          {currentView === 'home' ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-foreground/10 pb-6 animate-fade-in">
              <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Game Dashboard</h1>
                <p className="text-sm text-foreground/50 mt-1">Manage and track your video game collection.</p>
              </div>
              <Stats
                totalGames={totalGames}
                completedGames={completedGames}
                remainingGames={remainingGames}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between border-b border-foreground/10 pb-6 animate-fade-in">
              <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Collection</h1>
                <p className="text-sm text-foreground/50 mt-1">Browse and search your full video game gallery.</p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-foreground/5 border border-foreground/10 rounded-full text-foreground/60">
                {filteredGames.length} of {games.length} games shown
              </span>
            </div>
          )}

          {/* Dashboard Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Add Game Widget (Only in home view) */}
            {currentView === 'home' && (
              <div className="lg:col-span-1 lg:sticky lg:top-24 animate-scale-up">
                <AddGameForm onAddGame={handleAddGame} />
              </div>
            )}

            {/* Right Column: Game Cards Grid */}
            <div className={`${currentView === 'home' ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6`}>
              {currentView === 'home' && (
                <div className="flex items-center justify-between animate-fade-in">
                  <h2 className="text-xl font-bold text-foreground">Your Collection</h2>
                  <span className="text-xs px-2.5 py-1 bg-foreground/5 border border-foreground/10 rounded-full text-foreground/60">
                    {filteredGames.length} of {games.length} games shown
                  </span>
                </div>
              )}

              {isLoading ? (
                <div className="glass-card p-12 text-center flex flex-col items-center justify-center">
                  <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                  <p className="text-foreground/60">Loading your collection...</p>
                </div>
              ) : error ? (
                <div className="glass-card p-12 text-center">
                  <p className="text-destructive font-medium">{error}</p>
                </div>
              ) : (
                <GameCollection
                  games={filteredGames}
                  onEdit={handleEditGame}
                  onDelete={handleDeleteGame}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Game Modal */}
      <EditGameModal
        game={editingGame}
        onClose={() => setEditingGame(null)}
        onSave={handleUpdateGame}
      />
    </main>
  )
}