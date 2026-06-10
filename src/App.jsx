import { useState, useEffect, useRef } from 'react'
import { supabase, isSupabaseConfigured } from './supabaseClient'
import { FALLBACK_QUIZZES } from './fallbackQuizzes'
import {
  INITIAL_SCORES,
  JOB_LIST,
  SCORING_GUIDE,
  applyAnswerScore,
  determineJob,
  getAbilityResult,
  getQuizOption,
  getQuizType,
} from './abilityResults'
import './App.css'

const SCREENS = {
  MAIN: 'main',
  GUIDE: 'guide',
  WORLDVIEW: 'worldview',
  QUIZ: 'quiz',
  RESULT: 'result',
  JOB_LIST: 'job_list',
}

const GUIDE_LOCKED_MESSAGE =
  '20가지 직업 목록은 문답을 모두 마친 뒤 각성 결과 화면에서 확인할 수 있습니다.'

function SlideNavigator({ current, total, onPrev, onNext }) {
  return (
    <div className="fantasy-slide-nav">
      <button
        type="button"
        className="fantasy-slide-nav__btn"
        onClick={onPrev}
        disabled={current === 0}
        aria-label="이전 슬라이드"
      >
        ‹
      </button>
      <span className="fantasy-slide-nav__counter">
        {current + 1} / {total}
      </span>
      <button
        type="button"
        className="fantasy-slide-nav__btn"
        onClick={onNext}
        disabled={current >= total - 1}
        aria-label="다음 슬라이드"
      >
        ›
      </button>
    </div>
  )
}

function GuideSlidePanel({ slideIndex, onPrev, onNext }) {
  const totalSlides = SCORING_GUIDE.length + 1
  const isLockedSlide = slideIndex === SCORING_GUIDE.length

  return (
    <div className="fantasy-slide-panel">
      <div className="fantasy-slide-panel__frame">
        {!isLockedSlide ? (
          <article className="fantasy-rule-slide">
            <span className="fantasy-rule-slide__badge">이세계 규칙</span>
            <span className="fantasy-rule-slide__number">{slideIndex + 1}</span>
            <p className="fantasy-rule-slide__text">
              {SCORING_GUIDE[slideIndex]}
            </p>
          </article>
        ) : (
          <article className="fantasy-rule-slide fantasy-rule-slide--locked">
            <span className="fantasy-rule-slide__badge">안내</span>
            <span className="fantasy-rule-slide__icon" aria-hidden="true">
              🔒
            </span>
            <p className="fantasy-rule-slide__text">{GUIDE_LOCKED_MESSAGE}</p>
          </article>
        )}
      </div>
      <SlideNavigator
        current={slideIndex}
        total={totalSlides}
        onPrev={onPrev}
        onNext={onNext}
      />
    </div>
  )
}

function JobCodexSlidePanel({ slideIndex, onPrev, onNext }) {
  const job = JOB_LIST[slideIndex]

  return (
    <div className="fantasy-slide-panel">
      <div className="fantasy-slide-panel__frame">
        <article className="fantasy-codex-slide">
          <div className="fantasy-codex-slide__content">
            <p className="fantasy-codex-slide__group">{job.group}</p>
            <h3 className="fantasy-codex-slide__title">{job.title}</h3>
            <p className="fantasy-codex-slide__combo">{job.combo}</p>
            <p className="fantasy-codex-slide__desc">{job.desc}</p>
          </div>
          <div className="fantasy-codex-slide__image">
            <img src={job.image} alt={job.title} />
          </div>
        </article>
      </div>
      <SlideNavigator
        current={slideIndex}
        total={JOB_LIST.length}
        onPrev={onPrev}
        onNext={onNext}
      />
    </div>
  )
}

