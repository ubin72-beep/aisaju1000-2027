import Link from "next/link";
import { ArrowRight, Sparkles, Compass, MoonStar, Gem, ShieldCheck, MessageCircle, Wallet, ChevronRight } from "lucide-react";

const services = [
  { icon: Compass, title: "나의 사주 분석", desc: "개인 사주 계산은 검증을 거쳐 제공할 예정입니다.", tag: "처음 이용하는 분" },
  { icon: MessageCircle, title: "AI 명리 상담", desc: "궁금한 순간, 명리학의 개념으로 이어가는 대화.", tag: "대화형 상담" },
  { icon: MoonStar, title: "2027 신년운세", desc: "2027 신년운세 분석 기능을 준비하고 있습니다.", tag: "2027 특별 분석" },
  { icon: Gem, title: "궁합·관계 분석", desc: "관계 분석 기능을 준비하고 있습니다.", tag: "관계와 소통" }
];
export default function Home() {
  return <main>
    <header className="nav">
      <Link href="/" className="brand"><span className="brand-mark">天</span><span>AI 사주 <b>천년지기</b><small>CHEONNYEON JIGI</small></span></Link>
      <nav><a href="#services">서비스</a><a href="#points">포인트 안내</a><a href="#about">천년지기 소개</a></nav>
      <div className="nav-actions"><Link className="login" href="/login">로그인</Link><Link className="button button-small" href="/signup">무료로 시작하기 <ArrowRight size={15}/></Link></div>
    </header>

    <section className="hero hero-premium">
      <div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
      <div className="hero-art" aria-hidden="true"><div className="sun-glow"/><div className="planet"/><div className="moon"/><div className="star s1">✦</div><div className="star s2">✧</div><div className="star s3">✦</div></div>
      <div className="hero-copy">
        <div className="hero-pill"><Sparkles size={13}/> AI 사주 천년지기 · 2027</div>
        <p className="year">천년의 지혜를 오늘의 질문으로</p>
        <h1>지금 이 순간,<br/><em>당신이 가장 궁금한 것</em>을<br/>물어보세요.</h1>
        <p className="hero-desc">관계, 일, 재물, 나의 성향까지.<br/>오래된 명리의 언어로 오늘의 고민을 함께 살펴봅니다.</p>
        <form className="hero-question" action="/consult" method="get">
          <label htmlFor="hero-question-input" className="sr-only">AI 상담 질문</label>
          <input id="hero-question-input" name="q" maxLength={1000} placeholder="예: 새로운 일을 시작할 때 무엇을 살펴봐야 할까요?" required/>
          <button type="submit"><MessageCircle size={17}/> 지금 상담</button>
        </form>
        <div className="hero-chips">
          {[
            ['♡ 연애·관계','명리학에서는 연애와 관계를 어떻게 바라보나요?'],
            ['✧ 직업·적성','명리학에서 적성과 직업은 어떻게 해석하나요?'],
            ['◈ 재물·생활','재물운의 명리학적 의미를 알려주세요.'],
            ['☾ 오행·성격','오행과 성격의 관계를 쉽게 설명해 주세요.']
          ].map(([label,question])=><Link key={label} href={'/consult?q='+encodeURIComponent(question)}>{label}</Link>)}
        </div>
        <p className="hero-honesty"><ShieldCheck size={14}/> 현재 무료 베타 · 개인 명식 계산 준비 중 · 실제 결제 없음</p>
      </div>
      <div className="hero-bottom"><span>CHEONNYEON JIGI · AI CONSULTATION</span><span>DISCOVER YOUR OWN STORY</span></div>
    </section>

    <section className="quick-consult section" aria-labelledby="quick-consult-title">
      <div className="section-kicker">START WITH YOUR QUESTION</div>
      <h2 id="quick-consult-title">지금 가장 궁금한 것은 무엇인가요?</h2>
      <p className="muted">주제를 선택하면 상담실에 질문이 미리 입력됩니다. 현재는 무료 명리학 개념 상담 베타입니다.</p>
      <div className="quick-consult-grid">
        {[
          ['💕 연애·인간관계','명리학에서는 연애와 인간관계를 어떤 관점에서 이해하나요?'],
          ['💼 직업·적성','명리학에서 직업과 적성을 살펴볼 때 어떤 개념을 참고하나요?'],
          ['💰 재물·생활','명리학에서 재물운의 의미와 현실적인 재정 판단의 차이를 설명해 주세요.'],
          ['🌿 오행·성격','오행과 성격의 관계를 초보자도 이해하기 쉽게 설명해 주세요.']
        ].map(([title,question])=><Link className="quick-consult-link" key={title} href={'/consult?q='+encodeURIComponent(question)}>{title}<ArrowRight size={18}/></Link>)}
      </div>
      <Link className="text-link" href="/consult">직접 질문 작성하기 <ChevronRight size={16}/></Link>
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
      <div className="section-head"><div><div className="section-kicker">SIMPLE & TRANSPARENT</div><h2>필요한 만큼 충전하고,<br/><em>한 질문에 100포인트.</em></h2></div><p className="muted">1P = 1원 · 충전식 포인트 정책 확정<br/>현재는 무료 베타이며 실제 유료 결제는 준비 중입니다.</p></div>
      <div className="premium-price-grid">
        {[1000,3000,5000,10000].map(amount=><article className="premium-price-card" key={amount}><span>POINT TOP-UP</span><strong>{amount.toLocaleString('ko-KR')}<small> P</small></strong><p>{amount.toLocaleString('ko-KR')}원 · 상담 {amount/100}건 상당</p></article>)}
      </div>
      <div className="premium-price-foot"><span><ShieldCheck size={17}/> 상담 답변 1건당 100P 차감 예정</span><Link href="/mypage/topup">충전 상품 살펴보기 <ArrowRight size={16}/></Link></div>
    </section>

    <section className="closing"><Sparkles size={22}/><div className="section-kicker">BEGIN YOUR JOURNEY</div><h2>나를 알아가는 여정,<br/><em>천년지기와 함께.</em></h2><Link href="/signup" className="button">무료 회원가입 <ArrowRight size={16}/></Link></section>
    <footer><div className="brand"><span className="brand-mark">天</span><span>AI 사주 <b>천년지기</b><small>CHEONNYEON JIGI</small></span></div><p>본 서비스는 사주명리학을 바탕으로 자기 이해를 돕는 참고 정보를 제공합니다.</p><div className="footer-links"><Link href="/login">로그인</Link><Link href="/signup">회원가입</Link><a href="#about">서비스 소개</a><a href="#points">포인트 안내</a></div><small>© 2027 CHEONNYEON JIGI. ALL RIGHTS RESERVED.</small></footer>
  </main>;
}
