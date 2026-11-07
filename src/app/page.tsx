import Link from "next/link";
import { ArrowRight, Sparkles, Compass, MoonStar, Gem, ShieldCheck, MessageCircle, Wallet, ChevronRight } from "lucide-react";

const services = [
  { icon: Compass, title: "나의 사주 분석", desc: "타고난 기질과 오행의 균형을 깊이 있게 살펴봅니다.", tag: "처음 이용하는 분" },
  { icon: MessageCircle, title: "AI 명리 상담", desc: "궁금한 순간, 나의 사주를 바탕으로 이어지는 대화.", tag: "대화형 상담" },
  { icon: MoonStar, title: "2027 신년운세", desc: "정미년의 흐름과 월별 변화를 차분하게 읽어봅니다.", tag: "2027 특별 분석" },
  { icon: Gem, title: "궁합·관계 분석", desc: "서로 다른 기질을 이해하고 관계의 방향을 살펴봅니다.", tag: "관계와 소통" }
];
const prices = [
  ["오늘의 운세", "100P"], ["간단한 사주 질문", "200P"], ["성격·기질 분석", "300P"],
  ["재물·직업·애정운", "500P"], ["궁합 심층 분석", "800P"], ["대운·세운 분석", "1,000P"], ["종합 사주 분석", "1,500P"]
];
export default function Home() {
  return <main>
    <header className="nav">
      <Link href="/" className="brand"><span className="brand-mark">天</span><span>AI 사주 <b>천년지기</b><small>CHEONNYEON JIGI</small></span></Link>
      <nav><a href="#services">서비스</a><a href="#points">포인트 안내</a><a href="#about">천년지기 소개</a></nav>
      <div className="nav-actions"><Link className="login" href="/login">로그인</Link><Link className="button button-small" href="/signup">무료로 시작하기 <ArrowRight size={15}/></Link></div>
    </header>

    <section className="hero">
      <div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
      <div className="hero-copy">
        <div className="eyebrow"><span/> THE WISDOM OF EASTERN PHILOSOPHY</div>
        <p className="year">2027 · 丁未年</p>
        <h1>천년의 지혜,<br/><em>AI로 만나다.</em></h1>
        <p className="hero-desc">나의 타고난 기질을 이해하고, 삶의 흐름을 살펴보는 시간.<br/>정통 명리학의 지혜를 오늘의 AI 기술로 새롭게 경험하세요.</p>
        <div className="hero-cta"><Link href="/consult" className="button">무료 AI 상담 시작하기 <ArrowRight size={17}/></Link><a href="#services" className="text-link">서비스 둘러보기 <ChevronRight size={15}/></a></div>
        <div className="trust"><ShieldCheck size={16}/> 내 사주 정보와 상담 기록을 안전하게 관리하는 개인 맞춤 서비스</div>
      </div>
      <div className="hero-art" aria-label="천체와 달을 표현한 장식 그래픽">
        <div className="sun-glow"/><div className="planet"/><div className="moon"/><div className="star s1">✦</div><div className="star s2">✧</div><div className="star s3">✦</div>
        <div className="art-caption"><span>陰陽 · 五行 · 命理</span><b>나를 이해하는 새로운 시선</b></div>
      </div>
      <div className="hero-bottom"><span>01 / YOUR PERSONAL JOURNEY</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>

    <section className="intro section" id="about">
      <div className="section-kicker">A NEW WAY TO READ YOUR STORY</div>
      <h2>운명을 단정하기보다,<br/><em>나를 이해하는 지혜.</em></h2>
      <p>천년지기는 사주명리학을 삶을 돌아보는 하나의 언어로 바라봅니다.<br/>정확한 사주 데이터와 AI의 대화를 통해 나만의 질문을 깊이 있게 탐색합니다.</p>
    </section>

    <section className="section services" id="services">
      <div className="section-head"><div><div className="section-kicker">EXPLORE CHEONNYEON JIGI</div><h2>나를 위한 네 가지 여정</h2></div><span className="muted">YOUR STORY, YOUR PACE</span></div>
      <div className="service-grid">{services.map((s, i) => <article className="service-card" key={s.title}><div className="service-top"><span>0{i+1}</span><s.icon size={23}/></div><div className="service-tag">{s.tag}</div><h3>{s.title}</h3><p>{s.desc}</p><Link href="/signup">자세히 보기 <ArrowRight size={15}/></Link></article>)}</div>
    </section>

    <section className="consult-band">
      <div><div className="section-kicker">CONVERSATION WITH AI</div><h2>궁금한 것을 묻고,<br/><em>나만의 답을 찾아가세요.</em></h2><p>현재는 일반 명리학 개념을 쉽게 설명하는 무료 베타 상담입니다.<br/>질문 주제를 고르고 대화를 시작해 보세요. 개인 사주 계산은 준비 중입니다.</p><Link className="button" href="/consult">AI 상담 시작하기 <ArrowRight size={16}/></Link></div>
      <div className="chat-preview"><div className="chat-head"><span className="online"/> 천년지기 AI 상담 <small>예시 대화</small></div><div className="bubble ai">안녕하세요. 오늘은 어떤 이야기가 궁금하신가요?</div><div className="bubble user">올해 제 일과 재물의 흐름이 궁금해요.</div><div className="bubble ai">현재는 개인 사주 분석 전 단계예요. 재물운의 명리학적 의미부터 쉽게 알려드릴게요.</div><div className="chat-foot">현재 무료 베타 상담은 포인트가 차감되지 않습니다.</div></div>
    </section>

    <section className="section points" id="points">
      <div className="section-head"><div><div className="section-kicker">SIMPLE & TRANSPARENT</div><h2>필요한 만큼 충전하고,<br/><em>원하는 만큼 상담하세요.</em></h2></div><p className="muted">아래 요금은 서비스 준비를 위한 예시입니다.<br/>현재 실제 충전 및 유료 결제는 지원하지 않습니다.</p></div>
      <div className="point-layout"><div className="point-main"><span className="point-label">CHEONNYEON POINT</span><div className="point-big">10,000 <small>P</small></div><p>10,000원 충전 시 10,000P 지급</p><div className="point-rule"/><div className="point-note"><ShieldCheck size={17}/> 상담 요청 전 차감 포인트를 안내합니다.</div><Link className="button" href="/signup">서비스 준비 중 <ArrowRight size={16}/></Link></div>
      <div className="price-list"><h3>상담 유형별 포인트 안내 <span>예시 요금</span></h3>{prices.map(([name, price]) => <div className="price-row" key={name}><span>{name}</span><b>{price}</b></div>)}<p>* 최종 차감 가격은 서비스 오픈 전 확정됩니다.</p></div></div>
    </section>

    <section className="closing"><Sparkles size={22}/><div className="section-kicker">BEGIN YOUR JOURNEY</div><h2>나를 알아가는 여정,<br/><em>천년지기와 함께.</em></h2><Link href="/signup" className="button">무료 회원가입 <ArrowRight size={16}/></Link></section>
    <footer><div className="brand"><span className="brand-mark">天</span><span>AI 사주 <b>천년지기</b><small>CHEONNYEON JIGI</small></span></div><p>본 서비스는 사주명리학을 바탕으로 자기 이해를 돕는 참고 정보를 제공합니다.</p><div className="footer-links"><Link href="/login">로그인</Link><Link href="/signup">회원가입</Link><a href="#about">서비스 소개</a><a href="#points">포인트 안내</a></div><small>© 2027 CHEONNYEON JIGI. ALL RIGHTS RESERVED.</small></footer>
  </main>;
}
