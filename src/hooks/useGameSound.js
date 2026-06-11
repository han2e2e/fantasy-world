import { useCallback, useEffect, useRef } from 'react'

export function useGameSound() {
  const audioContextRef = useRef(null)

  const getAudioContext = useCallback(() => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return null

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass()
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }

    return audioContextRef.current
  }, [])

  const playSelectSound = useCallback(() => {
    const ctx = getAudioContext()
    if (!ctx) return

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const now = ctx.currentTime
    const duration = 0.08

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(880, now)

    gainNode.gain.setValueAtTime(0.18, now)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start(now)
    oscillator.stop(now + duration)
  }, [getAudioContext])

  const playAwakeningSound = useCallback(() => {
    const ctx = getAudioContext()
    if (!ctx) return

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const now = ctx.currentTime
    const duration = 2.5
    const fadeIn = 1.2

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(220, now)
    oscillator.frequency.exponentialRampToValueAtTime(880, now + duration)

    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.22, now + fadeIn)
    gainNode.gain.setValueAtTime(0.22, now + duration - 0.4)
    gainNode.gain.linearRampToValueAtTime(0, now + duration)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start(now)
    oscillator.stop(now + duration)
  }, [getAudioContext])

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }, [])

  return { playSelectSound, playAwakeningSound }
}
