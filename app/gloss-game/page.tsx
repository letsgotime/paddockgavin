"use client"
import { useEffect, useState } from "react"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

const AMAZON_URL = "https://www.amazon.com/Gloss-Game-Detailing-Discipline-Display/dp/B0FMPGNTPY"
const KINDLE_URL = "https://www.amazon.com/dp/B0FMPH9ZK1"
const ETSY_URL   = "https://www.etsy.com/shop/GoTimeMotorsports"

// Source design tokens — do not change
const sans  = "Archivo,'Helvetica Neue',Helvetica,Arial,sans-serif"
const mono  = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const serif = "Newsreader,Georgia,'Times New Roman',serif"
const bg    = "#0A1523"
const mid   = "#0E1A2A"
const bdr   = "#27384F"
const gold  = "#F8B800"
const teal  = "#00D2BE"
const body  = "#C4CBD6"
const light = "#DDE3EB"
const muted = "#B4B6B2"
const white = "#FFFFFF"
const panel = "#152538"
const clip  = "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)"
const clipLg= "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)"
const clip15= "polygon(0 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%)"

const TOC = [
  { n:"01", t:"The Saturday Ritual",            d:"Why the order matters more than the products." },
  { n:"02", t:"The Short List",                 d:"What belongs in the garage. Nothing else." },
  { n:"03", t:"The Wash System",                d:"Two buckets, one mitt, zero swirl marks from the wash." },
  { n:"04", t:"The Wheel Protocol",             d:"Rubber to barrel to face. Q-tip on the valve stems." },
  { n:"05", t:"Prep, Correct, Protect",         d:"How to tell what the paint needs before you spend anything." },
  { n:"06", t:"The Interior Loop",              d:"By touchpoint, not by scent. The way hands do it." },
  { n:"07", t:"Glass & Trim",                   d:"The panels most washes skip. They show." },
  { n:"08", t:"The Maintenance Pass",           d:"One hour. The gloss you built on Saturday is still there Friday." },
  { n:"09", t:"Engine Bay",                     d:"What to touch and what to leave alone." },
  { n:"10", t:"The Juice Box\u2122",            d:"Fifty-four products, eight zones. Every link checked." },
  { n:"11", t:"The Gloss Reset System\u2122",   d:"Seven days, one car. The workbook you run it from." },
  { n:"12", t:"The Next Car",                   d:"Buying with the finish in mind." },
]

function getNashville() {
  return new Intl.DateTimeFormat("en-US",{timeZone:"America/Chicago",hour:"numeric",minute:"2-digit",hour12:true}).format(new Date())
}
function getShift() {
  const h = Number(new Intl.DateTimeFormat("en-US",{timeZone:"America/Chicago",hour:"numeric",hour12:false}).format(new Date()))
  if (h>=6  && h<12) return "Morning shift"
  if (h>=12 && h<17) return "Afternoon shift"
  if (h>=17 && h<21) return "Evening shift"
  return "Night shift"
}

