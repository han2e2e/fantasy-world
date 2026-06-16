function MainScreen({ onGoToWorldview, onGoToGuide }) {
  return (
    <section className="fantasy-main-start-zone">
      <div className="fantasy-main__scrim" aria-hidden="true" />

      <div className="fantasy-main__actions">
        <button
          type="button"
          className="fantasy-main__start-btn"
          onClick={onGoToWorldview}
        >
          능력 개방하기
        </button>
        <button
          type="button"
          className="fantasy-main__rules-link"
          onClick={onGoToGuide}
        >
          점수 규칙 보기
        </button>
      </div>
    </section>
  )
}

export default MainScreen
