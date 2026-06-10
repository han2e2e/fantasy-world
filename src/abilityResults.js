import imgResult01 from './assets/images/뇌격자 일러스트.png'
import imgResult02 from './assets/images/멸진체 배경o.png'
import imgResult03 from './assets/images/택티컬 스나이퍼.png'
import imgResult04 from './assets/images/투신.png'
import imgResult05 from './assets/images/스플리터.png'
import imgResult06 from './assets/images/아비터.png'
import imgResult07 from './assets/images/로지스틱스.png'
import imgResult08 from './assets/images/어비스.png'
import imgResult09 from './assets/images/반인체.png'
import imgResult10 from './assets/images/레그레수스.png'
import imgResult11 from './assets/images/아이언하이드 배경o.png'
import imgResult12 from './assets/images/서바이버.png'
import imgResult13 from './assets/images/메카닉아카이브.png'
import imgResult14 from './assets/images/커맨더.png'
import imgResult15 from './assets/images/가디언 프로토콜.png'
import imgResult16 from './assets/images/퍼핏.png'
import imgResult17 from './assets/images/피루엣.png'
import imgResult18 from './assets/images/만상.png'
import imgResult19 from './assets/images/데메테르.png'
import imgResult20 from './assets/images/에테르.png'

export const INITIAL_SCORES = { combat: 0, strategy: 0, survival: 0, modern: 0 }

export const SCORING_GUIDE = [
  '10개 문항의 선택지마다 combat / strategy / survival / modern 중 하나의 점수가 보이지 않게 쌓입니다.',
  '해당 성향들을 종합적인 성향을 바탕으로 능력을 알 수 있습니다.',
  '조건 충족시 희귀한 클래스를 얻을 수 있습니다',
]

