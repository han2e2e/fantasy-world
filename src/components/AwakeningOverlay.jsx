// 직업 계열별 마법진 색상 매핑
function getForgeColor(titleClass) {
  if (!titleClass)
    return { primary: '#f5c842', glow: 'rgba(245,200,66,0.7)', shadow: 'rgba(245,200,66,0.4)' }
  if (titleClass.includes('combat'))
    return { primary: '#60b8ff', glow: 'rgba(96,184,255,0.8)', shadow: 'rgba(96,184,255,0.4)' }
  if (titleClass.includes('strategy'))
    return { primary: '#a29bfe', glow: 'rgba(162,155,254,0.8)', shadow: 'rgba(162,155,254,0.4)' }
  if (titleClass.includes('survival'))
    return { primary: '#e056a0', glow: 'rgba(224,86,160,0.8)', shadow: 'rgba(224,86,160,0.4)' }
  if (titleClass.includes('modern'))
    return { primary: '#00cec9', glow: 'rgba(0,206,201,0.8)', shadow: 'rgba(0,206,201,0.4)' }
  if (titleClass.includes('hidden'))
    return { primary: '#ff0057', glow: 'rgba(255,0,87,0.9)', shadow: 'rgba(191,90,242,0.6)' }
  return { primary: '#f5c842', glow: 'rgba(245,200,66,0.7)', shadow: 'rgba(245,200,66,0.4)' }
}

// 마법진 SVG — stroke-dasharray 애니메이션으로 호가 그려짐
function MagicCircleSVG({ phase, color }) {
  const C = 200
  const r1 = 155
  const r2 = 110
  const r3 = 68
  const c1 = 2 * Math.PI * r1
  const c2 = 2 * Math.PI * r2
  const c3 = 2 * Math.PI * r3

  const arcStyle1 = {
    strokeDasharray: c1,
    strokeDashoffset: phase >= 1 ? 0 : c1,
    transition: phase >= 1 ? 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)' : 'none',
    stroke: color.primary,
    strokeWidth: 1.5,
    fill: 'none',
    opacity: phase >= 1 ? 1 : 0,
  }
  const arcStyle2 = {
    strokeDasharray: c2,
    strokeDashoffset: phase >= 2 ? 0 : c2,
    transition: phase >= 2 ? 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)' : 'none',
    stroke: color.primary,
    strokeWidth: 1.2,
    fill: 'none',
    opacity: phase >= 2 ? 1 : 0,
  }
  const arcStyle3 = {
    strokeDasharray: c3,
    strokeDashoffset: phase >= 3 ? 0 : c3,
    transition: phase >= 3 ? 'stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)' : 'none',
    stroke: color.primary,
    strokeWidth: 1.0,
    fill: 'none',
    opacity: phase >= 3 ? 1 : 0,
  }

  const runeLines = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180
    return {
      x1: C + Math.cos(angle) * 30,
      y1: C + Math.sin(angle) * 30,
      x2: C + Math.cos(angle) * 62,
      y2: C + Math.sin(angle) * 62,
    }
  })

  const dotPositions = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * 22.5 * Math.PI) / 180
    return {
      cx: C + Math.cos(angle) * 155,
      cy: C + Math.sin(angle) * 155,
    }
  })

  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      className="forge-circle-svg"
      style={{ '--forge-glow': color.glow, '--forge-shadow': color.shadow }}
    >
      <defs>
        <filter id="forge-glow-filter" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="forge-glow-strong" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {dotPositions.map((pos, i) => (
        <circle
          key={i}
          cx={pos.cx}
          cy={pos.cy}
          r={2}
          fill={color.primary}
          opacity={phase >= 1 ? 0.5 : 0}
          style={{ transition: `opacity 0.4s ease ${i * 0.02}s` }}
          filter="url(#forge-glow-filter)"
        />
      ))}

      {/* 외곽 원 (Phase 1) */}
      <circle cx={C} cy={C} r={r1} style={arcStyle1} filter="url(#forge-glow-filter)" />

      {/* 중간 원 (Phase 2) — 반대 방향 회전 */}
      <g
        style={{
          transformOrigin: `${C}px ${C}px`,
          animation: phase >= 2 ? 'forge-ring-spin-ccw 12s linear infinite' : 'none',
        }}
      >
        <circle cx={C} cy={C} r={r2} style={arcStyle2} filter="url(#forge-glow-filter)" />
        {phase >= 2 &&
          Array.from({ length: 12 }, (_, i) => {
            const a = (i * 30 * Math.PI) / 180
            return (
              <circle
                key={i}
                cx={C + Math.cos(a) * r2}
                cy={C + Math.sin(a) * r2}
                r={3}
                fill={color.primary}
                opacity={0.4}
              />
            )
          })}
      </g>

      {/* 내부 원 (Phase 3) */}
      <circle cx={C} cy={C} r={r3} style={arcStyle3} filter="url(#forge-glow-filter)" />

      {/* 룬 방사선 (Phase 3) */}
      {runeLines.map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={color.primary}
          strokeWidth={1}
          opacity={phase >= 3 ? 0.7 : 0}
          style={{ transition: `opacity 0.3s ease ${i * 0.05}s` }}
          filter="url(#forge-glow-filter)"
        />
      ))}

      {/* 중심 코어 (Phase 3) */}
      <circle
        cx={C}
        cy={C}
        r={8}
        fill={color.primary}
        opacity={phase >= 3 ? 0.9 : 0}
        style={{ transition: 'opacity 0.4s ease' }}
        filter="url(#forge-glow-strong)"
      />

      {/* 외곽-내부 연결선 4개 (Phase 2) */}
      {[0, 90, 180, 270].map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        return (
          <line
            key={i}
            x1={C + Math.cos(rad) * (r3 + 4)}
            y1={C + Math.sin(rad) * (r3 + 4)}
            x2={C + Math.cos(rad) * (r2 - 4)}
            y2={C + Math.sin(rad) * (r2 - 4)}
            stroke={color.primary}
            strokeWidth={0.8}
            opacity={phase >= 2 ? 0.45 : 0}
            style={{ transition: 'opacity 0.4s ease' }}
          />
        )
      })}
    </svg>
  )
}

