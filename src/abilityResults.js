const JOB_IMAGE_MODULES = import.meta.glob('./assets/images/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

const JOB_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

export function getJobImageSrc(detailKey, fallback = '') {
  if (!detailKey) return fallback

  for (const ext of JOB_IMAGE_EXTENSIONS) {
    const modulePath = `./assets/images/${detailKey}.${ext}`
    if (JOB_IMAGE_MODULES[modulePath]) {
      return JOB_IMAGE_MODULES[modulePath]
    }
  }

  return fallback
}

export const INITIAL_SCORES = { combat: 0, strategy: 0, survival: 0, modern: 0 }

export const SCORING_GUIDE = [
  '10개 문항의 선택지마다 Combat / Strategy / Survival / Modern 중 하나의 성향 점수가 누적됩니다.',
  '누적된 점수의 종합적인 성향 조합을 바탕으로 당신만의 고유한 이능력이 결정됩니다.',
  '특정 조건을 충족할 경우, 아주 희귀한 하이브리드 및 히든 클래스를 각성할 수 있습니다.',
]

export const JOB_DETAILS = {
  lightning: {
    displayName: '뇌격자 (雷擊者)',
    group: 'Combat',
    combo: 'Strategy',
    personalityDesc:
      '당신은 문답 속에서 위기가 들이닥쳤을 때 어설프게 주저하거나 타협하지 않고, 가장 빠르고 확실하게 상황을 종결짓는 \'압도적인 실행력\'을 보여주었습니다. 하지만 당신의 돌격은 무모한 만용이 아닙니다. 당신은 본능적으로 전황의 핵심을 찌르는 날카로운 혜안을 보유하고 있으며, \'가장 치명적인 단 한 발\'을 꽂아 넣을 치밀함과 섬세함까지 겸비한 인재입니다. 머릿속으로 해결책을 구상하는 속도와 그것을 아웃풋으로 뿜어내는 육체의 템포가 완벽하게 일치하는 사람. 리스크를 계산하는 순간 이미 몸이 치고 나가 상황을 정리해 버리는 당신의 거침없는 결단력은, 인과을 관통하며 눈앞의 난제를 초고속으로 격파하는 \'뇌격자\'의 권능과 완벽히 공명하고 있습니다.',
    abilityDesc:
      '번개의 속도로 움직이는 것이 아니라, 번개 그 자체가 된 전사. 사고(思考)와 행동 사이의 시간차가 0에 수렴하여, 적이 공격을 인지하는 순간 이미 뇌격자의 주먹은 상대의 뒤통수를 지나쳐 있다. 전장의 공간 좌표를 읽는 것은 빠른 길을 찾기 위해서가 아니라, 가장 치명적인 각도를 계산하기 위해서다. 번개는 막을 수 없다. 번개가 치기 전에 이미 모든 것이 끝나있다.',
  },
  extinction: {
    displayName: '멸진체 (滅盡體)',
    group: 'Combat',
    combo: 'Survival',
    personalityDesc:
      '당신은 문답을 진행하는 내내 극한의 압박감과 절망적인 선택지 앞에서도 절대로 무너지지 않는 \'강인한 정신력과 생존 본능\'을 증명해 보였습니다. 당신은 위기가 찾아오면 움츠러드는 것이 아니라, 오히려 상황이 파국으로 치달을수록 무서운 집중력을 발휘하며 판을 뒤집어엎을 기회를 노리는 독종에 가깝습니다. 남들이 고통과 두려움에 마비될 때, 당신은 그 고통을 성장을 촉매제이자 리미터를 해제하는 트리거로 삼아 상황을 장악해 나가는 타입입니다. 몰릴 때마다 오히려 투지가 샘솟고 죽음의 문턱에서 가장 강력한 반격을 시작하는 당신의 불굴의 기질은, 세포가 파괴될수록 파괴력이 폭발하며 그 어떤 가혹한 환경에서도 기어코 살아남아 승리를 쟁취하는 \'멸진체\'의 영혼과 소름 돋도록 일치합니다.',
    abilityDesc:
      '신체의 고통 임계값이 존재하지 않는 \'완전 폭주 해방\' 능력. 일반인이라면 쇼크사할 수준의 부상도 이 존재에게는 리미터 해제의 트리거가 된다. 세포가 파괴될수록 뇌는 더 많은 아드레날린하고 투기를 방출하고, 신체는 한계를 넘어 계속 작동한다. 멈추는 것을 모르는 병기. 죽어가면서 가장 강해지는 존재.',
  },
  tactical: {
    displayName: '택티컬 스나이퍼 (Tactical Sniper)',
    group: 'Combat',
    combo: 'Modern',
    personalityDesc:
      '당신은 문답 속에서 무모하게 감정에 치우치거나 아날로그적인 방식에 의존하기보다, 가장 이성적이고 오차가 없는 \'최적의 효율성\'을 바탕으로 문제를 해결하는 성향을 보여주었습니다. 당신은 감정적인 본능을 배제하고, 최적화된 효율 사고를 기반으로 무모한 돌격 대신 최소 비용·최대 타격의 방식으로 전황을 정제하는 저격수입니다. 상황을 냉철하게 관조하며 주변 환경과 모든 변수를 한눈에 스캔하고, 움직이는 단 한 순간에 상황을 종결짓는 차가운 정확함. 감정을 배제한 채 현대적인 정밀함으로 이세계의 인과율을 백발백중으로 정조준하는 당신의 영리한 면모는, 보이지 않는 곳에서 모든 변수를 완벽히 통제하는 \'택티컬 스나이퍼\'의 권능 그 자체입니다.',
    abilityDesc:
      '차원의 틈새를 열어 현대 문명의 최첨단 저격 화기들을 자유자재로 다루는 \'초정밀 탄도 제어\' 능력. 시야에 보이지 않는 초장거리의 적이라 할지라도, 대기의 흐름과 행성의 자전축까지 연산하여 탄환의 궤적을 100% 명중하도록 고정한다. 격발과 동시에 총신의 한계를 초월한 탄 공간을 압축하며 날아가므로, 어떤 거리와 장애물도 무의미하게 만드는 백발백중의 절대적 명사수이자 전장의 사신.',
  },
  war_god: {
    displayName: '투신 (鬪神)',
    group: 'Combat',
    combo: 'Pure',
    personalityDesc:
      '당신은 10개의 질문을 거치는 동안 복잡한 잔꾀나 교묘한 회피, 시스템적 계산을 전부 거부한 채 오직 정면돌파와 완벽한 정답만을 추구하는 \'압도적인 힘의 신봉자\'입니다. 당신에게 우회로나 타협은 부차적인 수단일 뿐, 본질은 그 어떤 가로막는 장벽과 난제도 내 손으로 직접 부수고 전진하겠다는 압도적인 패기와 기백을 품고 있습니다. 타합을 모르는 뚝심과 낯선 세계를 내 발밑에 무릎 꿇리겠다는 거대한 지배욕, 그리고 어떤 위험 앞에서도 눈 하나 깜짝하지 않고 정면으로 맞서 싸우는 대담함. 오직 정면 승부만을 갈망하며 존재 자체만으로도 주변의 공기를 물리적인 위압감으로 짓누르는 당신의 파괴적인 영혼은, 운명을 개척하는 무력의 현현이자 \'투신\'이라 불리는 존재의 자리에 오르기에 한 치의 부족함도 없습니다.',
    abilityDesc:
      '오직 \'섬멸\'과 \'승리\'만을 위해 태어난 파괴의 클래스. 전장에 서는 것만으로도 압도적인 위압감이 물리적인 중력이 되어 주변 수백 미터의 땅을 침하시키고 적들의 숨통을 조여온다. 상처를 입지 않는 강철 같은 신체와 대륙을 쪼개는 완력을 지니고, 모든 것을 섬멸하는 무력의 현현화.',
  },
  splitter: {
    displayName: '스플리터 (Splitter)',
    group: 'Strategy',
    combo: 'Combat',
    personalityDesc:
      '당신은 문답 속에서 무모하게 감정에 휘둘려 행동하기보다, 무엇이 가장 이성적인 판단인지 침착하게 관찰하고 짚어내는 \'냉철한 통찰력\'을 보여주었습니다. 당신은 불필요한 힘의 낭비를 선호하지 않습니다. 힘을 믿고 치고 나가기보다는, 반드시 구조적 약점과 결함을 분석해 치밀한 계산을 기반으로 움직이는 이성주의자입니다. 난잡하게 얽힌 실타래 속에서 핵심이 되는 단 한 줄을 찾아 끊어내듯, 이세계가 던지는 복잡한 모순과 난제의 핵심을 정확히 찔러 무력화하는 예리함. 복잡한 혼돈 속에서도 가장 영리한 해결책을 그려내어 얽혀있는 문제의 고리 자체를 잘라버리는 당신의 정밀한 지략은, 절대적 절단을 집행하는 \'스플리터\'의 권능과 완벽히 맥이 닿아 있습니다.',
    abilityDesc:
      '대상의 방어력이나 신체 강도를 무시하고 존재하는 공간 자체를 분리하는 \'절대 절단\' 능력. 손가락으로 허공을 그으면 그 궤적을 따라 차원의 단면이 영구히 갈라진다. 이때 잘려 나간 신체 부위나 사물은 즉시 다른 차원으로 격리되어 소멸하기 때문에, 이 세계의 그 어떤 치유 마법이나 초재생 능력으로도 결코 수복할 수 없다.',
  },
  arbiter: {
    displayName: '아비터 (Arbiter)',
    group: 'Strategy',
    combo: 'Survival',
    personalityDesc:
      '당신은 질문을 마주하는 내내 리스크를 극도로 혐오하며, 자신이나 아군이 위험에 노출될 수 있는 불확실한 행동에는 애초에 발을 들이지 않는 \'치밀한 안전주의자\'의 면모를 증명했습니다. 당신의 생존은 운에 기대는 것이 아닙니다. 위험이 닥쳐와도 내 손바닥 위에 올려두고 통제할 수 있도록 판을 짜는 영리한 대처 능력을 소유하고 있습니다. 위험 요소가 아무리 강할지라도 내가 설계한 프레임 안으로 들어오는 순간 무력해지도록 주변의 환경과 조건을 먼저 장악하는 설계력. 직접 부딪혀 깨지기보다 규칙과 환경, 시스템의 흐름 자체를 내 편으로 개편해 안전을 당연한 결과로 만들어버리는 당신의 철두철미한 지성은, 차원의 규칙을 새로 쓰는 이질 구역의 지배자 \'아비터\'의 기질과 완벽하게 공명합니다.',
    abilityDesc:
      '특정 공간 좌표를 물리 법칙이 다른 \'이질 구역\'으로 선언하는 능력. 지정된 구역 안에서는 중력 방향이 바뀌고, 시간 흐름이 달라지며, 에너지 전달 방식 자체가 역전된다. 적의 칼은 허공을 가르고, 마법은 시전자에게 되돌아온다. 싸우지 않고 이기는 것이 아니다. 싸움이 시작되기 전에 이미 이 구역의 규칙을 내가 다시 쓴다.',
  },
  logistics: {
    displayName: '로지스틱스 (Logistics)',
    group: 'Strategy',
    combo: 'Modern',
    personalityDesc:
      '당신은 문답 속에서 가혹하고 날것의 이세계 환경에 직면했을 때, 무모하게 뛰어들거나 감정에 휘둘리기보다 무엇을 어디에, 어떤 순서로 배치해야 가장 효율적인지 본능적으로 계산하는 \'합리적인 시스템 사고력\'을 보여주었습니다. 당신은 불필요한 리스크를 철저히 거부하며, 주어진 자원의 가치를 극대화하여 가장 안전하고 확실한 답을 도출해 내는 효율적이고 냉철한 판단력을 지녔습니다. 낯선 혼돈 앞에서도 나침반을 보듯 냉정하게 상황의 흐름을 장악하고, 내가 서 있는 공간의 규칙과 자원을 재조립하여 나만의 체계적인 인프라를 구축하는 스마트함. 마법이나 완력 대신 \'최적의 효율성과 프로세스\'라는 현대적 공식으로 황무지 자체를 완벽하게 통제된 요새로 개편해 버리는 당신의 이성적인 사유 방식은, 문명의 시스템을 이세계에 재구축하는 절대적 설계자 \'로지스틱스\'의 아키텍처와 완벽히 일치합니다.',
    abilityDesc:
      '차원의 경계를 열어 현대 문명의 최첨단 자원을 무한히 꺼내 쓰는 \'전술 아카이브\' 능력. 특정 좌표에 현대식 전술 차량, 나노 구급 약품, 고화력 특수 장비 등 시대와 동떨어진 현대 물자를 즉시 소환하여 전장을 완벽한 요새로 재구축한다. 가혹한 이세계의 규칙을 현대 문명의 기술력(오버 테크놀로지)으로 전환하는 인간 요새.',
  },
  abyss: {
    displayName: '아비스 (Abyssus)',
    group: 'Strategy',
    combo: 'Pure',
    personalityDesc:
      '당신은 문답을 거치는 동안 물리적인 완력이나 단순한 과학 기술, 방어 체계의 구축을 전부 넘어서서 오직 사람의 심리와 본질적인 판의 흐름만을 장악려 하는 \'절대적인 지략가\'의 성향을 띠고 있습니다. 당신에게 단순한 육체적 충돌은 무의미합니다. 모든 상황의 수와 상대의 무의식을 수천 수만 갈래로 미리 들여다보고, 타인이 \'가장 완벽하다고 믿는 전략\'마저 내 손안에서 놀아나게 만듭니다. 직접 힘을 소모할 필요도 없이, 보이지 않는 배후에서 모든 관계의 인지 구조를 뒤틀어 스스로 자멸하는 경로를 찾아내게 만드는 판짜기의 극치. 주변이 승리를 확신하는 그 순간마저 당신이 짜놓은 거대한 덫 안이었음을 깨닫게 만드는 당신의 초월적인 지적 혜안은, 지성체들의 인지를 완벽히 조율하는 심연의 주권자 \'아비스\'의 좌에 앉기에 완벽한 자격을 갖추고 있습니다.',
    abilityDesc:
      '전장에 존재하는 모든 지성체의 인지 구조를 완벽히 장악하는 \'정신 장악\' 능력. 적들의 다음 수와 심리 상태를 수천 수만 갈래로 미리 들여다보고, 상대가 \'가장 완벽하다고 믿는 전략\'마저 도출이 가능하다. 판이 아무리 불리할지라도 적의 무의식을 뒤틀어 스스로 자멸하는 경로를 찾아내어 손가락 하나 까딱하지 않고 적의 전장을 박살내는 인지능력의 초월자.',
  },
  counter: {
    displayName: '반인체 (反刃體)',
    group: 'Survival',
    combo: 'Combat',
    personalityDesc:
      '당신은 문답 속에서 위기가 가로막았을 때, 무작정 성급하게 문제를 해결하기 급급하기보다 폭풍이 지나갈 때까지 묵묵히 버텨내고 타이밍을 재는 \'탁월한 인내심과 뚝심\'을 보여주었습니다. 당신의 회피는 두려움이 아닙니다. 자신에게 가해지는 리스크와 압박감을 고스란히 체내에 축적해 두었다가, 단 한 번의 결정적인 기회에 폭발적으로 되돌려주기 위한 영리한 준비 단계입니다. 남들이 충격에 쓰러질 때 고통을 인내하고 축적하여 반전의 기회를 노리고, 무작정 부딪히기보다 상대를 관찰하고 패턴을 읽는 치밀함. 그렇기에 당신의 반격은 늘 예상을 웃돌고 치명적입니다. 외부의 모든 위험과 위협을 나의 배터리로 삼아 상황의 완전한 역전을 설계하는 당신의 역발상적인 생존 본능은, 가해지는 에너지를 압축하여 되돌려주는 \'반인체\'의 각인을 일깨우기에 충분합니다.',
    abilityDesc:
      '외부에서 가해지는 모든 물리력과 에너지를 체내 배터리에 충전하는 능력. 적의 주먹, 마법, 폭발, 그 어떤 형태의 에너지도 소멸하지 않고 이 존재의 몸 안에 압축·저장된다. 임계점에 도달하는 순간 저장된 모든 에너지가 단 한 번의 방출로 터져나와 반경 수십 미터를 초토화시킨다. 맞는 것이 곧 충전이고, 충전이 끝나는 순간이 곧 상대의 끝이다.',
  },
  regressus: {
    displayName: '레그레수스 (Regressus)',
    group: 'Survival',
    combo: 'Strategy',
    personalityDesc:
      '당신은 질문을 거치는 동안 어떤 절망적인 실패나 변수가 터지더라도 절대 페이스를 잃지 않고, 상황을 냉정하게 복기하여 되돌릴 방법을 찾아내는 \'완벽주의적 생존가\'의 면모를 보여주었습니다. 당신은 이미 벌어진 피해에 연연하며 좌절하지 않습니다. 오히려 리스크의 원인을 철저하게 분석하여, 판 자체를 내게 가장 유리했던 시점으로 리셋하려는 대담한 지략을 지녔습니다. 최악의 파멸이 들이닥쳐 모든 것이 무너져가는 순간마저 \'어떻게 복구할 것인가\'를 본능적으로 계산하고 실행에 옮기는 철두철미함. 단순한 버티기를 넘어 시간의 축을 비틀어 실패라는 인과율마저 뒤엎어버리는 당신의 치밀한 방어 성향은, 상황을 완벽한 원점으로 되돌리는 고고한 시공의 지배자 \'레그레수스\'의 권능과 소름 돋도록 일치합니다.',
    abilityDesc:
      '생명이 다해가는 순간 신체 부위의 시간 축을 과거로 강제 롤백시키는 \'시공 좌표 역행\' 능력. 뼈가 부서지고 팔이 절단된 치명상은 물론, 이미 멎어버린 심장마저 부상당하기 이전의 완벽한 좌표로 복원해 낸다. 단순한 치유를 넘어 죽음이라는 절대적인 인과마저 전략적으로 되돌려 전황을 원점으로 되돌리는 시간 역행자이자 불사의 지배자.',
  },
  ironhide: {
    displayName: '아이언하이드 (Ironhide)',
    group: 'Survival',
    combo: 'Modern',
    personalityDesc:
      '당신은 문답 속에서 날것의 이세계 위험에 직면했을 때, 불확실한 운이나 임기응변에 의존하기보다 완벽한 매뉴얼과 체계를 갖춰 리스크를 사전에 차단하려는 \'철두철미한 시스템적 방어형\' 성향을 보여주었습니다. 당신은 무방비하게 보호받기를 원치 않습니다. 체계적인 하이테크 인프라와 논리적인 방어 기전을 둘러, 그 어떤 충격도 계산 범위 내에서 무력화시키는 것을 선호합니다. 상황의 변화를 실시간으로 스캔하며 문제를 즉시 봉합하고, 빈틈없는 전술적 방어벽으로 자신과 아군을 완벽히 보호하는 보호막을 형성합니다. 시스템의 정밀함을 생존의 방호벽으로 치환하여 걸어 다니는 요새를 완성하는 당신의 이성적인 사유 방식은, 보이지 않는 철벽의 레이어로 위험을 막아내는 \'아이언하이드\'의 아키텍처와 완벽하게 대칭을 이룹니다.',
    abilityDesc:
      '신체 표면에 미세한 나노 입자를 상시 대기시키는 \'하이테크 전술 외골격\' 능력. 타격을 입는 순간 보이지 않던 노란빛의 전술 홀로그램 레이어가 스캔하듯 켜지며, 나노 섬유와 방탄 합금 장갑을 실시간으로 전개해 완벽한 방호벽을 형성한다. 치명상을 입더라도 장갑 내부의 나노 메디컬 시스템이 상처를 실시간으로 봉합하고 수복해 내는 미래형 과학 기술의 결정체이자 걸어 다니는 요새.',
  },
  survivor: {
    displayName: '서바이버 (Survivor)',
    group: 'Survival',
    combo: 'Pure',
    personalityDesc:
      '당신은 10개의 운명적인 질문을 통과하는 내내, 화려한 무력이나 교묘한 잔꾀, 기계적 연산을 전부 거부한 채 오직 \'끝까지 살아남겠다\'는 하나의 본질에만 모든 몰입을 쏟아부은 신중함과 적응력의 끝판왕입니다. 당신에게 갈등이나 경쟁은 부차적인 유희일 뿐, 어떤 가혹한 재난과 위기 속에서도 내 한 목숨만큼은 반드시 보존하겠다는 순수한 생의 의지가 극에 달해 있습니다. 무모한 충돌을 본능적으로 우회하고, 위험의 징후를 동물적으로 감지하여 가장 안전한 경로만을 택하는 비범한 생존 본능. 세계의 인과율마저 당신에게 위해를 가하지 못해 안달복달하다가 결국 탄환을 휘게 만들고 재앙을 우회시켜 버리는 당신의 기적 같은 기질은, 살아있는 것 자체가 권능이자 무결한 보존이 본질인 \'서바이버\'의 권한을 갖게 되는 유일무이한 자격을 증명합니다.',
    abilityDesc:
      '이 존재에게 향하는 모든 \'사망 인과\'가 물리적으로 굴절되는 능력. 저격수의 탄환이 0.1mm 빗나가고, 독이 든 음식이 입술 직전에 쏟아지며, 건물이 이 존재가 서 있던 자리만 남기고 무너진다. 예지나 반응이 아니다. 세계의 인과율 자체가 이 존재의 죽음을 허용하지 않는다. 살아있는 것이 능력이 아니라, 죽을 수 없는 것이 이 존재의 본질이다.',
  },
  mechanic: {
    displayName: '메카닉 아카이브 (Mechanic Archive)',
    group: 'Modern',
    combo: 'Combat',
    personalityDesc:
      '당신은 문답 속에서 위기를 돌파할 때, 맨몸으로 부딪히는 무모한 아날로그 방식 대신 철저하게 통제된 자원과 기술력을 활용해 상대를 압도하려는 \'하이테크 사령관\'으로서의 성향을 보여주었습니다. 당신은 개인의 감정 소모나 리스크를 극도로 원치 않으며, 완벽하게 계산된 행동을 토대로 문제를 해결하는 방식을 선호합니다. 내 손에 직접 피를 묻히지 않고도 자율 드론과 기계 병기 시스템을 사출하여 상황을 완벽하게 통제하고, 알고리즘에 따른 정밀한 대처로 눈앞의 모든 난제를 흔적도 없이 증발시키는 차가운 판단력. 전면에 나서지 않아도 전장 자체를 원격으로 설계하며, 기계 시스템의 정밀함을 압도적인 해결력으로 치환하여 판을 청소하는 당신의 스마트한 성향은, 자율 군단의 절대적 지휘권을 쥔 \'메카닉 아카이브\'의 권능과 완벽히 맥이 닿아 있습니다.',
    abilityDesc:
      '포탈을 개방하면 현대 문명의 최첨단 자율 병기들을 전장에 소환하는 \'메카닉 군단 사령관\'. 수천 수만 대의 마이크로 추적 드론과 고화력 자폭 로봇 군단을 사출하여 본인의 군단으로 만든다. 인공지능 시스템의 통제하에 일시에 과부하된 기계 군단이 거대한 폭발을 일으키며 연쇄 폭발을 감행하며, 가로막는 모든 적과 진형을 흔적도 없이 증발시키는 기계 군단의 절대적 사령관.',
  },
  commander: {
    displayName: '커맨더 (Commander)',
    group: 'Modern',
    combo: 'Strategy',
    personalityDesc:
      '당신은 문답을 거치는 동안 미지의 세계가 던지는 수많은 변수와 유혹 앞에서, 섣부른 감정적 몰입이나 막연한 낙관론을 완벽하게 배제하는 \'극단적인 리스크 통제 기질\'을 보여주었습니다. 당신은 보이지 않는 위험 요소가 잔존하는 상황에서 운이나 직감에 기댈 바에는, 철저하게 기대 손실을 계산하고 우회하는 것이 가장 영리한 대처임을 본능적으로 이해하고 있습니다. 타인의 심리를 복잡하게 조종하는 교묘한 지략 싸움을 벌이는 것이 아닙니다. 당신은 혼돈으로 가득 찬 이세계의 모든 상황을 오직 냉정하게 수치화하고 최적화하려는 \'슈퍼컴퓨터의 연산\'에 가깝습니다. 그 어떤 돌발적인 위기 앞에서도 감정을 지워낸 채 오직 알고리즘과 생존 확률의 관점으로만 냉철하게 최선의 공식을 도출해 내는 당신의 이성적인 사유 방식은, 무결한 승리 공식을 뇌에 이식한 절대적 연산 장치 \'커맨더\'의 칩셋과 소름 돋도록 일치합니다.',
    abilityDesc:
      '현대의 슈퍼컴퓨터 연산 능력을 뇌에 이식한 \'절대 확률 계산\' 능력. 0.0001초 안에 전장의 모든 변수를 수집·분석해 승리 확률이 가장 높은 행동을 본능적으로 도출한다. 적의 다음 행동을 수식으로 예측하고, 자신의 모든 움직임이 최적의 알고리즘으로 자동 보정되어 실행된다. 체스판 위의 말이 아닌, 체스판의 규칙 자체를 설계하는 연산자.',
  },
  guardian: {
    displayName: '가디언 프로토콜 (Guardian Protocol)',
    group: 'Modern',
    combo: 'Survival',
    personalityDesc:
      '당신은 문답 속에서 날것의 위험에 직면했을 때, 나 혼자 독단적으로 살아남기보다 시스템 전체의 밸런스를 유지하여 모두를 구원하려는 \'헌신적이고 스마트한 관리자\' 성향을 보여주었습니다. 살아남는 가장 효율적인 방법이 혼자가 아닌 함께일 때 더 높아진다는 것을 당신은 본능적으로 직감하고 있습니다. 당신이 생각하는 가장 강력한 무기는 파괴가 아닌 \'수호와 치료\'이며, 공동체 전체를 실시간 네트워크로 묶어 리스크를 분산시키는 체계적인 방어를 선호합니다. 범위 내 모든 생체의 위험 신호를 나노 단위로 스캔하고, 치명적인 위기가 감지되는 순간 즉각 개입하여 구성원 전체의 파멸을 방지하는 철두철미한 관제 능력. 시스템 기술이 도달할 수 있는 가장 고결한 형태의 인프라로 불멸의 팀을 완성하는 당신의 따뜻하면서도 이성적인 사유 방식은, 동료를 혼자 쓰러뜨리지 않는 \'가디언 프로토콜\'의 네트워크와 완벽하게 대칭을 이룹니다.',
    abilityDesc:
      '전장 전체를 하나의 실시간 의료 네트워크로 연결하는 \'생체 데이터 관제\' 능력. 범위 내 모든 아군의 심박수·혈압·부상 부위를 나노 단위로 스캔하고, 치명상이 감지되는 순간 나노 약품을 혈관으로 직접 주입해 전장에서 즉사를 방지한다. 혼자서는 약하지만, 이 존재가 있는 한 팀 전원이 절대 혼자 쓰러지지 않는다. 현대 의학이 만든 가장 강력한 무기는 치료 그 자체였다.',
  },
  puppet: {
    displayName: '퍼핏 (Puppet)',
    group: 'Modern',
    combo: 'Pure',
    personalityDesc:
      '당신은 10개의 운명적인 질문을 관통하는 동안 이세계 특유의 신비주의나 마법, 검술의 낭만을 전부 거부한 채 모든 현상을 오직 \'시스템의 규칙과 데이터\'로만 해석하려 한 효율성의 극치이자 절대적인 이성주의자입니다. 당신에게 이세계의 초월적인 권능들은 경외의 대상이 아닙니다. 그저 백스테이지에서 패킷을 가로채고 소스코드를 뜯어 수정할 수 있는 프로그램 버그에 불과합니다. 규칙 및 인과가 소용돌이치는 미지의 차원 한복판에서 홀로 시스템의 허점을 해킹하고, 상황의 코드를 덮어써 내 것으로 복사해 버리는 초차원적인 사고방식. 세상이 정해둔 절대적 룰을 비웃으며 마스터 키보드 하나로 세계의 마스터 권한을 찬탈해 버리는 당신의 비범한 천재성은, 이세계 최초이자 유일무이한 시스템 크래커 \'퍼핏\'의 좌에 앉을 유일한 자격을 증명합니다.',
    abilityDesc:
      '이세계의 모든 이능력을 \'시스템 코드\'로 인식하고 침투하는 \'이능력 해킹\' 능력. 번개를 쓰는 자의 능력을 패킷처럼 가로채고, 공간을 가르는 자의 능력 코드를 덮어써서 내 것으로 복사한다. 이세계의 모든 초월적 권능은 이 존재 앞에서 단순한 프로그램 코드에 불과하다. 칼과 마법의 세계에서 홀로 키보드를 두드리며 세상의 모든 규칙을 관리자 권한으로 수정하는 이세계 최초의 해커.',
  },
  pirouette: {
    displayName: '피루엣 (Pirouette)',
    group: 'Hidden',
    combo: 'Combat_Strategy',
    personalityDesc:
      '파괴적인 실행력(Combat)과 치밀한 지략(Strategy)의 완벽한 동률. 전체 플레이어 중 오직 극소수만이 도달하는 이 기적적인 황금 비율 앞에서, 세계의 인과율은 일시적인 연산 오류를 일으키며 당신을 잔혹한 인형사 \'피루엣\'의 히든 각인으로 재정의했습니다. 당신은 파괴를 계획하는 동시에 실행하며, 파멸이 일어나는 그 짧은 찰나에도 이미 다음 수의 결말을 완성해 두는 잔인한 천재입니다. 무모한 난타전에 얽히지 않은 채 보이지 않는 백스테이지에서 실을 쥐고, 세계의 관계 구조와 타인의 심리를 찬탈해 손가락 하나로 조종하는 절대적인 지배력. 그 누구도 감지하지 못하는 차가운 인형극의 무대를 완성하고 마주하는 모든 재앙을 걸어 다니는 체스말로 부려 먹는 당신의 초차원적인 영리함은, 이 세계관에서 오직 단 한 명에게만 허락된 절대적 주권자의 증거입니다.',
    abilityDesc:
      '인간을 초월한 상위 존재의 능력을 손에 넣었다. 범위 내 모든 적의 신경계를 지배해 신체 제어권을 찬탈하는 \'절대 인형극\' 능력. 상대의 뇌를 강제로 강탈해 내 손가락 하나로 조종하며, 인장이 새겨진 적의 육체를 언제든 \'걸어 다니는 인간 지뢰\'로 매개화한다. 이 클래스는 세계에서 유일하게 단 한 명에게만 허락되며, 그 누구도 눈치채지 못하는 보이지 않는 인간의 지배자.',
  },
  mansang: {
    displayName: '만상 (萬象)',
    group: 'Hidden',
    combo: 'Combat_Survival',
    personalityDesc:
      '보통 사람은 위기 앞에서 싸우거나 도망칩니다. 하지만 당신은 질문을 통과하는 내내 두 가지를 동시에 선택했습니다. 이것은 우유부단함이 아닙니다. 파괴와 보존이라는 우주의 두 원리가 당신 안에서 전쟁 없이 공존하고 있다는 증거입니다. 삶을 갈망하는 생의 의지와, 모든 것을 파괴하는 사멸의 의지가 영혼의 천칭 위에서 완벽한 수평을 이루고 있는 상태입니다. 세계는 이 두 극단의 권능이 하나로 묶인 당신을 필멸자가 아닌 \'반신의 격\'으로 판정했습니다. 자신을 향해 몰려드는 세상의 적의와 혼돈의 인과율을 손짓 하나로 무력화시키고, 오직 단 한 걸음의 움직임만으로 온 세상의 생사여탈권을 쥐고 흔들며 세상의 균형을 지배한다. 해당 존재는 필멸의 존재가 대적할 수 없는 압도적인 무력의 정점이자, 세계의 유일한 인과율의 집행자.',
    abilityDesc:
      '삶과 죽음의 경계를 초월한 반신의 신격을 손에 넣었다. 우주를 구성하는 파괴와 보존의 규칙을 완벽하게 장악한 \'만상통제(萬象統制)\'의 권능. 자신을 향한 모든 적의(敵意)를 무(無)로 돌리고, 단 한 걸음의 움직임만으로 세상의 생사여탈권을 쥐고 흔들며 세상의 균형을 지배한다. 해당 존재는 필멸의 존재가 대적할 수 없는 압도적인 무력의 정점이자, 세계의 유일한 인과율의 집행자.',
  },
  demeter: {
    displayName: '데메테르 (Demeter)',
    group: 'Hidden',
    combo: 'Strategy_Survival',
    personalityDesc:
      '당신은 문답 속에서 가혹한 전황을 통제하는 \'거시적인 안목의 전략\'을 구상하면서도, 그 목적의 종착지를 파괴가 아닌 \'주변 모두를 살려내는 풍요와 번영\'에 두었습니다. 냉철한 이성으로 판을 짜되, 그 품에는 만인을 품을 수 있는 고결한 자비로움을 품은 지도자 성향입니다. 이 영리한 수호의 의지가 완벽한 대칭을 이룰 때, 개인의 무력을 아득히 초월하여 세상을 구원하는 신성이 깨어납니다. 존재 자체에서 뿜어지는 압도적인 카리스마와 생명력으로 주변을 매료시켜 스스로 따르게 만들고, 대지의 영성을 이끌어 사람들에게 무한한 생명과 지혜를 내리는 구원자. 세상을 단숨에 풍요롭게 번영시킬 수도, 혹은 한순간에 굶주려 시들게 만들 수도 있는 권능을 쥔 당신의 숭고한 정신은, 온 세상의 영성을 이끄는 고고한 생명의 여신 \'데메테르\'의 환생과 다름없습니다.',
    abilityDesc:
      '대지와 풍요의 근원을 장악하는 온 세상의 영성(靈性)을 이끄는 반신의 신격을 손에 넣었다. 존재 자체에서 뿜어지는 압도적인 카리스마로 만인을 매료시키는 \'신의(神意)\' 능력. 그의 카리스마에 매료된 수많은 추종자와 영웅들이 자발적으로 몰려들어 경배하며, 자기를 따르는 신도들에게는 한계가 없는 무한한 생명력과 신선한 지혜를 내리게 된다. 세상을 풍요롭게도, 혹은 단숨에 굶주려 시들게도 만들 수 있는 권능을 쥔, 세계의 유일한 고고한 생명의 여신.',
  },
  aether: {
    displayName: '에테르 (Aether)',
    group: 'Hidden',
    combo: 'Absolute_Zero',
    personalityDesc:
      '당신은 10개의 운명적인 문답을 관통하는 동안, 전투·전략·생존·현대라는 그 어떤 성향과 규칙으로도 온전히 가둘 수 없는 \'완벽한 예외이자 무결한 존재\'임을 증명했습니다. 당신은 어떤 상황에서도 단 하나의 방식만이 답이라고 고집하지 않았습니다. 이것은 우유부단함이 아니라, 모든 가능성을 동시에 열어두는 초월적 유연성입니다. 세계의 규칙은 성향을 강제하지만, 당신은 그 강제를 거부했습니다. 모든 잠재력이 완벽하게 균등 분배되었거나, 이 세계의 시스템이 설계해 둔 알고리즘의 한계를 아득히 초월해 버렸기에 고대 여신의 석상마저 당신의 본질을 감히 정의하지 못한 채 경배를 올렸습니다. 세계관이 정해둔 모든 인과와 법칙에 얽매이지 않고, 내 손끝에서 세상에 존재하지 않는 모든 초월적인 권능을 무(無)에서 창조하고 소멸시키는 절대적인 주권자. 이 가혹한 차원에 발을 들인 유일무이한 이방인이자, 세계의 규칙을 조율하고 다스리는 위대한 창조주의 영혼을 지닌 당신은, 이세계의 시작과 끝을 관장하는 존재하지 않는 0번째 신 \'에테르\' 그 자체입니다.',
    abilityDesc:
      '이세계의 규칙과 한계를 완벽히 초월하여, 세상에 존재하지 않는 모든 권능을 창조하는 이능 부여의 신격에 권능을 이어받았다. 세계관의 그 어떤 법칙과 시스템으로도 얽맬 수 없는 절대적 이방인이자 고유의 존재이며, 내 손끝에서 탄생한 초월적인 이능력들은 당신의 손에서 태어나고 소멸하는 주권자이다. 여신의 석상이 당신을 유일무이한 부여의 신으로 선정하였으며, 이 이세계는 당신의 조율자로서 관리를 하게 되는 세계의 유일무이한 창조주이자 0번째 신.',
  },
}

const JOB_REGISTRY = [
  { key: 'Combat_Strategy', detailKey: 'lightning', number: 1, badge: '전투 각인' },
  { key: 'Combat_Survival', detailKey: 'extinction', number: 2, badge: '전투 각인' },
  { key: 'Combat_Modern', detailKey: 'tactical', number: 3, badge: '전투 각인' },
  { key: 'Combat_Solo', detailKey: 'war_god', number: 4, badge: '전투 각인' },
  { key: 'Strategy_Combat', detailKey: 'splitter', number: 5, badge: '술식 각인' },
  { key: 'Strategy_Survival', detailKey: 'arbiter', number: 6, badge: '술식 각인' },
  { key: 'Strategy_Modern', detailKey: 'logistics', number: 7, badge: '술식 각인' },
  { key: 'Strategy_Solo', detailKey: 'abyss', number: 8, badge: '술식 각인' },
  { key: 'Survival_Combat', detailKey: 'counter', number: 9, badge: '생존 각인' },
  { key: 'Survival_Strategy', detailKey: 'regressus', number: 10, badge: '생존 각인' },
  { key: 'Survival_Modern', detailKey: 'ironhide', number: 11, badge: '생존 각인' },
  { key: 'Survival_Solo', detailKey: 'survivor', number: 12, badge: '생존 각인' },
  { key: 'Modern_Combat', detailKey: 'mechanic', number: 13, badge: '현대 각인' },
  { key: 'Modern_Strategy', detailKey: 'commander', number: 14, badge: '현대 각인' },
  { key: 'Modern_Survival', detailKey: 'guardian', number: 15, badge: '현대 각인' },
  { key: 'Modern_Solo', detailKey: 'puppet', number: 16, badge: '현대 각인' },
  { key: 'Equal_Combat_Strategy', detailKey: 'pirouette', number: 17, badge: '히든 클래스' },
  { key: 'Equal_Combat_Survival', detailKey: 'mansang', number: 18, badge: '반신 강림' },
  { key: 'Equal_Strategy_Survival', detailKey: 'demeter', number: 19, badge: '신격 강림' },
  { key: 'ERROR', detailKey: 'aether', number: 20, badge: '0번째 신' },
]

function normalizeDesc(text) {
  return String(text).replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim()
}

function parseDisplayName(full) {
  const match = full.match(/^(.+?)\s*\((.+)\)\s*$/)
  if (match) return { displayName: match[1].trim(), subName: match[2].trim() }
  return { displayName: full, subName: '' }
}

function formatCombo(group, combo) {
  if (combo === 'Pure') return `${group}+`
  if (combo === 'Combat_Strategy' || combo === 'Combat_Survival' || combo === 'Strategy_Survival') return '???'
  if (combo === 'Absolute_Zero') return '*규격외*'
  return `${group} + ${combo}`
}

export const ABILITY_RESULTS = Object.fromEntries(
  JOB_REGISTRY.map(({ key, detailKey, number, badge }) => {
    const detail = JOB_DETAILS[detailKey]
    const { displayName, subName } = parseDisplayName(detail.displayName)
    return [
      key,
      {
        number,
        detailKey,
        displayName,
        subName,
        group: detail.group,
        badge,
        combo: formatCombo(detail.group, detail.combo),
        personalityDesc: normalizeDesc(detail.personalityDesc),
        abilityDesc: normalizeDesc(detail.abilityDesc),
        desc: normalizeDesc(detail.abilityDesc),
        image: getJobImageSrc(detailKey),
      },
    ]
  })
)

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

function readOptionValue(raw) {
  if (raw == null) return null
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    return trimmed === '' ? null : trimmed
  }
  if (typeof raw === 'number' || typeof raw === 'boolean') {
    return String(raw)
  }
  if (typeof raw === 'object') {
    const text = raw.text ?? raw.label ?? raw.option ?? raw.value ?? raw.title
    if (text == null) return null
    const trimmed = String(text).trim()
    return trimmed === '' ? null : trimmed
  }
  return null
}

