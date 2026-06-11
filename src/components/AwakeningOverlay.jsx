import imgMainBg from '../assets/images/main_illustration.svg'

function AwakeningOverlay({ eyeOpen }) {
  return (
    <section className={`fantasy-goddess-awakening ${eyeOpen ? 'goddess-eye-open' : ''}`}>
      <div className="goddess-flash-effect" />

      <div className="goddess-loading__core">
        <div className="goddess-eye-orb">
          <img src={imgMainBg} alt="여신의 눈" className="goddess-eye-image" />
        </div>

        <div className="goddess-loading__text-zone">
          <p className="fantasy-loading__text-main">
            여신의 눈이 당신의 이능력을 각인합니다...
          </p>
          <p className="fantasy-loading__text-sub">
            이 세계의 규칙이 당신의 존재를 정의하기 시작합니다.
          </p>
        </div>

        <div className="goddess-progress-bar">
          <div className="goddess-progress-bar__fill" />
        </div>
      </div>
    </section>
  )
}

export default AwakeningOverlay
