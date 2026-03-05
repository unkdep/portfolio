"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Github, Linkedin, Mail, FileDown, ExternalLink, Sun, Moon, Menu, X, ArrowUp, Globe, Zap } from "lucide-react";

// ══════════════════════════════════════════════════════
// 1. CUSTOM CURSOR — telescope crosshair + star trail
// ══════════════════════════════════════════════════════
function TelescopeCursor({th}:{th:any}){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pos   = useRef({x:-200,y:-200});
  const trail = useRef<{x:number;y:number;op:number;r:number}[]>([]);
  const raf   = useRef(0);

  useEffect(()=>{
    const c = canvasRef.current; if(!c) return;
    const ctx = c.getContext("2d")!;
    const resize = ()=>{ c.width=window.innerWidth; c.height=window.innerHeight; };
    resize(); window.addEventListener("resize",resize);

    const onMove=(e:MouseEvent)=>{
      pos.current={x:e.clientX,y:e.clientY};
      // spawn star particle
      if(Math.random()>0.38){
        trail.current.push({
          x:e.clientX+(Math.random()-0.5)*10,
          y:e.clientY+(Math.random()-0.5)*10,
          op:0.7+Math.random()*0.3,
          r:Math.random()*1.8+0.4,
        });
        if(trail.current.length>55) trail.current.shift();
      }
    };
    window.addEventListener("mousemove",onMove);

    const draw=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      const {x,y}=pos.current;

      // — trail particles —
      trail.current = trail.current.filter(p=>p.op>0.04);
      trail.current.forEach(p=>{
        ctx.save();
        ctx.globalAlpha=p.op;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle="#a8c8b4"; ctx.fill();
        ctx.restore();
        p.op*=0.88; p.y-=0.18;
      });

      // — crosshair reticle —
      const sz=18, gap=5;
      ctx.save();
      ctx.strokeStyle=th.accentHi; ctx.lineWidth=1.2;
      ctx.shadowColor=th.accent; ctx.shadowBlur=6;
      ctx.globalAlpha=0.9;
      // horizontal lines
      ctx.beginPath(); ctx.moveTo(x-sz,y); ctx.lineTo(x-gap,y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x+gap,y); ctx.lineTo(x+sz,y); ctx.stroke();
      // vertical lines
      ctx.beginPath(); ctx.moveTo(x,y-sz); ctx.lineTo(x,y-gap); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x,y+gap); ctx.lineTo(x,y+sz); ctx.stroke();
      // center dot
      ctx.beginPath(); ctx.arc(x,y,1.8,0,Math.PI*2);
      ctx.fillStyle=th.accentHi; ctx.fill();
      // outer circle
      ctx.globalAlpha=0.35; ctx.lineWidth=0.7;
      ctx.beginPath(); ctx.arc(x,y,sz+4,0,Math.PI*2); ctx.stroke();
      ctx.restore();

      raf.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>{
      window.removeEventListener("resize",resize);
      window.removeEventListener("mousemove",onMove);
      cancelAnimationFrame(raf.current);
    };
  },[th]);

  return <canvas ref={canvasRef}
    style={{position:"fixed",inset:0,zIndex:999,pointerEvents:"none"}}/>;
}

// ══════════════════════════════════════════════════════
// 2. SPACE RADIO AUDIO (Web Audio API — sem arquivos)
// ══════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════
// PORTFOLIO AMBIENT AUDIO — subtle space background
// ══════════════════════════════════════════════════════
function useAmbientAudio(){
  const ctxRef    = useRef<AudioContext|null>(null);
  const masterRef = useRef<GainNode|null>(null);
  const activeRef = useRef(false);
  const intervals = useRef<ReturnType<typeof setInterval>[]>([]);

  const stop = useCallback(()=>{
    intervals.current.forEach(clearInterval);
    intervals.current=[];
    if(masterRef.current && ctxRef.current){
      const g=masterRef.current, c=ctxRef.current;
      try {
        g.gain.setValueAtTime(g.gain.value, c.currentTime);
        g.gain.linearRampToValueAtTime(0, c.currentTime+2.2);
        setTimeout(()=>{ try{ c.close(); }catch(e){} ctxRef.current=null; masterRef.current=null; },2500);
      } catch(e){}
    }
    activeRef.current=false;
  },[]);

  const start = useCallback(()=>{
    if(activeRef.current) return;
    const AudioCtx=window.AudioContext||(window as any).webkitAudioContext;
    const ctx=new AudioCtx();
    const master=ctx.createGain(); master.gain.value=0; master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.18, ctx.currentTime+4);
    ctxRef.current=ctx; masterRef.current=master; activeRef.current=true;

    // ── Reverb convolver (simulate space) ──
    const makeReverb=()=>{
      const len=ctx.sampleRate*3.5;
      const buf=ctx.createBuffer(2,len,ctx.sampleRate);
      for(let ch=0;ch<2;ch++){
        const d=buf.getChannelData(ch);
        for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.5);
      }
      const conv=ctx.createConvolver(); conv.buffer=buf; return conv;
    };
    const reverb=makeReverb();
    const reverbGain=ctx.createGain(); reverbGain.gain.value=0.55;
    reverb.connect(reverbGain); reverbGain.connect(master);

    // ── Pentatonic melody — gentle, space-like ──
    // Notes in Hz: A3 C4 D4 E4 G4 A4 C5 (pentatonic, dreamy)
    const scale=[220,261.6,293.7,329.6,392,440,523.3];
    let melodyStep=0;
    const playNote=()=>{
      if(!activeRef.current) return;
      const freq=scale[melodyStep % scale.length];
      melodyStep++;
      const osc=ctx.createOscillator();
      // alternate between sine and triangle for color
      osc.type = melodyStep%3===0 ? "triangle" : "sine";
      osc.frequency.value=freq;
      const g=ctx.createGain();
      const t=ctx.currentTime;
      const dur=1.8+Math.random()*1.4;
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(0.12+Math.random()*0.06,t+0.25);
      g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
      osc.connect(g); g.connect(reverb); g.connect(master);
      osc.start(t); osc.stop(t+dur+0.1);
    };
    playNote();
    const melI=setInterval(playNote, 2200+Math.random()*1800);
    intervals.current.push(melI);

    // ── Pad chord (A minor wash) ──
    [220,261.6,329.6,440].forEach((freq,i)=>{
      const osc=ctx.createOscillator(); osc.type="sine"; osc.frequency.value=freq;
      const detune=ctx.createOscillator(); detune.type="sine"; detune.frequency.value=freq*1.002;
      const g=ctx.createGain(); g.gain.value=0.028-i*0.004;
      osc.connect(g); detune.connect(g); g.connect(reverb); g.connect(master);
      osc.start(); detune.start();
    });

    // ── Sub breath (very low, 40Hz) ──
    const sub=ctx.createOscillator(); sub.type="sine"; sub.frequency.value=40;
    const lfo=ctx.createOscillator(); lfo.type="sine"; lfo.frequency.value=0.06;
    const lfoG=ctx.createGain(); lfoG.gain.value=3;
    lfo.connect(lfoG); lfoG.connect(sub.frequency);
    const subG=ctx.createGain(); subG.gain.value=0.22;
    sub.connect(subG); subG.connect(master);
    sub.start(); lfo.start();

    // ── Crystal shimmer tones (high harmonics, very soft) ──
    const shimmer=()=>{
      if(!activeRef.current) return;
      const freq=1800+Math.random()*2400;
      const osc=ctx.createOscillator(); osc.type="sine"; osc.frequency.value=freq;
      const g=ctx.createGain();
      const t=ctx.currentTime, dur=2+Math.random()*2.5;
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(0.018,t+0.5);
      g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
      osc.connect(g); g.connect(reverb);
      osc.start(t); osc.stop(t+dur);
    };
    const shimI=setInterval(shimmer, 3500+Math.random()*3000);
    intervals.current.push(shimI);
  },[]);

  return { start, stop };
}

function playSpaceRadio(onDone?:()=>void){
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  const ctx = new AudioCtx();
  const master = ctx.createGain(); master.connect(ctx.destination); master.gain.value=0.38;

  const makeNoise=(startT:number,dur:number,vol:number)=>{
    const bufSize=ctx.sampleRate*dur;
    const buf=ctx.createBuffer(1,bufSize,ctx.sampleRate);
    const data=buf.getChannelData(0);
    for(let i=0;i<bufSize;i++) data[i]=(Math.random()*2-1)*vol;
    const src=ctx.createBufferSource(); src.buffer=buf;
    const g=ctx.createGain(); g.gain.value=1;
    const bp=ctx.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=1200; bp.Q.value=0.8;
    src.connect(bp); bp.connect(g); g.connect(master);
    src.start(startT); src.stop(startT+dur);
  };

  const beep=(startT:number,dur:number,freq:number,vol:number)=>{
    const osc=ctx.createOscillator(); osc.type="sine"; osc.frequency.value=freq;
    const g=ctx.createGain();
    g.gain.setValueAtTime(0,startT);
    g.gain.linearRampToValueAtTime(vol,startT+0.015);
    g.gain.setValueAtTime(vol,startT+dur-0.015);
    g.gain.linearRampToValueAtTime(0,startT+dur);
    osc.connect(g); g.connect(master);
    osc.start(startT); osc.stop(startT+dur+0.05);
  };

  const sweep=(startT:number)=>{
    const osc=ctx.createOscillator(); osc.type="sawtooth";
    osc.frequency.setValueAtTime(180,startT);
    osc.frequency.exponentialRampToValueAtTime(420,startT+2.5);
    const g=ctx.createGain(); g.gain.value=0.06;
    const lp=ctx.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=600;
    osc.connect(lp); lp.connect(g); g.connect(master);
    osc.start(startT); osc.stop(startT+2.6);
  };

  const now = ctx.currentTime;
  makeNoise(now, 0.18, 0.7);
  makeNoise(now+0.22, 0.08, 0.5);
  const morse=[0.06,0.06,0.06,0.18,0.18,0.18,0.06,0.06,0.06];
  let t=now+0.38;
  morse.forEach(d=>{ beep(t,d,880,0.55); t+=d+0.09; });
  beep(t+0.08, 0.22, 660, 0.45);
  beep(t+0.36, 0.30, 990, 0.38);
  sweep(now+0.3);
  makeNoise(t+0.72, 0.14, 0.4);
  const totalDur = (t+0.92 - now)*1000;
  if(onDone) setTimeout(onDone, totalDur);
}