export const ABILITY_RESULTS = {
  Combat_Strategy: {
    number: 1,
    group: '⚔️ Combat 주성향',
    combo: 'Combat + Strategy',
    title: '1. 뇌격자(雷擊者)',
    desc: '자신의 몸을 순수한 전격으로 둘러 초고속으로 이동하고 폭발적인 뇌뢰(雷雷)를 방출하는 능력. 전장의 공간 좌표들을 종횡무진하며 적의 사각지대를 순식간에 유린하고 치고 빠지는 전술적 암살이 특기다.',
    image: imgResult01,
  },
  Combat_Survival: {
    number: 2,
    group: '⚔️ Combat 주성향',
    combo: 'Combat + Survival',
    title: '2. 멸진체(滅盡體)',
    desc: "드레날린을 폭발시켜 신체를 강제 폭주시키는 '과부하(Overdrive)' 능력. 공격할 때마다 근육과 세포가 타들어 가듯 파괴되지만, 초재생 능력이 이를 즉시 수복한다. 상처가 많이 날수록 뿜어져 나온 고밀도의 생체 에너지가 더욱 단단해지는 '버서커 모드' 상태가 되어 적을 몰살한다",
    image: imgResult02,
  },
  Combat_Modern: {
    number: 3,
    group: '⚔️ Combat 주성향',
    combo: 'Combat + Modern',
    title: '3. 택티컬 스나이퍼 (Tactical Sniper)',
    desc: "공간 좌표를 열어 현대의 첨단 총기와 스나이퍼 라이플을 자유자재로 소환해 사용하는 '전술 화기 제어' 능력. 소환된 현대 무기를 소환과 동시에, 화기의 한계를 초월한 거대한 플라즈마 레이저포까지 소환·전개하여 전투가 가능하다.",
    image: imgResult03,
  },
  Combat_Solo: {
    number: 4,
    group: '⚔️ Combat 주성향',
    combo: 'Combat+',
    title: '4. 투신 (鬪神)',
    desc: "오직 '섬멸'과 '승리'만을 위해 태어난 파괴의 클래스. 전장에 서는 것만으로도 압도적인 위압감이 물리적인 중력이 되어 주변 수백 미터의 땅을 침하시키고 적들의 숨통을 조여온다. 상처를 입지 않는 강철 같은 신체와 대륙을 쪼개는 완력을 지니고, 모든 것을 섬멸하는 무력의 현현화.",
    image: imgResult04,
  },

  Strategy_Combat: {
    number: 5,
    group: '🌀 Strategy 주성향',
    combo: 'Strategy + Combat',
    title: '5. 스플리터 (Splitter)',
    desc: "대상의 방어력이나 신체 강도를 무시하고 존재하는 공간 자체를 분리하는 '절대 절단' 능력. 손가락으로 허공을 그으면 그 궤적을 따라 차원의 단면이 영구히 갈라진다. 이때 잘려 나간 신체 부위나 사물은 즉시 다른 차원으로 격리되어 소멸하기 때문에, 이 세계의 그 어떤 치유 마법이나 초재생 능력으로도 결코 수복할 수 없다.",
    image: imgResult05,
  },
  Strategy_Survival: {
    number: 6,
    group: '🌀 Strategy 주성향',
    combo: 'Strategy + Survival',
    title: '6. 아비터 (Arbiter)',
    desc: '전장 전체의 규칙을 마음대로 뜯어고치는 \'세계선 조작\' 능력. 특정 좌표를 지정해 "이 구역 안에서는 공격 불가", "이 구역 안에서는 피해량 0" 같은 절대적인 규칙을 부여한다. 적이 아무리 강해도 자신이 짜놓은 생존 룰 안에서 강제로 놀아나게 만들어, 손가락 하나 까딱하지 않고 아군을 완벽하게 생존시키는 심판과도 같은 존재.',
    image: imgResult06,
  },
  Strategy_Modern: {
    number: 7,
    group: '🌀 Strategy 주성향',
    combo: 'Strategy + Modern',
    title: '7. 로지스틱스 (Logistics)',
    desc: "차원의 경계를 열어 현대 문명의 최첨단 자원을 무한히 꺼내 쓰는 '전술 아카이브' 능력. 특정 좌표에 현대식 전술 차량, 나노 구급 약품, 고화력 특수 장비 등 시대와 동떨어진 현대 물자를 즉시 소환하여 전장을 완벽한 요새로 재구축한다. 가혹한 이세계의 규칙을 현대 문명의 기술력(오버 테크놀로지)으로 전환하는 인간요새.",
    image: imgResult07,
  },
  Strategy_Solo: {
    number: 8,
    group: '🌀 Strategy 주성향',
    combo: 'Strategy+',
    title: '8. 아비스 (Abyssus)',
    desc: "전장에 존재하는 모든 지성체의 인지 구조를 완벽히 장악하는 '정신 장악' 능력. 적들의 다음 수와 심리 상태를 수천 수만 갈래로 미리 들여다보며, 상대가 '가장 완벽하다고 믿는 전략'마저 도출이 가능하다. 판이 아무리 불리할지라도 적의 무의식을 뒤틀어 스스로 자멸하는 경로를 찾아내어 손가락 하나 까딱하지 않고 적의 전장을 박살내는 인지능력의 초월자.",
    image: imgResult08,
  },

  Survival_Combat: {
    number: 9,
    group: '🛡️ Survival 주성향',
    combo: 'Survival + Combat',
    title: '9. 반인체 (反刃體)',
    desc: '체에 가해지는 모든 물리적 충격과 원소 에너지를 흡수하여 자신의 무력으로 치환하는 \'에너지 축적\' 능력. 적에게 받은 충격, 열, 전기 등의 모든 대미지를 체내에 완벽히 무력화하여 축적한 뒤, 더 파괴적인 고압의 전격과 완력으로 변환해 되돌려 보낸다. 상대의 공격이 강하면 강할수록 무한히 진화하여 끝없이 강해지는 결투와 생존의 대가.',
    image: imgResult09,
  },
  Survival_Strategy: {
    number: 10,
    group: '🛡️ Survival 주성향',
    combo: 'Survival + Strategy',
    title: '10. 레그레수스 (Regressus)',
    desc: "생명이 다해가는 순간 신체 부위의 시간 축을 과거로 강제 롤백시키는 '시공 좌표 역행' 능력. 뼈가 부서지고 팔이 절단된 치명상은 물론, 이미 멎어버린 심장마저 부상당하기 이전의 완벽한 좌표로 복원해 낸다. 단순한 치유를 넘어 죽음이라는 절대적인 인과마저 전략적으로 되돌려 전황을 원점으로 되돌리는 시간 역행자이자 불사의 지배자.",
    image: imgResult10,
  },
  Survival_Modern: {
    number: 11,
    group: '🛡️ Survival 주성향',
    combo: 'Survival + Modern',
    title: '11. 아이언하이드 (Ironhide)',
    desc: "신체 표면에 미세한 나노 입자를 상시 대기시키는 '하이테크 전술 외골격' 능력. 타격을 입는 순간 보이지 않던 노란빛의 전술 홀로그램 레이어가 스캔하듯 켜지며, 나노 섬유와 방탄 합금 장갑을 실시간으로 전개해 완벽한 방호벽을 형성한다. 치명상을 입더라도 장갑 내부의 나노 메디컬 시스템이 상처를 실시간으로 봉합하고 수복해 내는 미래형 과학 기술의 결정체이자 걸어 다니는 요새.",
    image: imgResult11,
  },
  Survival_Solo: {
    number: 12,
    group: '🛡️ Survival 주성향',
    combo: 'Survival+',
    title: '12. 서바이버 (Survivor)',
    desc: "자신을 향한 미세한 악의와 전장의 모든 리스크를 완벽히 차단하는 '절대 살기 감지' 능력. 찰나의 위험조차 본능적으로 미리 예지하여 완벽하게 대처하며, 자신에게 가해질 모든 사망 변수를 무의식으로 무효화 시킨다. 이 세계의 그 어떤 기습, 저주, 즉사 권능조차 이 존재에게는 도달하지 못하며, 어떠한 절망적인 재앙 속에서도 사전에 위험 요소를 무력화한다. 모든 위험으로부터 해방한 자유의 의지 그 자체.",
    image: imgResult12,
  },

  Modern_Combat: {
    number: 13,
    group: '🌍 Modern 주성향',
    combo: 'Modern + Combat',
    title: '13. 메카닉 아카이브 (Mechanic Archive)',
    desc: "포탈을 개방하면 현대 문명의 최첨단 자율 병기들을 전장에 소환하는 '메카닉 군단 사령관'. 수천 수만 대의 마이크로 추적 드론과 고화력 자폭 로봇 군단을 사출하여 본인의 군단으로 만든다. 인공지능 시스템의 통제하에 일시에 과부하된 기계 군단이 거대한 폭발을 일으키며 연쇄 폭발을 감행하며, 가로막는 모든 적과 진형을 흔적도 없이 증발시키는 기계 군단의 절대적 사령관.",
    image: imgResult13,
  },
  Modern_Strategy: {
    number: 14,
    group: '🌍 Modern 주성향',
    combo: 'Modern + Strategy',
    title: '14. 커맨더 (Commander)',
    desc: "전장에 존재하는 모든 인간의 시야와 인지 체계를 하나로 연결하는 '동기화' 능력. 범위 안의 모든 생명체의 시각 정보를 동기화하여 판도를 구축하고, 이 초정밀 전술 시야를 아군 전체의 뇌에 다이렉트로 동기화시킨다. 적들이 무엇을 보고 어디를 노리는지 아군 모두가 실시간으로 공유, 완벽한 승리의 판을 설계하여 전장을 체스판처럼 지배하는 절대적 사령관.",
    image: imgResult14,
  },
  Modern_Survival: {
    number: 15,
    group: '🌍 Modern 주성향',
    combo: 'Modern + Survival',
    title: '15. 가디언 프로토콜 (Guardian Protocol)',
    desc: '현대 과학의 방호 및 메디컬 네트워크를 아군에게 공유해 전술 보안 체계를 전개한다. 전술 영역 내 모든 팀원의 신체 표면에 하이테크 방탄 합금 배리어를 코팅하여 모든 충격을 상쇄하고, 신체 손상이 감지되는 순간 나노 약품과 전술 응급 처치 액추에이터를 네트워크로 동시 주입해 실시간으로 치명상을 처치한다. 어떤 전장에서도 팀원 전원을 불패의 상태로 인도하는 살아있는 방어 시스템이자 최종 수호자.',
    image: imgResult15,
  },
  Modern_Solo: {
    number: 16,
    group: '🌍 Modern 주성향',
    combo: 'Modern+',
    title: '16. 퍼핏 (Puppet)',
    desc: "스마트폰, 인터넷, 전력망과 산업 기반 등 인류가 이룩한 현대 문명의 인프라 전체를 이세계에 구축하는 '소환 및 구현' 능력. 칼과 마법이 지배하는 세계관 한복판에 현대의 과학 기술과 정보 네트워크를 독점적으로 보유하여 세상의 패러다임을 송두리째 뒤바꿔놓는다. 기술과 자원, 정보의 유통을 완벽히 통제함으로써 존재 자체만으로 전 세계의 인과와 권력을 손에 쥐고 뒤흔드는 현대 과학 문명의 유일무이한 신.",
    image: imgResult16,
  },

  Equal_Combat_Strategy: {
    number: 17,
    group: '히든',
    combo: '???',
    title: '17. 피루엣 (Pirouette)',
    desc: "인간을 초월한 상위 존재의 능력을 손에 넣었다. 범위 내 모든 적의 신경계를 지배해 신체 제어권을 찬탈하는 '절대 인형극' 능력. 상대의 뇌를 강제로 강탈해 내 손가락 하나로 조종하며, 인장이 새겨진 적의 육체를 언제든 '걸어 다니는 인간 지뢰'로 매개화한다. 이 클래스는 세계에서 유일하게 단 한 명에게만 허락되며, 그 누구도 눈치채지 못하는 보이지 않는 인간의 지배자.",
    image: imgResult17,
  },
  Equal_Combat_Survival: {
    number: 18,
    group: '히든',
    combo: '???',
    title: '18. 만상 (萬象)',
    desc: "삶과 죽음의 경계를 초월한 반신의 신격을 손에 넣었다. 우주를 구성하는 파괴와 보존의 규칙을 완벽하게 장악한 '만상통제(萬象統制)'의 권능. 자신을 향한 모든 적의(敵意)를 무(無)로 돌리고, 단 한 걸음의 움직임만으로 세상의 생사여탈권을 쥐고 흔들며 세상의 균형을 지배한다. 해당 존재는 필멸의 존재가 대적할 수 없는 압도적인 무력의 정점이자, 세계의 유일한 인과율의 집행자.",
    image: imgResult18,
  },
  Equal_Strategy_Survival: {
    number: 19,
    group: '히든',
    combo: '???',
    title: '19. 데메테르 (Demeter)',
    desc: "대지와 풍요의 근원을 장악하는 온 세상의 영성(靈性)을 이끄는 반신의 신격을 손에 넣었다. 존재 자체에서 뿜어지는 압도적인 카리스마로 만인을 매료시키는 '신의(神意)' 능력. 그의 카리스마에 매료된 수많은 추종자와 영웅들이 자발적으로 몰려들어 경배하며, 자기를 따르는 신도들에게는 한계가 없는 무한한 생명력과 신선한 지혜를 내리게 된다. 세상을 풍요롭게도, 혹은 단숨에 굶주려 시들게도 만들 수 있는 권능을 쥔, 세계의 유일한 고고한 생명의 여신.",
    image: imgResult19,
  },
  ERROR: {
    number: 20,
    group: '💎 하이브리드 히든',
    combo: '*규격외*',
    title: '20. 에테르 (Aether)',
    desc: '이세계의 규칙과 한계를 완벽히 초월하여, 세상에 존재하지 않는 모든 권능을 창조하는 이능 부여의 신격에 권능을 이어받았다. 세계관의 그 어떤 법칙과 시스템으로도 얽맬 수 없는 절대적 이방인이자 고유의 존재이며, 내 손끝에서 탄생한 초월적인 이능력들은 당신의 손에서 태어나고 소멸하는 주권자이다. 여신의 석상이 당신을 유일무이한 부여의 신으로 선정하였으며, 이 이세계는 당신의 조율자로서 관리를 하게 되는 세계의 유일무이한 창조주이자 0번째 신.',
    image: imgResult20,
  },
}

