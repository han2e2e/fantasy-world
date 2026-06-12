import { useRef, useCallback } from 'react'

function createAudioContext() {
  if (typeof window === 'undefined') return null
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return null
  return new AudioContextClass()
}

export function useGameSound() {
  const ctxRef = useRef(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = createAudioContext()
    }
    if (ctxRef.current && ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  // 선택 클릭음
  const playSelectSound = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08)
    gain.gain.setValueAtTime(0.18, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.12)
  }, [getCtx])

  // Phase 0: 두우웅 저음 (마법진 소환 전조)
  const playBoomSound = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime

    const sub = ctx.createOscillator()
    const subGain = ctx.createGain()
    sub.connect(subGain)
    subGain.connect(ctx.destination)
    sub.type = 'sine'
    sub.frequency.setValueAtTime(55, t)
    sub.frequency.exponentialRampToValueAtTime(40, t + 1.2)
    subGain.gain.setValueAtTime(0, t)
    subGain.gain.linearRampToValueAtTime(0.7, t + 0.05)
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 1.4)
    sub.start(t)
    sub.stop(t + 1.4)

    const mid = ctx.createOscillator()
    const midGain = ctx.createGain()
    mid.connect(midGain)
    midGain.connect(ctx.destination)
    mid.type = 'triangle'
    mid.frequency.setValueAtTime(110, t)
    midGain.gain.setValueAtTime(0.2, t)
    midGain.gain.exponentialRampToValueAtTime(0.001, t + 0.9)
    mid.start(t)
    mid.stop(t + 0.9)
  }, [getCtx])

  // Phase 1~3: 망치 단조음 (호출마다 약간 다른 주파수)
  const playHammerSound = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    const freq = 160 + Math.random() * 40

    const impact = ctx.createOscillator()
    const impactGain = ctx.createGain()
    impact.connect(impactGain)
    impactGain.connect(ctx.destination)
    impact.type = 'sawtooth'
    impact.frequency.setValueAtTime(freq, t)
    impact.frequency.exponentialRampToValueAtTime(freq * 0.4, t + 0.18)
    impactGain.gain.setValueAtTime(0.85, t)
    impactGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
    impact.start(t)
    impact.stop(t + 0.22)

    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * 0.08))
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i += 1) data[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.value = 800
    noiseFilter.Q.value = 0.8
    const noiseGain = ctx.createGain()
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noiseGain.gain.setValueAtTime(0.6, t)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09)
    noise.start(t)
    noise.stop(t + 0.09)

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(60)
    }
  }, [getCtx])

  // Phase 5: 완성 화음 (C4·E4·G4·C5 + 딜레이 리버브)
  const playCompleteSound = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    const master = ctx.createGain()
    master.gain.setValueAtTime(0.4, t)
    master.connect(ctx.destination)

    const delay = ctx.createDelay(0.3)
    delay.delayTime.value = 0.18
    const delayGain = ctx.createGain()
    delayGain.gain.value = 0.25
    delay.connect(delayGain)
    delayGain.connect(delay)
    delayGain.connect(master)

    ;[261.63, 329.63, 392.0, 523.25].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.connect(g)
      g.connect(master)
      g.connect(delay)
      osc.type = 'sine'
      osc.frequency.value = freq
      const startT = t + i * 0.04
      g.gain.setValueAtTime(0, startT)
      g.gain.linearRampToValueAtTime(0.55, startT + 0.06)
      g.gain.exponentialRampToValueAtTime(0.001, startT + 1.6)
      osc.start(startT)
      osc.stop(startT + 1.6)
    })

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([40, 30, 80])
    }
  }, [getCtx])

  // 기존 호환성 유지
  const playAwakeningSound = playBoomSound

  return {
    playSelectSound,
    playBoomSound,
    playHammerSound,
    playCompleteSound,
    playAwakeningSound,
  }
}