// ══════════════════════════════════════════════════════
// DEEP SPACE OVERLAY — cinematic starfield experience
// ══════════════════════════════════════════════════════
function DeepSpaceOverlay({active,onClose,th}:{active:boolean;onClose:()=>void;th:any}){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const audioRef  = useRef<{ctx:AudioContext;master:GainNode;stop:()=>void}|null>(null);

  // Generate stable star data
  const stars = useMemo(()=>Array.from({length:280},(_,i)=>({
    x: Math.random(), y: Math.random(),
    r: Math.pow(Math.random(),2)*2.8+0.3,   // power curve — mostly small, few big
    speed: Math.random()*0.00015+0.00003,    // very slow drift
    angle: Math.random()*Math.PI*2,
    twinkleSpd: Math.random()*0.012+0.004,
    twinklePh: Math.random()*Math.PI*2,
    bright: Math.random()>0.88,
    // blue-white color variation
    hue: Math.floor(Math.random()*3),        // 0=white, 1=blue-white, 2=warm
    flash: Math.random()>0.97,               // rare flash stars
  })),[]);

  // Shooting stars
  const shooters = useRef<{x:number;y:number;vx:number;vy:number;life:number;maxLife:number;w:number}[]>([]);

  // Deep space ambient audio
  useEffect(()=>{
    if(!active){ audioRef.current?.stop(); audioRef.current=null; return; }
    const AudioCtx=window.AudioContext||(window as any).webkitAudioContext;
    const ctx=new AudioCtx();
    const master=ctx.createGain(); master.gain.value=0; master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.3,ctx.currentTime+2);

    // Reverb
    const rLen=ctx.sampleRate*4;
    const rBuf=ctx.createBuffer(2,rLen,ctx.sampleRate);
    for(let ch=0;ch<2;ch++){const d=rBuf.getChannelData(ch);for(let i=0;i<rLen;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/rLen,2);}
    const reverb=ctx.createConvolver(); reverb.buffer=rBuf;
    const revG=ctx.createGain(); revG.gain.value=0.7; reverb.connect(revG); revG.connect(master);

    // Deep sine pads
    [40,80,120].forEach((f,i)=>{
      const o=ctx.createOscillator(); o.type="sine"; o.frequency.value=f;
      const g=ctx.createGain(); g.gain.value=[0.35,0.18,0.08][i];
      o.connect(g); g.connect(master); o.start();
    });
    // Dreamy melody (pentatonic A)
    const mel=[220,261.6,293.7,329.6,392,440,523.3];
    let step=0;
    const ping=()=>{
      const o=ctx.createOscillator(); o.type="sine"; o.frequency.value=mel[step%mel.length]; step++;
      const g=ctx.createGain(); const t=ctx.currentTime,dur=3+Math.random()*2;
      g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(0.09,t+0.3); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
      o.connect(g); g.connect(reverb); o.start(t); o.stop(t+dur);
    };
    ping();
    const pi=setInterval(ping,2800+Math.random()*1800);

    const stop=()=>{
      clearInterval(pi);
      master.gain.setValueAtTime(master.gain.value,ctx.currentTime);
      master.gain.linearRampToValueAtTime(0,ctx.currentTime+1.6);
      setTimeout(()=>{try{ctx.close();}catch(e){}},2000);
    };
    audioRef.current={ctx,master,stop};
    return()=>{stop();};
  },[active]);

  // Canvas animation
  useEffect(()=>{
    if(!active){ cancelAnimationFrame(rafRef.current); return; }
    const c=canvasRef.current; if(!c) return;
    const ctx=c.getContext("2d")!;
    let W=0,H=0;
    const resize=()=>{W=c.width=window.innerWidth;H=c.height=window.innerHeight;};
    resize(); window.addEventListener("resize",resize);

    let t=0;
    const draw=()=>{
      t+=0.012;
      // Fade trail (not full clear — creates motion blur)
      ctx.fillStyle="rgba(4,6,12,0.18)";
      ctx.fillRect(0,0,W,H);

      const COLORS=["rgba(220,232,255,","rgba(180,210,255,","rgba(255,245,230,"];

      // ── Draw stars ──
      stars.forEach(s=>{
        // Slow drift
        s.x += Math.cos(s.angle)*s.speed;
        s.y += Math.sin(s.angle)*s.speed;
        if(s.x<0) s.x=1; if(s.x>1) s.x=0;
        if(s.y<0) s.y=1; if(s.y>1) s.y=0;

        const tw = s.flash
          ? (Math.random()>0.992 ? 0.95+Math.random()*0.05 : 0.05+Math.sin(t*s.twinkleSpd*200+s.twinklePh)*0.05)
          : 0.35+0.65*Math.sin(t*s.twinkleSpd*180+s.twinklePh);
        const cx=s.x*W, cy=s.y*H;
        const col=COLORS[s.hue];

        ctx.save();
        ctx.globalAlpha=tw;

        // Bright stars get diffraction spikes
        if(s.bright || (s.flash && tw>0.5)){
          const len=s.r*(s.flash&&tw>0.5?20:10);
          const spikeAlpha=s.flash&&tw>0.5?0.9:0.55;
          [0,90,45,135].forEach(angle=>{
            const rad=angle*Math.PI/180;
            const grad=ctx.createLinearGradient(cx-Math.cos(rad)*len,cy-Math.sin(rad)*len,cx+Math.cos(rad)*len,cy+Math.sin(rad)*len);
            grad.addColorStop(0,col+"0)");
            grad.addColorStop(0.5,col+spikeAlpha+")");
            grad.addColorStop(1,col+"0)");
            ctx.strokeStyle=grad; ctx.lineWidth=s.flash&&tw>0.5?1.2:0.7;
            ctx.beginPath(); ctx.moveTo(cx-Math.cos(rad)*len,cy-Math.sin(rad)*len);
            ctx.lineTo(cx+Math.cos(rad)*len,cy+Math.sin(rad)*len); ctx.stroke();
          });
          // Halo
          const halo=ctx.createRadialGradient(cx,cy,0,cx,cy,s.r*(s.flash&&tw>0.5?10:5));
          halo.addColorStop(0,col+"0.35)"); halo.addColorStop(1,col+"0)");
          ctx.fillStyle=halo; ctx.beginPath(); ctx.arc(cx,cy,s.r*(s.flash&&tw>0.5?10:5),0,Math.PI*2); ctx.fill();
        }

        // Star core
        ctx.beginPath(); ctx.arc(cx,cy,s.r*(s.flash&&tw>0.5?1.8:1),0,Math.PI*2);
        ctx.shadowColor=col+"0.8)"; ctx.shadowBlur=s.bright?6:3;
        ctx.fillStyle=col+"1)"; ctx.fill();
        ctx.shadowBlur=0;
        ctx.restore();
      });

      // ── Shooting stars (spawn occasionally) ──
      if(Math.random()>0.992){
        const angle=(Math.random()*0.4+0.1)*Math.PI;
        const spd=W*(0.008+Math.random()*0.012);
        shooters.current.push({
          x:Math.random()*W*0.7,y:Math.random()*H*0.4,
          vx:Math.cos(angle)*spd, vy:Math.sin(angle)*spd,
          life:0, maxLife:50+Math.floor(Math.random()*30), w:1.2+Math.random()*1.2,
        });
      }
      shooters.current = shooters.current.filter(s=>{
        s.x+=s.vx; s.y+=s.vy; s.life++;
        const prog=s.life/s.maxLife;
        const alpha=prog<0.2 ? prog/0.2 : prog>0.7 ? 1-(prog-0.7)/0.3 : 1;
        const len=s.w*(18+s.maxLife*0.5);
        const grad=ctx.createLinearGradient(s.x-s.vx*(len/Math.hypot(s.vx,s.vy)),s.y-s.vy*(len/Math.hypot(s.vx,s.vy)),s.x,s.y);
        grad.addColorStop(0,"rgba(200,225,255,0)");
        grad.addColorStop(1,`rgba(220,235,255,${alpha*0.9})`);
        ctx.save(); ctx.strokeStyle=grad; ctx.lineWidth=s.w*alpha;
        ctx.shadowColor="rgba(180,215,255,0.8)"; ctx.shadowBlur=4;
        ctx.beginPath();
        ctx.moveTo(s.x-s.vx*(len/Math.hypot(s.vx,s.vy)),s.y-s.vy*(len/Math.hypot(s.vx,s.vy)));
        ctx.lineTo(s.x,s.y); ctx.stroke(); ctx.restore();
        return s.life<s.maxLife && s.x<W*1.2 && s.y<H*1.2;
      });

      rafRef.current=requestAnimationFrame(draw);
    };
    // Black initial fill
    ctx.fillStyle="#04060c"; ctx.fillRect(0,0,W||window.innerWidth,H||window.innerHeight);
    draw();
    return()=>{ window.removeEventListener("resize",resize); cancelAnimationFrame(rafRef.current); };
  },[active,stars]);

  // ESC
  useEffect(()=>{
    if(!active) return;
    const fn=(e:KeyboardEvent)=>{if(e.key==="Escape")onClose();};
    window.addEventListener("keydown",fn);
    return()=>window.removeEventListener("keydown",fn);
  },[active,onClose]);

  return(
    <AnimatePresence>
      {active&&(
        <motion.div
          initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          transition={{duration:1.6,ease:"easeInOut"}}
          style={{position:"fixed",inset:0,zIndex:500}}>
          <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/>

          {/* Close hint */}
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            transition={{delay:2,duration:1}}
            onClick={onClose}
            style={{
              position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",
              fontFamily:"'Share Tech Mono',monospace",fontSize:10,letterSpacing:"0.24em",
              color:"rgba(180,210,255,0.4)",cursor:"none",
              display:"flex",alignItems:"center",gap:8,
            }}>
            <span>[ CLIQUE OU ESC PARA SAIR ]</span>
          </motion.div>

          {/* Audio bars */}
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.5,duration:1}}
            style={{position:"absolute",bottom:32,right:32,display:"flex",alignItems:"flex-end",gap:3,pointerEvents:"none"}}>
            {[0,1,2,3,4].map(i=>(
              <motion.div key={i}
                animate={{scaleY:[0.2,1,0.3,0.8,0.2]}}
                transition={{duration:1.4+i*0.22,delay:i*0.1,repeat:Infinity,ease:"easeInOut"}}
                style={{width:3,height:16,borderRadius:2,background:"rgba(140,190,255,0.45)",transformOrigin:"bottom"}}/>
            ))}
          </motion.div>

          {/* Clickable overlay (whole screen) */}
          <div onClick={onClose} style={{position:"absolute",inset:0,cursor:"none"}}/>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


const DARK = {
  bg:"#12141a", bgCard:"rgba(18,22,32,0.88)", bgCardHov:"rgba(24,30,46,0.96)",
  border:"rgba(220,227,232,0.07)", text:"#dce3e8", textMuted:"#7a9e8a", textFaint:"#2e4038",
  accent:"#7a9e8a", accentHi:"#a8c8b4", accentDim:"#3d6655",
  navBg:"rgba(12,13,18,0.90)", inputBg:"rgba(255,255,255,0.03)",
  shadow:"0 4px 40px rgba(0,0,0,0.6)", starOp:1, avatarBg:"rgba(18,28,22,0.85)",
  scanline:"rgba(122,158,138,0.022)",
};
const LIGHT = {
  bg:"#e8ecf2", bgCard:"rgba(245,248,254,0.88)", bgCardHov:"rgba(255,255,255,0.97)",
  border:"rgba(71,100,145,0.15)", text:"#111827", textMuted:"#3a5a8a", textFaint:"#8aaac8",
  accent:"#3a5a8a", accentHi:"#2a456e", accentDim:"#6a8ab8",
  navBg:"rgba(232,236,242,0.92)", inputBg:"rgba(71,100,145,0.05)",
  shadow:"0 4px 24px rgba(71,100,145,0.12)", starOp:0.28, avatarBg:"rgba(40,65,110,0.18)",
  scanline:"rgba(71,100,145,0.018)",
};

const TR: Record<string,any> = {
  pt:{
    ids:["inicio","sobre","experiencia","tecnologias","projetos","contato"],
    nav:["INÍCIO","SOBRE","EXPERIÊNCIA","TECNOLOGIAS","PROJETOS","CONTATO"],
    status:"SISTEMA ONLINE", target:"ALVO: NGC 1952 · NEBULOSA DO CARANGUEJO",
    objId:"OBJ-001 · IDENTIFICADO", name:"Rafael", role:"Desenvolvedor Fullstack",
    roleLabel:"CLASSIFICAÇÃO DO OPERADOR",
    heroDesc:"Apaixonado por tecnologia e desenvolvimento de aplicações modernas, escaláveis e com foco em performance. Experiência em React, Next.js e bancos de dados SQL/NoSQL.",
    coords:["RA 05h 34m 31s","DEC +22° 00′ 52″","DIST 6523 AL","MAG 8.4","TIPO PLSR"],
    cvBtn:"BAIXAR CV", contactBtn:"CONTATO", scanBtn:"SCAN",
    aboutLabel:"SEG-002 · PERFIL DO OBSERVADOR",
    aboutTitle:"Olá, eu sou Rafael", aboutSub:"DESENVOLVEDOR WEB · FULLSTACK",
    aboutP:[
      "Sou desenvolvedor fullstack — transformo ideias em soluções digitais modernas e escaláveis.",
      "Experiência em front-end e back-end, sempre buscando aprender novas tecnologias e resolver problemas reais.",
      "Apaixonado por projetos desafiadores e pela criação de experiências digitais únicas.",
    ],
    expLabel:"SEG-003 · LOG DE MISSÕES", expTitle:"Experiência",
    expRole:"Estagiário de Tecnologia", expCo:"AGCO Corporation",
    expLoc:"Mogi das Cruzes, SP — Brasil", expType:"Estágio · Presencial",
    expDates:"MAR 2024 — MAR 2025", expDur:"1 ANO",
    expDesc:"Suporte no desenvolvimento de novas tecnologias, projetos com Power Platform e análise de dados.",
    expSkills:["Ciência de Dados","Power Platform","Eng. de Processos"],
    techLabel:"SEG-004 · MAPA DE CONSTELAÇÕES", techTitle:"Tecnologias",
    techSub:"Passe o cursor sobre as estrelas para revelar as constelações",
    projLabel:"SEG-005 · OBJETOS CATALOGADOS", projTitle:"Projetos", projBtn:"ACESSAR",
    contactLabel:"SEG-006 · CANAL DE TRANSMISSÃO",
    contactTitle:"Entre em Contato", contactDesc:"Transmitindo nas frequências disponíveis.",
    namePh:"Seu nome", emailPh:"Seu e-mail", msgPh:"Sua mensagem", sendBtn:"TRANSMITIR",
    footerMain:"OBSERVATÓRIO RAFAEL · 23°31′S 46°11′W", scrollHint:"ROLAR",
  },
  en:{
    ids:["inicio","sobre","experiencia","tecnologias","projetos","contato"],
    nav:["HOME","ABOUT","EXPERIENCE","TECHNOLOGIES","PROJECTS","CONTACT"],
    status:"SYSTEM ONLINE", target:"TARGET: NGC 1952 · CRAB NEBULA",
    objId:"OBJ-001 · IDENTIFIED", name:"Rafael", role:"Fullstack Developer",
    roleLabel:"OPERATOR CLASSIFICATION",
    heroDesc:"Passionate about technology and developing modern, scalable applications focused on performance. Experience in React, Next.js, and SQL/NoSQL databases.",
    coords:["RA 05h 34m 31s","DEC +22° 00′ 52″","DIST 6523 LY","MAG 8.4","TYPE PLSR"],
    cvBtn:"DOWNLOAD CV", contactBtn:"CONTACT", scanBtn:"SCAN",
    aboutLabel:"SEG-002 · OBSERVER PROFILE",
    aboutTitle:"Hi, I'm Rafael", aboutSub:"WEB DEVELOPER · FULLSTACK",
    aboutP:[
      "I'm a fullstack developer — I turn ideas into modern, scalable digital solutions.",
      "Experience in front-end and back-end, always looking to learn new technologies and solve real problems.",
      "Passionate about challenging projects and creating unique digital experiences.",
    ],
    expLabel:"SEG-003 · MISSION LOG", expTitle:"Experience",
    expRole:"Technology Intern", expCo:"AGCO Corporation",
    expLoc:"Mogi das Cruzes, SP — Brazil", expType:"Internship · On-site",
    expDates:"MAR 2024 — MAR 2025", expDur:"1 YEAR",
    expDesc:"Support in developing new technologies, Power Platform projects and data analysis.",
    expSkills:["Data Science","Power Platform","Process Eng."],
    techLabel:"SEG-004 · CONSTELLATION MAP", techTitle:"Technologies",
    techSub:"Hover over the stars to reveal the constellations",
    projLabel:"SEG-005 · CATALOGUED OBJECTS", projTitle:"Projects", projBtn:"ACCESS",
    contactLabel:"SEG-006 · TRANSMISSION CHANNEL",
    contactTitle:"Get in Touch", contactDesc:"Broadcasting on available frequencies.",
    namePh:"Your name", emailPh:"Your email", msgPh:"Your message", sendBtn:"TRANSMIT",
    footerMain:"OBSERVATORY RAFAEL · 23°31′S 46°11′W", scrollHint:"SCROLL",
  },
};

const TECHS = [
  {name:"React",      icon:"/icon-react.png",      color:"#61DAFB", x:0.20,y:0.28,cat:"NGC-4889",mag:"★★★★★"},
  {name:"Next.js",    icon:"/icon-nextjs.png",      color:"#a8c8b4", x:0.50,y:0.15,cat:"NGC-1300",mag:"★★★★★"},
  {name:"TypeScript", icon:"/icon-typescript.png",  color:"#3B82F6", x:0.80,y:0.26,cat:"NGC-7331",mag:"★★★★☆"},
  {name:"Node.js",    icon:"/icon-nodejs.png",      color:"#4ADE80", x:0.15,y:0.68,cat:"NGC-5194",mag:"★★★★☆"},
  {name:"HTML5",      icon:"/icon-html5.png",       color:"#F97316", x:0.44,y:0.58,cat:"NGC-0224",mag:"★★★★☆"},
  {name:"CSS3",       icon:"/icon-css3.png",        color:"#38BDF8", x:0.70,y:0.65,cat:"NGC-2903",mag:"★★★☆☆"},
  {name:"SQL",        icon:"/icon-sql.png",         color:"#7a9e8a", x:0.88,y:0.72,cat:"NGC-3031",mag:"★★★☆☆"},
];
const EDGES = [[0,1],[1,2],[0,3],[0,4],[1,4],[2,6],[4,5],[5,6],[3,4],[2,5]];

const PROJECTS = [
  {name:"CGN Construções",cat:"OBJ-C001",mag:"7.2",
   desc:"Landing page moderna e responsiva para empresa de serralheria e estruturas metálicas.",
   descEn:"Modern responsive landing page for a metalwork and steel structures company.",
   link:"https://cgnconstrucoes.vercel.app/",techs:["React","TypeScript"],
   image:"/cgn-construcoes-thumb.png",color:"#a8c8b4"},
  {name:"Barbearia",cat:"OBJ-C002",mag:"8.1",
   desc:"Website elegante para barbearia local com foco em agendamento online e apresentação de serviços.",
   descEn:"Elegant website for a local barbershop focused on online booking and services.",
   link:"https://example.com/barbearia",techs:["Next.js","TailwindCSS","React"],
   image:"/barbearia-thumb.png",color:"#7a9e8a"},
];

// ── Star Field ──
function StarField({opacity,deepSpace}:{opacity:number;deepSpace:boolean}){
  const ref=useRef<HTMLCanvasElement>(null);
  const raf=useRef(0);
  const dsRef=useRef(deepSpace);
  useEffect(()=>{dsRef.current=deepSpace;},[deepSpace]);
  const stars=useMemo(()=>Array.from({length:340},()=>({
    x:Math.random(),y:Math.random(),
    r:Math.random()*1.6+0.2,
    op:Math.random()*0.65+0.15,
    spd:Math.random()*0.0006+0.0001,
    ph:Math.random()*Math.PI*2,
    bright:Math.random()>0.88,
  })),[]);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d")!;
    let W=0,H=0;
    const resize=()=>{W=c.width=window.innerWidth;H=c.height=window.innerHeight;};
    resize();window.addEventListener("resize",resize);
    let t=0;
    const draw=()=>{
      t+=0.012;ctx.clearRect(0,0,W,H);
      const ds=dsRef.current;
      stars.forEach(s=>{
        // In deep space: full brightness, faster twinkle, larger radius
        const twBase=ds ? s.op*(0.75+0.25*Math.sin(t*s.spd*500+s.ph)) : s.op*(0.5+0.5*Math.sin(t*s.spd*300+s.ph));
        const tw=ds ? Math.min(twBase*1.6,1) : twBase;
        const r=ds ? s.r*1.5 : s.r;
        ctx.save();ctx.globalAlpha=tw;
        if(s.bright){
          const cx=s.x*W,cy=s.y*H,len=r*(ds?14:9);
          const mk=(x1:number,y1:number,x2:number,y2:number)=>{
            const g=ctx.createLinearGradient(x1,y1,x2,y2);
            g.addColorStop(0,"rgba(220,227,232,0)");
            g.addColorStop(0.5,`rgba(220,227,232,${tw})`);
            g.addColorStop(1,"rgba(220,227,232,0)");return g;
          };
          ctx.lineWidth=ds?1.2:0.8;
          ctx.strokeStyle=mk(cx-len,cy,cx+len,cy);
          ctx.beginPath();ctx.moveTo(cx-len,cy);ctx.lineTo(cx+len,cy);ctx.stroke();
          ctx.strokeStyle=mk(cx,cy-len,cx,cy+len);
          ctx.beginPath();ctx.moveTo(cx,cy-len);ctx.lineTo(cx,cy+len);ctx.stroke();
        }
        ctx.beginPath();ctx.arc(s.x*W,s.y*H,r,0,Math.PI*2);
        // Deep space: warm white glow
        if(ds){
          ctx.shadowColor="rgba(220,227,232,0.9)";
          ctx.shadowBlur=s.bright?8:3;
        }
        ctx.fillStyle="#dce3e8";ctx.fill();
        ctx.shadowBlur=0;
        ctx.restore();
      });
      raf.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>{window.removeEventListener("resize",resize);cancelAnimationFrame(raf.current);};
  },[stars]);
  return <canvas ref={ref} style={{
    position:"fixed",inset:0,zIndex:0,pointerEvents:"none",
    opacity: deepSpace ? 1 : opacity,
    transition:"opacity 1.4s ease"
  }}/>;
}