export function normalizeQuizRow(row) {
  if (!row || typeof row !== 'object') return row

  const normalized = { ...row }
  const questionNumber = Number(
    row.question_number ?? row.number ?? row.id ?? row.quiz_number ?? 0
  )

  normalized.question_number = Number.isFinite(questionNumber)
    ? questionNumber
    : 0
  normalized.question =
    row.question ?? row.question_text ?? row.text ?? row.title ?? ''

  if (Array.isArray(row.options)) {
    row.options.forEach((option, index) => {
      const value = readOptionValue(option)
      if (value) normalized[`option${index + 1}`] = value
    })
  }

  if (row.choices && typeof row.choices === 'object' && !Array.isArray(row.choices)) {
    ;[1, 2, 3, 4].forEach((num) => {
      const value = readOptionValue(
        row.choices[num] ?? row.choices[String(num)]
      )
      if (value) normalized[`option${num}`] = value
    })
  }

  ;[1, 2, 3, 4].forEach((num) => {
    const keys = [
      `option${num}`,
      `option_${num}`,
      `choice${num}`,
      `choice_${num}`,
      `answer${num}`,
      `answer_${num}`,
      `opt${num}`,
      `opt_${num}`,
    ]

    for (const key of keys) {
      const value = readOptionValue(row[key])
      if (value) {
        normalized[`option${num}`] = value
        break
      }
    }
  })

  return normalized
}

