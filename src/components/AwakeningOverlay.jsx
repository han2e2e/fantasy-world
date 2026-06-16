import { useEffect, useRef, useState } from 'react'

// ── 직업 고유 색상 매핑 (채도/밝기 최대 원색) ──
function getColorFromTitleClass(titleClass) {
  const map = {
    'title-combat-1': { primary: '#00aaff', glow: 'rgba(0,170,255,0.95)', bg: '#00050f' },
    'title-combat-2': { primary: '#ff4500', glow: 'rgba(255,69,0,0.95)', bg: '#0f0100' },
    'title-combat-3': { primary: '#1e90ff', glow: 'rgba(30,144,255,0.95)', bg: '#00050f' },
    'title-combat-4': { primary: '#ffc200', glow: 'rgba(255,194,0,0.98)', bg: '#0f0900' },
    'title-strategy-5': { primary: '#cc00ff', glow: 'rgba(204,0,255,0.95)', bg: '#07000f' },
    'title-strategy-6': { primary: '#e8eef2', glow: 'rgba(232,238,242,0.9)', bg: '#05060a' },
    'title-strategy-7': { primary: '#00e676', glow: 'rgba(0,230,118,0.95)', bg: '#001a0a' },
    'title-strategy-8': { primary: '#7c4dff', glow: 'rgba(124,77,255,0.95)', bg: '#03000f' },
    'title-survival-9': { primary: '#ff1493', glow: 'rgba(255,20,147,0.95)', bg: '#0f0008' },
    'title-survival-10': { primary: '#40c4ff', glow: 'rgba(64,196,255,0.95)', bg: '#00080f' },
    'title-survival-11': { primary: '#ffea00', glow: 'rgba(255,234,0,0.98)', bg: '#0f0d00' },
    'title-survival-12': { primary: '#e0f4ff', glow: 'rgba(224,244,255,0.88)', bg: '#04080f' },
    'title-modern-13': { primary: '#00e5ff', glow: 'rgba(0,229,255,0.95)', bg: '#000f0f' },
    'title-modern-14': { primary: '#ff6d00', glow: 'rgba(255,109,0,0.95)', bg: '#0f0300' },
    'title-modern-15': { primary: '#2979ff', glow: 'rgba(41,121,255,0.95)', bg: '#00030f' },
    'title-modern-16': { primary: '#9c27ff', glow: 'rgba(156,39,255,0.95)', bg: '#04000f' },
    'title-hidden-17': { primary: '#ff0044', glow: 'rgba(255,0,68,0.98)', bg: '#0f0002' },
    'title-hidden-18': { primary: '#ffd700', glow: 'rgba(255,215,0,0.98)', bg: '#0f0c00' },
    'title-hidden-19': { primary: '#b2ff59', glow: 'rgba(178,255,89,0.98)', bg: '#050f00' },
    'title-hidden-20': { primary: '#ea00ff', glow: 'rgba(234,0,255,0.98)', bg: '#07000f' },
  }
  return map[titleClass] ?? { primary: '#4dd9ff', glow: 'rgba(77,217,255,0.9)', bg: '#020c18' }
}

// 두 HEX 색상을 t(0~1) 비율로 보간
function blendHex(hexA, hexB, t) {
  const parse = (h) => {
    const c = h.replace('#', '')
    return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]
  }
  const [ar, ag, ab] = parse(hexA)
  const [br, bg_, bb] = parse(hexB)
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg_ - ag) * t)
  const b = Math.round(ab + (bb - ab) * t)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// 무채색 시작점 — 차갑지 않은 순수 회백색
const NEUTRAL_START = '#c8c8d0'
const BG_START = '#04040a'

// ── 기하 헬퍼 (중심은 translate(300,300) 이후의 0,0 기준) ──
function polyPoints(n, r, rot = 0) {
  return Array.from({ length: n }, (_, i) => {
    const a = ((rot + (i * 360) / n) * Math.PI) / 180 - Math.PI / 2
    return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`
  }).join(' ')
}

function starPoints(points, rOut, rIn, rot = 0) {
  return Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 === 0 ? rOut : rIn
    const a = ((rot + (i * 360) / (points * 2)) * Math.PI) / 180 - Math.PI / 2
    return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`
  }).join(' ')
}

