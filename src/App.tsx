import React from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Music, Gamepad2, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 pt-8 px-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            <Zap className="text-black w-6 h-6 fill-current" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">
            Neon<span className="text-cyan-400">Rhythm</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-white/40">
          <a href="#" className="hover:text-cyan-400 transition-colors">Arcade</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Tracks</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Leaderboard</a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/60">
            v1.0.4-beta
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column - Info & Stats */}
        <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-white/40">
              <Gamepad2 size={16} />
              <span className="text-[10px] font-mono uppercase tracking-widest">Controls</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {[
                { key: '↑↓←→', action: 'Navigate Snake' },
                { key: 'Space', action: 'Pause / Resume' },
                { key: 'R', action: 'Reset Game' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs font-mono text-cyan-400">{item.key}</span>
                  <span className="text-[10px] text-white/40 uppercase">{item.action}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
            <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">Daily Challenge</h4>
            <p className="text-sm text-white/70 leading-relaxed">
              Reach 500 points in "Cyber Pulse" to unlock the <span className="text-white font-bold">Neon Ghost</span> skin.
            </p>
          </section>
        </div>

        {/* Center Column - Game */}
        <div className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <SnakeGame />
          </motion.div>
        </div>

        {/* Right Column - Music Player */}
        <div className="lg:col-span-3 flex flex-col gap-8 order-3">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-white/40">
              <Music size={16} />
              <span className="text-[10px] font-mono uppercase tracking-widest">Now Playing</span>
            </div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <MusicPlayer />
            </motion.div>
          </section>

          <section className="space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Upcoming Tracks</span>
            <div className="space-y-2">
              {[
                { title: 'Neon Dreams', artist: 'Digital Echo', time: '3:32' },
                { title: 'Midnight Drive', artist: 'Vector Wave', time: '2:36' }
              ].map((track, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-mono text-white/20 group-hover:text-cyan-400">
                    0{i + 2}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-white/80">{track.title}</h5>
                    <p className="text-[10px] text-white/40">{track.artist}</p>
                  </div>
                  <span className="text-[10px] font-mono text-white/20">{track.time}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="relative z-10 py-12 px-8 border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
            © 2026 Neon Rhythm Arcade • All Rights Reserved
          </div>
          <div className="flex gap-8 text-[10px] font-mono text-white/40 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
