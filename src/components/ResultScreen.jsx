import { useEffect, useState } from 'react'
import {
  getJobImageSrc,
  getJobTitleClass,
  JOB_LIST,
  translateCategory,
} from '../abilityResults'
import { supabase, isSupabaseConfigured } from '../supabaseClient'
import JobTitleDisplay from './JobTitleDisplay'

function ResultScreen({ result, onRestart }) {
  const [viewResult, setViewResult] = useState(result)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isJobListModalOpen, setIsJobListModalOpen] = useState(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviews, setReviews] = useState([])
  const [nickname, setNickname] = useState('')
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setViewResult(result)
  }, [result])

  const titleClass = getJobTitleClass(viewResult.key)
  const abilityText = viewResult.abilityDesc ?? viewResult.desc
  const jobImageSrc = getJobImageSrc(viewResult.detailKey, viewResult.image)
  const isAnyModalOpen =
    isModalOpen || isJobListModalOpen || isCommentModalOpen || isReviewModalOpen

  const handleJobSelect = (job) => {
    setViewResult({ key: job.key, ...job })
    setIsJobListModalOpen(false)
  }

  const handleOpenJobList = () => {
    setIsModalOpen(false)
    setIsJobListModalOpen(true)
  }

  const fetchReviews = async () => {
    if (!isSupabaseConfigured || !supabase) return
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('방명록 불러오기 실패:', error)
      return
    }
    setReviews(data ?? [])
  }

  useEffect(() => {
    if (!isReviewModalOpen) return
    fetchReviews()
  }, [isReviewModalOpen])

  const handleSubmitReview = async () => {
    if (isSubmitting) return
    const trimmedComment = comment.trim()
    if (!trimmedComment) {
      alert('한 줄 후기를 입력해 주세요.')
      return
    }
    if (!isSupabaseConfigured || !supabase) {
      alert('방명록 기능을 사용할 수 없습니다. (DB 미연결)')
      return
    }

    const finalNickname = nickname.trim() || 'ㅇㅇ'
    setIsSubmitting(true)

    const { error } = await supabase.from('guestbook').insert({
      nickname: finalNickname,
      comment: trimmedComment,
    })

    setIsSubmitting(false)

    if (error) {
      console.error('방명록 등록 실패:', error)
      alert('후기 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.')
      return
    }

    setNickname('')
    setComment('')
    fetchReviews()
  }

  useEffect(() => {
    if (!isAnyModalOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return
      if (isReviewModalOpen) setIsReviewModalOpen(false)
      else if (isJobListModalOpen) setIsJobListModalOpen(false)
      else if (isCommentModalOpen) setIsCommentModalOpen(false)
      else if (isModalOpen) setIsModalOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    isAnyModalOpen,
    isModalOpen,
    isJobListModalOpen,
    isCommentModalOpen,
    isReviewModalOpen,
  ])

  return (
    <section className="fantasy-result-layout">
      <div className="fantasy-result__left-content">
        <div className="fantasy-result__header">
          <JobTitleDisplay
            displayName={viewResult.displayName}
            subName={viewResult.subName}
            titleClass={titleClass}
            mainClassName="fantasy-result__title"
          />

          <p className="fantasy-guide__combo-sub fantasy-result__combo-tags">
            {translateCategory(`${viewResult.group} | ${viewResult.combo}`)}
          </p>
        </div>

        <div className="fantasy-result__personality-box">
          <p className="fantasy-result__personality leading-loose tracking-wide text-justify">
            {viewResult.personalityDesc}
          </p>
        </div>

        <div className="fantasy-result__buttons">
          <button
            type="button"
            className="fantasy-btn fantasy-btn--glow fantasy-result__ability-toggle"
            onClick={() => setIsModalOpen(true)}
          >
            해당 직업의 능력설명 보기
          </button>

          <button
            type="button"
            className="fantasy-btn fantasy-btn--glow fantasy-btn--restart fantasy-result__restart"
            onClick={onRestart}
          >
            다시 시험받기
          </button>

          <button
            type="button"
            className="fantasy-btn fantasy-btn--sub"
            onClick={handleOpenJobList}
          >
            20가지 직업 목록 보기
          </button>

          <button
            type="button"
            className="fantasy-btn fantasy-btn--sub fantasy-result__review-btn"
            onClick={() => setIsReviewModalOpen(true)}
          >
            후기 남기기
          </button>
        </div>
      </div>

      <div
        className="fantasy-result__right-image"
        data-title-class={titleClass}
      >
        <div className="fantasy-result__illustration-frame">
          <img
            src={jobImageSrc}
            alt={viewResult.displayName}
            className="fantasy-result__illustration"
          />
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fantasy-ability-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ability-modal-title"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="fantasy-ability-modal__card"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="fantasy-ability-modal__close"
              aria-label="능력설명 닫기"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>

            <div className="fantasy-ability-modal__title-wrap">
              <JobTitleDisplay
                displayName={viewResult.displayName}
                subName={viewResult.subName}
                titleClass={titleClass}
                mainClassName="fantasy-ability-modal__title"
              />
            </div>

            <p className="fantasy-ability-modal__desc leading-loose tracking-wide text-justify">
              {abilityText}
            </p>
          </div>
        </div>
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
              더 좋은 피드백 제안은 dlgks888g@naver.com로 남겨주세요!
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

      {isJobListModalOpen && (
        <div
          className="fantasy-ability-modal fantasy-joblist-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="joblist-modal-title"
          onClick={() => setIsJobListModalOpen(false)}
        >
          <div
            className="fantasy-joblist-modal__card"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="fantasy-ability-modal__close"
              aria-label="직업 목록 닫기"
              onClick={() => setIsJobListModalOpen(false)}
            >
              ×
            </button>

            <p className="fantasy-joblist-modal__subtitle leading-relaxed tracking-wide text-left">
              이세계의 모든 운명
            </p>
            <h2 id="joblist-modal-title" className="fantasy-joblist-modal__title">
              20가지 직업 일람
            </h2>

            <div className="fantasy-joblist-modal__grid">
              {JOB_LIST.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`fantasy-joblist-modal__item ${item.key === viewResult.key ? 'is-current' : ''}`}
                  onClick={() => handleJobSelect(item)}
                >
                  <span className="fantasy-joblist-modal__item-name">
                    {item.displayName}
                  </span>
                  <span className="fantasy-joblist-modal__item-sub">
                    {item.subName}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isReviewModalOpen && (
        <div
          className="fantasy-ability-modal fantasy-review-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
          onClick={() => setIsReviewModalOpen(false)}
        >
          <div
            className="fantasy-review-modal__card"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="fantasy-ability-modal__close"
              aria-label="방명록 닫기"
              onClick={() => setIsReviewModalOpen(false)}
            >
              ×
            </button>

            <h2 id="review-modal-title" className="fantasy-review-modal__title">
              [ 📜 이세계 방명록 ]
            </h2>

            <div className="fantasy-review-modal__form">
              <input
                type="text"
                className="fantasy-review-modal__nickname"
                placeholder="ㅇㅇ"
                maxLength={12}
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
              />
              <input
                type="text"
                className="fantasy-review-modal__comment"
                placeholder="한 줄 후기를 남겨보세요..."
                maxLength={120}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSubmitReview()
                }}
              />
              <button
                type="button"
                className="fantasy-review-modal__submit"
                disabled={isSubmitting}
                onClick={handleSubmitReview}
              >
                등록
              </button>
            </div>

            <div className="fantasy-review-modal__list">
              {reviews.length === 0 ? (
                <p className="fantasy-review-modal__empty leading-relaxed tracking-wide">
                  아직 남겨진 후기가 없습니다. 첫 번째 후기를 남겨보세요!
                </p>
              ) : (
                reviews.map((review) => (
                  <p
                    key={review.id}
                    className="fantasy-review-modal__item leading-relaxed tracking-wide text-left"
                  >
                    <span className="fantasy-review-modal__item-nick">
                      [{review.nickname}]
                    </span>
                    <span className="fantasy-review-modal__item-sep"> : </span>
                    <span className="fantasy-review-modal__item-text">
                      {review.comment}
                    </span>
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ResultScreen
