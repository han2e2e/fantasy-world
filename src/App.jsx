import { useState, useEffect, useRef } from 'react'
import { supabase, isSupabaseConfigured } from './supabaseClient'
import { FALLBACK_QUIZZES } from './fallbackQuizzes'
import {
  INITIAL_SCORES,
  JOB_LIST,
  applyAnswerScore,
  determineJob,
  getAbilityResult,
  getJobTitleClass,
  getQuizType,
  normalizeQuizList,
  translateCategory,
} from './abilityResults'
import JobTitleDisplay from './components/JobTitleDisplay'
import MainScreen from './components/MainScreen'
import QuizScreen from './components/QuizScreen'
import ResultScreen from './components/ResultScreen'
import AwakeningOverlay from './components/AwakeningOverlay'
import { useGameSound } from './hooks/useGameSound'
import './App.css'

const SCREENS = {
  MAIN: 'main',
  GUIDE: 'guide',
  GODDESS_INTERVIEW: 'goddess_interview',
  QUIZ: 'quiz',
  RESULT: 'result',
  JOB_LIST: 'job_list',
}

function GoddessInterviewPanel({
  interviewStep,
  setInterviewStep,
  onConfirm,
  loading,
  dbError,
}) {
  return (
    <section
      className={`fantasy-goddess-interview ${interviewStep === 'step2' ? 'fantasy-goddess-interview--step2' : ''}`}
    >
      {interviewStep === 'step1' && (
        <div className="goddess-interview__step1-root">
          <div className="goddess-interview__record-badge">
            소 환 기 록
          </div>

          <div className="goddess-interview__opening-lines">
            <p className="goddess-interview__line goddess-interview__line--dim90">
              눈을 떴다.
            </p>
            <p className="goddess-interview__line goddess-interview__line--dim95">
              익숙한 천장도, 알던 냄새도 없었다.
            </p>
            <p className="goddess-interview__line goddess-interview__line--dim90">
              여기는... 내가 알던 세계가 아니었다.
            </p>
          </div>

          <div className="goddess-interview__lore-block">
            <p>이세계에서는 단 하나의 이능력이</p>
            <p>그 사람의</p>
            <p className="goddess-interview__gold-line">
              신분도, 계급도, 살아갈 자격마저도
            </p>
            <p>결정한다고 했다.</p>
          </div>

          <div className="goddess-interview__divider-bar" aria-hidden="true" />

          <div className="goddess-interview__statue-block">
            <p>그리고 나는 지금,</p>
            <p className="goddess-interview__gold-title">
              그 모든 것을 결정하는 여신의 조각상
            </p>
            <p>앞에 서 있다.</p>
          </div>

          <button
            type="button"
            className="goddess-interview__touch-btn goddess-interview__touch-btn--step1"
            onClick={() => setInterviewStep('step2')}
          >
            여신의 조각상에 손을 갖다 댄다
          </button>
        </div>
      )}

      {interviewStep === 'step2' && (
        <div className="goddess-interview__step goddess-interview__step--step2">
          <p className="goddess-interview__goddess-intro">
            여신이 나에게 말을 걸었다.
          </p>

          <div className="goddess-interview__dialogue">
            <span className="goddess-interview__label">— 여신 —</span>
            <p className="goddess-interview__voice">
              &ldquo;당신은 어떤 존재입니까?&rdquo;
            </p>
          </div>

          <button
            type="button"
            className="fantasy-btn fantasy-btn--glow goddess-interview__submit goddess-interview__submit--step2"
            disabled={loading}
            onClick={onConfirm}
          >
            문답 시작하기
          </button>

          {dbError && (
            <p className="fantasy-error">
              {dbError === 'Invalid API key'
                ? 'Supabase API 키가 올바르지 않습니다. 대시보드에서 anon public 키를 확인해 주세요.'
                : `DB 연결 오류: ${dbError}`}
            </p>
          )}
        </div>
      )}
    </section>
  )
}