const ORDERED_JOB_KEYS = [
  'Combat_Strategy',
  'Combat_Survival',
  'Combat_Modern',
  'Combat_Solo',
  'Strategy_Combat',
  'Strategy_Survival',
  'Strategy_Modern',
  'Strategy_Solo',
  'Survival_Combat',
  'Survival_Strategy',
  'Survival_Modern',
  'Survival_Solo',
  'Modern_Combat',
  'Modern_Strategy',
  'Modern_Survival',
  'Modern_Solo',
  'Equal_Combat_Strategy',
  'Equal_Combat_Survival',
  'Equal_Strategy_Survival',
  'ERROR',
]

export const JOB_LIST = ORDERED_JOB_KEYS.map((key) => ({
  key,
  ...ABILITY_RESULTS[key],
}))

const TYPE_ALIASES = {
  combat: 'combat',
  strategy: 'strategy',
  survival: 'survival',
  modern: 'modern',
  '1': 'combat',
  '2': 'strategy',
  '3': 'survival',
  '4': 'modern',
  전투: 'combat',
  전략: 'strategy',
  생존: 'survival',
  현대: 'modern',
}

function normalizeTrait(raw) {
  if (raw == null || raw === '') return null

  const value = String(raw).trim().toLowerCase()
  if (TYPE_ALIASES[value]) return TYPE_ALIASES[value]

  if (value.includes('combat') || value.includes('전투')) return 'combat'
  if (value.includes('strategy') || value.includes('전략')) return 'strategy'
  if (value.includes('survival') || value.includes('생존')) return 'survival'
  if (value.includes('modern') || value.includes('현대')) return 'modern'

  return null
}