// 8종 룬 심볼 (원점 기준 작은 선분 조합)
function RuneSymbol({ index }) {
  switch (index % 8) {
    case 0:
      return (
        <>
          <line x1="-6" y1="-6" x2="6" y2="6" />
          <line x1="-6" y1="6" x2="6" y2="-6" />
          <circle r="5" fill="none" />
        </>
      )
    case 1:
      return (
        <>
          <line x1="0" y1="-7" x2="0" y2="7" />
          <line x1="-5" y1="-3" x2="5" y2="-3" />
          <line x1="-5" y1="3" x2="5" y2="3" />
        </>
      )
    case 2:
      return <polygon points="0,-7 6,4 -6,4" fill="none" />
    case 3:
      return (
        <>
          <line x1="0" y1="-7" x2="0" y2="7" />
          <circle r="4" fill="none" />
        </>
      )
    case 4:
      return <polygon points="0,-7 6,0 0,7 -6,0" fill="none" />
    case 5:
      return (
        <>
          <line x1="-6" y1="-6" x2="0" y2="2" />
          <line x1="6" y1="-6" x2="0" y2="2" />
          <line x1="0" y1="2" x2="0" y2="7" />
        </>
      )
    case 6:
      return (
        <>
          <line x1="-6" y1="0" x2="6" y2="0" />
          <line x1="0" y1="-6" x2="0" y2="6" />
          <circle r="6" fill="none" />
        </>
      )
    default:
      return (
        <>
          <circle r="6" fill="none" />
          <circle r="2" fill="currentColor" stroke="none" />
        </>
      )
  }
}

// ── 파티클 폭발 (key 변경으로 리마운트) ──
function ParticlesBurst({ mc }) {
  const particles = Array.from({ length: 14 }, (_, i) => ({
    angle: i * (360 / 14),
    dist: 90 + (i % 4) * 28,
    delay: i * 0.03,
    size: i % 3 === 0 ? 4 : 2.5,
  }))

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      {particles.map((p, i) => (
        <circle
          key={i}
          cx="50%"
          cy="50%"
          r={p.size}
          fill={mc}
          style={{
            transformOrigin: 'center',
            animation: `particle-fly 0.55s ease-out ${p.delay}s forwards`,
            '--angle': `${p.angle}deg`,
            '--dist': `${p.dist}px`,
          }}
        />
      ))}
    </svg>
  )
}

