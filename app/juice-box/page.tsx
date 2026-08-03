"use client"
import { useEffect, useState } from "react"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

const AMAZON_URL = "https://www.amazon.com/Gloss-Game-Detailing-Discipline-Display/dp/B0FMPGNTPY"
const ETSY_URL   = "https://www.etsy.com/shop/GoTimeMotorsports"

// Source design tokens
const sans  = "Archivo,'Helvetica Neue',Helvetica,Arial,sans-serif"
const mono  = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const serif = "Newsreader,Georgia,'Times New Roman',serif"
const bg    = "#0A1523"
const mid   = "#0E1A2A"
const bdr   = "#27384F"
const gold  = "#F8B800"
const teal  = "#00D2BE"
const body  = "#C4CBD6"
const muted = "#B4B6B2"
const white = "#FFFFFF"
const clip  = "polygon(0 0,100% 0,100% calc(100% - 11px),calc(100% - 11px) 100%,0 100%)"
const clipLg= "polygon(0 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%)"

// Product index — 8 zones, faithful to the source structure
const ZONES = [
  { zone:"Pre-wash", items:[
    {name:"Chemical Guys Foam Blaster 6",link:`https://a.co/d/00DnYn60`,note:"Hooks to the hose. The foam step that lifts bulk contamination before contact.",price:"~$35",affiliate:true},
    {name:"Iron X",link:"https://www.amazon.com/s?k=iron+x+decontamination",note:"Iron remover. Purple bleed means it is working.",price:"~$20",affiliate:false},
    {name:"Optimum No Rinse",link:"https://www.amazon.com/s?k=optimum+no+rinse",note:"Two-bucket wash additive. Low water, high lubrication.",price:"~$18",affiliate:false},
  ]},
  { zone:"Wash", items:[
    {name:"AMMO NYC AMMO Foam",link:"https://www.ammonyc.com",note:"pH-neutral foam soap. Thick, slick, safe for coatings.",price:"~$28",affiliate:false},
    {name:"The Rag Company Minx",link:"https://www.amazon.com/s?k=rag+company+minx+wash+mitt",note:"The wash mitt. Silk-like, deep pile, does not hold grit.",price:"~$22",affiliate:false},
    {name:"Chemical Guys MIC_507",link:"https://www.amazon.com/s?k=chemical+guys+mic507",note:"Drying towel. Twisted loop, no drag.",price:"~$18",affiliate:false},
  ]},
  { zone:"Wheels", items:[
    {name:"Sonax Wheel Cleaner Full Effect",link:"https://www.amazon.com/s?k=sonax+wheel+cleaner",note:"Iron remover and wheel cleaner in one. Purple means it is working.",price:"~$22",affiliate:false},
    {name:"Mothers Wheel Brush Set",link:"https://www.amazon.com/s?k=mothers+wheel+brush+set",note:"Three sizes. Barrel brush, lug nut brush, face brush.",price:"~$30",affiliate:false},
    {name:"P&S Detail Products Bead Maker",link:"https://www.amazon.com/s?k=ps+detail+bead+maker",note:"Spray sealant. Goes on wet or dry, stands up to repeated washes.",price:"~$20",affiliate:false},
  ]},
  { zone:"Paint correction", items:[
    {name:"AMMO NYC Frothe",link:"https://www.ammonyc.com",note:"Clay lubricant and detail spray. Does both jobs well.",price:"~$30",affiliate:false},
    {name:"Chemical Guys Hex-Logic Pad Kit",link:"https://www.amazon.com/s?k=chemical+guys+hex+logic+pad+kit",note:"Four pads: heavy cut, light cut, polishing, finishing.",price:"~$45",affiliate:false},
    {name:"Meguiar\u2019s M205",link:"https://www.amazon.com/s?k=meguiars+m205",note:"Ultra-finishing polish. Leaves a clear, hologram-free finish.",price:"~$20",affiliate:false},
  ]},
  { zone:"Protection", items:[
    {name:"Gtechniq Crystal Serum Light",link:"https://www.amazon.com/s?k=gtechniq+crystal+serum+light",note:"Semi-permanent coating. Two years on a correct prep.",price:"~$60",affiliate:false},
    {name:"AMMO NYC Frothe",link:"https://www.ammonyc.com",note:"Used as a topper on cured coatings for extra gloss.",price:"~$30",affiliate:false},
    {name:"P&S Bead Maker",link:"https://www.amazon.com/s?k=ps+detail+bead+maker",note:"Maintenance spray after coating. Adds slickness, repels water.",price:"~$20",affiliate:false},
  ]},
  { zone:"Interior", items:[
    {name:"303 Aerospace Protectant",link:"https://www.amazon.com/s?k=303+aerospace+protectant",note:"UV protection for all interior plastics and trim. Not greasy.",price:"~$18",affiliate:false},
    {name:"Chemical Guys InnerClean",link:"https://www.amazon.com/s?k=chemical+guys+innerclean",note:"Interior quick detailer. Low-sheen, wipes clean.",price:"~$12",affiliate:false},
    {name:"Gyeon Leather Conditioner",link:"https://www.amazon.com/s?k=gyeon+leather+conditioner",note:"Non-greasy leather treatment. Conditions without slickening.",price:"~$28",affiliate:false},
  ]},
  { zone:"Glass", items:[
    {name:"Invisible Glass",link:"https://www.amazon.com/s?k=invisible+glass+spray",note:"Streak-free glass cleaner. Works on tinted and coated glass.",price:"~$8",affiliate:false},
    {name:"The Rag Company Glass Waffle Towel",link:"https://www.amazon.com/s?k=rag+company+glass+waffle+towel",note:"Dedicated glass towel. Waffle weave grabs residue.",price:"~$12",affiliate:false},
  ]},
  { zone:"Maintenance", items:[
    {name:"AMMO NYC Reload",link:"https://www.ammonyc.com",note:"SiO2 spray. Tops up the coating between washes.",price:"~$30",affiliate:false},
    {name:"Gtechniq W6 Iron & General Fallout Remover",link:"https://www.amazon.com/s?k=gtechniq+w6",note:"Maintenance decontamination. Every 3\u20136 months on coated cars.",price:"~$22",affiliate:false},
    {name:"Koch Chemie Micro Cut & Finish",link:"https://www.amazon.com/s?k=koch+chemie+micro+cut+finish",note:"Light correction polish for swirl touch-up between details.",price:"~$28",affiliate:false},
  ]},
]