export function getQuizOption(quiz, num) {
  return (
    quiz[`option${num}`] ??
    quiz[`option_${num}`] ??
    quiz[`choice_${num}`] ??
    `선택지 ${num}`
  )
}

export function getQuizType(quiz, optionNumber) {
  const keys = [
    `type${optionNumber}`,
    `type_${optionNumber}`,
    `trait${optionNumber}`,
    `trait_${optionNumber}`,
    `option${optionNumber}_type`,
    `option_${optionNumber}_type`,
    `score_type${optionNumber}`,
    `score_type_${optionNumber}`,
  ]

  for (const key of keys) {
    const trait = normalizeTrait(quiz[key])
    if (trait) return trait
  }

  if (quiz.types && typeof quiz.types === 'object') {
    const trait = normalizeTrait(
      quiz.types[optionNumber] ?? quiz.types[String(optionNumber)]
    )
    if (trait) return trait
  }

  return null
}

export function getQuizPoints(quiz, optionNumber) {
  const raw =
    quiz[`point${optionNumber}`] ??
    quiz[`point_${optionNumber}`] ??
    quiz[`points${optionNumber}`] ??
    quiz[`score${optionNumber}`] ??
    quiz[`score_${optionNumber}`] ??
    1

  const points = Number(raw)
  return Number.isFinite(points) && points > 0 ? points : 1
}

