import { getQuizOption } from '../abilityResults'

function stripLastQuestionPrefix(text) {
  return text.replace(/^마지막\s*질문입니다[.\s]*/u, '').trim()
}

// "상황 설명. 질문?" 구조를 첫 문장 경계에서 두 줄로 분리
function renderQuestionLines(text) {
  const clean = String(text ?? '').trim()
  const boundary = clean.indexOf('. ')
  if (boundary === -1) return clean

  const first = clean.slice(0, boundary + 1)
  const second = clean.slice(boundary + 2).trim()
  return (
    <>
      {first}
      <br />
      {second}
    </>
  )
}

function QuizScreen({ quiz, currentIdx, totalCount, onAnswer }) {
  const isLastQuestion = currentIdx === totalCount - 1
  const displayQuestion = isLastQuestion
    ? stripLastQuestionPrefix(quiz.question)
    : quiz.question

  return (
    <section
      key={`quiz-${quiz.question_number}-${currentIdx}`}
      className={`fantasy-quiz${isLastQuestion ? ' fantasy-quiz--last' : ''}`}
    >
      <div className="fantasy-quiz__progress-track">
        <div
          className="fantasy-quiz__progress-fill"
          style={{ width: `${(currentIdx / totalCount) * 100}%` }}
        />
      </div>

      <span className="fantasy-quiz__label">
        ㅡ 제 {quiz.question_number} 문답 ㅡ
      </span>
      {isLastQuestion && (
        <p className="fantasy-quiz__last-notice">마지막 질문입니다</p>
      )}
      <h2 className="fantasy-quiz__question">
        {renderQuestionLines(displayQuestion)}
      </h2>
      <div className="fantasy-quiz__options">
        {[1, 2, 3, 4].map((num) => (
          <button
            key={`quiz-${quiz.question_number}-option-${num}`}
            type="button"
            className="fantasy-btn fantasy-btn--glow fantasy-btn--option"
            onClick={() => onAnswer(num)}
          >
            <span className="fantasy-quiz__option-text">
              {num}. {getQuizOption(quiz, num)}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default QuizScreen