// ── Constellation Canvas ──
function ConstellationMap({th,lang}:{th:typeof DARK;lang:string}){
  const ref=useRef<HTMLCanvasElement>(null);
  const wrapRef=useRef<HTMLDivElement>(null);
  const [hovered,setHovered]=useState<number|null>(null);
  const [dims,setDims]=useState({w:800,h:420});
  const [tip,setTip]=useState<{x:number;y:number;i:number}|null>(null);
  const raf=useRef(0);
  const tRef=useRef(0);

  useEffect(()=>{
    const obs=new ResizeObserver(entries=>{
      const{width}=entries[0].contentRect;
      setDims({w:width,h:Math.max(360,width*0.52)});
    });
    if(wrapRef.current)obs.observe(wrapRef.current);
    return()=>obs.disconnect();
  },[]);

  const gp=useCallback((tech:typeof TECHS[0],W:number,H:number)=>({x:tech.x*W,y:tech.y*H}),[]);

  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d")!;
    c.width=dims.w;c.height=dims.h;
    const W=dims.w,H=dims.h;
    const draw=()=>{
      tRef.current+=0.018;const t=tRef.current;
      ctx.clearRect(0,0,W,H);
      // edges
      EDGES.forEach(([a,b])=>{
        const pa=gp(TECHS[a],W,H),pb=gp(TECHS[b],W,H);
        const active=hovered!==null&&(hovered===a||hovered===b);
        ctx.beginPath();ctx.moveTo(pa.x,pa.y);ctx.lineTo(pb.x,pb.y);
        if(active){
          ctx.strokeStyle=th.accentHi+"cc";ctx.lineWidth=1.4;
          ctx.setLineDash([]);ctx.shadowColor=th.accentHi;ctx.shadowBlur=10;
        }else{
          ctx.strokeStyle=th.accent+"25";ctx.lineWidth=0.6;
          ctx.setLineDash([4,7]);ctx.shadowBlur=0;
        }
        ctx.stroke();ctx.shadowBlur=0;ctx.setLineDash([]);
      });
      // stars
      TECHS.forEach((tech,i)=>{
        const{x,y}=gp(tech,W,H);
        const isH=hovered===i;
        const pulse=0.7+0.3*Math.sin(t*1.5+i*0.9);
        const r=isH?15:7+pulse*2;
        if(isH){
          const grd=ctx.createRadialGradient(x,y,0,x,y,44);
          grd.addColorStop(0,tech.color+"44");grd.addColorStop(1,"transparent");
          ctx.fillStyle=grd;ctx.beginPath();ctx.arc(x,y,44,0,Math.PI*2);ctx.fill();
          [0,90,45,135].forEach(angle=>{
            const rad=angle*Math.PI/180,len=26;
            const grd2=ctx.createLinearGradient(x-Math.cos(rad)*len,y-Math.sin(rad)*len,x+Math.cos(rad)*len,y+Math.sin(rad)*len);
            grd2.addColorStop(0,"rgba(220,227,232,0)");grd2.addColorStop(0.5,"rgba(220,227,232,0.6)");grd2.addColorStop(1,"rgba(220,227,232,0)");
            ctx.strokeStyle=grd2;ctx.lineWidth=0.9;
            ctx.beginPath();ctx.moveTo(x-Math.cos(rad)*len,y-Math.sin(rad)*len);ctx.lineTo(x+Math.cos(rad)*len,y+Math.sin(rad)*len);ctx.stroke();
          });
        }
        ctx.beginPath();ctx.arc(x,y,r*0.5,0,Math.PI*2);
        ctx.fillStyle=isH?tech.color:"#dce3e8";
        ctx.shadowColor=isH?tech.color:th.accent;ctx.shadowBlur=isH?18:5;
        ctx.fill();ctx.shadowBlur=0;
        ctx.font=isH?"11px 'Share Tech Mono',monospace":"9px 'Share Tech Mono',monospace";
        ctx.fillStyle=isH?th.text:th.textMuted+"aa";ctx.textAlign="center";
        ctx.fillText(tech.name,x,y+(isH?30:20));
        if(isH){ctx.font="9px 'Share Tech Mono',monospace";ctx.fillStyle=th.accent;ctx.fillText(tech.cat,x,y-24);}
      });
      raf.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(raf.current);
  },[dims,hovered,th,gp]);

  const onMove=useCallback((e:React.MouseEvent<HTMLCanvasElement>)=>{
    const rect=ref.current!.getBoundingClientRect();
    const mx=e.clientX-rect.left,my=e.clientY-rect.top;
    let found:number|null=null;
    TECHS.forEach((tech,i)=>{
      if(Math.hypot(mx-tech.x*dims.w,my-tech.y*dims.h)<30)found=i;
    });
    setHovered(found);
    setTip(found!==null?{x:TECHS[found].x*dims.w,y:TECHS[found].y*dims.h,i:found}:null);
  },[dims]);

  return(
    <div ref={wrapRef} style={{position:"relative",width:"100%",height:dims.h}}>
      <canvas ref={ref} width={dims.w} height={dims.h}
        onMouseMove={onMove} onMouseLeave={()=>{setHovered(null);setTip(null);}}
        style={{width:"100%",height:"100%",cursor:hovered!==null?"crosshair":"default"}}/>
      <AnimatePresence>
        {tip&&(
          <motion.div key={tip.i}
            initial={{opacity:0,scale:0.85,y:8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.85}}
            transition={{duration:0.18}}
            style={{
              position:"absolute",
              left:Math.min(tip.x+22,dims.w-175),
              top:Math.max(tip.y-90,8),
              width:165,pointerEvents:"none",zIndex:10,
              background:th.bgCard,border:`1px solid ${TECHS[tip.i].color}55`,
              borderRadius:4,padding:"13px 15px",backdropFilter:"blur(16px)",
              boxShadow:`0 0 24px ${TECHS[tip.i].color}28`,
            }}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <img src={TECHS[tip.i].icon} alt={TECHS[tip.i].name} style={{width:30,height:30,objectFit:"contain"}}/>
              <span style={{fontWeight:700,fontSize:16,color:th.text}}>{TECHS[tip.i].name}</span>
            </div>
            <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:th.accent,letterSpacing:"0.14em",marginBottom:3}}>{TECHS[tip.i].cat}</div>
            <div style={{fontSize:13,color:TECHS[tip.i].color}}>{TECHS[tip.i].mag}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── HUD ──
function HUD({th}:{th:typeof DARK}){
  const[utc,setUtc]=useState("--:--:-- UTC");
  const[ra,setRa]=useState("RA --h --m --s");
  useEffect(()=>{
    const tick=()=>{
      const n=new Date();
      setUtc(n.toUTCString().slice(17,25)+" UTC");
      setRa(`RA ${String(n.getUTCHours()).padStart(2,"0")}h ${String(n.getUTCMinutes()).padStart(2,"0")}m ${String(n.getUTCSeconds()).padStart(2,"0")}s`);
    };
    tick();const id=setInterval(tick,1000);return()=>clearInterval(id);
  },[]);
  return(
    <div style={{position:"fixed",bottom:20,left:22,zIndex:50,pointerEvents:"none",fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:th.accent,lineHeight:1.9,opacity:0.6,letterSpacing:"0.1em"}}>
      <div>{utc}</div><div>{ra}</div><div>DEC +23° 31′ 00″</div>
    </div>
  );
}

// ── Reticle ──
function Reticle({th}:{th:typeof DARK}){
  return(
    <div style={{position:"fixed",inset:0,zIndex:1,pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <svg width="200" height="200" viewBox="0 0 200 200" style={{opacity:0.045}}>
        <circle cx="100" cy="100" r="88" stroke={th.accent} strokeWidth="0.7" fill="none"/>
        <circle cx="100" cy="100" r="62" stroke={th.accent} strokeWidth="0.4" fill="none"/>
        <circle cx="100" cy="100" r="3.5" stroke={th.accent} strokeWidth="0.7" fill="none"/>
        <line x1="0" y1="100" x2="75" y2="100" stroke={th.accent} strokeWidth="0.5"/>
        <line x1="125" y1="100" x2="200" y2="100" stroke={th.accent} strokeWidth="0.5"/>
        <line x1="100" y1="0" x2="100" y2="75" stroke={th.accent} strokeWidth="0.5"/>
        <line x1="100" y1="125" x2="100" y2="200" stroke={th.accent} strokeWidth="0.5"/>
        {Array.from({length:12},(_,i)=>{
          const a=i*30,r=88;
          const x1=100+r*Math.cos(a*Math.PI/180),y1=100+r*Math.sin(a*Math.PI/180);
          const x2=100+(r-10)*Math.cos(a*Math.PI/180),y2=100+(r-10)*Math.sin(a*Math.PI/180);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={th.accent} strokeWidth="0.8"/>;
        })}
      </svg>
    </div>
  );
}

// ── Navbar ──
function Navbar({t,th,theme,setTheme,lang,setLang,active,deepSpace,setDeepSpace,audioOn,setAudioOn}:any){
  const[scrolled,setScrolled]=useState(false);
  const[mob,setMob]=useState(false);
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>50);
    window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn);
  },[]);
  return(<>
    <motion.nav initial={{y:-72,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.55}}
      style={{position:"fixed",top:0,left:0,right:0,zIndex:100,height:64,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 clamp(1.2rem,4vw,2.8rem)",background:scrolled?th.navBg:"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?`1px solid ${th.border}`:"none",transition:"background 0.4s,border 0.4s"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={th.accent} strokeWidth="1.4">
          <circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:15,letterSpacing:"0.14em",color:th.accent,fontWeight:700}}>RAF.OBS</span>
      </div>
      <div className="nd" style={{display:"flex",gap:28}}>
        {t.nav.map((item:string,i:number)=>{
          const a=active===t.ids[i];
          return(<a key={i} href={`#${t.ids[i]}`} style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,letterSpacing:"0.18em",color:a?th.accentHi:th.textMuted,textDecoration:"none",position:"relative",paddingBottom:3,transition:"color 0.2s"}}>
            {item}{a&&<motion.div layoutId="nav-ul" style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:th.accent}}/>}
          </a>);
        })}
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <button onClick={()=>setTheme(theme==="dark"?"light":"dark")} style={{width:36,height:36,borderRadius:4,border:`1px solid ${th.border}`,background:th.inputBg,color:th.textMuted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{theme==="dark"?<Sun size={15}/>:<Moon size={15}/>}</button>
        <button onClick={()=>setLang(lang==="pt"?"en":"pt")} style={{padding:"6px 12px",borderRadius:4,border:`1px solid ${th.border}`,background:th.inputBg,color:th.accent,cursor:"none",fontFamily:"'Share Tech Mono',monospace",fontSize:11,letterSpacing:"0.12em",fontWeight:700}}>{lang==="pt"?"EN":"PT"}</button>
        {/* Ambient sound toggle */}
        <motion.button
          title={audioOn ? (lang==="pt"?"Desligar som":"Mute audio") : (lang==="pt"?"Som ambiente":"Ambient sound")}
          onClick={()=>setAudioOn(!audioOn)}
          whileHover={{scale:1.08}}
          style={{
            width:36,height:36,borderRadius:4,
            border:`1px solid ${audioOn ? th.accent+"88" : th.border}`,
            background: audioOn ? `${th.accent}18` : th.inputBg,
            color: audioOn ? th.accent : th.textFaint,
            cursor:"none",display:"flex",alignItems:"center",justifyContent:"center",gap:2,
            transition:"all 0.25s",
            flexShrink:0,
          }}>
          {audioOn ? (
            /* sound waves on */
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          ) : (
            /* sound off */
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          )}
        </motion.button>
        <motion.button
          title={deepSpace ? "Sair do Deep Space" : "Modo Deep Space"}
          onClick={()=>setDeepSpace(!deepSpace)}
          animate={deepSpace ? {} : {
            boxShadow:[
              `0 0 0px ${th.accentHi}00`,
              `0 0 18px ${th.accentHi}70`,
              `0 0 6px ${th.accentHi}30`,
              `0 0 22px ${th.accentHi}80`,
              `0 0 0px ${th.accentHi}00`,
            ]
          }}
          transition={deepSpace ? {} : {duration:3.2,repeat:Infinity,ease:"easeInOut"}}
          style={{
            position:"relative",
            height:36,borderRadius:4,
            border:`1px solid ${deepSpace ? th.accentHi+"99" : th.accentHi+"55"}`,
            background: deepSpace ? `${th.accentHi}28` : `${th.accentHi}10`,
            color: deepSpace ? th.accentHi : th.accentHi,
            cursor:"none",display:"flex",alignItems:"center",justifyContent:"center",
            gap:7, padding:"0 10px",
            transition:"background 0.3s, border 0.3s",
          }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="12" cy="12" r="9"/>
            <circle cx="12" cy="12" r="4"/>
            <line x1="12" y1="2" x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="6" y2="12"/>
            <line x1="18" y1="12" x2="22" y2="12"/>
          </svg>
          <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,letterSpacing:"0.14em",whiteSpace:"nowrap"}}>
            {deepSpace ? "SAIR" : "DEEP SPACE"}
          </span>
        </motion.button>
        <button className="nm" onClick={()=>setMob(!mob)} style={{width:36,height:36,borderRadius:4,border:`1px solid ${th.border}`,background:th.inputBg,color:th.textMuted,cursor:"pointer",display:"none",alignItems:"center",justifyContent:"center"}}>{mob?<X size={15}/>:<Menu size={15}/>}</button>
      </div>
    </motion.nav>
    <AnimatePresence>{mob&&(
      <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.18}}
        style={{position:"fixed",top:64,left:0,right:0,zIndex:99,background:th.navBg,backdropFilter:"blur(20px)",borderBottom:`1px solid ${th.border}`,padding:"12px 24px 18px"}}>
        {t.nav.map((item:string,i:number)=>(
          <a key={i} href={`#${t.ids[i]}`} onClick={()=>setMob(false)} style={{display:"block",padding:"10px 0",borderBottom:`1px solid ${th.border}`,fontFamily:"'Share Tech Mono',monospace",fontSize:12,letterSpacing:"0.15em",color:active===t.ids[i]?th.accentHi:th.textMuted,textDecoration:"none"}}>{item}</a>
        ))}
      </motion.div>
    )}</AnimatePresence>
  </>);
}

