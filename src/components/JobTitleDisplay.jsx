function JobTitleDisplay({ displayName, subName, titleClass, mainClassName }) {
  const subTitle = subName ? `- ${subName} -` : ''

  return (
    <div className="fantasy-title-container">
      <h2 className={`${mainClassName} ${titleClass}`}>{displayName}</h2>
      {subTitle && <p className="fantasy-title__sub-lang">{subTitle}</p>}
    </div>
  )
}

export default JobTitleDisplay