export function normalizeQuizList(list) {
  return [...list]
    .map(normalizeQuizRow)
    .sort((a, b) => a.question_number - b.question_number)
}

export function getQuizOption(quiz, num) {
  if (!quiz) return `선택지 ${num}`

  const keys = [
    `option${num}`,
    `option_${num}`,
    `choice${num}`,
    `choice_${num}`,
    `answer${num}`,
    `answer_${num}`,
    `opt${num}`,
    `opt_${num}`,
  ]

  for (const key of keys) {
    const value = readOptionValue(quiz[key])
    if (value) return value
  }

  if (Array.isArray(quiz.options)) {
    const value = readOptionValue(quiz.options[num - 1])
    if (value) return value
  }

  if (quiz.choices && typeof quiz.choices === 'object') {
    const value = readOptionValue(
      quiz.choices[num] ?? quiz.choices[String(num)]
    )
    if (value) return value
  }

  return `선택지 ${num}`
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

const JOB_TITLE_CLASSES = {
  Combat_Strategy: 'title-combat-1',
  Combat_Survival: 'title-combat-2',
  Combat_Modern: 'title-combat-3',
  Combat_Solo: 'title-combat-4',
  Strategy_Combat: 'title-strategy-5',
  Strategy_Survival: 'title-strategy-6',
  Strategy_Modern: 'title-strategy-7',
  Strategy_Solo: 'title-strategy-8',
  Survival_Combat: 'title-survival-9',
  Survival_Strategy: 'title-survival-10',
  Survival_Modern: 'title-survival-11',
  Survival_Solo: 'title-survival-12',
  Modern_Combat: 'title-modern-13',
  Modern_Strategy: 'title-modern-14',
  Modern_Survival: 'title-modern-15',
  Modern_Solo: 'title-modern-16',
  Equal_Combat_Strategy: 'title-hidden-17',
  Equal_Combat_Survival: 'title-hidden-18',
  Equal_Strategy_Survival: 'title-hidden-19',
  ERROR: 'title-hidden-20',
}

export function getJobTitleClass(jobKey) {
  return JOB_TITLE_CLASSES[jobKey] ?? 'title-combat-1'
}

export function translateCategory(engText) {
  if (!engText) return ''

  let cleanText = engText
  if (engText.includes('|')) {
    cleanText = engText.split('|')[1].trim()
  }

  return cleanText
    .replace(/Combat/gi, '⚔️ 전투')
    .replace(/Strategy/gi, '🌀 전략')
    .replace(/Survival/gi, '🛡️ 생존')
    .replace(/Modern/gi, '🌍 현대')
    .replace(/\+/g, '    ')
}
