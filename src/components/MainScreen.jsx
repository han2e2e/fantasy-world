import imgMainBg from '../assets/images/main_illustration.svg'

function MainScreen({ onGoToWorldview, onGoToGuide }) {
  return (
    <section className="fantasy-main-start-zone">
      <div className="fantasy-main__bg-layer">
        <img
          src={imgMainBg}
          alt="이세계 마법진 오프닝"
          className="fantasy-main__center-magic-circle"
        />
      </div>

      <div className="fantasy-main__front-content">
        <div className="title-wrap">
          <p className="sub-line">성향으로 알아보는 이세계</p>
          <div className="divider-top">
            <div className="divider-line" />
            <div className="divider-diamond" />
            <div className="divider-line" />
          </div>
          <div className="main-title-wrap">
            <div className="main-title">이능력 찾기</div>
          </div>
          <div className="divider-bottom">
            <div className="divider-line" />
            <div className="divider-diamond" />
            <div className="divider-line" />
          </div>
          <p className="ability-tag">personality &nbsp;·&nbsp; ability &nbsp;·&nbsp; RPG</p>
          <p className="eng-sub">find the ability that&apos;s written in your soul</p>
        </div>

        <div className="fantasy-main__btn-group">
          <button
            type="button"
            className="fantasy-btn fantasy-btn--glow"
            onClick={onGoToWorldview}
          >
            능력 개방하기
          </button>
          <button
            type="button"
            className="fantasy-btn fantasy-btn--sub"
            onClick={onGoToGuide}
          >
            점수 규칙 보기
          </button>
        </div>
      </div>
    </section>
  )
}

export default MainScreen
