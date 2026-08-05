'use client'

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Decorative glowing background */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute top-40 left-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
          Video Game
          <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Collection
          </span>
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          Manage your favorite games in one beautiful place. Track what you&apos;ve completed and discover what&apos;s next.
        </p>
      </div>
    </section>
  )
}