function RulesGuidePanel({ onBack }) {
  return (
    <section className="fantasy-guide fantasy-guide--rules">

      <div className="rules-header">
        <div className="worldview-divider">
          <div className="worldview-divider__line" />
          <span className="worldview-divider__text">이능력 판정 원리</span>
          <div className="worldview-divider__line" />
        </div>
      </div>

      <div className="rules-list">

        <div className="rules-item">
          <span className="rules-item__number">01</span>
          <p className="rules-item__text">
            10개 문항의 선택지마다
            <em className="rules-em">
              {' '}
              {translateCategory('Combat / Strategy / Survival / Modern')}
              {' '}
            </em>
            중 하나의 성향 점수가 누적됩니다.
          </p>
        </div>

        <div className="rules-item">
          <span className="rules-item__number">02</span>
          <p className="rules-item__text">
            최종 누적된 성향들의 조합을 바탕으로
            <em className="rules-em"> 당신만의 이능력</em>이 결정됩니다.
          </p>
        </div>

        <div className="rules-item">
          <span className="rules-item__number">03</span>
          <p className="rules-item__text">
            특별한 운명의 조건을 충족할 경우,
            <em className="rules-em--hidden"> 아주 희귀한 히든 클래스</em>를
            각성할 수 있습니다.
          </p>
        </div>

        <div className="rules-item">
          <span className="rules-item__number">04</span>
          <p className="rules-item__text">
            문답을 마치면 20가지 직업 도감을
            언제든 자유롭게 열람할 수 있습니다.
          </p>
        </div>

      </div>

      <p className="fantasy-guide__unlock-note">
        여신의 눈은 당신의 본질을 거짓 없이 꿰뚫어 봅니다.
      </p>

      <button
        type="button"
        className="fantasy-btn fantasy-btn--glow"
        onClick={onBack}
      >
        메인으로 돌아가기
      </button>
    </section>
  )
}

