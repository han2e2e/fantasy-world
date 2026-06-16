import { useEffect, useRef, useState } from 'react'

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
function ParticlesBurst() {
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
          fill="var(--mc)"
          filter="url(#glow-sm)"
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

// ── 마법진 SVG ──
function MagicCircleSVG() {
  return (
    <svg
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      overflow="visible"
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
        <filter id="glow-lg" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="14" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="core-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="45%" stopColor="var(--mc)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--mc)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ① 최외곽 점선 링 + 눈금 16개 */}
      <g className="ring-dotted" style={{ color: 'var(--mc)' }}>
        <g transform="translate(300,300)">
          <circle
            r="270"
            fill="none"
            stroke="var(--mc)"
            strokeOpacity="0.35"
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
                stroke="var(--mc)"
                strokeOpacity="0.35"
                strokeWidth="1.5"
              />
            )
          })}
        </g>
      </g>

      {/* ② 룬 심볼 링 r=245 */}
      <g className="ring-rune" style={{ color: 'var(--mc)' }} filter="url(#glow-sm)">
        <g transform="translate(300,300)">
          <circle r="245" fill="none" stroke="var(--mc)" strokeOpacity="0.6" strokeWidth="1" />
          {Array.from({ length: 8 }, (_, i) => (
            <g
              key={i}
              transform={`rotate(${i * 45}) translate(0,-245)`}
              stroke="var(--mc)"
              strokeOpacity="0.7"
              strokeWidth="1.4"
              fill="none"
              color="var(--mc)"
            >
              <RuneSymbol index={i} />
            </g>
          ))}
        </g>
      </g>

      {/* ③ 12각형 외곽 r=235 */}
      <g className="ring-12gon">
        <g transform="translate(300,300)">
          <polygon
            points={polyPoints(12, 235)}
            fill="none"
            stroke="var(--mc)"
            strokeOpacity="0.3"
            strokeWidth="1.2"
          />
        </g>
      </g>

      {/* ④ 14각 별형 외각 r=195 (phase별 가속) */}
      <g className="ring-star">
        <g transform="translate(300,300)">
          <polygon
            points={starPoints(14, 195, 140)}
            fill="none"
            stroke="var(--mc)"
            strokeOpacity="0.45"
            strokeWidth="1.3"
          />
        </g>
      </g>

      {/* ⑤ 위성 6개 공전 r=158 + 고정 Star of David */}
      <g transform="translate(300,300)">
        <polygon
          points={polyPoints(3, 158, 0)}
          fill="none"
          stroke="var(--mc)"
          strokeOpacity="0.25"
          strokeWidth="1"
        />
        <polygon
          points={polyPoints(3, 158, 180)}
          fill="none"
          stroke="var(--mc)"
          strokeOpacity="0.25"
          strokeWidth="1"
        />
      </g>
      <g className="ring-orbit" filter="url(#glow-sm)">
        <g transform="translate(300,300)">
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i} transform={`rotate(${i * 60}) translate(0,-158)`}>
              <circle r="14" fill="none" stroke="var(--mc)" strokeWidth="1.5" />
              <circle r="5" fill="var(--mc)" />
            </g>
          ))}
        </g>
      </g>

      {/* ⑥ 육각형 이중 프레임 r=118 / r=108 + 꼭짓점 dot */}
      <g filter="url(#glow-sm)">
        <g transform="translate(300,300)">
          <polygon points={polyPoints(6, 118)} fill="none" stroke="var(--mc)" strokeOpacity="0.55" strokeWidth="1.4" />
          <polygon points={polyPoints(6, 108)} fill="none" stroke="var(--mc)" strokeOpacity="0.4" strokeWidth="1" />
          {Array.from({ length: 6 }, (_, i) => {
            const a = ((i * 60) * Math.PI) / 180 - Math.PI / 2
            return (
              <circle
                key={i}
                cx={(Math.cos(a) * 118).toFixed(1)}
                cy={(Math.sin(a) * 118).toFixed(1)}
                r="4"
                fill="var(--mc)"
              />
            )
          })}
        </g>
      </g>

      {/* ⑦ 내부 교차 삼각형 (Star of David) r=95 */}
      <g className="ring-tri" filter="url(#glow-sm)">
        <g transform="translate(300,300)">
          <polygon points={polyPoints(3, 95, 0)} fill="none" stroke="var(--mc)" strokeOpacity="0.65" strokeWidth="1.4" />
          <polygon points={polyPoints(3, 95, 180)} fill="none" stroke="var(--mc)" strokeOpacity="0.65" strokeWidth="1.4" />
        </g>
      </g>

      {/* ⑧ 내부 보조 원 r=65 + 십자/X/마름모 */}
      <g transform="translate(300,300)" stroke="var(--mc)" strokeOpacity="0.5">
        <circle r="65" fill="none" strokeWidth="1" strokeDasharray="4 5" />
        <line x1="0" y1="-60" x2="0" y2="60" strokeWidth="0.8" />
        <line x1="-60" y1="0" x2="60" y2="0" strokeWidth="0.8" />
        <line x1="-42" y1="-42" x2="42" y2="42" strokeWidth="0.6" strokeOpacity="0.3" />
        <line x1="42" y1="-42" x2="-42" y2="42" strokeWidth="0.6" strokeOpacity="0.3" />
        <polygon points={polyPoints(4, 50)} fill="none" strokeWidth="0.9" />
      </g>

      {/* ⑨ 코어 글로우 r=38 */}
      <g transform="translate(300,300)" filter="url(#glow-lg)">
        <circle className="forge-core" r="38" fill="url(#core-grad)" />
      </g>

      {/* ⑩ 최중심 점 */}
      <g transform="translate(300,300)" filter="url(#glow-md)">
        <circle className="forge-center" r="9" fill="#ffffff" />
        <circle r="3" fill="var(--mc)" />
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

  const cssVars = isHidden
    ? { '--mc': '#bf5af2', '--mc-glow': 'rgba(191,90,242,0.9)', '--mc-bg': '#08020f' }
    : { '--mc': '#4dd9ff', '--mc-glow': 'rgba(77,217,255,0.85)', '--mc-bg': '#020c18' }

  const safePhase = Math.min(Math.max(phase, 0), 5)
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
    phase >= 5 ? 0 : phase >= 4 ? 0.28 : phase >= 3 ? 0.2 : phase >= 2 ? 0.14 : phase >= 1 ? 0.08 : 0

  return (
    <div
      className={`forge-overlay ${isHidden ? 'forge-overlay--hidden' : ''}`}
      data-phase={phase}
      style={cssVars}
    >
      <div
        className={`forge-bg-pulse ${phase === 4 ? 'forge-bg-pulse--breathe' : ''}`}
        style={{ opacity: bgPulseOpacity, transition: 'opacity 0.4s ease' }}
      />

      <div className={flashClass} />

      <div className={wrapClass}>
        {phase >= 4 && phase < 5 && (
          <>
            <div className="forge-ripple forge-ripple--1" />
            <div className="forge-ripple forge-ripple--2" />
          </>
        )}

        <MagicCircleSVG />

        {showParticles && <ParticlesBurst key={particleKey} />}
      </div>

      <div className="forge-status-text">
        {phase < 5 ? (
          <span className="forge-charging-text">이능력 각성 중...</span>
        ) : (
          <div className="forge-complete-block">
            <span className={`forge-class-name ${jobTitleClass || ''}`}>{jobName}</span>
            <span className="forge-complete-label">각성 완료</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default AwakeningOverlay
