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
          <p className="sub-line">태어나자마자 모든 게 결정되는</p>
          <div className="divider-top">
            <div className="divider-line" />
            <div className="divider-diamond" />
            <div className="divider-line" />
          </div>
          <div className="main-title-wrap">
            <div className="main-title">이능력 세계</div>
          </div>
          <div className="divider-bottom">
            <div className="divider-line" />
            <div className="divider-diamond" />
            <div className="divider-line" />
          </div>
          <p className="ability-tag">ability &nbsp;·&nbsp; world &nbsp;·&nbsp; RPG</p>
          <p className="eng-sub">where destiny is written at birth</p>
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