function getNashville(){
  return new Intl.DateTimeFormat("en-US",{timeZone:"America/Chicago",hour:"numeric",minute:"2-digit",hour12:true}).format(new Date())
}
function getShiftLabel(){
  const h = Number(new Intl.DateTimeFormat("en-US",{timeZone:"America/Chicago",hour:"numeric",hour12:false}).format(new Date()))
  return h>=8&&h<18?"Day shift":"Night shift"
}

export default function JuiceBoxPage(){
  const [nashTime, setNashTime] = useState(getNashville)
  const [shift,    setShift]    = useState(getShiftLabel)
  const [unlocked, setUnlocked] = useState(false)
  const [jbEmail,  setJbEmail]  = useState("")
  const [jbMsg,    setJbMsg]    = useState("")
  const [jbOk,     setJbOk]     = useState(false)
  const [jbSending,setJbSending]= useState(false)

  useEffect(()=>{
    try { if(localStorage.getItem("jbIndexUnlocked")==="1") setUnlocked(true) } catch{}
  },[])

  useEffect(()=>{
    const t = setInterval(()=>{ setNashTime(getNashville()); setShift(getShiftLabel()) },30000)
    return ()=>clearInterval(t)
  },[])

  useEffect(()=>{
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-r]"))
    if(!("IntersectionObserver" in window)){ els.forEach(e=>e.classList.add("on")); return }
    els.forEach(e=>{ if(!e.dataset.armed) e.setAttribute("data-armed","1") })
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("on"); obs.unobserve(en.target) }})
    },{rootMargin:"0px 0px -10% 0px",threshold:0.04})
    els.forEach(e=>obs.observe(e))
    return ()=>obs.disconnect()
  },[])

  const affCount = ZONES.reduce((n,z)=>n+z.items.filter(i=>i.affiliate).length,0)
  const locked   = !unlocked
  const shownZones = locked ? ZONES.slice(0,1) : ZONES

  async function submitJuicebox(e: React.FormEvent){
    e.preventDefault()
    if(jbSending||jbOk) return
    const mail = jbEmail.trim()
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)){ setJbMsg("That address does not look right."); return }
    setJbSending(true); setJbMsg("")
    try {
      const res = await fetch("/api/juicebox",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:mail})})
      if(res.ok){
        try{ localStorage.setItem("jbIndexUnlocked","1") }catch{}
        setJbOk(true); setUnlocked(true)
        setJbMsg("Sent. The PDF is on its way, and the shelf below is open.")
      } else { setJbMsg("Could not send it just now. Try again in a moment.") }
    } catch { setJbMsg("Could not send it just now. Try again in a moment.") }
    finally { setJbSending(false) }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..600&display=swap');
        html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
        ::selection{background:#F8B800;color:#101010}
        @keyframes rIn{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
        @keyframes rPop{from{opacity:0;transform:translateY(18px) scale(.955)}to{opacity:1;transform:none}}
        [data-r][data-armed]:not(.on){opacity:0}
        [data-r].on{animation:rIn .8s cubic-bezier(.16,1,.3,1) both}
        [data-r="p"].on{animation-name:rPop}
        @media(prefers-reduced-motion:reduce){[data-r][data-armed]:not(.on){opacity:1}[data-r].on{animation:none}html{scroll-behavior:auto}}
        ::selection{background:#F8B800;color:#101010}
        input:focus{outline:0;border-color:#00D2BE!important;box-shadow:inset 0 0 0 1px rgba(0,210,190,.45)}
      `}</style>

      <SiteNav />

      {/* Telemetry strip */}
      <div style={{borderBottom:`1px solid ${bdr}`,background:mid}}>
        <div style={{maxWidth:1000,margin:"0 auto",padding:"13px clamp(20px,5vw,40px)",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
          <span style={{display:"inline-flex",alignItems:"center",gap:12,fontFamily:mono,fontSize:12.5,letterSpacing:".24em",textTransform:"uppercase",color:"#EDF1F6"}}>
            <i aria-hidden="true" style={{width:34,height:4,background:teal,flex:"0 0 auto"}} />
            {shift} &middot; {nashTime} Nashville
          </span>
          <i aria-hidden="true" style={{flex:"1 1 auto",height:1,background:bdr,minWidth:40}} />
          <span style={{fontFamily:mono,fontSize:12.5,letterSpacing:".24em",textTransform:"uppercase",color:muted}}>Chapter ten &middot; the index</span>
        </div>
      </div>

      <main style={{minWidth:0,maxWidth:1000,margin:"0 auto",padding:"0 clamp(20px,5vw,40px)",background:bg,color:body,fontFamily:sans}}>

        {/* ── Masthead ── */}
        <section style={{padding:"clamp(50px,7vw,78px) 0 clamp(40px,6vw,60px)",borderBottom:`1px solid ${bdr}`}}>
          <p data-r="1" style={{margin:"0 0 18px",fontFamily:mono,fontSize:12,letterSpacing:".18em",textTransform:"uppercase",color:muted}}>The official index &middot; from The Gloss Game&#8482;</p>
          <h1 data-r="1" style={{margin:"0 0 22px",fontFamily:sans,fontWeight:900,fontSize:"clamp(38px,6.6vw,68px)",lineHeight:1.04,letterSpacing:"-.02em",textTransform:"uppercase",color:white,maxWidth:"16ch"}}>
            The GoTime<br /><span style={{color:gold}}>Juice Box&#8482;</span>
          </h1>
          <p data-r="1" style={{margin:0,fontSize:"clamp(18px,2.2vw,21px)",lineHeight:1.6,color:"#DDE3EB",maxWidth:"54ch"}}>
            Not the best car detailing products by vote &mdash; the ones that keep earning their slot. Roughly $55K went through this garage finding them, on twenty-nine of his own cars plus clients&rsquo; and friends&rsquo;. This is what stayed within reach.
          </p>
          <div data-r="1" style={{marginTop:26,maxWidth:"62ch"}}>
            <p style={{fontFamily:mono,fontSize:12,lineHeight:1.75,letterSpacing:".02em",color:muted,borderLeft:`2px solid ${teal}`,padding:"2px 0 2px 16px",margin:0}}>
              <b style={{color:"#EDF1F6",fontWeight:400}}>A dot means the link pays a commission.</b> {affCount} of the links below are marked. Nothing was added because it pays, and nothing was left off because it doesn&rsquo;t. The book was written before any of the links existed.
            </p>
          </div>
        </section>

        {/* ── The shelf ── */}
        <section style={{padding:"clamp(44px,6vw,72px) 0",borderBottom:`1px solid ${bdr}`}}>
          <div style={{display:"flex",flexWrap:"wrap",borderTop:"1px solid rgba(255,255,255,.1)",borderBottom:"1px solid rgba(255,255,255,.1)"}}>
            {shownZones.map((z,zi)=>(
              <div data-r="p" key={z.zone} style={{flex:"1 1 min(250px,100%)",minWidth:"min(250px,100%)",background:bg,padding:"26px 24px 28px",display:"flex",flexDirection:"column",gap:10,boxShadow:"-1px 0 0 rgba(255,255,255,.1),0 -1px 0 rgba(255,255,255,.1)",animationDelay:`${zi*.08}s`}}>
                <span style={{fontFamily:mono,fontSize:11,letterSpacing:".2em",textTransform:"uppercase",color:teal}}>{z.zone}</span>
                <ul style={{margin:0,padding:0,listStyle:"none",display:"flex",flexDirection:"column",gap:11}}>
                  {z.items.map(it=>(
                    <li key={it.name} style={{fontSize:14.5,lineHeight:1.45,color:body,paddingLeft:15,position:"relative"}}>
                      <span style={{position:"absolute",left:0,top:9,width:6,height:1,background:teal,display:"block"}} aria-hidden="true" />
                      <a href={it.link} target="_blank" rel="noopener" style={{color:"#EDF1F6",fontWeight:500,textDecoration:"none"}}>{it.name}</a>
                      {it.affiliate&&<sup style={{color:teal,fontSize:10,letterSpacing:".1em",marginLeft:4}}>&#9679;</sup>}
                      {it.price&&<span style={{fontFamily:mono,fontSize:11,color:muted,marginLeft:7}}>{it.price}</span>}
                      <em style={{fontStyle:"normal",display:"block",color:muted,fontSize:12.5,marginTop:2}}>{it.note}</em>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Gate — locked state */}
          {locked&&(
            <>
              <div style={{position:"relative",marginTop:-70,height:70,background:"linear-gradient(180deg,rgba(10,21,35,0),#0A1523)",pointerEvents:"none"}} />
              <div style={{border:"1px solid rgba(0,210,190,.35)",background:"linear-gradient(150deg,rgba(0,210,190,.08),rgba(0,210,190,0))",clipPath:"polygon(0 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%)",padding:"clamp(24px,4vw,40px)"}}>
                <p style={{margin:"0 0 14px",fontFamily:mono,fontSize:11,letterSpacing:".22em",textTransform:"uppercase",color:teal}}>Zones 2&ndash;{ZONES.length} &middot; locked</p>
                <h2 style={{margin:"0 0 10px",fontFamily:sans,fontWeight:900,fontSize:"clamp(24px,3.6vw,36px)",lineHeight:1.05,letterSpacing:"-.02em",textTransform:"uppercase",color:white,maxWidth:"22ch"}}>That was zone one. The rest goes where your email does</h2>
                <p style={{margin:"0 0 22px",fontSize:16,lineHeight:1.6,color:body,maxWidth:"56ch"}}>One email, the whole index as a PDF &mdash; every zone, every link checked, the paid ones marked &mdash; and this page unlocks with it.</p>
                <form onSubmit={submitJuicebox} noValidate style={{maxWidth:560}}>
                  <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
                    <input id="jbmail" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" required value={jbEmail} onChange={e=>setJbEmail(e.target.value)} style={{flex:"1 1 220px",minWidth:0,background:"rgba(6,14,24,.55)",color:white,border:"1px solid rgba(255,255,255,.22)",padding:"16px 18px",fontFamily:sans,fontSize:16,clipPath:clip}} />
                    <button type="submit" disabled={jbSending} style={{fontFamily:sans,fontWeight:800,fontSize:15,letterSpacing:".03em",textTransform:"uppercase",background:gold,color:"#101010",border:0,cursor:"pointer",padding:"15px 24px",clipPath:clip,transition:"background .18s"}}>
                      {jbSending?"Sending…":"Send it · unlock the shelf"}
                    </button>
                  </div>
                  <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{position:"absolute",left:-9999,width:1,height:1,opacity:0}} />
                  <p style={{margin:"12px 0 0",fontSize:13.5,lineHeight:1.55,color:muted,maxWidth:"46ch"}}>One email with the PDF. After that I write when I have something worth reading, and every email has a link to stop them.</p>
                  {jbMsg&&<p role="status" aria-live="polite" style={{margin:"10px 0 0",fontFamily:mono,fontSize:12.5,letterSpacing:".06em",color:jbOk?teal:gold,minHeight:18}}>{jbMsg}</p>}
                </form>
              </div>
            </>
          )}

          <p data-r="1" style={{fontFamily:mono,fontSize:11.5,letterSpacing:".06em",color:muted,margin:"16px 0 0",display:"flex",alignItems:"baseline",gap:9}}>
            <span style={{color:teal,fontSize:9}}>&#9679;</span>
            Paid link &mdash; buying through it sends a commission Gavin&rsquo;s way, at no cost to you.
          </p>
          <p data-r="1" style={{margin:"14px 0 0",fontSize:15,lineHeight:1.6,color:body}}>
            {unlocked?"Want it in the garage? ":"Already on the list? "}
            <a href="/gloss-game#index" style={{fontWeight:600,color:teal,textDecoration:"none"}}>
              {unlocked?"Get the index as a PDF \u2192":"The form on the book page works too \u2192"}
            </a>
          </p>
        </section>

        {/* ── Three ways to start ── */}
        <section style={{padding:"clamp(44px,6vw,72px) 0",borderBottom:`1px solid ${bdr}`}}>
          <div style={{display:"flex",alignItems:"center",gap:15,margin:"0 0 30px"}}>
            <i style={{fontStyle:"normal",width:26,height:3,background:teal,flex:"0 0 auto"}} />
            <span style={{fontFamily:mono,fontSize:11.5,letterSpacing:".22em",textTransform:"uppercase",color:"#EDF1F6",whiteSpace:"nowrap"}}>Three ways to start</span>
            <span style={{flex:"1 1 auto",height:1,background:"rgba(255,255,255,.12)",display:"block"}} />
          </div>
          <div style={{display:"flex",flexWrap:"wrap",borderTop:"1px solid rgba(255,255,255,.1)",borderBottom:"1px solid rgba(255,255,255,.1)"}}>
            {[
              {tag:"Starter",price:"$150",desc:"Foam gun, soap, three towels, a mitt, Frothe.",note:"Entry point and flip cars"},
              {tag:"Builder",price:"$500",desc:"PF22.2, AMMO Foam, Boost, Reload, towels.",note:"Weekly use, semi-pro garage",delay:".1s"},
              {tag:"Pro",price:"$1,500+",desc:"Wall rack, BlowR Pro, four buckets, the Elixir stack, a tool cart.",note:"Workshop-ready, client prep, delivery days",delay:".2s"},
            ].map(t=>(
              <div data-r="p" key={t.tag} style={{flex:"1 1 min(260px,100%)",minWidth:"min(260px,100%)",background:bg,padding:"26px 24px 28px",display:"flex",flexDirection:"column",gap:10,boxShadow:"-1px 0 0 rgba(255,255,255,.1),0 -1px 0 rgba(255,255,255,.1)",animationDelay:t.delay||"0s"}}>
                <span style={{fontFamily:mono,fontSize:11,letterSpacing:".2em",textTransform:"uppercase",color:teal}}>{t.tag}</span>
                <p style={{margin:0,fontFamily:sans,fontWeight:900,fontSize:"clamp(28px,4vw,38px)",color:white,letterSpacing:"-.03em",lineHeight:1}}>{t.price}</p>
                <p style={{margin:0,fontFamily:serif,fontSize:15.5,lineHeight:1.55,color:muted}}>{t.desc}</p>
                <p style={{margin:"auto 0 0",paddingTop:14,fontFamily:mono,fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:teal}}>{t.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── The book band ── */}
        <section style={{padding:"clamp(48px,7vw,80px) 0"}}>
          <div data-r="1" style={{border:"1px solid #0A6BAA",background:"linear-gradient(150deg,rgba(0,81,133,.94),rgba(0,81,133,.55))",boxShadow:"inset 0 1px 0 rgba(255,255,255,.2)",clipPath:clipLg,padding:"clamp(26px,4.4vw,48px)",display:"flex",flexWrap:"wrap",gap:"clamp(24px,4vw,44px)",alignItems:"center"}}>
            <figure style={{margin:0,flex:"0 0 clamp(120px,16vw,170px)"}}>
              <div style={{aspectRatio:"1025/1600",background:mid,border:"1px solid rgba(255,255,255,.2)",overflow:"hidden",boxShadow:"0 22px 40px -18px rgba(0,0,0,.7)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontFamily:mono,fontSize:10,letterSpacing:".18em",textTransform:"uppercase",color:muted}}>Cover</span>
              </div>
            </figure>
            <div style={{flex:"1 1 min(320px,100%)"}}>
              <h2 style={{margin:"0 0 12px",fontFamily:sans,fontWeight:900,fontSize:"clamp(26px,4vw,40px)",lineHeight:1.04,letterSpacing:"-.02em",textTransform:"uppercase",color:white}}>The index is chapter ten</h2>
              <p style={{margin:0,fontSize:16,lineHeight:1.64,color:"#DCE8F2",maxWidth:"50ch"}}>The order that makes these products work is the other eleven chapters. Ninety-six pages, and the back half is the workbook.</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:14,alignItems:"center",marginTop:24}}>
                <a href={AMAZON_URL} target="_blank" rel="noopener" style={{display:"inline-flex",alignItems:"center",fontFamily:sans,fontWeight:800,fontSize:15,letterSpacing:".03em",textTransform:"uppercase",background:gold,color:"#101010",padding:"15px 26px",clipPath:clip,transition:"background .18s",textDecoration:"none"}}>Get the book &middot; $19.99</a>
                <a href="/gloss-game" style={{fontFamily:mono,fontSize:11.5,letterSpacing:".17em",textTransform:"uppercase",color:"#7FE8DC",textDecoration:"none"}}>See the whole system &rarr;</a>
              </div>
            </div>
          </div>
          <div data-r="1" style={{marginTop:"clamp(24px,4vw,36px)",display:"flex",flexWrap:"wrap",gap:"8px 24px"}}>
            <a href="https://instagram.com/PaddockGavin" target="_blank" rel="noopener" style={{fontFamily:mono,fontSize:11.5,letterSpacing:".17em",textTransform:"uppercase",color:teal,textDecoration:"none"}}>Tag your shelf &middot; @PaddockGavin</a>
            <a href="https://gotimemotorsports.com" target="_blank" rel="noopener" style={{fontFamily:mono,fontSize:11.5,letterSpacing:".17em",textTransform:"uppercase",color:teal,textDecoration:"none"}}>gotimemotorsports.com</a>
            <a href={ETSY_URL} target="_blank" rel="noopener" style={{fontFamily:mono,fontSize:11.5,letterSpacing:".17em",textTransform:"uppercase",color:teal,textDecoration:"none"}}>The Etsy shelf</a>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}
