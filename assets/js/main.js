/* Global init */
const $ = (sel,ctx=document)=>ctx.querySelector(sel);
const $$ = (sel,ctx=document)=>Array.from(ctx.querySelectorAll(sel));

// Nav toggle
(()=>{
  const btn = $('.nav-toggle');
  const menu = $('#menu');
  if(!btn||!menu) return;
  btn.addEventListener('click',()=>{
    const exp = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!exp));
    menu.style.display = exp ? 'none' : 'flex';
  });
})();

// Typed hero subtitle
(()=>{
  const target = $('#typed');
  if(!target || !window.Typed) return;
  new Typed('#typed',{
    strings:['Agentic AI Developer','Full‑Stack Web Developer','Innovation Enthusiast'],
    typeSpeed:40,
    backSpeed:15,
    backDelay:900,
    loop:true
  });
})();

// AOS animations
if(window.AOS){ AOS.init({ once:true, duration:700, easing:'ease-out' }); }

// Remove any obsolete ring logic (replaced by flip cards)

// Simple rotating globe particles on canvas (lightweight)
(()=>{
  const canvas = $('#globeCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(2, window.devicePixelRatio||1);
  const resize = ()=>{
    canvas.width = canvas.clientWidth * DPR;
    canvas.height = canvas.clientHeight * DPR;
  };
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const count = 420;
  for(let i=0;i<count;i++){
    const u = Math.random();
    const v = Math.random();
    const theta = 2*Math.PI*u;
    const phi = Math.acos(2*v-1);
    particles.push({theta,phi});
  }
  let t=0;
  function render(){
    t += 0.003;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const R = Math.min(canvas.width, canvas.height)/2.6;
    const cx = canvas.width/2, cy = canvas.height/2;
    particles.forEach(p=>{
      const a = p.theta + t; // rotation
      const x = Math.sin(p.phi)*Math.cos(a);
      const y = Math.cos(p.phi);
      const z = Math.sin(p.phi)*Math.sin(a);
      const depth = (z+1)/2; // 0..1
      const px = cx + x*R;
      const py = cy + y*R;
      const size = 1 + depth*2.2;
      const alpha = 0.35 + depth*0.65;
      ctx.fillStyle = `rgba(0,212,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(px,py,size,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(render);
  }
  render();
})();

// Mission typewriter (no external dep)
(()=>{
  const el = $('.type-mission');
  if(!el) return;
  const text = el.dataset.text || '';
  let i=0; const speed=24;
  const tick=()=>{
    el.textContent = text.slice(0,i++);
    if(i<=text.length) setTimeout(tick,speed);
  };
  tick();
})();

// Removed GitHub calendar; replaced with tech marquee

// Contact form validation (client‑side)
(()=>{
  const form = $('#contactForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    let ok = true;
    const name = $('#name');
    const email = $('#email');
    const message = $('#message');
    const setErr=(id,msg)=>{$('#'+id).textContent=msg};
    setErr('err-name',''); setErr('err-email',''); setErr('err-message','');
    if(!name.value.trim()){ setErr('err-name','Please enter your name'); ok=false; }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){ setErr('err-email','Enter a valid email'); ok=false; }
    if(message.value.trim().length<10){ setErr('err-message','Message must be at least 10 characters'); ok=false; }
    if(ok){
      const mailto = `mailto:siddhantgrooti@gmail.com?subject=${encodeURIComponent('Portfolio Contact from '+name.value)}&body=${encodeURIComponent(message.value+"\n\nFrom: "+email.value)}`;
      window.location.href = mailto;
      form.reset();
    }
  });
})();

// Copy email to clipboard
(()=>{
  const btn = $('#copyEmail');
  if(!btn) return;
  btn.addEventListener('click', async ()=>{
    try{
      await navigator.clipboard.writeText(btn.dataset.email);
      btn.textContent = 'Copied!';
      setTimeout(()=>btn.textContent='Copy Email',1200);
    }catch{alert('Copy failed');}
  });
})();

// Resume download with particle burst
(()=>{
  const btn = $('#downloadResume');
  if(!btn) return;
  btn.addEventListener('click', ()=>{
    burst(btn);
    // Placeholder: replace with actual PDF path when available
    const link = document.createElement('a');
    link.href = 'assets/resume/Siddhant_Kumar_Resume.pdf';
    link.download = 'Siddhant_Kumar_Resume.pdf';
    document.body.appendChild(link); link.click(); link.remove();
  });

  function burst(origin){
    const rect = origin.getBoundingClientRect();
    const cx = rect.left + rect.width/2 + window.scrollX;
    const cy = rect.top + rect.height/2 + window.scrollY;
    const container = document.createElement('div');
    Object.assign(container.style,{position:'absolute',left:0,top:0,width:'100%',height:'100%',pointerEvents:'none'});
    document.body.appendChild(container);
    const N=28;
    for(let i=0;i<N;i++){
      const p = document.createElement('span');
      p.className='particle';
      const angle = (Math.PI*2*i)/N;
      const dist = 80 + Math.random()*40;
      const x = Math.cos(angle)*dist;
      const y = Math.sin(angle)*dist;
      Object.assign(p.style,{
        position:'absolute',left:cx+'px',top:cy+'px',width:'6px',height:'6px',borderRadius:'50%',
        background:`conic-gradient(#00D4FF, #9333EA)`,boxShadow:'0 0 12px #00D4FF'
      });
      container.appendChild(p);
      p.animate([
        { transform:'translate(0,0) scale(1)', opacity:1 },
        { transform:`translate(${x}px,${y}px) scale(0)`, opacity:0 }
      ],{ duration:700, easing:'cubic-bezier(.2,.8,.2,1)' });
    }
    setTimeout(()=>container.remove(),720);
  }
})();

// Leaflet map centered on Punjab, India
(()=>{
  const el = $('#map');
  if(!el || !window.L) return;
  const map = L.map(el).setView([30.9, 75.85], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19}).addTo(map);
  L.marker([30.9,75.85]).addTo(map).bindPopup('Punjab, India');
})();

// Footer year
$('#year').textContent = new Date().getFullYear();