function AwakeningOverlay({ phase, jobName, jobTitleClass }) {
  // phase가 없으면(null/undefined) 아무것도 렌더링하지 않음
  if (phase === null || phase === undefined) return null

  const color = getForgeColor(jobTitleClass)
  const isHidden = jobTitleClass ? jobTitleClass.includes('hidden') : false

  return (
    <div
      className={`forge-overlay ${phase >= 5 ? 'forge-overlay--flash' : ''} ${
        isHidden ? 'forge-overlay--hidden' : ''
      }`}
      data-phase={phase}
      style={{
        '--forge-primary': color.primary,
        '--forge-glow': color.glow,
        '--forge-shadow': color.shadow,
      }}
    >
      <div className={`forge-bg-pulse ${phase >= 3 ? 'forge-bg-pulse--active' : ''}`} />

      {phase >= 1 && phase <= 4 && (
        <div className="forge-particles" data-phase={phase} aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="forge-particle" style={{ '--i': i }} />
          ))}
        </div>
      )}

      <div
        className="forge-circle-wrap"
        style={{
          filter:
            phase >= 5
              ? `drop-shadow(0 0 40px ${color.glow}) drop-shadow(0 0 80px ${color.shadow})`
              : phase >= 3
                ? `drop-shadow(0 0 20px ${color.glow})`
                : 'none',
          transition: 'filter 0.6s ease',
          animation:
            phase >= 3 && phase < 5
              ? 'forge-circle-breathe 2s ease-in-out infinite alternate'
              : 'none',
        }}
      >
        <MagicCircleSVG phase={phase} color={color} />
      </div>

      <div className={`forge-class-reveal ${phase >= 4 ? 'forge-class-reveal--visible' : ''}`}>
        <p className="forge-class-label">이능력 각성</p>
        <p
          className={`forge-class-name ${jobTitleClass ?? ''}`}
          style={{ '--forge-primary': color.primary }}
        >
          {jobName}
        </p>
      </div>

      <div className={`forge-flash ${phase >= 5 ? 'forge-flash--active' : ''}`} />

      <div className="forge-status-text">
        {phase === 0 && <span>이능력을 불러오는 중...</span>}
        {phase >= 1 && phase <= 3 && <span>연성 중 {phase}/3</span>}
        {phase === 4 && <span>각성 완료</span>}
        {phase >= 5 && <span>이능력이 부여되었습니다</span>}
      </div>
    </div>
  )
}

export default AwakeningOverlay