// ── 마법진 SVG (색을 직접 주입) ──
function MagicCircleSVG({ mc, phase, opacity }) {
  const coreBlur = phase >= 5 ? 20 : phase >= 4 ? 12 : 7

  return (
    <svg
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      overflow="visible"
      style={{ opacity, transition: 'opacity 0.6s ease' }}
    >
      <defs>
        <filter id="glow-sm" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-md" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-core" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={coreBlur} result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="core-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.95} />
          <stop offset="40%" stopColor={mc} stopOpacity={0.85} />
          <stop offset="100%" stopColor={mc} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* ① 최외곽 점선 링 + 눈금 16개 */}
      <g className="ring-dotted">
        <g transform="translate(300,300)">
          <circle
            r="270"
            fill="none"
            stroke={mc}
            strokeOpacity={0.45}
            strokeWidth="1.5"
            strokeDasharray="5 9"
          />
          {Array.from({ length: 16 }, (_, i) => {
            const a = ((i * 22.5) * Math.PI) / 180 - Math.PI / 2
            return (
              <line
                key={i}
                x1={(Math.cos(a) * 264).toFixed(1)}
                y1={(Math.sin(a) * 264).toFixed(1)}
                x2={(Math.cos(a) * 276).toFixed(1)}
                y2={(Math.sin(a) * 276).toFixed(1)}
                stroke={mc}
                strokeOpacity={0.45}
                strokeWidth="1.5"
              />
            )
          })}
        </g>
      </g>

      {/* ② 룬 심볼 링 r=245 */}
      <g className="ring-rune" filter="url(#glow-sm)">
        <g transform="translate(300,300)">
          <circle r="245" fill="none" stroke={mc} strokeOpacity={0.6} strokeWidth="1" />
          {Array.from({ length: 8 }, (_, i) => (
            <g
              key={i}
              transform={`rotate(${i * 45}) translate(0,-245)`}
              stroke={mc}
              strokeOpacity={0.75}
              strokeWidth="1.4"
              fill="none"
              color={mc}
            >
              <RuneSymbol index={i} />
            </g>
          ))}
        </g>
      </g>

      {/* ③ 12각형 외곽 r=235 */}
      <g className="ring-12gon">
        <g transform="translate(300,300)">
          <polygon points={polyPoints(12, 235)} fill="none" stroke={mc} strokeOpacity={0.3} strokeWidth="1.2" />
        </g>
      </g>

      {/* ④ 14각 별형 외각 r=195 (phase별 가속) */}
      <g className="ring-star">
        <g transform="translate(300,300)">
          <polygon points={starPoints(14, 195, 140)} fill="none" stroke={mc} strokeOpacity={0.5} strokeWidth="1.3" />
        </g>
      </g>

      {/* ⑤ 위성 6개 공전 r=158 + 고정 Star of David */}
      <g transform="translate(300,300)">
        <polygon points={polyPoints(3, 158, 0)} fill="none" stroke={mc} strokeOpacity={0.25} strokeWidth="1" />
        <polygon points={polyPoints(3, 158, 180)} fill="none" stroke={mc} strokeOpacity={0.25} strokeWidth="1" />
      </g>
      <g className="ring-orbit" filter="url(#glow-sm)">
        <g transform="translate(300,300)">
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i} transform={`rotate(${i * 60}) translate(0,-158)`}>
              <circle r="14" fill="none" stroke={mc} strokeWidth="1.5" />
              <circle r="5" fill={mc} />
            </g>
          ))}
        </g>
      </g>

      {/* ⑥ 육각형 이중 프레임 r=118 / r=108 + 꼭짓점 dot */}
      <g filter="url(#glow-sm)">
        <g transform="translate(300,300)">
          <polygon points={polyPoints(6, 118)} fill="none" stroke={mc} strokeOpacity={0.6} strokeWidth="1.4" />
          <polygon points={polyPoints(6, 108)} fill="none" stroke={mc} strokeOpacity={0.45} strokeWidth="1" />
          {Array.from({ length: 6 }, (_, i) => {
            const a = ((i * 60) * Math.PI) / 180 - Math.PI / 2
            return (
              <circle
                key={i}
                cx={(Math.cos(a) * 118).toFixed(1)}
                cy={(Math.sin(a) * 118).toFixed(1)}
                r="4"
                fill={mc}
              />
            )
          })}
        </g>
      </g>

      {/* ⑦ 내부 교차 삼각형 (Star of David) r=95 */}
      <g className="ring-tri" filter="url(#glow-sm)">
        <g transform="translate(300,300)">
          <polygon points={polyPoints(3, 95, 0)} fill="none" stroke={mc} strokeOpacity={0.7} strokeWidth="1.8" />
          <polygon points={polyPoints(3, 95, 180)} fill="none" stroke={mc} strokeOpacity={0.7} strokeWidth="1.8" />
        </g>
      </g>

      {/* ⑧ 내부 보조 원 r=65 + 십자/X/마름모 */}
      <g transform="translate(300,300)" stroke={mc} strokeOpacity={0.5}>
        <circle r="65" fill="none" strokeWidth="1" strokeDasharray="4 5" />
        <line x1="0" y1="-60" x2="0" y2="60" strokeWidth="0.8" />
        <line x1="-60" y1="0" x2="60" y2="0" strokeWidth="0.8" />
        <line x1="-42" y1="-42" x2="42" y2="42" strokeWidth="0.6" strokeOpacity={0.3} />
        <line x1="42" y1="-42" x2="-42" y2="42" strokeWidth="0.6" strokeOpacity={0.3} />
        <polygon points={polyPoints(4, 50)} fill="none" strokeWidth="0.9" />
      </g>

      {/* ⑨ 코어 글로우 r=38 (phase가 오를수록 blur 강화) */}
      <g transform="translate(300,300)" filter="url(#glow-core)">
        <circle className="forge-core" r="38" fill="url(#core-grad)" />
      </g>

      {/* ⑩ 최중심 점 */}
      <g transform="translate(300,300)" filter="url(#glow-md)">
        <circle className="forge-center" r="9" fill="#ffffff" />
        <circle r="3" fill={mc} />
      </g>
    </svg>
  )
}

