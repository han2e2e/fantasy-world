import { useEffect, useState } from 'react'
import {
  getJobImageSrc,
  getJobTitleClass,
  JOB_LIST,
  translateCategory,
} from '../abilityResults'
import { supabase, isSupabaseConfigured } from '../supabaseClient'
import JobTitleDisplay from './JobTitleDisplay'

const REVIEWS_PER_PAGE = 5
const MY_REVIEWS_STORAGE_KEY = 'isekai_guestbook_my_ids'

// 작성일을 YYYY.MM.DD 형식으로 포맷
function formatReviewDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd}`
}

function readMyReviewIds() {
  try {
    const raw = localStorage.getItem(MY_REVIEWS_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// 긴 성향 설명을 의미 단위(문장)로 모아 2~3개 문단으로 분리
function splitIntoParagraphs(text, target = 3) {
  const clean = String(text ?? '').trim()
  if (!clean) return []

  const sentences = clean.match(/[^.]+\.(?:\s|$)/g)
  if (!sentences || sentences.length <= 1) return [clean]

  const trimmed = sentences.map((sentence) => sentence.trim())
  const size = Math.ceil(trimmed.length / target)
  const paragraphs = []
  for (let i = 0; i < trimmed.length; i += size) {
    paragraphs.push(trimmed.slice(i, i + size).join(' '))
  }
  return paragraphs
}

// 작은따옴표로 감싼 핵심 키워드('압도적인 실행력' 등)를 강조 처리
function renderWithEmphasis(paragraph) {
  return paragraph.split(/('[^']+')/g).map((part, index) => {
    if (/^'[^']+'$/.test(part)) {
      return (
        <strong key={index} className="fantasy-result__keyword">
          {part}
        </strong>
      )
    }
    return <span key={index}>{part}</span>
  })
}

function ResultScreen({ result, onRestart, responseId = null }) {
  const [viewResult, setViewResult] = useState(result)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isJobListModalOpen, setIsJobListModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviews, setReviews] = useState([])
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false)
  const [myReviewIds, setMyReviewIds] = useState(readMyReviewIds)
  const [currentPage, setCurrentPage] = useState(1)

  const reviewerName = result.displayName

  useEffect(() => {
    try {
      localStorage.setItem(MY_REVIEWS_STORAGE_KEY, JSON.stringify(myReviewIds))
    } catch {
      // localStorage 사용 불가 환경은 조용히 무시
    }
  }, [myReviewIds])

  // 👑개발자 글은 상단 고정 박스로 분리, 목록은 일반 유저 후기만 페이지네이션
  const userReviews = reviews.filter((review) => review.nickname !== '👑개발자')

  const totalPages = Math.max(
    1,
    Math.ceil(userReviews.length / REVIEWS_PER_PAGE)
  )
  const safePage = Math.min(currentPage, totalPages)
  const pagedReviews = userReviews.slice(
    (safePage - 1) * REVIEWS_PER_PAGE,
    safePage * REVIEWS_PER_PAGE
  )

  useEffect(() => {
    setViewResult(result)
  }, [result])

  const titleClass = getJobTitleClass(viewResult.key)
  const abilityText = viewResult.abilityDesc ?? viewResult.desc
  const jobImageSrc = getJobImageSrc(viewResult.detailKey, viewResult.image)
  const isAnyModalOpen = isModalOpen || isJobListModalOpen || isReviewModalOpen

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
    setCurrentPage(1)
    fetchReviews()
  }, [isReviewModalOpen])

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [totalPages])

  const handleSubmitReview = async () => {
    if (isSubmitting || hasSubmittedReview) return
    const trimmedComment = comment.trim()
    if (!trimmedComment) {
      alert('한 줄 후기를 입력해 주세요.')
      return
    }
    if (!isSupabaseConfigured || !supabase) {
      alert('방명록 기능을 사용할 수 없습니다. (DB 미연결)')
      return
    }

    setIsSubmitting(true)

    const reviewRow = {
      nickname: reviewerName,
      comment: trimmedComment,
    }
    if (responseId != null) {
      reviewRow.user_response_id = responseId
    }

    const { data, error } = await supabase
      .from('guestbook')
      .insert(reviewRow)
      .select()

    setIsSubmitting(false)

    if (error) {
      console.error('방명록 등록 실패:', error)
      alert('후기 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.')
      return
    }

    const newId = data?.[0]?.id
    if (newId != null) {
      setMyReviewIds((prev) => [...prev, newId])
    }

    setComment('')
    setHasSubmittedReview(true)
    fetchReviews()
  }

  const handleDeleteReview = async (reviewId) => {
    if (!myReviewIds.includes(reviewId)) return
    if (!isSupabaseConfigured || !supabase) return

    const { error } = await supabase
      .from('guestbook')
      .delete()
      .eq('id', reviewId)

    if (error) {
      console.error('방명록 삭제 실패:', error)
      alert('후기 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.')
      return
    }

    setReviews((prev) => prev.filter((review) => review.id !== reviewId))
    setMyReviewIds((prev) => prev.filter((id) => id !== reviewId))
    setHasSubmittedReview(false)
  }

  useEffect(() => {
    if (!isAnyModalOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return
      if (isReviewModalOpen) setIsReviewModalOpen(false)
      else if (isJobListModalOpen) setIsJobListModalOpen(false)
      else if (isModalOpen) setIsModalOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isAnyModalOpen, isModalOpen, isJobListModalOpen, isReviewModalOpen])

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
          {splitIntoParagraphs(viewResult.personalityDesc).map(
            (paragraph, index) => (
              <p key={index} className="fantasy-result__personality-para">
                {renderWithEmphasis(paragraph)}
              </p>
            )
          )}
        </div>

        <div className="fantasy-result__buttons">
          <button
            type="button"
            className="fantasy-btn fantasy-btn--glow fantasy-result__ability-toggle"
            onClick={() => setIsModalOpen(true)}
          >
            능력설명 보기
          </button>

          <div className="fantasy-result__btn-row">
            <button
              type="button"
              className="fantasy-btn fantasy-btn--glow fantasy-btn--restart fantasy-result__restart"
              onClick={onRestart}
            >
              다시하기
            </button>

            <button
              type="button"
              className="fantasy-btn fantasy-btn--sub"
              onClick={handleOpenJobList}
            >
              직업목록보기
            </button>
          </div>

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

            <div className="fantasy-ability-modal__desc">
              {splitIntoParagraphs(abilityText).map((paragraph, index) => (
                <p
                  key={index}
                  className="fantasy-ability-modal__desc-para"
                >
                  {renderWithEmphasis(paragraph)}
                </p>
              ))}
            </div>
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
              📜 이세계 방명록
            </h2>

            {/* 1. 개발자 코멘트 — 최상단 고정, 삭제 불가 */}
            <div className="fantasy-review-modal__dev-pin leading-relaxed tracking-wide">
              <span className="fantasy-review-modal__dev-nick">👑 개발자</span>
              <span className="fantasy-review-modal__item-sep"> : </span>
              <span className="fantasy-review-modal__dev-text">
                플레이해주셔서 감사합니다.
              </span>
            </div>

            {/* 2. 후기 등록 폼 */}
            {hasSubmittedReview ? (
              <p className="fantasy-review-modal__done leading-relaxed tracking-wide">
                이미 후기를 남기셨습니다. 감사합니다!
              </p>
            ) : (
              <div className="fantasy-review-modal__form">
                <span
                  className="fantasy-review-modal__identity"
                  title="당신의 직업이 닉네임으로 자동 기록됩니다"
                >
                  {reviewerName}
                </span>
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
            )}

            {/* 3. 유저 후기 목록 */}
            <div className="fantasy-review-modal__list">
              {userReviews.length === 0 ? (
                <p className="fantasy-review-modal__empty leading-relaxed tracking-wide">
                  아직 남겨진 후기가 없습니다. 첫 번째 후기를 남겨보세요!
                </p>
              ) : (
                pagedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="fantasy-review-modal__item leading-relaxed tracking-wide"
                  >
                    <span className="fantasy-review-modal__item-nick">
                      {review.nickname}
                    </span>
                    <span className="fantasy-review-modal__item-sep">:</span>
                    <span className="fantasy-review-modal__item-text">
                      {review.comment}
                    </span>

                    <span className="fantasy-review-modal__item-meta">
                      {myReviewIds.includes(review.id) && (
                        <button
                          type="button"
                          className="fantasy-review-modal__delete"
                          aria-label="내 후기 삭제"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          삭제
                        </button>
                      )}
                      <span className="fantasy-review-modal__item-date">
                        {formatReviewDate(review.created_at)}
                      </span>
                    </span>
                  </div>
                ))
              )}
            </div>

            {userReviews.length > 0 && totalPages > 1 && (
              <div className="fantasy-review-modal__pagination">
                <button
                  type="button"
                  className="fantasy-review-modal__page-btn"
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                >
                  이전
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={`fantasy-review-modal__page-btn ${
                        pageNumber === safePage ? 'is-active' : ''
                      }`}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  )
                )}

                <button
                  type="button"
                  className="fantasy-review-modal__page-btn"
                  disabled={safePage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                >
                  다음
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default ResultScreen