function App() {
  const [screen, setScreen] = useState(SCREENS.MAIN)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [quizList, setQuizList] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState(null)
  const [scores, setScores] = useState(INITIAL_SCORES)
  const [finalResult, setFinalResult] = useState(null)
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false)
  const [guideSlideIdx, setGuideSlideIdx] = useState(0)
  const [jobSlideIdx, setJobSlideIdx] = useState(0)
  const scoresRef = useRef(INITIAL_SCORES)

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true)

      if (!isSupabaseConfigured || !supabase) {
        setQuizList(FALLBACK_QUIZZES)
        setDbError(null)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('quizzes')
          .select('*')
          .order('question_number', { ascending: true })

        if (error) {
          setDbError(error.message)
          setQuizList(FALLBACK_QUIZZES)
          console.error('DB 에러:', error.message)
        } else if (!data || data.length === 0) {
          setDbError(null)
          setQuizList(FALLBACK_QUIZZES)
        } else {
          setDbError(null)
          setQuizList(data)
        }
      } catch (err) {
        console.error('연동 에러:', err)
        setQuizList(FALLBACK_QUIZZES)
      } finally {
        setLoading(false)
      }
    }
    fetchQuizzes()
  }, [])

  const goToScreen = (nextScreen) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setScreen(nextScreen)
      setIsTransitioning(false)
    }, 500)
  }

  const handleStartQuiz = () => {
    if (dbError) {
      alert(
        dbError === 'Invalid API key'
          ? 'Supabase API 키가 올바르지 않습니다.\n\nSupabase 대시보드 → Project Settings → API → anon public 키를 .env의 VITE_SUPABASE_ANON_KEY에 넣고 dev 서버를 재시작해 주세요.'
          : `DB 연결 오류: ${dbError}`
      )
      return
    }
    if (quizList.length === 0) {
      alert('아직 등록된 문답이 없습니다. Supabase quizzes 테이블에 데이터를 추가해 주세요.')
      return
    }
    scoresRef.current = INITIAL_SCORES
    setScores(INITIAL_SCORES)
    setCurrentIdx(0)
    setFinalResult(null)
    setHasCompletedQuiz(false)
    goToScreen(SCREENS.QUIZ)
  }

  const handleAnswer = (optionNumber) => {
    const currentQuiz = quizList[currentIdx]
    const nextScores = applyAnswerScore(
      currentQuiz,
      optionNumber,
      scoresRef.current
    )

    if (!getQuizType(currentQuiz, optionNumber)) {
      console.warn(
        `질문 ${currentQuiz.question_number}의 선택지 ${optionNumber}에 성향(type) 값이 없습니다. Supabase type${optionNumber} 컬럼을 확인하세요.`
      )
    }

    scoresRef.current = nextScores
    setScores(nextScores)

    if (currentIdx + 1 < quizList.length) {
      setCurrentIdx((idx) => idx + 1)
    } else {
      const jobKey = determineJob(nextScores)
      setFinalResult(getAbilityResult(jobKey))
      setHasCompletedQuiz(true)
      goToScreen(SCREENS.RESULT)
    }
  }

  const handleViewJobList = () => {
    if (!hasCompletedQuiz) return
    setJobSlideIdx(0)
    goToScreen(SCREENS.JOB_LIST)
  }

  const openGuide = () => {
    setGuideSlideIdx(0)
    goToScreen(SCREENS.GUIDE)
  }

  const handleRestart = () => {
    scoresRef.current = INITIAL_SCORES
    setScores(INITIAL_SCORES)
    setCurrentIdx(0)
    setFinalResult(null)
    setHasCompletedQuiz(false)
    goToScreen(SCREENS.MAIN)
  }

  return (
    <div className="fantasy-app">
      <div className="fantasy-bg" aria-hidden="true">
        <div className="fantasy-bg__glow fantasy-bg__glow--top" />
        <div className="fantasy-bg__glow fantasy-bg__glow--bottom" />
        <div className="fantasy-bg__stars" />
      </div>

      <main
        className={`fantasy-screen ${screen === SCREENS.RESULT || screen === SCREENS.JOB_LIST || screen === SCREENS.GUIDE ? 'fantasy-screen--wide' : ''} ${isTransitioning ? 'fantasy-screen--fade-out' : 'fantasy-screen--fade-in'}`}
      >
        {screen === SCREENS.MAIN && (
          <section className="fantasy-content">
            <h1 className="fantasy-logo">
              태어나자마자 모든 게 결정되는
              <br />
              <span className="fantasy-logo__accent">이능력 세계</span>
            </h1>
            <button
              type="button"
              className="fantasy-btn fantasy-btn--glow"
              onClick={() => goToScreen(SCREENS.WORLDVIEW)}
            >
              [ 능력 개방하기 ]
            </button>
            <button
              type="button"
              className="fantasy-btn fantasy-btn--sub"
              onClick={openGuide}
            >
              [ 점수 배치 안내 ]
            </button>
          </section>
        )}

        {screen === SCREENS.GUIDE && (
          <section className="fantasy-guide fantasy-guide--slide">
            <h2 className="fantasy-guide__title">점수 배치 안내</h2>
            <p className="fantasy-guide__slide-hint">‹ › 버튼으로 한 장씩 넘겨보세요</p>

            <GuideSlidePanel
              slideIndex={guideSlideIdx}
              onPrev={() => setGuideSlideIdx((idx) => Math.max(0, idx - 1))}
              onNext={() =>
                setGuideSlideIdx((idx) =>
                  Math.min(SCORING_GUIDE.length, idx + 1)
                )
              }
            />

            <button
              type="button"
              className="fantasy-btn fantasy-btn--glow"
              onClick={() => goToScreen(SCREENS.MAIN)}
            >
              메인으로 돌아가기
            </button>
          </section>
        )}

        {screen === SCREENS.JOB_LIST && hasCompletedQuiz && (
          <section className="fantasy-guide fantasy-guide--slide">
            <h2 className="fantasy-guide__title">20가지 직업 도감</h2>
            <p className="fantasy-guide__unlock-note">
              각성을 완료한 자만 열람할 수 있는 비밀 직업 도감입니다.
            </p>
            <p className="fantasy-guide__slide-hint">‹ › 버튼으로 직업을 넘겨보세요</p>

            <JobCodexSlidePanel
              slideIndex={jobSlideIdx}
              onPrev={() => setJobSlideIdx((idx) => Math.max(0, idx - 1))}
              onNext={() =>
                setJobSlideIdx((idx) => Math.min(JOB_LIST.length - 1, idx + 1))
              }
            />

            <button
              type="button"
              className="fantasy-btn fantasy-btn--glow"
              onClick={() => goToScreen(SCREENS.RESULT)}
            >
              결과 화면으로 돌아가기
            </button>
          </section>
        )}

        {screen === SCREENS.WORLDVIEW && (
          <section className="fantasy-content">
            <p className="fantasy-desc">
              눈을 뜨자 알수없는 세계로 눈을떴다.
              <br />
              이세계에서는 각자마다의 능력이 있다고 한다.
              <br /><br />
              이세계에 소환된 당신은 엄청난 능력을 손에 넣을 수 있게 되었다
              <br />
              <span className="fantasy-desc__highlight">여신의 조각상 앞에 서게 됐다.</span>
              <br /><br />
              여신과의 대화로 당신은 능력을 개화할수있다.
              <br />
              자신을 시험해보자...
            </p>
            <button
              type="button"
              className="fantasy-btn fantasy-btn--glow"
              disabled={loading}
              onClick={handleStartQuiz}
            >
              {loading ? '여신의 부름을 기다리는 중...' : '[ 문답 시작하기 ]'}
            </button>
            {dbError && (
              <p className="fantasy-error">
                {dbError === 'Invalid API key'
                  ? 'Supabase API 키가 올바르지 않습니다. 대시보드에서 anon public 키를 확인해 주세요.'
                  : `DB 연결 오류: ${dbError}`}
              </p>
            )}
          </section>
        )}

        {screen === SCREENS.QUIZ && quizList.length > 0 && (
          <section className="fantasy-quiz">
            <span className="fantasy-quiz__label">
              질문 {quizList[currentIdx].question_number} / {quizList.length}
            </span>
            <h2 className="fantasy-quiz__question">
              {quizList[currentIdx].question}
            </h2>
            <div className="fantasy-quiz__options">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  className="fantasy-btn fantasy-btn--glow fantasy-btn--option"
                  onClick={() => handleAnswer(num)}
                >
                  {num}. {getQuizOption(quizList[currentIdx], num)}
                </button>
              ))}
            </div>
          </section>
        )}

        {screen === SCREENS.RESULT && finalResult && (
          <section className="fantasy-result-layout">
            <div className="fantasy-result__left-content">
              <span className="fantasy-result__badge">각성 완료</span>
              <h2 className="fantasy-result__title">{finalResult.title}</h2>
              <p className="fantasy-result__desc">{finalResult.desc}</p>
              <div className="fantasy-result__actions">
                <button
                  type="button"
                  className="fantasy-btn fantasy-btn--glow fantasy-btn--restart"
                  onClick={handleRestart}
                >
                  다시 각성하기
                </button>
                <button
                  type="button"
                  className="fantasy-btn fantasy-btn--sub"
                  onClick={handleViewJobList}
                >
                  [ 20가지 직업 목록 보기 ]
                </button>
              </div>
            </div>

            <div className="fantasy-result__right-image">
              <img
                src={finalResult.image}
                alt={finalResult.title}
                className="fantasy-result__illustration"
              />
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
