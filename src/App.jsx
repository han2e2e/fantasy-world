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
            소환 기록
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
            <p>이세계에서는 여신과의 대화를 통해</p>
            <p>나의 이능력을 개방시켜준다고 한다.</p>
          </div>

          <div className="goddess-interview__divider-bar" aria-hidden="true" />

          <div className="goddess-interview__statue-block">
            <p>그리고 나는 지금,</p>
            <p className="goddess-interview__gold-title">
              그 이능력을 부여해준다는 여신의 조각상
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
  const [awakeningPhase, setAwakeningPhase] = useState(0)
  const [answers, setAnswers] = useState([])
  const [jumpNotice, setJumpNotice] = useState(false)
  const [responseId, setResponseId] = useState(null)
  const [interviewStep, setInterviewStep] = useState('step1')
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const scoresRef = useRef(INITIAL_SCORES)
  const currentIdxRef = useRef(0)
  const answersRef = useRef([])
  const awakeningTimersRef = useRef([])
  const {
    playSelectSound,
    playBoomSound,
    playHammerSound,
    playCompleteSound,
  } = useGameSound()

  useEffect(() => {
    currentIdxRef.current = currentIdx
  }, [currentIdx])

  useEffect(() => {
    if (!isCommentModalOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsCommentModalOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isCommentModalOpen])


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
    setAwakeningPhase(0)
    answersRef.current = []
    setAnswers([])
    setResponseId(null)
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

  const finalizeQuiz = (finalAnswers) => {
    if (isAwakening) return
    // 모든 답을 처음부터 합산하여 점수 재계산 (뒤로 가서 답을 바꿔도 정확)
    let computedScores = INITIAL_SCORES
    quizList.forEach((quiz, index) => {
      const option = finalAnswers[index]
      if (option != null) {
        computedScores = applyAnswerScore(quiz, option, computedScores)
      }
    })

    scoresRef.current = computedScores
    setScores(computedScores)

    const jobKey = determineJob(computedScores)
    const jobResult = getAbilityResult(jobKey)
    setFinalResult({ key: jobKey, ...jobResult })
    setHasCompletedQuiz(true)
    setResponseId(null)

    if (isSupabaseConfigured && supabase) {
      supabase
        .from('user_responses')
        .insert({
          user_name: jobResult.displayName,
          selected_choices: finalAnswers,
          final_scores: computedScores,
          matched_job: jobResult.displayName,
        })
        .select()
        .then(({ data, error }) => {
          if (error) {
            console.error('응답 저장 실패:', error)
          } else {
            console.log('응답 저장 성공:', data)
            setResponseId(data?.[0]?.id ?? null)
          }
        })
    }

    awakeningTimersRef.current.forEach(clearTimeout)
    awakeningTimersRef.current = []

    // 마법진 연성 시퀀스 시작
    setIsAwakening(true)
    setAwakeningPhase(0)

    // 히든 클래스(17~20)는 망치 5타 + 강화 연출 (총 3200ms)
    const isHiddenClass = getJobTitleClass(jobKey).includes('hidden')

    // 긴장감 빌드업: 일반 직업 약 5.0초 연성 시퀀스
    const normalSchedule = [
      [0, () => { setAwakeningPhase(0); playBoomSound() }],
      [600, () => { setAwakeningPhase(1); playHammerSound() }],
      [1300, () => { setAwakeningPhase(2); playHammerSound() }],
      [2100, () => { setAwakeningPhase(3); playHammerSound() }],
      [3000, () => { setAwakeningPhase(4) }],
      [3900, () => { setAwakeningPhase(5); playCompleteSound() }],
      [5000, () => { setIsAwakening(false); setAwakeningPhase(0); goToScreen(SCREENS.RESULT) }],
    ]

    // 히든 직업(17~20)은 망치 5타 + 강화 연출, 약 5.5초
    const hiddenSchedule = [
      [0, () => { setAwakeningPhase(0); playBoomSound() }],
      [500, () => { setAwakeningPhase(1); playHammerSound() }],
      [950, () => { setAwakeningPhase(2); playHammerSound() }],
      [1400, () => { setAwakeningPhase(3); playHammerSound() }],
      [1850, () => { setAwakeningPhase(2); playHammerSound() }],
      [2350, () => { setAwakeningPhase(3); playHammerSound() }],
      [2950, () => { setAwakeningPhase(4) }],
      [3800, () => { setAwakeningPhase(5); playCompleteSound() }],
      [5500, () => { setIsAwakening(false); setAwakeningPhase(0); goToScreen(SCREENS.RESULT) }],
    ]

    const schedule = isHiddenClass ? hiddenSchedule : normalSchedule
    schedule.forEach(([ms, fn]) => {
      awakeningTimersRef.current.push(setTimeout(fn, ms))
    })
  }

  const handleAnswer = (optionNumber) => {
    const quizIndex = currentIdxRef.current
    const currentQuiz = quizList[quizIndex]

    if (!currentQuiz) return

    playSelectSound()

    if (!getQuizType(currentQuiz, optionNumber)) {
      console.warn(
        `질문 ${currentQuiz.question_number}의 선택지 ${optionNumber}에 성향(type) 값이 없습니다. Supabase type${optionNumber} 컬럼을 확인하세요.`
      )
    }

    // 문항별로 답을 저장 (뒤로 가서 답을 바꿔도 덮어쓰기)
    const nextAnswers = [...answersRef.current]
    nextAnswers[quizIndex] = optionNumber
    answersRef.current = nextAnswers
    setAnswers(nextAnswers)

    if (quizIndex + 1 < quizList.length) {
      const nextIdx = quizIndex + 1
      currentIdxRef.current = nextIdx
      setCurrentIdx(nextIdx)
      return
    }

    // 마지막 문항을 답한 경우 — 빈 문항이 있으면 그쪽으로 이동, 모두 채웠으면 완료
    const firstUnanswered = quizList.findIndex((_, i) => nextAnswers[i] == null)
    if (firstUnanswered !== -1) {
      setJumpNotice(true)
      setTimeout(() => setJumpNotice(false), 2200)
      currentIdxRef.current = firstUnanswered
      setCurrentIdx(firstUnanswered)
      return
    }

    finalizeQuiz(nextAnswers)
  }

  const handlePrevQuestion = () => {
    const idx = currentIdxRef.current
    if (idx <= 0) return
    const prev = idx - 1
    currentIdxRef.current = prev
    setCurrentIdx(prev)
  }

  const handleNextQuestion = () => {
    const idx = currentIdxRef.current
    if (idx >= quizList.length - 1) return
    // 현재 문항에 답하지 않았으면 다음으로 못 넘어감
    if (answersRef.current[idx] == null) return
    const next = idx + 1
    currentIdxRef.current = next
    setCurrentIdx(next)
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
            answeredCount={answers.filter((a) => a != null).length}
            jumpNotice={jumpNotice}
            onAnswer={handleAnswer}
            onPrev={handlePrevQuestion}
            onNext={handleNextQuestion}
            selectedOption={answers[currentIdx] ?? null}
            canGoPrev={currentIdx > 0}
            canGoNext={
              answers[currentIdx] != null && currentIdx < quizList.length - 1
            }
          />
        )}

        {finalResult && (
          <div
            style={{
              position: isAwakening ? 'fixed' : 'static',
              visibility: isAwakening ? 'hidden' : 'visible',
              inset: isAwakening ? 0 : 'auto',
              zIndex: isAwakening ? -1 : 'auto',
              pointerEvents: isAwakening ? 'none' : 'auto',
            }}
          >
            <ResultScreen
              result={finalResult}
              onRestart={handleRestart}
              responseId={responseId}
            />
          </div>
        )}
      </main>

      {isAwakening && (
        <AwakeningOverlay
          phase={awakeningPhase}
          jobTitleClass={finalResult ? getJobTitleClass(finalResult.key) : ''}
          jobName={finalResult ? finalResult.displayName : ''}
        />
      )}

      <button
        type="button"
        className="fantasy-author-credit fantasy-author-credit--clickable"
        aria-label="개발자 코멘트 보기"
        onClick={() => setIsCommentModalOpen(true)}
      >
        기획 · 개발 이한
      </button>

      {isCommentModalOpen && (
        <div
          className="fantasy-ability-modal fantasy-comment-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="comment-modal-title"
          onClick={() => setIsCommentModalOpen(false)}
        >
          <div
            className="fantasy-comment-modal__card"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="comment-modal-title" className="fantasy-comment-modal__title">
              [ ✉️ 개발자 코멘트 ]
            </h2>

            <p className="fantasy-comment-modal__body leading-relaxed tracking-wide text-left">
              재밌게 플레이해주셔서 감사합니다.
              <br />
              더 좋은 피드백 제안은 dlgks888@naver.com로 남겨주세요!
            </p>

            <button
              type="button"
              className="fantasy-comment-modal__close-btn"
              onClick={() => setIsCommentModalOpen(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
