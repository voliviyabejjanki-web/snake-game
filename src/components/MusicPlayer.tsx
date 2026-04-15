import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Slider } from '@/components/ui/slider';

const TRACKS = [
  {
    id: 1,
    title: "Cyber Pulse",
    artist: "AI Synth",
    duration: 184,
    color: "from-cyan-500 to-blue-600",
    glow: "rgba(34, 211, 238, 0.5)"
  },
  {
    id: 2,
    title: "Neon Dreams",
    artist: "Digital Echo",
    duration: 212,
    color: "from-fuchsia-500 to-purple-600",
    glow: "rgba(217, 70, 239, 0.5)"
  },
  {
    id: 3,
    title: "Midnight Drive",
    artist: "Vector Wave",
    duration: 156,
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16, 185, 129, 0.5)"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState([70]);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            handleNext();
            return 0;
          }
          return p + 0.5;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentTrack.color} flex items-center justify-center shadow-lg shadow-current/20`}>
          <Music className="text-white w-8 h-8" />
        </div>
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="flex flex-col"
            >
              <h3 className="text-lg font-bold text-white truncate">{currentTrack.title}</h3>
              <p className="text-sm text-white/50 font-mono uppercase tracking-wider">{currentTrack.artist}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-2">
        <Slider 
          value={[progress]} 
          max={100} 
          step={0.1}
          onValueChange={(val) => setProgress(val[0])}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-white/30 uppercase tracking-tighter">
          <span>{formatTime((progress / 100) * currentTrack.duration)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <SkipBack size={24} />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isPlaying ? 'bg-white text-black scale-95' : 'bg-white text-black hover:scale-105'}`}
            style={{ boxShadow: isPlaying ? `0 0 20px ${currentTrack.glow}` : 'none' }}
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          <button 
            onClick={handleNext}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex items-center gap-3 w-32">
          <Volume2 size={16} className="text-white/40" />
          <Slider 
            value={volume} 
            max={100} 
            step={1}
            onValueChange={setVolume}
            className="w-full"
          />
        </div>
      </div>

      {/* Visualizer Bars */}
      <div className="flex items-end justify-center gap-1 h-8 px-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className={`w-1 rounded-full bg-gradient-to-t ${currentTrack.color}`}
            animate={{ 
              height: isPlaying ? [8, Math.random() * 32 + 8, 8] : 4 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.5 + Math.random() * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
}