function AwakeningOverlay({ phase, jobTitleClass, jobName }) {
  const prevPhaseRef = useRef(phase)
  const [entered, setEntered] = useState(false)
  const [hammerActive, setHammerActive] = useState(false)
  const [flashActive, setFlashActive] = useState(false)
  const [particleKey, setParticleKey] = useState(0)

  // 등장 트랜지션 트리거
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // 망치 타격(phase 1~3) 시 흔들림 + 플래시 + 파티클 리마운트
  useEffect(() => {
    const prev = prevPhaseRef.current
    prevPhaseRef.current = phase
    if (phase !== prev && phase >= 1 && phase <= 3) {
      setHammerActive(true)
      setFlashActive(true)
      setParticleKey((k) => k + 1)
      const t1 = setTimeout(() => setHammerActive(false), 230)
      const t2 = setTimeout(() => setFlashActive(false), 130)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
    return undefined
  }, [phase])

  if (phase === null || phase === undefined) return null

  const isHidden = jobTitleClass ? jobTitleClass.includes('hidden') : false
  const safePhase = Math.min(Math.max(phase, 0), 5)

  // phase가 올라갈수록 무채색 → 직업 원색으로 단계적으로 채워짐
  const targetColor = getColorFromTitleClass(jobTitleClass)
  const ease = (t) => t * t * (3 - 2 * t) // smoothstep

  const colorByPhase = {
    0: {
      primary: NEUTRAL_START,
      glow: 'rgba(200,200,208,0.25)',
      bg: BG_START,
      opacity: 0.3,
    },
    1: {
      primary: blendHex(NEUTRAL_START, targetColor.primary, ease(0.2)),
      glow: targetColor.glow.replace(/[\d.]+\)$/, '0.35)'),
      bg: BG_START,
      opacity: 0.55,
    },
    2: {
      primary: blendHex(NEUTRAL_START, targetColor.primary, ease(0.5)),
      glow: targetColor.glow.replace(/[\d.]+\)$/, '0.58)'),
      bg: blendHex(BG_START, targetColor.bg, 0.3),
      opacity: 0.75,
    },
    3: {
      primary: blendHex(NEUTRAL_START, targetColor.primary, ease(0.8)),
      glow: targetColor.glow.replace(/[\d.]+\)$/, '0.78)'),
      bg: blendHex(BG_START, targetColor.bg, 0.65),
      opacity: 0.9,
    },
    4: {
      primary: blendHex(NEUTRAL_START, targetColor.primary, ease(0.95)),
      glow: targetColor.glow.replace(/[\d.]+\)$/, '0.9)'),
      bg: blendHex(BG_START, targetColor.bg, 0.88),
      opacity: 0.97,
    },
    5: {
      primary: targetColor.primary,
      glow: targetColor.glow,
      bg: targetColor.bg,
      opacity: 1.0,
    },
  }

  const currentColor = colorByPhase[safePhase] ?? colorByPhase[0]
  const mc = currentColor.primary
  const mcGlow = currentColor.glow
  const mcBg = currentColor.bg
  const mcOpacity = currentColor.opacity

  // 텍스트(HTML) 요소용 CSS 변수 — SVG는 직접 주입
  const cssVars = {
    '--mc': mc,
    '--mc-glow': mcGlow,
  }

  const showParticles = phase >= 1 && phase <= 3

  const wrapClass = [
    'forge-circle-wrap',
    `phase-${safePhase}`,
    entered ? 'is-entered' : '',
    hammerActive ? 'hammer-hit' : '',
    phase >= 4 && phase < 5 ? 'vibrating' : '',
    phase >= 5 ? 'phase-burst' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const flashClass =
    phase >= 5
      ? 'forge-flash forge-flash--burst'
      : flashActive
        ? 'forge-flash forge-flash--hit'
        : 'forge-flash'

  const bgPulseOpacity =
    phase >= 5 ? 0.55 : phase >= 4 ? 0.28 : phase >= 3 ? 0.2 : phase >= 2 ? 0.14 : phase >= 1 ? 0.08 : 0

  return (
    <div
      className={`forge-overlay ${isHidden ? 'forge-overlay--hidden' : ''}`}
      data-phase={phase}
      style={{
        ...cssVars,
        backgroundColor: mcBg,
        transition: 'background-color 1.0s ease',
      }}
    >
      <div
        className={`forge-bg-pulse ${phase === 4 ? 'forge-bg-pulse--breathe' : ''}`}
        style={{
          opacity: bgPulseOpacity,
          background: `radial-gradient(circle at center, ${mcGlow} 0%, transparent 60%)`,
          transition: 'opacity 0.4s ease',
        }}
      />

      <div className={flashClass} />

      <div className={wrapClass}>
        {phase >= 4 && phase < 5 && (
          <>
            <div className="forge-ripple forge-ripple--1" style={{ borderColor: mc }} />
            <div className="forge-ripple forge-ripple--2" style={{ borderColor: mc }} />
          </>
        )}

        <MagicCircleSVG mc={mc} phase={phase} opacity={mcOpacity} />

        {showParticles && <ParticlesBurst key={particleKey} mc={mc} />}
      </div>

      <div className="forge-status-text">
        {phase === 0 && <span style={{ display: 'block', minHeight: '72px' }} />}

        {phase >= 1 && phase <= 3 && (
          <span className="forge-charging-text">이능력 각성 중...</span>
        )}

        {phase === 4 && (
          <span className="forge-charging-text forge-charging-text--critical">
            임계점 돌파 중...
          </span>
        )}

        {phase === 5 && (
          <div className="forge-complete-block">
            <span
              className={`forge-class-name ${jobTitleClass || ''}`}
              style={{
                color: targetColor.primary,
                textShadow: `0 0 20px ${targetColor.primary}, 0 0 50px ${targetColor.glow}, 0 0 90px ${targetColor.glow}`,
              }}
            >
              {jobName}
            </span>
            <span className="forge-complete-label">각성 완료</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default AwakeningOverlay