// ── Helpers ──
function SecLabel({text,th}:any){
  return(
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,justifyContent:"center"}}>
      <div style={{flex:1,maxWidth:64,height:1,background:`linear-gradient(to right,transparent,${th.accent})`}}/>
      <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,letterSpacing:"0.22em",color:th.accent}}>{text}</span>
      <div style={{flex:1,maxWidth:64,height:1,background:`linear-gradient(to left,transparent,${th.accent})`}}/>
    </div>
  );
}

function Reveal({children,delay=0,x=0,y=32}:any){
  const ref=useRef<HTMLDivElement>(null);
  const[vis,setVis]=useState(false);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:0.08});
    obs.observe(el);return()=>obs.disconnect();
  },[]);
  return(<motion.div ref={ref} initial={{opacity:0,x,y}} animate={vis?{opacity:1,x:0,y:0}:{}} transition={{duration:0.75,delay,ease:[0.16,1,0.3,1]}}>{children}</motion.div>);
}

function Card({children,th,accent,style={}}:any){
  const[hov,setHov]=useState(false);
  const col=accent||th.accent;
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{borderRadius:4,position:"relative",overflow:"hidden",background:hov?th.bgCardHov:th.bgCard,border:`1px solid ${hov?col+"55":th.border}`,boxShadow:hov?`0 0 28px ${col}18, ${th.shadow}`:th.shadow,backdropFilter:"blur(16px)",transform:hov?"translateY(-3px)":"translateY(0)",transition:"all 0.28s",...style}}>
      {(["tl","tr","bl","br"] as const).map(c=>(
        <div key={c} style={{position:"absolute",top:c[0]==="t"?8:undefined,bottom:c[0]==="b"?8:undefined,left:c[1]==="l"?8:undefined,right:c[1]==="r"?8:undefined,width:12,height:12,pointerEvents:"none",borderTop:c[0]==="t"?`1px solid ${col}44`:"none",borderBottom:c[0]==="b"?`1px solid ${col}44`:"none",borderLeft:c[1]==="l"?`1px solid ${col}44`:"none",borderRight:c[1]==="r"?`1px solid ${col}44`:"none"}}/>
      ))}
      {children}
    </div>
  );
}

