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

function JobListPanel() {
  return (
    <div className="fantasy-guide__jobs">
      {JOB_LIST.map((job) => (
        <article key={job.key} className="fantasy-guide__job-card">
          <div className="fantasy-guide__job-head">
            <img
              src={job.image}
              alt={job.title}
              className="fantasy-guide__job-thumb"
            />
            <div>
              <p className="fantasy-guide__job-group">{job.group}</p>
              <h4 className="fantasy-guide__job-title">{job.title}</h4>
              <p className="fantasy-guide__job-combo">{job.combo}</p>
            </div>
          </div>
          <p className="fantasy-guide__job-desc">{job.desc}</p>
        </article>
      ))}
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
    goToScreen(SCREENS.JOB_LIST)
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
        className={`fantasy-screen ${screen === SCREENS.RESULT || screen === SCREENS.JOB_LIST ? 'fantasy-screen--wide' : ''} ${isTransitioning ? 'fantasy-screen--fade-out' : 'fantasy-screen--fade-in'}`}
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
              onClick={() => goToScreen(SCREENS.GUIDE)}
            >
              [ 점수 배치 안내 ]
            </button>
          </section>
        )}

        {screen === SCREENS.GUIDE && (
          <section className="fantasy-guide">
            <h2 className="fantasy-guide__title">점수 배치 안내</h2>

            <div className="fantasy-guide__section">
              <h3 className="fantasy-guide__subtitle">이세계 규칙</h3>
              <ul className="fantasy-guide__list">
                {SCORING_GUIDE.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </div>

            <p className="fantasy-guide__locked">
              20가지 직업 목록은 문답을 모두 마친 뒤 각성 결과 화면에서 확인할 수 있습니다.
            </p>

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
          <section className="fantasy-guide">
            <h2 className="fantasy-guide__title">20가지 직업 목록</h2>
            <p className="fantasy-guide__unlock-note">
              각성을 완료한 자만 열람할 수 있는 비밀 직업 도감입니다.
            </p>

            <div className="fantasy-guide__section">
              <JobListPanel />
            </div>

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