export default function GlossGamePage() {
  const [nashTime, setNashTime] = useState(getNashville)
  const [shift,    setShift]    = useState(getShift)
  const [barOn,    setBarOn]    = useState(false)
  const [jbEmail,  setJbEmail]  = useState("")
  const [jbMsg,    setJbMsg]    = useState("")
  const [jbOk,     setJbOk]     = useState(false)
  const [jbSending,setJbSending]= useState(false)

  // Nashville clock
  useEffect(()=>{
    const t = setInterval(()=>{ setNashTime(getNashville()); setShift(getShift()) }, 30000)
    return ()=>clearInterval(t)
  },[])

  // Sticky bar
  useEffect(()=>{
    const fn = ()=>setBarOn(window.scrollY>320)
    window.addEventListener("scroll",fn,{passive:true})
    return ()=>window.removeEventListener("scroll",fn)
  },[])

  // Scroll reveal — mirrors source [data-r] pattern
  useEffect(()=>{
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-r]"))
    if (!("IntersectionObserver" in window)){ els.forEach(e=>e.classList.add("on")); return }
    els.forEach(e=>{ if (!e.dataset.armed) e.setAttribute("data-armed","1") })
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("on"); obs.unobserve(en.target) }})
    },{rootMargin:"0px 0px -10% 0px",threshold:0.04})
    els.forEach(e=>obs.observe(e))
    return ()=>obs.disconnect()
  },[])

  async function submitJuicebox(e: React.FormEvent){
    e.preventDefault()
    if(jbSending||jbOk) return
    setJbSending(true); setJbMsg("")
    try {
      const fd = new FormData(e.target as HTMLFormElement)
      const res = await fetch("/api/juicebox",{method:"POST",body:fd})
      if(res.ok){ setJbOk(true); setJbMsg("Check your inbox — it should be there within a minute.") }
      else { setJbMsg("Something went wrong. Try again or DM @PaddockGavin.") }
    } catch { setJbMsg("Something went wrong. Try again or DM @PaddockGavin.") }
    finally { setJbSending(false) }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..600&display=swap');
        html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
        ::selection{background:#F8B800;color:#101010}
        @keyframes rIn{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
        @keyframes rInL{from{opacity:0;transform:translateX(-34px)}to{opacity:1;transform:none}}
        @keyframes rInR{from{opacity:0;transform:translateX(34px)}to{opacity:1;transform:none}}
        @keyframes rPop{from{opacity:0;transform:translateY(18px) scale(.955)}to{opacity:1;transform:none}}
        @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        [data-r][data-armed]:not(.on){opacity:0}
        [data-r].on{animation:rIn .8s cubic-bezier(.16,1,.3,1) both}
        [data-r="l"].on{animation-name:rInL}
        [data-r="r"].on{animation-name:rInR}
        [data-r="p"].on{animation-name:rPop}
        .floaty{animation:floaty 7s ease-in-out infinite}
        @media(prefers-reduced-motion:reduce){[data-r][data-armed]:not(.on){opacity:1}[data-r].on,.floaty{animation:none}html{scroll-behavior:auto}}
        input:focus{outline:0;border-color:#00D2BE!important;box-shadow:inset 0 0 0 1px rgba(0,210,190,.45)}
      `}</style>

      <SiteNav />

      {/* Telemetry strip */}
      <div style={{borderBottom:`1px solid ${bdr}`,background:mid}}>
        <div style={{maxWidth:1000,margin:"0 auto",padding:"13px clamp(20px,5vw,40px)",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
          <span style={{display:"inline-flex",alignItems:"center",gap:12,fontFamily:mono,fontSize:12.5,letterSpacing:".24em",textTransform:"uppercase",color:"#EDF1F6"}}>
            <i aria-hidden="true" style={{width:34,height:4,background:gold,flex:"0 0 auto"}} />
            {shift} &middot; {nashTime} Nashville
          </span>
          <i aria-hidden="true" style={{flex:"1 1 auto",height:1,background:bdr,minWidth:40}} />
          <span style={{fontFamily:mono,fontSize:12.5,letterSpacing:".24em",textTransform:"uppercase",color:muted}}>
            Book one &middot; The Gloss Game&#8482;
          </span>
        </div>
      </div>

      <main style={{minWidth:0,maxWidth:1000,margin:"0 auto",padding:"0 clamp(20px,5vw,40px)",background:bg,color:body,fontFamily:sans}}>

        {/* ── Hero ── */}
        <section style={{padding:"clamp(50px,7vw,78px) 0 clamp(44px,6vw,66px)",borderBottom:`1px solid ${bdr}`}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:"clamp(28px,5vw,60px)",alignItems:"center"}}>
            <div style={{flex:"1.2 1 min(480px,100%)",minWidth:"min(440px,100%)"}}>
              <p data-r="1" style={{margin:"0 0 18px",fontFamily:mono,fontSize:12,letterSpacing:".18em",textTransform:"uppercase",color:muted}}>The car detailing book &middot; by Gavin Brooks</p>
              <h1 data-r="1" style={{margin:"0 0 22px",fontFamily:sans,fontWeight:900,fontSize:"clamp(38px,6.6vw,68px)",lineHeight:1.04,letterSpacing:"-.02em",textTransform:"uppercase",color:white,maxWidth:"17ch"}}>
                You spent six figures<br /><span style={{color:gold}}>on the finish.</span>
              </h1>
              <p data-r="1" style={{margin:0,fontSize:"clamp(18px,2.2vw,21px)",lineHeight:1.6,color:light,maxWidth:"54ch"}}>
                Most detailers are guessing. The Gloss Game is the order that protects it &mdash; what to buy, what touches the paint, and in what sequence, so a finish worth protecting stays that way.
              </p>
              <div data-r="1" style={{display:"flex",flexWrap:"wrap",gap:"10px 28px",marginTop:30,padding:"20px 24px",background:panel,border:`1px solid ${bdr}`,borderLeft:`4px solid ${gold}`}}>
                {[["Paperback","$19.99"],["Inside","12 chapters · 96 pages"],["Edition","First · August 2025"],["Ships","Prime · in stock"]].map(([k,v])=>(
                  <div key={k} style={{fontFamily:mono,fontSize:12,letterSpacing:".1em",textTransform:"uppercase",color:muted}}>
                    {k}<b style={{display:"block",color:white,fontFamily:sans,fontSize:19,fontWeight:900,letterSpacing:"-.01em",marginTop:3}}>{v}</b>
                  </div>
                ))}
              </div>
              <div data-r="1" style={{display:"flex",flexWrap:"wrap",gap:14,alignItems:"center",marginTop:30}}>
                <a href={AMAZON_URL} target="_blank" rel="noopener" style={{display:"inline-flex",alignItems:"center",fontFamily:sans,fontWeight:800,fontSize:16,letterSpacing:".03em",textTransform:"uppercase",background:gold,color:"#101010",padding:"16px 28px",clipPath:clip,transition:"background .18s",textDecoration:"none"}}>Get the paperback &middot; $19.99</a>
                <a href={KINDLE_URL} target="_blank" rel="noopener" style={{display:"inline-flex",alignItems:"center",fontFamily:sans,fontWeight:800,fontSize:15,letterSpacing:".03em",textTransform:"uppercase",color:"#EDF1F6",border:"1px solid rgba(255,255,255,.3)",padding:"15px 26px",clipPath:clip,transition:"border-color .18s,color .18s",textDecoration:"none"}}>Kindle &middot; $9.99</a>
                <span style={{fontSize:14,color:muted}}>The back half is a workbook. It wants a pen.</span>
              </div>
            </div>
            <figure data-r="r" style={{margin:0,flex:"0 1 clamp(230px,26vw,320px)",minWidth:"min(230px,100%)",animationDelay:".15s"}}>
              <div className="floaty" style={{filter:"drop-shadow(0 34px 40px rgba(0,0,0,.55))"}}>
                <div style={{aspectRatio:"1025/1600",background:mid,border:"1px solid rgba(255,255,255,.14)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontFamily:mono,fontSize:11,letterSpacing:".18em",textTransform:"uppercase",color:muted}}>Cover</span>
                </div>
              </div>
              <figcaption style={{marginTop:12,textAlign:"center",fontFamily:mono,fontSize:11.5,letterSpacing:".17em",textTransform:"uppercase",color:muted}}>First edition &middot; August 2025</figcaption>
            </figure>
          </div>
        </section>

        {/* ── The reason ── */}
        <section style={{padding:"clamp(48px,7vw,80px) 0",borderBottom:`1px solid ${bdr}`}}>
          <div style={{maxWidth:760}}>
            <p data-r="1" style={{margin:"0 0 18px",fontFamily:mono,fontSize:12,letterSpacing:".18em",textTransform:"uppercase",color:muted}}>The reason you&rsquo;re on this page</p>
            <h2 data-r="1" style={{margin:"0 0 22px",fontFamily:sans,fontWeight:900,fontSize:"clamp(28px,4.4vw,42px)",lineHeight:1.04,letterSpacing:"-.02em",textTransform:"uppercase",color:white}}>
              The shelf is full.<br /><span style={{color:gold}}>The shine still fades.</span>
            </h2>
            <p data-r="1" style={{margin:"0 0 18px",fontSize:19,lineHeight:1.65,color:light}}>You know the moment. Sunday went to the whole car, and by Friday the hood looks like nobody was there. The swirls came back two washes after the correction. The bottle that promised depth left streaks you can read in the garage light.</p>
            <p data-r="1" style={{margin:"0 0 18px",fontSize:19,lineHeight:1.65,color:light}}>So you bought a better soap. Then a plusher towel. Then a coating. The line in the door caught the sun anyway.</p>
            <p data-r="1" style={{margin:0,fontSize:19,lineHeight:1.65,color:light}}>The products were never the problem. The order was &mdash; which bucket, which mitt, what touches the paint after the wheels. The Gloss Game is that order, written down so you can run it.</p>
          </div>
        </section>

        {/* ── What it teaches ── */}
        <section style={{padding:"clamp(48px,7vw,80px) 0",borderBottom:`1px solid ${bdr}`}}>
          <div style={{maxWidth:760}}>
            <p data-r="1" style={{margin:"0 0 18px",fontFamily:mono,fontSize:12,letterSpacing:".18em",textTransform:"uppercase",color:muted}}>What the book teaches</p>
            <h2 data-r="1" style={{margin:"0 0 26px",fontFamily:sans,fontWeight:900,fontSize:"clamp(28px,4.4vw,42px)",lineHeight:1.04,letterSpacing:"-.02em",textTransform:"uppercase",color:white}}>How to detail a car, in order</h2>
            <div data-r="1" style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:10,margin:"0 0 30px"}}>
              {["Rubber","Barrels","Faces"].map(s=>(
                <span key={s} style={{display:"inline-flex",alignItems:"center",gap:10}}>
                  <span style={{display:"inline-block",transform:"skewX(-12deg)",background:panel,border:`1px solid ${bdr}`,padding:"11px 18px"}}>
                    <b style={{display:"inline-block",transform:"skewX(12deg)",fontFamily:sans,fontWeight:900,fontSize:16,color:white,textTransform:"uppercase"}}>{s}</b>
                  </span>
                  <b style={{color:teal,fontFamily:mono,fontSize:17}}>&rarr;</b>
                </span>
              ))}
              <span style={{display:"inline-block",transform:"skewX(-12deg)",background:panel,border:`1px solid ${gold}`,padding:"11px 18px"}}>
                <b style={{display:"inline-block",transform:"skewX(12deg)",fontFamily:sans,fontWeight:900,fontSize:16,color:gold,textTransform:"uppercase"}}>Paint</b>
              </span>
            </div>
            {[
              ["Why do swirl marks come back after every wash?","Because the wash is where they start. Chapters two and three code the whole thing \u2014 buckets, mitts, towels by panel \u2014 so nothing dirty touches clean paint twice."],
              ["What order do you detail a car in?","Wheels first, paint last. Chapter four runs the wheel protocol to the Q-tip on the valve stems, and the loop above is the spine of the whole book."],
              ["Do you need a machine to get the gloss back?","Sometimes. Chapter five \u2014 prep, correct, protect \u2014 is how to tell, before you spend a weekend or a dime you didn\u2019t need to."],
              ["How do you detail a car interior?","By touchpoint, not by scent. Chapter six works the cabin the way hands do \u2014 vents, stitching, the places fingers land \u2014 so it stays clean between Saturdays."],
              ["How do you organize detailing supplies?","On hooks and shelves, bagged and labeled, one reach away \u2014 time saved looking is time on the paint. Chapter two is the setup."],
            ].map(([q,a])=>(
              <div data-r="1" key={q} style={{margin:"0 0 24px"}}>
                <h3 style={{margin:"0 0 8px",fontFamily:sans,fontWeight:800,fontSize:19,color:white}}>{q}</h3>
                <p style={{margin:0,fontSize:16.5,lineHeight:1.62,color:body}}>{a}</p>
              </div>
            ))}
            <p data-r="1" style={{margin:"clamp(20px,3vw,28px) 0 0",fontFamily:mono,fontSize:13,letterSpacing:".14em",textTransform:"uppercase"}}>
              <a href={AMAZON_URL} target="_blank" rel="noopener" style={{color:gold,borderBottom:`1px solid rgba(248,184,0,.45)`,paddingBottom:2,textDecoration:"none"}}>The whole order is $19.99 &rarr;</a>
            </p>
          </div>
        </section>

        {/* ── From the book ── */}
        <section style={{padding:"clamp(48px,7vw,80px) 0",borderBottom:`1px solid ${bdr}`}}>
          <div data-r="p" style={{position:"relative",overflow:"hidden",background:"#EDF1F6",clipPath:clipLg,padding:"clamp(30px,5vw,56px)"}}>
            <span aria-hidden="true" style={{position:"absolute",right:18,top:8,fontFamily:sans,fontWeight:900,fontSize:120,lineHeight:1,letterSpacing:"-.04em",color:"transparent",WebkitTextStroke:"2px rgba(14,26,42,.12)",pointerEvents:"none"}}>02</span>
            <p style={{margin:"0 0 22px",fontFamily:mono,fontSize:12,letterSpacing:".22em",textTransform:"uppercase",color:"#5B6673"}}>From the preface &middot; page 2 of 96</p>
            <blockquote style={{margin:0,fontFamily:serif,fontWeight:300,fontStyle:"italic",fontSize:"clamp(24px,3.8vw,42px)",lineHeight:1.22,letterSpacing:"-.014em",color:"#16202C",maxWidth:"24ch"}}>
              &ldquo;This isn&rsquo;t a tutorial. It&rsquo;s a transfer of ownership. From what I built&mdash;to what you can own.&rdquo;
            </blockquote>
            <p style={{margin:"18px 0 0",fontFamily:serif,fontStyle:"italic",fontSize:"clamp(17px,2.2vw,21px)",color:"#3D4A5C"}}>Not just how to shine. But how to move.</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:14,alignItems:"center",marginTop:"clamp(24px,3.6vw,34px)"}}>
              <a href={AMAZON_URL} target="_blank" rel="noopener" style={{display:"inline-flex",alignItems:"center",fontFamily:sans,fontWeight:800,fontSize:15,letterSpacing:".03em",textTransform:"uppercase",background:gold,color:"#101010",padding:"15px 26px",clipPath:clip,transition:"background .18s",textDecoration:"none"}}>Start the transfer &middot; $19.99</a>
              <span style={{fontFamily:mono,fontSize:12,letterSpacing:".14em",textTransform:"uppercase",color:"#5B6673"}}>94 pages follow</span>
            </div>
          </div>
        </section>

        {/* ── Inside the book / TOC ── */}
        <section style={{padding:"clamp(48px,7vw,80px) 0",borderBottom:`1px solid ${bdr}`}}>
          <p data-r="1" style={{margin:"0 0 18px",fontFamily:mono,fontSize:12,letterSpacing:".18em",textTransform:"uppercase",color:muted}}>Inside the book</p>
          <h2 data-r="1" style={{margin:"0 0 8px",fontFamily:sans,fontWeight:900,fontSize:"clamp(28px,4.4vw,42px)",lineHeight:1.04,letterSpacing:"-.02em",textTransform:"uppercase",color:white}}>Twelve chapters, one Saturday at a time</h2>
          <p data-r="1" style={{margin:"0 0 26px",fontSize:16.5,lineHeight:1.6,color:muted,maxWidth:"60ch"}}>The first half teaches the system. The second half is the workbook you run it from.</p>
          <div data-r="1" style={{columns:2,columnWidth:300,columnGap:"clamp(24px,4vw,54px)",borderTop:`2px solid ${bdr}`}}>
            {TOC.map(ch=>(
              <div key={ch.n} style={{breakInside:"avoid",display:"flex",gap:12,alignItems:"baseline",padding:"11px 2px",borderBottom:`1px solid rgba(255,255,255,.09)`}}>
                <span style={{fontFamily:mono,fontSize:12,color:teal,flex:"0 0 24px"}}>{ch.n}</span>
                <div style={{flex:"1 1 auto"}}>
                  <p style={{margin:0,fontFamily:sans,fontWeight:700,fontSize:15.5,color:"#EDF1F6"}}>{ch.t}</p>
                  <p style={{margin:"2px 0 0",fontFamily:serif,fontSize:14.5,lineHeight:1.45,color:muted}}>{ch.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Proof ── */}
        <section style={{padding:"clamp(48px,7vw,80px) 0",borderBottom:`1px solid ${bdr}`}}>
          <p data-r="1" style={{margin:"0 0 18px",fontFamily:mono,fontSize:12,letterSpacing:".18em",textTransform:"uppercase",color:muted}}>Where it comes from</p>
          <h2 data-r="1" style={{margin:"0 0 8px",fontFamily:sans,fontWeight:900,fontSize:"clamp(28px,4.4vw,42px)",lineHeight:1.04,letterSpacing:"-.02em",textTransform:"uppercase",color:white}}>Thirty years of Saturdays</h2>
          <p data-r="1" style={{margin:0,fontSize:16.5,lineHeight:1.6,color:muted,maxWidth:"60ch"}}>The same ritual, the same order &mdash; across twenty-nine of his own cars, plus clients&rsquo; and friends&rsquo;, from daily drivers to cars wearing somebody&rsquo;s whole year.</p>
          <div data-r="1" style={{display:"flex",flexWrap:"wrap",border:`1px solid ${bdr}`,marginTop:32}}>
            {[
              {val:"1993",c:gold,   desc:"The first Saturday ritual: detail the car, mow the lawn, then the weekend. Escondido, California."},
              {val:"$25", c:teal,   desc:"The first rate card, age fifteen \u2014 wash and wax in La Jolla, 1995."},
              {val:"25 hrs",c:teal, desc:"Into the E92 M3\u2019s paint before anything else on the car got touched."},
              {val:"$55K",c:"#EDF1F6",desc:"Spent on supplies and procedures finding what stood out. Chapter ten is what survived."},
            ].map(s=>(
              <div key={s.val} style={{flex:"1 1 min(210px,100%)",minWidth:"min(210px,100%)",background:mid,padding:"24px 20px",boxShadow:`-1px 0 0 ${bdr},0 -1px 0 ${bdr}`}}>
                <span style={{display:"block",fontFamily:mono,fontSize:28,color:s.c,marginBottom:8}}>{s.val}</span>
                <p style={{margin:0,fontSize:14,color:muted,lineHeight:1.5}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Seven-day reset ── */}
        <section style={{padding:"clamp(48px,7vw,80px) 0",borderBottom:`1px solid ${bdr}`}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:"clamp(24px,4vw,56px)"}}>
            <div data-r="1" style={{flex:"1.1 1 min(360px,100%)"}}>
              <p style={{margin:"0 0 18px",fontFamily:mono,fontSize:12,letterSpacing:".18em",textTransform:"uppercase",color:muted}}>Chapter eleven</p>
              <h2 style={{margin:"0 0 20px",fontFamily:sans,fontWeight:900,fontSize:"clamp(28px,4.4vw,42px)",lineHeight:1.04,letterSpacing:"-.02em",textTransform:"uppercase",color:white}}>Seven days, one car</h2>
              <p style={{margin:"0 0 16px",fontSize:16.5,lineHeight:1.62,color:body,maxWidth:"58ch"}}>The Gloss Reset System&#8482; brings a finish back one day at a time, thirty to sixty minutes each. Which job belongs to which day, and the journal you run it from &mdash; that&rsquo;s the back half of the book.</p>
              <p style={{margin:0,fontSize:15,lineHeight:1.6,color:muted,maxWidth:"58ch"}}>Built for flip cars, client refreshes, gloss-stressed daily drivers, return-to-lease vehicles, and garage queens in hiding.</p>
            </div>
            <div data-r="1" style={{flex:".9 1 min(280px,100%)",display:"flex",flexWrap:"wrap",gap:8,alignContent:"flex-start"}}>
              {[1,2,3,4,5,6,7].map(d=>(
                <div key={d} style={{transform:"skewX(-12deg)",background:d===1?teal:d===7?gold:"rgba(255,255,255,.03)",border:d===1?`1px solid ${teal}`:d===7?`1px solid ${gold}`:"1px solid rgba(255,255,255,.2)",padding:"10px 16px"}}>
                  <span style={{display:"block",transform:"skewX(12deg)",fontFamily:mono,fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:d===1?"#00302B":d===7?"#101010":body,fontWeight:(d===1||d===7)?700:400}}>Day {d}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Reader quote ── */}
        <section style={{padding:"clamp(36px,6vw,64px) 0",borderBottom:`1px solid ${bdr}`}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:"clamp(22px,3.5vw,44px)",alignItems:"center"}}>
            <div data-r="l" style={{flex:"1.5 1 min(340px,100%)",borderLeft:`3px solid ${teal}`,background:"linear-gradient(150deg,rgba(0,210,190,.07),rgba(0,210,190,0))",padding:"clamp(22px,3.6vw,38px) clamp(20px,3.2vw,34px)"}}>
              <blockquote style={{margin:0,fontFamily:serif,fontStyle:"italic",fontWeight:300,fontSize:"clamp(21px,3vw,32px)",lineHeight:1.3,color:white,maxWidth:"34ch",letterSpacing:"-.012em"}}>
                &ldquo;Gavin doesn&rsquo;t just teach you how to detail&mdash;he gives you a system that makes it second nature. The Gloss Game&#8482; completely changed how I care for my R8 and my whole garage flow. Every move I make now has purpose.&rdquo;
              </blockquote>
              <p style={{margin:"18px 0 0",fontFamily:mono,fontSize:11.5,letterSpacing:".2em",textTransform:"uppercase",color:muted}}>Derrick R. &middot; R8 owner &middot; printed on the back cover</p>
            </div>
          </div>
        </section>

        {/* ── Ways to buy ── */}
        <section id="buy" style={{padding:"clamp(48px,7vw,80px) 0",borderBottom:`1px solid ${bdr}`}}>
          <p data-r="1" style={{margin:"0 0 18px",fontFamily:mono,fontSize:12,letterSpacing:".18em",textTransform:"uppercase",color:muted}}>Pick your copy</p>
          <h2 data-r="1" style={{margin:"0 0 8px",fontFamily:sans,fontWeight:900,fontSize:"clamp(28px,4.4vw,42px)",lineHeight:1.04,letterSpacing:"-.02em",textTransform:"uppercase",color:white}}>Fifty-five grand of trial. $19.99 for what survived</h2>
          <p data-r="1" style={{margin:"0 0 32px",fontSize:16.5,lineHeight:1.6,color:muted,maxWidth:"60ch"}}>One book, three ways to own it. Most people end up with two.</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:20}}>
            <div data-r="p" style={{flex:"1.2 1 min(280px,100%)",minWidth:"min(280px,100%)",border:`2px solid ${gold}`,background:`linear-gradient(180deg,rgba(248,184,0,.08),transparent 60%)`,padding:"28px 26px",display:"flex",flexDirection:"column",clipPath:clip15}}>
              <p style={{margin:"0 0 12px",fontFamily:mono,fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:gold,fontWeight:700}}>The workbook &middot; most people start here</p>
              <h3 style={{margin:"0 0 6px",fontFamily:sans,fontWeight:900,fontSize:22,color:white,textTransform:"uppercase"}}>Paperback</h3>
              <p style={{margin:"0 0 4px",fontFamily:sans,fontWeight:900,fontSize:42,letterSpacing:"-.03em",color:white}}>$19.99</p>
              <p style={{margin:"0 0 18px",fontSize:14,color:muted}}>96 pages &middot; ISBN 979-8298190060</p>
              <ul style={{margin:"0 0 24px",padding:0,listStyle:"none",display:"flex",flexDirection:"column",gap:9}}>
                {["The full system, chapters one through twelve","The seven-day reset as fill-in workbook pages","Lives in the garage. Takes a pencil. Forgives water."].map(li=>(
                  <li key={li} style={{fontSize:15,color:"#DDE3EB",paddingLeft:18,position:"relative",lineHeight:1.5}}>
                    <span style={{position:"absolute",left:0,top:8,width:7,height:7,background:gold,display:"block"}} aria-hidden="true" />
                    {li}
                  </li>
                ))}
              </ul>
              <a href={AMAZON_URL} target="_blank" rel="noopener" style={{marginTop:"auto",display:"inline-flex",alignItems:"center",justifyContent:"center",fontFamily:sans,fontWeight:800,fontSize:15,letterSpacing:".03em",textTransform:"uppercase",background:gold,color:"#101010",padding:"15px 20px",clipPath:clip,transition:"background .18s",textDecoration:"none"}}>Buy the paperback</a>
            </div>
            <div data-r="p" style={{animationDelay:".1s",flex:"1 1 min(260px,100%)",minWidth:"min(260px,100%)",border:`1px solid ${bdr}`,background:panel,padding:"28px 26px",display:"flex",flexDirection:"column",clipPath:clip15}}>
              <p style={{margin:"0 0 12px",fontFamily:mono,fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:teal,fontWeight:700}}>The phone copy</p>
              <h3 style={{margin:"0 0 6px",fontFamily:sans,fontWeight:900,fontSize:22,color:white,textTransform:"uppercase"}}>Kindle</h3>
              <p style={{margin:"0 0 18px",fontSize:14,color:muted}}>$9.99 &middot; free on Kindle Unlimited &middot; zero shelf space</p>
              <ul style={{margin:"0 0 24px",padding:0,listStyle:"none",display:"flex",flexDirection:"column",gap:9}}>
                {["In your pocket at the parts store","Searchable mid-wash, one soapy thumb","Reads tonight, runs Saturday"].map(li=>(
                  <li key={li} style={{fontSize:15,color:"#DDE3EB",paddingLeft:18,position:"relative",lineHeight:1.5}}>
                    <span style={{position:"absolute",left:0,top:8,width:7,height:7,background:teal,display:"block"}} aria-hidden="true" />
                    {li}
                  </li>
                ))}
              </ul>
              <a href={KINDLE_URL} target="_blank" rel="noopener" style={{marginTop:"auto",display:"inline-flex",alignItems:"center",justifyContent:"center",fontFamily:sans,fontWeight:800,fontSize:15,letterSpacing:".03em",textTransform:"uppercase",color:"#EDF1F6",border:"1px solid rgba(255,255,255,.3)",padding:"14px 20px",clipPath:clip,transition:"border-color .18s,color .18s",textDecoration:"none"}}>See it on Kindle</a>
            </div>
            <div data-r="p" style={{animationDelay:".2s",flex:"1 1 min(260px,100%)",minWidth:"min(260px,100%)",border:`1px solid ${bdr}`,background:panel,padding:"28px 26px",display:"flex",flexDirection:"column",clipPath:clip15}}>
              <p style={{margin:"0 0 12px",fontFamily:mono,fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:teal,fontWeight:700}}>The second copy</p>
              <h3 style={{margin:"0 0 6px",fontFamily:sans,fontWeight:900,fontSize:22,color:white,textTransform:"uppercase"}}>The gift</h3>
              <p style={{margin:"0 0 18px",fontSize:14,color:muted}}>$19.99, wrapped by Christmas morning</p>
              <ul style={{margin:"0 0 24px",padding:0,listStyle:"none",display:"flex",flexDirection:"column",gap:9}}>
                {["For the friend whose bucket is doing this to their paint","For the kid with a first car and a hose","One for the shelf, one for the glovebox"].map(li=>(
                  <li key={li} style={{fontSize:15,color:"#DDE3EB",paddingLeft:18,position:"relative",lineHeight:1.5}}>
                    <span style={{position:"absolute",left:0,top:8,width:7,height:7,background:teal,display:"block"}} aria-hidden="true" />
                    {li}
                  </li>
                ))}
              </ul>
              <a href={AMAZON_URL} target="_blank" rel="noopener" style={{marginTop:"auto",display:"inline-flex",alignItems:"center",justifyContent:"center",fontFamily:sans,fontWeight:800,fontSize:15,letterSpacing:".03em",textTransform:"uppercase",color:"#EDF1F6",border:"1px solid rgba(255,255,255,.3)",padding:"14px 20px",clipPath:clip,transition:"border-color .18s,color .18s",textDecoration:"none"}}>Buy another copy</a>
            </div>
          </div>
          <p data-r="1" style={{margin:"22px 0 0",fontSize:15,lineHeight:1.6,color:muted}}>Also on the shelf: <a href={ETSY_URL} target="_blank" rel="noopener" style={{fontWeight:700,color:teal}}>It Was Never About The Wash&#8482;</a> &mdash; GoTime Motorsports Etsy shop.</p>
        </section>

        {/* ── Worth it / not ── */}
        <section style={{padding:"clamp(48px,7vw,80px) 0",borderBottom:`1px solid ${bdr}`}}>
          <p data-r="1" style={{margin:"0 0 18px",fontFamily:mono,fontSize:12,letterSpacing:".18em",textTransform:"uppercase",color:muted}}>Before you buy</p>
          <h2 data-r="1" style={{margin:"0 0 30px",fontFamily:sans,fontWeight:900,fontSize:"clamp(28px,4.4vw,42px)",lineHeight:1.04,letterSpacing:"-.02em",textTransform:"uppercase",color:white}}>Worth twenty dollars, or worth skipping</h2>
          <div style={{display:"flex",flexWrap:"wrap",gap:"clamp(24px,4vw,44px)"}}>
            <div data-r="1" style={{flex:"1 1 min(300px,100%)"}}>
              <h3 style={{margin:"0 0 16px",fontFamily:sans,fontWeight:800,fontSize:19,color:gold}}>It&rsquo;s for you if</h3>
              <ul style={{margin:0,padding:0,listStyle:"none",display:"flex",flexDirection:"column",gap:12}}>
                {["You own a car worth protecting and want to know what is being done to it.","You own more products than process.","The garage light shows lines you made yourself.","You\u2019d rather own the skill than trust the wrong detailer."].map(li=>(
                  <li key={li} style={{fontSize:16,color:"#DDE3EB",paddingLeft:26,position:"relative",lineHeight:1.5}}>
                    <span style={{position:"absolute",left:0,top:7,width:11,height:11,background:gold,display:"block"}} aria-hidden="true" />
                    {li}
                  </li>
                ))}
              </ul>
            </div>
            <div data-r="1" style={{flex:"1 1 min(300px,100%)"}}>
              <h3 style={{margin:"0 0 16px",fontFamily:sans,fontWeight:800,fontSize:19,color:muted}}>Save your money if</h3>
              <ul style={{margin:0,padding:0,listStyle:"none",display:"flex",flexDirection:"column",gap:12}}>
                {["You drop the car at a shop and like it that way. Fair.","You want product reviews. The index names what earns a slot, not what\u2019s trending.","You already run four buckets and code your towels. Buy it for somebody instead."].map(li=>(
                  <li key={li} style={{fontSize:16,color:muted,paddingLeft:26,position:"relative",lineHeight:1.5}}>
                    <span style={{position:"absolute",left:0,top:7,width:11,height:11,border:"2px solid #848482",display:"block"}} aria-hidden="true" />
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── The index, free / lead magnet ── */}
        <section id="index" style={{padding:"clamp(44px,6vw,72px) 0",borderBottom:`1px solid ${bdr}`,background:"linear-gradient(150deg,rgba(0,210,190,.06),rgba(0,210,190,0))"}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:"clamp(24px,4vw,54px)"}}>
            <div data-r="l" style={{flex:"1.1 1 min(340px,100%)"}}>
              <p style={{margin:"0 0 18px",fontFamily:mono,fontSize:12,letterSpacing:".18em",textTransform:"uppercase",color:teal}}>The index, free</p>
              <h2 style={{margin:"0 0 20px",fontFamily:sans,fontWeight:900,fontSize:"clamp(28px,4.4vw,42px)",lineHeight:1.04,letterSpacing:"-.02em",textTransform:"uppercase",color:white}}>Everything that goes on the car. Before you buy anything.</h2>
              <p style={{margin:"0 0 14px",fontSize:16.5,lineHeight:1.62,color:body,maxWidth:"58ch"}}>Fifty-four products across eight zones, every link fetched and checked, and the eight that pay a commission marked so you can see them.</p>
              <p style={{margin:0,fontSize:16.5,lineHeight:1.62,color:body,maxWidth:"58ch"}}>The index tells you what. The book tells you why &mdash; and on a six-figure finish, the why is the part that matters.</p>
            </div>
            <div data-r="r" style={{flex:"1 1 min(300px,100%)",alignSelf:"center",animationDelay:".12s"}}>
              <form onSubmit={submitJuicebox} noValidate>
                <label htmlFor="jbmail" style={{display:"block",fontFamily:mono,fontSize:11,letterSpacing:".22em",textTransform:"uppercase",color:teal,margin:"0 0 12px"}}>Where should I send it</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
                  <input id="jbmail" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" required value={jbEmail} onChange={e=>setJbEmail(e.target.value)} style={{flex:"1 1 240px",minWidth:0,background:"rgba(6,14,24,.55)",color:white,border:"1px solid rgba(255,255,255,.22)",padding:"16px 18px",fontFamily:sans,fontSize:16,clipPath:clip}} />
                  <button type="submit" disabled={jbSending||jbOk} style={{fontFamily:sans,fontWeight:800,fontSize:15,letterSpacing:".03em",textTransform:"uppercase",background:gold,color:"#101010",border:0,cursor:"pointer",padding:"15px 24px",clipPath:clip,transition:"background .18s",opacity:(jbSending||jbOk)?0.7:1}}>
                    {jbSending?"Sending…":jbOk?"Sent ✓":"Send the index"}
                  </button>
                </div>
                <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{position:"absolute",left:-9999,width:1,height:1,opacity:0}} />
                <p style={{margin:"12px 0 0",fontSize:13.5,lineHeight:1.55,color:muted,maxWidth:"44ch"}}>One email with the PDF. After that I write when I have something worth reading, and every email has a link to stop them.</p>
                {jbMsg&&<p role="status" aria-live="polite" style={{margin:"10px 0 0",fontFamily:mono,fontSize:12.5,letterSpacing:".06em",color:jbOk?teal:"#F87171",minHeight:18}}>{jbMsg}</p>}
              </form>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{padding:"clamp(48px,7vw,80px) 0",borderBottom:`1px solid ${bdr}`}}>
          <p data-r="1" style={{margin:"0 0 18px",fontFamily:mono,fontSize:12,letterSpacing:".18em",textTransform:"uppercase",color:muted}}>Straight answers</p>
          <h2 data-r="1" style={{margin:"0 0 26px",fontFamily:sans,fontWeight:900,fontSize:"clamp(28px,4.4vw,42px)",lineHeight:1.04,letterSpacing:"-.02em",textTransform:"uppercase",color:white}}>Before you ask</h2>
          <div style={{borderTop:`2px solid ${bdr}`}}>
            {[
              ["How long does it take to detail a car?","A full reset in this system runs seven days, thirty to sixty minutes at a time. A maintenance wash is about an hour once the order is habit. Chapter eight keeps it from swallowing your Saturday."],
              ["How much does it cost to detail a car?","A shop detail runs a few hundred dollars, and a correction runs more. The paperback is $19.99, and the order is yours after that. The back half is a workbook."],
              ["Do I need expensive products?","No. Most of the fifty-five grand taught what not to buy twice. Chapter two is the short list."],
              ["Is it for beginners?","Yes. It starts at the bucket. If you already code your towels, buy it for somebody who doesn\u2019t."],
            ].map(([q,a])=>(
              <div data-r="1" key={q} style={{display:"flex",flexWrap:"wrap",gap:"6px clamp(18px,3vw,40px)",padding:"20px 2px",borderBottom:`1px solid rgba(255,255,255,.09)`}}>
                <h3 style={{margin:0,fontFamily:sans,fontWeight:800,fontSize:17.5,color:white,flex:"0 1 min(340px,100%)"}}>{q}</h3>
                <p style={{margin:0,fontSize:16,lineHeight:1.6,color:body,flex:"1 1 min(320px,100%)"}}>{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Final call ── */}
        <section style={{padding:"clamp(48px,7vw,84px) 0"}}>
          <div data-r="1" style={{border:"1px solid #0A6BAA",background:"linear-gradient(150deg,rgba(0,81,133,.94),rgba(0,81,133,.55))",boxShadow:"inset 0 1px 0 rgba(255,255,255,.2)",clipPath:clipLg,padding:"clamp(26px,4.4vw,48px)"}}>
            <blockquote style={{margin:"0 0 10px",fontFamily:serif,fontStyle:"italic",fontWeight:300,fontSize:"clamp(24px,3.6vw,38px)",lineHeight:1.2,color:white,maxWidth:"24ch",letterSpacing:"-.014em"}}>
              &ldquo;I didn&rsquo;t just learn how to clean cars. I learned how to build options.&rdquo;
            </blockquote>
            <p style={{margin:"0 0 26px",fontFamily:mono,fontSize:11.5,letterSpacing:".2em",textTransform:"uppercase",color:"#BBD4E6"}}>The Gloss Game, preface</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:14,alignItems:"center"}}>
              <a href={AMAZON_URL} target="_blank" rel="noopener" style={{display:"inline-flex",alignItems:"center",fontFamily:sans,fontWeight:800,fontSize:16,letterSpacing:".03em",textTransform:"uppercase",background:gold,color:"#101010",padding:"16px 28px",clipPath:clip,transition:"background .18s",textDecoration:"none"}}>Get the paperback &middot; $19.99</a>
              <a href={KINDLE_URL} target="_blank" rel="noopener" style={{fontFamily:mono,fontSize:12,letterSpacing:".17em",textTransform:"uppercase",color:"#7FE8DC",borderBottom:"1px solid rgba(0,210,190,.4)",paddingBottom:2,textDecoration:"none"}}>Kindle edition</a>
              <span style={{fontFamily:mono,fontSize:12,letterSpacing:".14em",textTransform:"uppercase",color:"#BBD4E6"}}>First edition &middot; August 2025 &middot; 96 pages</span>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"8px 24px",marginTop:22,paddingTop:18,borderTop:"1px solid rgba(255,255,255,.16)"}}>
              <a href="https://instagram.com/PaddockGavin" target="_blank" rel="noopener" style={{fontFamily:mono,fontSize:11.5,letterSpacing:".17em",textTransform:"uppercase",color:"#7FE8DC",textDecoration:"none"}}>Tag your reset &middot; @PaddockGavin</a>
              <a href="https://gotimemotorsports.com" target="_blank" rel="noopener" style={{fontFamily:mono,fontSize:11.5,letterSpacing:".17em",textTransform:"uppercase",color:"#7FE8DC",textDecoration:"none"}}>gotimemotorsports.com</a>
              <a href={ETSY_URL} target="_blank" rel="noopener" style={{fontFamily:mono,fontSize:11.5,letterSpacing:".17em",textTransform:"uppercase",color:"#7FE8DC",textDecoration:"none"}}>The Etsy shelf</a>
              <a href="/juice-box" style={{fontFamily:mono,fontSize:11.5,letterSpacing:".17em",textTransform:"uppercase",color:"#7FE8DC",textDecoration:"none"}}>The Juice Box index</a>
            </div>
          </div>
          <div data-r="1" style={{marginTop:"clamp(26px,4vw,40px)",display:"flex",flexWrap:"wrap",gap:"8px 30px",alignItems:"baseline"}}>
            <span style={{fontFamily:mono,fontSize:11,letterSpacing:".18em",textTransform:"uppercase",color:muted}}>Written by Gavin Brooks</span>
            <a href="https://gotimemotorsports.com" target="_blank" rel="noopener" style={{fontFamily:mono,fontSize:11,letterSpacing:".18em",textTransform:"uppercase",color:muted,borderBottom:"1px solid rgba(255,255,255,.25)",paddingBottom:1,textDecoration:"none"}}>Published by GoTime Motorsports&#8482;</a>
            <span style={{fontFamily:serif,fontStyle:"italic",fontSize:14.5,color:muted}}>For April and Rian, and for Jerry and Robyn.</span>
            <a href="https://instagram.com/PaddockGavin" target="_blank" rel="noopener" style={{fontFamily:mono,fontSize:11,letterSpacing:".18em",textTransform:"uppercase",color:teal,textDecoration:"none"}}>Questions &middot; DM @PaddockGavin</a>
          </div>
        </section>

      </main>

      {/* Sticky buy bar — bottom, mirrors source exactly */}
      <div aria-hidden={!barOn} style={{position:"fixed",left:0,right:0,bottom:0,zIndex:60,background:"rgba(10,21,35,.92)",backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",borderTop:`1px solid ${bdr}`,transform:barOn?"translateY(0)":"translateY(100%)",transition:"transform .4s cubic-bezier(.16,1,.3,1)",paddingBottom:"env(safe-area-inset-bottom)"}}>
        <div style={{maxWidth:1000,margin:"0 auto",padding:"11px clamp(20px,5vw,40px)",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
          <span style={{fontFamily:sans,fontWeight:900,fontSize:15,letterSpacing:"-.01em",textTransform:"uppercase",color:white}}>The Gloss Game&#8482;</span>
          <span style={{fontFamily:mono,fontSize:12,letterSpacing:".12em",textTransform:"uppercase",color:muted}}>Paperback &middot; $19.99 &middot; ships Prime</span>
          <i aria-hidden="true" style={{flex:"1 1 auto"}} />
          <a href={AMAZON_URL} target="_blank" rel="noopener" style={{display:"inline-flex",alignItems:"center",fontFamily:sans,fontWeight:800,fontSize:13.5,letterSpacing:".03em",textTransform:"uppercase",background:gold,color:"#101010",padding:"11px 20px",clipPath:"polygon(0 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%)",transition:"background .18s",textDecoration:"none"}}>Get the paperback</a>
        </div>
      </div>

      <SiteFooter />
    </>
  )
}
