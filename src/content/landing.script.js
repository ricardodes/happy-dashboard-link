
lucide.createIcons();

// Navbar scroll
window.addEventListener('scroll',()=>{
  const nav=document.getElementById('navbar');
  if(window.scrollY>50){nav.style.boxShadow='0 10px 30px rgba(15,94,62,0.1)'; nav.style.padding='0.8rem 0';}
  else{nav.style.boxShadow='none'; nav.style.padding='1.2rem 0';}
});

// Scroll reveal
const reveals=document.querySelectorAll('.reveal');
const revealObserver=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('active');} });
},{threshold:0.1});
reveals.forEach(el=>revealObserver.observe(el));

// Counter animation
const counters=document.querySelectorAll('[data-count]');
const counterObserver=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const target=parseInt(entry.target.getAttribute('data-count'));
      let current=0; const increment=target/50;
      const timer=setInterval(()=>{
        current+=increment;
        if(current>=target){
          entry.target.textContent=target+(target===98?'%':target===24?'h':'+');
          clearInterval(timer);
        }else{
          entry.target.textContent=Math.floor(current)+(target===98?'%':target===24?'h':'+');
        }
      },25);
      counterObserver.unobserve(entry.target);
    }
  });
},{threshold:0.5});
counters.forEach(c=>counterObserver.observe(c));

// Simulador
let simAtual='mei';
function setSimTab(btn,tipo){
  simAtual=tipo;
  document.querySelectorAll('.sim-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  calcularSimulador();
}
function calcularSimulador(){
  const fat=parseFloat(document.getElementById('sim-faturamento').value)||0;
  const setor=document.getElementById('sim-setor').value;
  if(fat===0){document.getElementById('sim-result').classList.remove('show');return;}
  let aliquota=0;
  switch(simAtual){
    case 'mei':aliquota=0.04;break;
    case 'simples':aliquota=setor==='servicos'?0.15:setor==='industria'?0.12:0.10;break;
    case 'presumido':aliquota=setor==='servicos'?0.32:0.16;break;
    case 'real':aliquota=0.34;break;
  }
  const imposto=fat*aliquota;
  const percentual=(aliquota*100).toFixed(1);
  document.getElementById('sim-valor').textContent='R$ '+imposto.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  document.getElementById('sim-percentual').textContent=percentual+'% do faturamento mensal';
  document.getElementById('sim-result').classList.add('show');
}

// Lead form
function handleLead(e){
  e.preventDefault();
  alert('Obrigado! Seu diagnóstico foi solicitado. Nossa equipe entrará em contato em até 24 horas.');
  e.target.reset();
}

// GSAP
if(typeof gsap!=='undefined'){
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.hero-badge',{y:30,opacity:0,duration:1,delay:0.2});
  gsap.from('.hero-title',{y:50,opacity:0,duration:1,delay:0.4});
  gsap.from('.hero-subtitle',{y:30,opacity:0,duration:1,delay:0.6});
  gsap.from('.hero-buttons',{y:30,opacity:0,duration:1,delay:0.8});
  gsap.from('.floating-card',{y:100,opacity:0,duration:1.2,stagger:0.2,delay:1,ease:"power3.out"});
}