function JobCodexContainer({
  selectedIdx,
  onSelectJob,
  onBack,
  backLabel,
  showDetail,
}) {
  const job = JOB_LIST[selectedIdx]

  return (
    <section
      className={`fantasy-guide-container ${showDetail ? '' : 'fantasy-guide-container--list-only'}`}
    >
      {showDetail && (
      <div className="fantasy-guide__main-view">
        <div className="fantasy-guide__info-panel">
          <span className="fantasy-guide__badge">
            {'\u2736'} {job.badge} {'\u2736'}
          </span>
          <JobTitleDisplay
            displayName={job.displayName}
            subName={job.subName}
            titleClass={getJobTitleClass(job.key)}
            mainClassName="fantasy-guide__title"
          />
          <p className="fantasy-guide__combo-sub">
            {translateCategory(`${job.group} | ${job.combo}`)}
          </p>
          <p className="fantasy-guide__desc">{job.desc}</p>

          <button
            type="button"
            className="fantasy-btn fantasy-btn--glow fantasy-guide__back-btn"
            onClick={onBack}
          >
            {backLabel}
          </button>
        </div>

        <div
          className="fantasy-guide__image-panel"
          data-title-class={getJobTitleClass(job.key)}
        >
          <img
            src={job.image}
            alt={job.displayName}
            className="fantasy-guide__giant-illustration"
          />
        </div>
      </div>
      )}

      <div className="fantasy-guide__quick-selector">
        <h3 className="fantasy-guide__selector-title">20가지 직업 목록</h3>
        <div className="fantasy-guide__buttons-grid">
          {JOB_LIST.map((item, index) => (
              <button
                key={item.key}
                type="button"
                className={`fantasy-guide__select-btn ${showDetail && selectedIdx === index ? 'active' : ''}`}
                onClick={() => onSelectJob(index)}
              >
                {item.displayName}
              </button>
            ))}
        </div>
        {!showDetail && (
          <button
            type="button"
            className="fantasy-btn fantasy-btn--sub fantasy-guide__list-back-btn"
            onClick={onBack}
          >
            {backLabel}
          </button>
        )}
      </div>
    </section>
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
  const [guideIdx, setGuideIdx] = useState(0)
  const [jobIdx, setJobIdx] = useState(0)
  const [guideShowDetail, setGuideShowDetail] = useState(false)
  const [jobListShowDetail, setJobListShowDetail] = useState(false)
  const [isAwakening, setIsAwakening] = useState(false)
  const [eyeOpen, setEyeOpen] = useState(false)
  const [userChoices, setUserChoices] = useState([])
  const [interviewStep, setInterviewStep] = useState('step1')
  const scoresRef = useRef(INITIAL_SCORES)
  const currentIdxRef = useRef(0)
  const userChoicesRef = useRef([])
  const awakeningTimersRef = useRef([])
  const { playSelectSound, playAwakeningSound } = useGameSound()

  useEffect(() => {
    currentIdxRef.current = currentIdx
  }, [currentIdx])

  useEffect(() => {
    if (isAwakening) {
      playAwakeningSound()
    }
  }, [isAwakening, playAwakeningSound])

  useEffect(() => {
    if (screen === SCREENS.GUIDE) {
      setGuideShowDetail(false)
    }
    if (screen === SCREENS.JOB_LIST) {
      setJobListShowDetail(false)
    }
  }, [screen])

  useEffect(() => {
    return () => {
      awakeningTimersRef.current.forEach(clearTimeout)
      awakeningTimersRef.current = []
    }
  }, [])

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true)

      if (!isSupabaseConfigured || !supabase) {
        setQuizList(normalizeQuizList(FALLBACK_QUIZZES))
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
          setQuizList(normalizeQuizList(FALLBACK_QUIZZES))
          console.error('DB 에러:', error.message)
        } else if (!data || data.length === 0) {
          setDbError(null)
          setQuizList(normalizeQuizList(FALLBACK_QUIZZES))
        } else {
          setDbError(null)
          setQuizList(normalizeQuizList(data))
        }
      } catch (err) {
        console.error('연동 에러:', err)
        setQuizList(normalizeQuizList(FALLBACK_QUIZZES))
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

  const resetQuizSession = () => {
    scoresRef.current = INITIAL_SCORES
    setScores(INITIAL_SCORES)
    currentIdxRef.current = 0
    setCurrentIdx(0)
    setFinalResult(null)
    setHasCompletedQuiz(false)
    setIsAwakening(false)
    setEyeOpen(false)
    userChoicesRef.current = []
    setUserChoices([])
    awakeningTimersRef.current.forEach(clearTimeout)
    awakeningTimersRef.current = []
  }

  const handleOpenGoddessInterview = () => {
    resetQuizSession()
    setInterviewStep('step1')
    goToScreen(SCREENS.GODDESS_INTERVIEW)
  }

  const handleGoddessConfirm = () => {
    if (loading) {
      alert('여신의 부름을 기다리는 중입니다. 잠시 후 다시 시도해 주세요.')
      return
    }
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
    goToScreen(SCREENS.QUIZ)
  }

  const handleAnswer = (optionNumber) => {
    const quizIndex = currentIdxRef.current
    const currentQuiz = quizList[quizIndex]

    if (!currentQuiz) return

    playSelectSound()

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

    const nextChoices = [...userChoicesRef.current, optionNumber]
    userChoicesRef.current = nextChoices
    setUserChoices(nextChoices)

    if (quizIndex + 1 < quizList.length) {
      const nextIdx = quizIndex + 1
      currentIdxRef.current = nextIdx
      setCurrentIdx(nextIdx)
    } else {
      const jobKey = determineJob(nextScores)
      const jobResult = getAbilityResult(jobKey)
      setFinalResult({ key: jobKey, ...jobResult })
      setHasCompletedQuiz(true)

      if (isSupabaseConfigured && supabase) {
        supabase
          .from('user_responses')
          .insert({
            user_name: '',
            selected_choices: nextChoices,
            final_scores: nextScores,
            matched_job: jobResult.displayName,
          })
          .select()
          .then(({ data, error }) => {
            if (error) {
              console.error('응답 저장 실패:', error)
            } else {
              console.log('응답 저장 성공:', data)
            }
          })
      }

      awakeningTimersRef.current.forEach(clearTimeout)
      awakeningTimersRef.current = []

      setIsAwakening(true)
      setEyeOpen(false)

      awakeningTimersRef.current.push(
        setTimeout(() => setEyeOpen(true), 1500),
        setTimeout(() => {
          setIsAwakening(false)
          setEyeOpen(false)
          goToScreen(SCREENS.RESULT)
        }, 3000)
      )
    }
  }

  const handleGuideSelectJob = (index) => {
    setGuideIdx(index)
    setGuideShowDetail(true)
  }

  const handleJobListSelectJob = (index) => {
    setJobIdx(index)
    setJobListShowDetail(true)
  }

  const handleRestart = () => {
    resetQuizSession()
    setInterviewStep('step1')
    goToScreen(SCREENS.MAIN)
  }

  const activeQuiz =
    screen === SCREENS.QUIZ && quizList.length > 0
      ? quizList[currentIdx]
      : null

  return (
    <div className="fantasy-app">
      <div className="fantasy-bg" aria-hidden="true">
        <div className="fantasy-bg__glow fantasy-bg__glow--top" />
        <div className="fantasy-bg__glow fantasy-bg__glow--bottom" />
        <div className="fantasy-bg__stars" />
      </div>

      <main
        className={`fantasy-screen ${screen === SCREENS.MAIN ? 'fantasy-screen--main' : ''} ${screen === SCREENS.RESULT || screen === SCREENS.JOB_LIST || screen === SCREENS.GUIDE ? 'fantasy-screen--wide' : ''} ${isTransitioning ? 'fantasy-screen--fade-out' : 'fantasy-screen--fade-in'}`}
      >
        {screen === SCREENS.MAIN && (
          <MainScreen
            onGoToWorldview={handleOpenGoddessInterview}
            onGoToGuide={() => goToScreen(SCREENS.GUIDE)}
          />
        )}

        {screen === SCREENS.GUIDE && !hasCompletedQuiz && (
          <RulesGuidePanel onBack={() => goToScreen(SCREENS.MAIN)} />
        )}

        {screen === SCREENS.GUIDE && hasCompletedQuiz && JOB_LIST.length > 0 && (
          <JobCodexContainer
            selectedIdx={guideIdx}
            onSelectJob={handleGuideSelectJob}
            onBack={() => {
              setGuideShowDetail(false)
              goToScreen(SCREENS.MAIN)
            }}
            backLabel="메인으로 돌아가기"
            showDetail={guideShowDetail}
          />
        )}

        {screen === SCREENS.JOB_LIST && hasCompletedQuiz && JOB_LIST.length > 0 && (
          <JobCodexContainer
            selectedIdx={jobIdx}
            onSelectJob={handleJobListSelectJob}
            onBack={() => {
              setJobListShowDetail(false)
              goToScreen(SCREENS.RESULT)
            }}
            backLabel="결과 화면으로 돌아가기"
            showDetail={jobListShowDetail}
          />
        )}

        {screen === SCREENS.GODDESS_INTERVIEW && (
          <GoddessInterviewPanel
            interviewStep={interviewStep}
            setInterviewStep={setInterviewStep}
            onConfirm={handleGoddessConfirm}
            loading={loading}
            dbError={dbError}
          />
        )}

        {activeQuiz && !isAwakening && (
          <QuizScreen
            quiz={activeQuiz}
            currentIdx={currentIdx}
            totalCount={quizList.length}
            onAnswer={handleAnswer}
          />
        )}

        {screen === SCREENS.RESULT && finalResult && (
          <ResultScreen
            result={finalResult}
            onRestart={handleRestart}
          />
        )}
      </main>

      {isAwakening && <AwakeningOverlay eyeOpen={eyeOpen} />}

      {screen === SCREENS.MAIN && (
        <p className="fantasy-author-credit" aria-label="제작자 크레딧">
          기획 · 개발 이한
        </p>
      )}
    </div>
  )
}

export default App