function useActive(ids:string[]){
  const[act,setAct]=useState(ids[0]);
  useEffect(()=>{
    const fn=()=>{let cur=ids[0];ids.forEach(id=>{const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<=window.innerHeight*0.52)cur=id;});setAct(cur);};
    window.addEventListener("scroll",fn,{passive:true});fn();return()=>window.removeEventListener("scroll",fn);
  },[ids]);
  return act;
}

// ══ MAIN ══
export default function Home(){
  const[lang,setLang]=useState<"pt"|"en">("pt");
  const[theme,setTheme]=useState<"dark"|"light">("dark");
  const[showTop,setShowTop]=useState(false);
  const[scanning,setScanning]=useState(false);
  const t=TR[lang];const th=theme==="dark"?DARK:LIGHT;
  const active=useActive(t.ids);
  useEffect(()=>{const fn=()=>setShowTop(window.scrollY>400);window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn);},[]);
  const[deepSpace,setDeepSpace]=useState(false);
  const[audioOn,setAudioOn]=useState(false);
  const ambient=useAmbientAudio();
  const[txState,setTxState]=useState<"idle"|"sending"|"sent">("idle");
  const scan=()=>{setScanning(true);setTimeout(()=>setScanning(false),2600);};
  useEffect(()=>{
    if(audioOn) ambient.start(); else ambient.stop();
    return()=>{ ambient.stop(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[audioOn]);
  const transmit=()=>{
    if(txState!=="idle") return;
    setTxState("sending");
    playSpaceRadio(()=>setTxState("sent"));
    setTimeout(()=>setTxState("idle"),5500);
  };

  return(<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Outfit:wght@300;400;500;600;700;800&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
      html{scroll-behavior:smooth;}
      body{font-family:'Outfit',sans-serif;background:${th.bg};color:${th.text};overflow-x:hidden;transition:background 0.4s,color 0.4s;cursor:none;}
      ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:${th.bg};}::-webkit-scrollbar-thumb{background:${th.accent};border-radius:2px;}
      a{text-decoration:none;color:inherit;}
      body::after{content:'';position:fixed;inset:0;z-index:1;pointer-events:none;background-image:repeating-linear-gradient(0deg,${th.scanline} 0px,${th.scanline} 1px,transparent 1px,transparent 3px);}
      .grid-bg{position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(${th.accent}04 1px,transparent 1px),linear-gradient(90deg,${th.accent}04 1px,transparent 1px);background-size:60px 60px;}
      @media(max-width:768px){.nd{display:none!important}.nm{display:flex!important}}
      .hero-outer{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px clamp(1rem,5vw,3rem) 60px;position:relative;z-index:2;}
      .hero-grid{display:grid;grid-template-columns:1fr 420px;gap:clamp(2rem,4vw,5rem);align-items:center;max-width:1100px;width:100%;margin:0 auto;}
      @media(max-width:900px){.hero-grid{grid-template-columns:1fr;text-align:center;}.hbtns{justify-content:center!important;}.hsoc{justify-content:center!important;}.visor{width:100%!important;max-width:440px;margin:0 auto;}}
      .visor{border-radius:6px;border:1px solid ${th.border};background:${th.bgCard};backdrop-filter:blur(16px);box-shadow:0 0 60px ${th.accent}20, ${th.shadow};overflow:hidden;}
      .visor-hdr{padding:10px 18px;border-bottom:1px solid ${th.border};display:flex;justify-content:space-between;align-items:center;background:${th.accent}0a;}
      @keyframes scanAnim{0%{top:0;opacity:1}90%{top:100%;opacity:1}100%{top:100%;opacity:0}}
      .scan-bar{position:absolute;left:0;right:0;height:2px;z-index:20;background:linear-gradient(to right,transparent,${th.accentHi},transparent);animation:scanAnim 2.4s ease-in-out forwards;box-shadow:0 0 14px ${th.accent};}
      .section{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:100px clamp(1rem,5vw,3rem);position:relative;z-index:2;}
      .inner{max-width:900px;width:100%;margin:0 auto;}
      .btn-solid{display:inline-flex;align-items:center;gap:9px;padding:12px 26px;border-radius:4px;background:${th.accent};border:1px solid ${th.accent};color:${th.bg};font-family:'Share Tech Mono',monospace;font-size:12px;letter-spacing:0.14em;font-weight:700;cursor:pointer;transition:all 0.22s;}
      .btn-solid:hover{filter:brightness(1.2);transform:translateY(-2px);box-shadow:0 0 24px ${th.accent}55;}
      .btn-ghost{display:inline-flex;align-items:center;gap:9px;padding:11px 24px;border-radius:4px;background:${th.accent}18;border:1px solid ${th.accent}55;color:${th.accentHi};font-family:'Share Tech Mono',monospace;font-size:12px;letter-spacing:0.14em;cursor:pointer;transition:all 0.22s;}
      .btn-ghost:hover{background:${th.accent}30;border-color:${th.accent};transform:translateY(-2px);box-shadow:0 0 18px ${th.accent}28;}
      .obs-inp{width:100%;background:${th.inputBg};border:1px solid ${th.border};border-radius:4px;padding:13px 16px;color:${th.text};font-family:'Outfit',sans-serif;font-size:15px;outline:none;resize:none;transition:border-color 0.2s,box-shadow 0.2s;}
      .obs-inp::placeholder{color:${th.textFaint};font-size:14px;}
      .obs-inp:focus{border-color:${th.accent}88;box-shadow:0 0 0 2px ${th.accent}14;}
      .proj-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));gap:24px;}
      .about-layout{display:grid;grid-template-columns:auto 1fr;gap:clamp(2rem,5vw,4rem);align-items:start;}
      @media(max-width:640px){.about-layout{grid-template-columns:1fr;justify-items:center;}}
    `}</style>

    <TelescopeCursor th={th}/>
    <DeepSpaceOverlay active={deepSpace} onClose={()=>setDeepSpace(false)} th={th}/>
    <StarField opacity={th.starOp} deepSpace={deepSpace}/>
    <div className="grid-bg"/>
    <Reticle th={th}/>
    <HUD th={th}/>
    <Navbar t={t} th={th} theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} active={active} deepSpace={deepSpace} setDeepSpace={setDeepSpace} audioOn={audioOn} setAudioOn={setAudioOn}/>

    <main style={{position:"relative",zIndex:2}}>

      {/* ══ HERO ══ */}
      <div id="inicio" className="hero-outer">
        <div className="hero-grid">
          {/* Text */}
          <div>
            <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.15}}
              style={{display:"flex",alignItems:"center",gap:10,marginBottom:28}}>
              <motion.div animate={{opacity:[1,0,1]}} transition={{duration:1.1,repeat:Infinity}}
                style={{width:7,height:7,borderRadius:"50%",background:th.accent}}/>
              <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:12,letterSpacing:"0.22em",color:th.accent}}>{t.status}</span>
            </motion.div>
            <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.4,duration:0.7}}
              style={{fontSize:"clamp(3.8rem,9vw,7rem)",fontWeight:800,lineHeight:0.95,letterSpacing:"-0.03em",marginBottom:14,color:th.text}}>{t.name}</motion.h1>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.55}}
              style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
              <span style={{fontFamily:"'Share Tech Mono',monospace",color:th.accent,fontSize:16}}>[</span>
              <span style={{fontWeight:600,fontSize:"clamp(1.1rem,2.8vw,1.45rem)",color:th.accentHi}}>{t.role}</span>
              <span style={{fontFamily:"'Share Tech Mono',monospace",color:th.accent,fontSize:16}}>]</span>
            </motion.div>
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.75}}
              style={{color:th.textMuted,maxWidth:520,lineHeight:1.85,fontSize:16,marginBottom:34}}>{t.heroDesc}</motion.p>
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.95}}
              className="hbtns" style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:30}}>
              <a href="/cv.pdf" download className="btn-solid"><FileDown size={15}/>{t.cvBtn}</a>
              <a href="mailto:seuemail@gmail.com" className="btn-ghost"><Mail size={15}/>{t.contactBtn}</a>
              <button className="btn-ghost" onClick={scan}>
                <motion.span animate={scanning?{opacity:[1,0,1]}:{}} transition={{duration:0.35,repeat:Infinity}}>◈</motion.span>
                {scanning?(lang==="pt"?"VARRENDO...":"SCANNING..."):t.scanBtn}
              </button>
            </motion.div>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.05}}
              className="hsoc" style={{display:"flex",gap:20}}>
              {[{href:"https://github.com/unkdep",Icon:Github,label:"GITHUB"},{href:"https://www.linkedin.com/in/rafaelunk",Icon:Linkedin,label:"LINKEDIN"}].map(({href,Icon,label})=>(
                <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" whileHover={{y:-2}}
                  style={{display:"flex",alignItems:"center",gap:7,fontFamily:"'Share Tech Mono',monospace",fontSize:11,letterSpacing:"0.18em",color:th.textFaint,transition:"color 0.2s"}}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color=th.accentHi}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color=th.textFaint}>
                  <Icon size={16}/>{label}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Visor */}
          <motion.div initial={{opacity:0,scale:0.88,x:30}} animate={{opacity:1,scale:1,x:0}} transition={{delay:0.45,duration:0.75}} className="visor">
            <div className="visor-hdr">
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={th.accent} strokeWidth="1.5"><circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>
                <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,letterSpacing:"0.2em",color:th.accent}}>VISOR · OBJ-001</span>
              </div>
              <div style={{display:"flex",gap:5}}>
                {[th.accent+"77",th.accent+"44",th.accent+"22"].map((c,i)=>(
                  <motion.div key={i} animate={{opacity:[1,0.4,1]}} transition={{duration:2+i*0.7,repeat:Infinity}} style={{width:7,height:7,borderRadius:"50%",background:c}}/>
                ))}
              </div>
            </div>
            <div style={{position:"relative",padding:"30px 24px 20px"}}>
              {scanning&&<div className="scan-bar"/>}
              <div style={{position:"relative",width:170,height:170,margin:"0 auto 22px"}}>
                {[0,1,2].map(i=>(
                  <motion.div key={i} animate={{rotate:i%2===0?360:-360}} transition={{duration:20+i*8,repeat:Infinity,ease:"linear"}}
                    style={{position:"absolute",inset:-(i+1)*16,borderRadius:"50%",border:`1px solid ${th.accent}${["2e","1e","12"][i]}`}}/>
                ))}
                <div style={{position:"absolute",inset:0,zIndex:3,pointerEvents:"none"}}>
                  <svg width="100%" height="100%" viewBox="0 0 170 170">
                    <line x1="85" y1="0" x2="85" y2="60" stroke={th.accent} strokeWidth="0.6" opacity="0.5"/>
                    <line x1="85" y1="110" x2="85" y2="170" stroke={th.accent} strokeWidth="0.6" opacity="0.5"/>
                    <line x1="0" y1="85" x2="60" y2="85" stroke={th.accent} strokeWidth="0.6" opacity="0.5"/>
                    <line x1="110" y1="85" x2="170" y2="85" stroke={th.accent} strokeWidth="0.6" opacity="0.5"/>
                  </svg>
                </div>
                {/* Avatar - avatarBg garante visibilidade no modo light */}
                <div style={{width:170,height:170,borderRadius:"50%",overflow:"hidden",border:`2.5px solid ${th.accent}66`,boxShadow:`0 0 24px ${th.accent}30`,position:"relative",zIndex:2,background:th.avatarBg}}>
                  <img src="/iconesobre.png" alt="Rafael" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5px 12px"}}>
                {[{l:"TIPO",v:"FULLSTACK"},{l:"ORIGEM",v:"BR · SP"},{l:"STATUS",v:"● ATIVO"}].map(({l,v})=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",borderBottom:`1px solid ${th.border}`,padding:"6px 0"}}>
                    <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,letterSpacing:"0.12em",color:th.textFaint}}>{l}</span>
                    <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,letterSpacing:"0.1em",color:th.accent}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div animate={{y:[0,8,0]}} transition={{duration:2.4,repeat:Infinity}}
          style={{marginTop:56,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
          <div style={{width:1,height:50,background:`linear-gradient(to bottom,transparent,${th.accent},transparent)`}}/>
          <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,letterSpacing:"0.26em",color:th.textFaint}}>{t.scrollHint}</span>
        </motion.div>
      </div>

      {/* ══ SOBRE ══ */}
      <section id="sobre" className="section">
        <div className="inner">
          <Reveal><SecLabel text={t.aboutLabel} th={th}/></Reveal>
          <Reveal delay={0.05}>
            <h2 style={{fontSize:"clamp(2.2rem,5vw,3.2rem)",fontWeight:800,letterSpacing:"-0.02em",textAlign:"center",marginBottom:8,color:th.text}}>{t.aboutTitle}</h2>
            <p style={{fontFamily:"'Share Tech Mono',monospace",textAlign:"center",color:th.accent,fontSize:11,letterSpacing:"0.2em",marginBottom:52}}>{t.aboutSub}</p>
          </Reveal>
          <div className="about-layout">
            <Reveal delay={0.08}>
              <div style={{position:"relative",width:160,height:160,flexShrink:0}}>
                {[0,1,2].map(i=>(
                  <motion.div key={i} animate={{scale:[1,1.1,1],opacity:[0.3,0.1,0.3]}} transition={{duration:3.5+i,delay:i*1.1,repeat:Infinity,ease:"easeInOut"}}
                    style={{position:"absolute",inset:-(i+1)*15,borderRadius:"50%",border:`1px solid ${th.accent}44`}}/>
                ))}
                <div style={{width:160,height:160,borderRadius:"50%",overflow:"hidden",border:`2.5px solid ${th.accent}66`,boxShadow:`0 0 24px ${th.accent}30`,position:"relative",zIndex:2,background:th.avatarBg}}>
                  <img src="/iconesobre.png" alt="Rafael" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                </div>
              </div>
            </Reveal>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {t.aboutP.map((p:string,i:number)=>(
                <Reveal key={i} delay={i*0.1} x={20}>
                  <Card th={th} style={{padding:"18px 22px"}}>
                    <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                      <span style={{fontFamily:"'Share Tech Mono',monospace",color:th.accent,fontSize:11,marginTop:3,flexShrink:0}}>{`0${i+1}.`}</span>
                      <p style={{color:th.textMuted,lineHeight:1.85,fontSize:16}}>{p}</p>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ EXPERIÊNCIA ══ */}
      <section id="experiencia" className="section">
        <div className="inner">
          <Reveal><SecLabel text={t.expLabel} th={th}/></Reveal>
          <Reveal delay={0.05}><h2 style={{fontSize:"clamp(2.2rem,5vw,3.2rem)",fontWeight:800,letterSpacing:"-0.02em",textAlign:"center",marginBottom:52,color:th.text}}>{t.expTitle}</h2></Reveal>
          <Reveal delay={0.1}>
            <div style={{position:"relative",paddingLeft:52}}>
              <div style={{position:"absolute",left:15,top:28,bottom:0,width:2,borderRadius:2,background:`linear-gradient(to bottom,${th.accent},transparent)`}}/>
              <motion.div animate={{boxShadow:[`0 0 0 0 ${th.accent}55`,`0 0 0 10px ${th.accent}00`,`0 0 0 0 ${th.accent}55`]}} transition={{duration:2.5,repeat:Infinity}}
                style={{position:"absolute",left:7,top:28,width:18,height:18,borderRadius:"50%",background:th.accent}}/>
              <Card th={th} style={{padding:"32px"}}>
                <div style={{display:"flex",gap:24,flexWrap:"wrap",alignItems:"flex-start"}}>
                  {/* AGCO logo — fundo escuro fixo para logo branca ficar visível em ambos os temas */}
                  <div style={{width:88,height:88,borderRadius:6,flexShrink:0,background:"#1a2535",padding:10,border:`1px solid ${th.border}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 16px rgba(0,0,0,0.25)"}}>
                    <img src="/logo-agco.png" alt="AGCO" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
                  </div>
                  <div style={{flex:1,minWidth:220}}>
                    <div style={{display:"flex",alignItems:"baseline",gap:14,flexWrap:"wrap",marginBottom:6}}>
                      <h3 style={{fontSize:22,fontWeight:800,color:th.text}}>{t.expRole}</h3>
                      <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,letterSpacing:"0.15em",color:th.accent,background:`${th.accent}18`,border:`1px solid ${th.accent}44`,padding:"2px 8px",borderRadius:3}}>{t.expDur}</span>
                    </div>
                    <p style={{fontFamily:"'Share Tech Mono',monospace",color:th.accent,fontSize:12,letterSpacing:"0.12em",marginBottom:4}}>{t.expCo}</p>
                    <p style={{fontFamily:"'Share Tech Mono',monospace",color:th.textFaint,fontSize:10,letterSpacing:"0.14em",marginBottom:18}}>{t.expDates}</p>
                    <p style={{color:th.textMuted,fontSize:15,lineHeight:1.75,marginBottom:18}}>{t.expDesc}</p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
                      {t.expSkills.map((s:string,i:number)=>(
                        <span key={i} style={{fontFamily:"'Share Tech Mono',monospace",padding:"4px 12px",borderRadius:3,border:`1px solid ${th.accent}44`,color:th.accent,background:`${th.accent}0e`,fontSize:11,letterSpacing:"0.12em"}}>{s}</span>
                      ))}
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:22}}>
                      {[{Icon:Globe,text:t.expLoc},{Icon:Zap,text:t.expType}].map(({Icon,text})=>(
                        <span key={text} style={{display:"flex",alignItems:"center",gap:7,color:th.textFaint,fontSize:14}}><Icon size={14} color={th.accent}/>{text}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ TECNOLOGIAS — CONSTELLATION ══ */}
      <section id="tecnologias" className="section">
        <div className="inner">
          <Reveal><SecLabel text={t.techLabel} th={th}/></Reveal>
          <Reveal delay={0.05}>
            <h2 style={{fontSize:"clamp(2.2rem,5vw,3.2rem)",fontWeight:800,letterSpacing:"-0.02em",textAlign:"center",marginBottom:8,color:th.text}}>{t.techTitle}</h2>
            <p style={{fontFamily:"'Share Tech Mono',monospace",textAlign:"center",color:th.textFaint,fontSize:11,letterSpacing:"0.16em",marginBottom:36}}>{t.techSub}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Card th={th} style={{padding:"8px",overflow:"visible"}}>
              <div style={{padding:"10px 16px 8px",borderBottom:`1px solid ${th.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,letterSpacing:"0.2em",color:th.accent}}>MAPA ESTELAR · TECH-CLUSTER</span>
                <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:th.textFaint}}>{TECHS.length} OBJETOS</span>
              </div>
              <ConstellationMap th={th} lang={lang}/>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* ══ PROJETOS ══ */}
      <section id="projetos" className="section">
        <div className="inner">
          <Reveal><SecLabel text={t.projLabel} th={th}/></Reveal>
          <Reveal delay={0.05}><h2 style={{fontSize:"clamp(2.2rem,5vw,3.2rem)",fontWeight:800,letterSpacing:"-0.02em",textAlign:"center",marginBottom:52,color:th.text}}>{t.projTitle}</h2></Reveal>
          <div className="proj-grid">
            {PROJECTS.map((proj,idx)=>(
              <Reveal key={idx} delay={idx*0.1}>
                <Card th={th} accent={proj.color} style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
                  <div style={{padding:"9px 16px",borderBottom:`1px solid ${th.border}`,display:"flex",justifyContent:"space-between",background:`${proj.color}0a`}}>
                    <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,letterSpacing:"0.18em",color:proj.color}}>{proj.cat}</span>
                    <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:th.textFaint}}>MAG {proj.mag}</span>
                  </div>
                  <div style={{position:"relative",height:200,overflow:"hidden"}}>
                    {proj.image?(
                      <motion.img whileHover={{scale:1.05}} transition={{duration:0.4}}
                        src={proj.image} alt={proj.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                    ):(
                      <div style={{width:"100%",height:"100%",background:`${proj.color}0e`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:th.textFaint}}>EM CATALOGAÇÃO</div>
                    )}
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(12,14,20,0.7) 0%,transparent 55%)",pointerEvents:"none"}}/>
                  </div>
                  <div style={{padding:22,flex:1,display:"flex",flexDirection:"column",gap:14}}>
                    <h3 style={{fontSize:20,fontWeight:800,color:th.text}}>{proj.name}</h3>
                    <p style={{color:th.textMuted,fontSize:15,lineHeight:1.8,flex:1}}>{lang==="pt"?proj.desc:proj.descEn}</p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                      {proj.techs.map((tc,i)=>(
                        <span key={i} style={{fontFamily:"'Share Tech Mono',monospace",padding:"4px 10px",borderRadius:3,fontSize:10,letterSpacing:"0.12em",border:`1px solid ${proj.color}44`,color:proj.color,background:`${proj.color}0e`}}>{tc}</span>
                      ))}
                    </div>
                    <motion.a href={proj.link} target="_blank" rel="noopener noreferrer" whileHover={{x:4}}
                      style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center",padding:"11px 0",borderRadius:3,border:`1px solid ${proj.color}44`,background:`${proj.color}0e`,color:proj.color,fontFamily:"'Share Tech Mono',monospace",fontSize:11,letterSpacing:"0.14em",transition:"all 0.22s"}}
                      onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background=`${proj.color}22`;el.style.boxShadow=`0 0 18px ${proj.color}28`;}}
                      onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background=`${proj.color}0e`;el.style.boxShadow="none";}}>
                      {t.projBtn} <ExternalLink size={14}/>
                    </motion.a>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTATO ══ */}
      <section id="contato" className="section">
        <div style={{maxWidth:560,width:"100%",margin:"0 auto"}}>
          <Reveal><SecLabel text={t.contactLabel} th={th}/></Reveal>
          <Reveal delay={0.05}>
            <h2 style={{fontSize:"clamp(2.2rem,5vw,3.2rem)",fontWeight:800,letterSpacing:"-0.02em",textAlign:"center",marginBottom:10,color:th.text}}>{t.contactTitle}</h2>
            <p style={{fontFamily:"'Share Tech Mono',monospace",textAlign:"center",color:th.textFaint,fontSize:11,letterSpacing:"0.18em",marginBottom:40}}>{t.contactDesc}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Card th={th} style={{padding:30}}>
              <div style={{display:"flex",flexDirection:"column",gap:13}}>
                <input type="text" placeholder={t.namePh} className="obs-inp"/>
                <input type="email" placeholder={t.emailPh} className="obs-inp"/>
                <textarea rows={4} placeholder={t.msgPh} className="obs-inp"/>
                <motion.button
                  whileHover={txState==="idle"?{scale:1.01}:{}}
                  whileTap={txState==="idle"?{scale:0.97}:{}}
                  className="btn-solid"
                  style={{justifyContent:"center",width:"100%",marginTop:6,fontSize:13,opacity:txState==="sending"?0.8:1,position:"relative",overflow:"hidden"}}
                  onClick={transmit}>
                  {txState==="idle"&&<>◈ {t.sendBtn}</>}
                  {txState==="sending"&&(
                    <span style={{display:"flex",alignItems:"center",gap:10}}>
                      <motion.span animate={{opacity:[1,0,1]}} transition={{duration:0.45,repeat:Infinity}}>◈</motion.span>
                      <span style={{fontFamily:"'Share Tech Mono',monospace",letterSpacing:"0.18em"}}>{lang==="pt"?"TRANSMITINDO...":"TRANSMITTING..."}</span>
                    </span>
                  )}
                  {txState==="sent"&&(
                    <motion.span initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                      style={{display:"flex",alignItems:"center",gap:10,color:th.bg}}>
                      ✓ {lang==="pt"?"TRANSMISSÃO CONFIRMADA":"TRANSMISSION CONFIRMED"}
                    </motion.span>
                  )}
                </motion.button>
              </div>
            </Card>
          </Reveal>
          <Reveal delay={0.18}>
            <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:26,flexWrap:"wrap"}}>
              {[{href:"mailto:seuemail@gmail.com",Icon:Mail,label:"EMAIL"},{href:"https://www.linkedin.com/in/rafaelunk",Icon:Linkedin,label:"LINKEDIN"},{href:"https://github.com/unkdep",Icon:Github,label:"GITHUB"}].map(({href,Icon,label})=>(
                <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" whileHover={{y:-2}} className="btn-ghost" style={{fontSize:11,letterSpacing:"0.14em"}}>
                  <Icon size={14}/>{label}
                </motion.a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{borderTop:`1px solid ${th.border}`,padding:"30px 24px",display:"flex",flexDirection:"column",alignItems:"center",gap:7,position:"relative",zIndex:2}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={th.accent} strokeWidth="1.4"><circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>
          <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,letterSpacing:"0.2em",color:th.accent}}>{t.footerMain}</span>
        </div>
        <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,letterSpacing:"0.1em",color:th.textFaint}}>© 2025 · TODOS OS DIREITOS RESERVADOS</span>
      </footer>
    </main>

    <AnimatePresence>{showTop&&(
      <motion.button initial={{opacity:0,scale:0.7}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.7}} whileHover={{scale:1.1}}
        onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
        style={{position:"fixed",bottom:28,right:28,zIndex:200,width:44,height:44,borderRadius:4,background:`${th.accent}22`,border:`1px solid ${th.accent}55`,color:th.accentHi,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 16px ${th.accent}28`}}>
        <ArrowUp size={18}/>
      </motion.button>
    )}</AnimatePresence>
  </>);
}