export function applyAnswerScore(quiz, optionNumber, scores) {
  const nextScores = { ...scores }
  const trait = getQuizType(quiz, optionNumber)

  if (trait && nextScores[trait] !== undefined) {
    nextScores[trait] += getQuizPoints(quiz, optionNumber)
  }

  return nextScores
}

export function determineJob(finalScores) {
  const sorted = Object.entries(finalScores).sort((a, b) => b[1] - a[1])
  const total = sorted.reduce((sum, [, score]) => sum + score, 0)

  if (total === 0) return 'ERROR'

  const [firstRank, firstScore] = sorted[0]
  const [secondRank, secondScore] = sorted[1]
  const [, thirdScore] = sorted[2]
  const [, fourthScore] = sorted[3]

  if (
    firstScore === secondScore &&
    secondScore === thirdScore &&
    thirdScore === fourthScore
  ) {
    return 'ERROR'
  }

  if (firstScore === secondScore && firstScore > thirdScore) {
    const pair = new Set([firstRank, secondRank])
    if (pair.has('combat') && pair.has('strategy')) return 'Equal_Combat_Strategy'
    if (pair.has('combat') && pair.has('survival')) return 'Equal_Combat_Survival'
    if (pair.has('strategy') && pair.has('survival')) return 'Equal_Strategy_Survival'
    return 'ERROR'
  }

  if (firstScore - secondScore >= 3) {
    if (firstRank === 'combat') return 'Combat_Solo'
    if (firstRank === 'strategy') return 'Strategy_Solo'
    if (firstRank === 'survival') return 'Survival_Solo'
    if (firstRank === 'modern') return 'Modern_Solo'
  }

  const primary = firstRank.charAt(0).toUpperCase() + firstRank.slice(1)
  const secondary = secondRank.charAt(0).toUpperCase() + secondRank.slice(1)
  const resultKey = `${primary}_${secondary}`

  return ABILITY_RESULTS[resultKey] ? resultKey : 'ERROR'
}

export function getAbilityResult(resultKey) {
  return ABILITY_RESULTS[resultKey] ?? ABILITY_RESULTS.ERROR
}
