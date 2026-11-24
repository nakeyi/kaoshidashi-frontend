/* ===== 源自 H5 原型的完整交互逻辑（保留） ===== */

/* ================= 状态 ================= */
const DEMO_SCORE_HISTORY=[
  {m:'9月月考',v:78,marks:[81,78,79,74]},
  {m:'10月月考',v:82,marks:[85,80,84,79]},
  {m:'期中',v:85,marks:[88,84,86,82]},
  {m:'11月周测',v:88,marks:[90,89,87,86]}
].map(({m,v,marks})=>({
  m,v,demo:true,subjects:['数学','语文','英语','物理'].map((name,index)=>({name,score:marks[index],max:100}))
}));


const U = {
  logged:false, onboarded:false, scoreProfile:null,
  name:'', grade:'', gender:'男', school:'', identity:'中考', examDate:'', dailyH:'3',
  subjects:[], total:'', scores:{数学:88, 物理:82, 英语:85, 语文:90}, parentPhone:'',
  activated:false, activeCourse:'', activeSubject:'', activatedCourses:[], activatedSubjects:[], setupStep:0,
  courseStudy:{},
  setup:{schoolProgress:'', textbook:'', nextExam:'', nextExamTime:'', subjectScore:'', plannerTime:'', remark:'',
         stars:[8,1,1,1], evalMethod:'', uploadCount:0, analysisDone:false, studyTime:'', studyDays:'',
         dayPlan:{}, callRemind:'是', planSaved:false},
  materials:[], hours:{today:0.0, week:2.4, total:36.5},
  checkins:[{date:'11-07', txt:'完成二次函数专项 20 题，整理错题 3 道', imgs:2}],
  manage:[{d:'11-06', t:'规划师致电回访', s:'调整学习计划：每晚增加 30 分钟英语阅读'},
          {d:'11-02', t:'月考成绩录入', s:'10 月月考 4 科成绩已建档'}],
  scoresHis:DEMO_SCORE_HISTORY.slice(),
};
const S = { mode:'评分', idx:0, ans:{}, records:[
  {d:'11-08', q:2, ok:false, kp:'垂径定理'},
  {d:'11-07', q:4, ok:false, kp:'简单事件的概率'},
  {d:'11-05', q:6, ok:true, kp:'二次函数图象变换'},
  {d:'11-03', q:1, ok:true, kp:'二次函数与一元二次方程'},
]};
const CHAT = { msgs:[{who:'ai', txt:'同学你好，我是考试大师 AI 答疑助手 🤖\n24 小时在线，数学 / 物理 / 化学 / 英语题目都可以随时提问，我会先给出解题思路和步骤。'}] };

/* ================= 题库 ================= */
const Q = [
 {id:1,type:'single',stem:'已知二次函数 y = x² − 4x + 3 的图象与 x 轴相交，交点的横坐标分别是（　）',opts:['x₁=1，x₂=3','x₁=−1，x₂=3','x₁=1，x₂=−3','x₁=−1，x₂=−3'],ans:0,ana:'令 y = 0：x² − 4x + 3 = 0，因式分解得 (x−1)(x−3) = 0，解得 x₁ = 1，x₂ = 3，故选 A。',kp:'二次函数与一元二次方程'},
 {id:2,type:'single',stem:'⊙O 的半径为 5，弦 AB = 8，则圆心 O 到弦 AB 的距离为（　）',opts:['2','3','4','6'],ans:1,ana:'作 OC ⊥ AB 于点 C，由垂径定理 AC = AB/2 = 4。在 Rt△OAC 中，OC = √(OA² − AC²) = √(25 − 16) = 3，故选 B。',kp:'垂径定理'},
 {id:3,type:'fill',stem:'分解因式：x² − 9 = ______',ans:'(x+3)(x-3)',ana:'利用平方差公式 a² − b² = (a+b)(a−b)，其中 a = x、b = 3，故 x² − 9 = (x+3)(x−3)。',kp:'因式分解'},
 {id:4,type:'fill',stem:'不透明袋子中装有 3 个红球和 2 个白球（除颜色外完全相同），随机摸出 1 个球，摸到红球的概率为 ______',ans:'3/5',ana:'P(摸到红球) = 红球个数 ÷ 总个数 = 3 ÷ (3+2) = 3/5。',kp:'简单事件的概率'},
 {id:5,type:'solve',stem:'解一元一次方程：2x + 6 = 14',ans:'x=4',ana:'移项得 2x = 14 − 6 = 8，两边同除以 2，得 x = 4。',kp:'一元一次方程'},
 {id:6,type:'single',stem:'将抛物线 y = 2x² 向左平移 3 个单位，再向上平移 1 个单位，所得抛物线的解析式为（　）',opts:['y = 2(x+3)² + 1','y = 2(x−3)² + 1','y = 2(x+3)² − 1','y = 2(x−3)² − 1'],ans:0,ana:'平移口诀"左加右减、上加下减"：向左平移 3 个单位，x 换为 x+3；向上平移 1 个单位，解析式 +1，得 y = 2(x+3)² + 1，故选 A。',kp:'二次函数图象变换'},
];
const PAPERS = {
  mock:{name:'模拟测试卷', desc:'全真模拟中考/期末命题风格', n:6},
  sync:{name:'同步测试卷', desc:'与教材章节同步的单元测试', n:6},
  area:{name:'区域测试卷', desc:'本地区近三年真题汇编', n:6},
};
const AITESTS = ['初中物理综合能力测评卷','初中数学综合能力测评卷','初中化学综合能力测评卷','初中英语综合能力测评卷'];
const KPTYPE={'二次函数与一元二次方程':'函数','垂径定理':'几何','因式分解':'数与式','简单事件的概率':'概率统计','一元一次方程':'方程','二次函数图象变换':'函数'};
const CHAPTERS = [
 {t:'1. 专项平面验算（一）', d:'45 分钟 · 已学完', p:100},
 {t:'2. 专项平面验算（二）', d:'38 分钟 · 已学完', p:100},
 {t:'3. 二次函数图像与系数', d:'52 分钟 · 学习中', p:62},
 {t:'4. 圆的证明高频模型', d:'47 分钟 · 未开始', p:0},
 {t:'5. 概率统计速解技巧', d:'41 分钟 · 未开始', p:0},
];

/* ================= 路由 ================= */
let stack = [], curTab = 'home', navDir = 'fwd';
const parentScroll=[];
let sidePageRoot=null;
const screen = document.getElementById('screen');
const tabbar = document.getElementById('tabbar');
function setHTML(html, cls){
  const extra = cls || (html.indexOf('setup-topbar')>=0 ? 'page-setup' : '');
  screen.innerHTML = '<div class="page'+(navDir==='back'?' back':'')+(extra?' '+extra:'')+'">'+html+'</div>';
  screen.scrollTop = 0;
}
function goTab(name){
  if(name==='courses') name='home';
  stack = []; navDir='fwd'; curTab = name;
  const pages = {home:pageHome, qa:pageQa, me:pageMe};
  setHTML(pages[name](), name==='qa'?'page-chat':'');
  tabbar.querySelectorAll('.tb').forEach(b=>b.classList.toggle('on', b.dataset.tab===name));
  tabbar.style.display='flex';
}
function pushPage(fn, dir){ navDir = dir||'fwd'; stack.push(fn); setHTML(fn()); tabbar.style.display='none'; }
function popPage(){
  if(!stack.length) return;
  const top=parentScroll[stack.length-1]||0;
  stack.pop();
  parentScroll.length=stack.length;
  navDir='back';
  if(stack.length) setHTML(stack[stack.length-1]());
  else goTab(curTab,sidePageRoot);
  screen.scrollTop=top;
}
function goBack(){
  if(stack[stack.length-1]===pageSetup2) setupBack(2);
  else popPage();
}
function refresh(){ navDir='back'; if(stack.length) setHTML(stack[stack.length-1]()); else goTab(curTab,sidePageRoot); }
function head(title, extra){
  return '<div class="hd"><b>'+title+'</b><span class="spacer"></span>'+(extra||'')+'</div>';
}
function demoStart(){
  stack=[]; curTab='home'; navDir='fwd';
  tabbar.style.display='none';
  if(U.logged){ goTab('home'); return; }
  setHTML(pageLogin());
  tabbar.querySelectorAll('.tb').forEach(b=>b.classList.remove('on'));
}
function hint(msg){ const h=document.getElementById('hint'); h.textContent=msg; h.classList.add('show'); setTimeout(()=>h.classList.remove('show'),1800); }

/* ================= Toast / Modal ================= */
let toastTimer;
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>t.classList.remove('show'), 2200);
}
function openModal(html){
  const root = document.getElementById('modal-root');
  document.getElementById('sheet').innerHTML = '<div class="grab"></div><button class="modal-x" onclick="event.stopPropagation();closeModal()" aria-label="关闭"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'+html;
  root.classList.add('show');
}
function closeModal(){
  document.getElementById('modal-root').classList.remove('show');
}

/* ================= 图标 ================= */
const IC = {
  book:'<svg viewBox="0 0 24 24"><path d="M12 3 3 8l9 5 9-5z"/><path d="M7 10.5V15c0 1.7 2.2 3 5 3s5-1.3 5-3v-4.5"/></svg>',
  pen:'<svg viewBox="0 0 24 24"><path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19z"/><path d="M13.5 7.5l3 3"/></svg>',
  chat:'<svg viewBox="0 0 24 24"><path d="M4 6h16v11H9l-5 4z"/><path d="M8.5 11.5h7"/></svg>',
  chart:'<svg viewBox="0 0 24 24"><path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-5M13 16V8M18 16v-8"/></svg>',
  clock:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  camera:'<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="3"/><circle cx="12" cy="13.5" r="3.4"/><path d="M9 7l1.5-2.5h3L15 7"/></svg>',
  doc:'<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9.5 12h5M9.5 15.5h5"/></svg>',
  star:'<svg viewBox="0 0 24 24"><path d="M12 3l2.5 5.5 6 .7-4.5 4 1.3 5.8-5.3-3-5.3 3 1.3-5.8-4.5-4 6-.7z"/></svg>',
  ai:'<svg viewBox="0 0 24 24"><path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4z"/><path d="M18.5 15l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/></svg>',
  people:'<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c1.1-2.8 3.1-4.2 5.5-4.2s4.4 1.4 5.5 4.2"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.9c2.2.2 3.7 1.5 4.5 3.6"/></svg>',
  check:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  arrow:'<svg viewBox="0 0 24 24"><path d="M9.5 5l7 7-7 7"/></svg>',
  play:'<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg>',
  bolt:'<svg viewBox="0 0 24 24"><path d="M13 3 6 13.5h5L10 21l8-11h-5.5z"/></svg>',
  live:'<svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="3"/><path d="M16 10.5 21 7v10l-5-3.5z"/></svg>',
  plan:'<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h5"/></svg>',
  trophy:'<svg viewBox="0 0 24 24"><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 5M17 6h3a3 3 0 0 1-3 5"/><path d="M12 14v3M8.5 20h7"/></svg>',
  route:'<svg viewBox="0 0 24 24"><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.5" transform="translate(0 0)"/></svg>',
};
function arw(){return '<svg class="arw" viewBox="0 0 24 24"><path d="M9.5 5l7 7-7 7"/></svg>'}

/* ================= 图表 ================= */
function lineChart(data, w, h){
  if(!data.length) return '<p class="empty">暂无成绩记录</p>';
  const pad={l:34,r:14,t:16,b:26}, iw=w-pad.l-pad.r, ih=h-pad.t-pad.b;
  const vs=data.map(d=>d.v), min=Math.max(0,Math.min(...vs)-4), max=Math.min(100,Math.max(...vs)+3);
  const x=i=>pad.l+(data.length>1?iw*i/(data.length-1):iw/2), y=v=>pad.t+ih*(1-(v-min)/(max-min));
  let grid='',labels='';
  [min,Math.round((min+max)/2),max].forEach(v=>{
    grid+='<line x1="'+pad.l+'" y1="'+y(v)+'" x2="'+(w-pad.r)+'" y2="'+y(v)+'" stroke="#ECEFF3"/>';
    labels+='<text x="'+(pad.l-7)+'" y="'+(y(v)+4)+'" text-anchor="end" font-size="9.5" fill="#9AA3B0">'+v+'</text>';
  });
  data.forEach((d,i)=>{
    labels+='<text x="'+x(i)+'" y="'+(h-8)+'" text-anchor="middle" font-size="9.5" fill="#9AA3B0">'+myText(d.m)+'</text>';
    labels+='<circle cx="'+x(i)+'" cy="'+y(d.v)+'" r="4" fill="#fff" stroke="#3D7EFF" stroke-width="2.2"/><text x="'+x(i)+'" y="'+(y(d.v)-9)+'" text-anchor="middle" font-size="10" font-weight="800" fill="#1B2430">'+d.v+'</text>';
  });
  let path=''; data.forEach((d,i)=>{ path+=(i?' L ':'M ')+x(i)+' '+y(d.v); });
  const area=path+' L '+x(data.length-1)+' '+(pad.t+ih)+' L '+pad.l+' '+(pad.t+ih)+' Z';
  return '<svg viewBox="0 0 '+w+' '+h+'" style="width:100%"><path d="'+area+'" fill="rgba(61,126,255,.08)"/><path d="'+path+'" fill="none" stroke="#3D7EFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'+grid+labels+'</svg>';
}
function radarSvg(labels, vals, size=250, confirmed=[]){
  const n=labels.length, cx=size/2, cy=size/2+4, R=size/2-42;
  const pt=(i,r)=>{
    const a=-Math.PI/2+2*Math.PI*i/n;
    return [cx+r*Math.cos(a), cy+r*Math.sin(a)];
  };
  const points=(values)=>values.map((v,i)=>pt(i,R*v/100).join(',')).join(' ');
  const rings=[25,50,75,100].map(level=>n<3
    ? `<circle cx="${cx}" cy="${cy}" r="${R*level/100}" fill="none" stroke="#E4EAF2"/>`
    : `<polygon points="${points(labels.map(()=>level))}" fill="none" stroke="#E4EAF2"/>`).join('');
  const axes=labels.map((label,i)=>{
    const [x,y]=pt(i,R), [lx,ly]=pt(i,R+16);
    return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#E4EAF2"/>
      <text x="${lx}" y="${ly}" text-anchor="middle" font-size="10.5" fill="#5A6472" font-weight="600">${label}</text>`;
  }).join('');
  function series(values,color,fill){
    const dots=values.map((v,i)=>{
      if(v==null) return '';
      const [x,y]=pt(i,R*v/100);
      return `<circle cx="${x}" cy="${y}" r="3.5" fill="${color}"/>`;
    }).join('');
    if(values.length!==n || !values.every(v=>v!=null) || n===1) return dots;
    const shape=n===2?'polyline':'polygon';
    return `<${shape} points="${points(values)}" fill="${n===2?'none':fill}" stroke="${color}" stroke-width="2"/>`+dots;
  }
  return `<svg viewBox="0 0 ${size} ${size}" style="width:100%">${rings}${axes}
    ${series(vals,'#3D7EFF','rgba(61,126,255,.14)')}${series(confirmed,'#148468','rgba(20,132,104,.14)')}</svg>`;
}

/* ================= 登录 / 建档 ================= */
let agreeOn=false, cd=0, cdTimer=null;
let onboarding=null;
function pageLogin(){
  return `
  <div class="login-hero">
    <div class="login-logo">${IC.bolt}</div>
    <h2>考试大师</h2>
    <p>AI 学情诊断 · 规划师伴学 · 一对一答疑</p>
  </div>
  <div class="card">
    <div class="field"><label>手机号</label><input class="input" id="lg-phone" type="tel" maxlength="11" placeholder="请输入手机号"></div>
    <div class="field"><label>验证码</label>
      <div style="display:flex;gap:9px">
        <input class="input" id="lg-code" type="tel" maxlength="6" placeholder="请输入验证码" style="flex:1">
        <button class="btn lite sm" id="lg-send" style="flex:none;min-width:104px" onclick="sendCode()">获取验证码</button>
      </div>
    </div>
    <button class="btn" onclick="doLogin()">登 录</button>
    <div class="other" style="text-align:center;margin-top:14px;font-size:12px;color:var(--ink3)">其他登录方式 <b style="color:var(--blue);cursor:pointer" onclick="quickLogin()">3 秒快捷登录</b></div>
    <div class="agree" onclick="toggleAgree()">
      <span class="box ${agreeOn?'on':''}" id="agree">${agreeOn?IC.check:''}</span>
      <span>已阅读并同意 <b style="color:var(--blue)">《考试大师用户协议》</b>、<b style="color:var(--blue)">《用户个人信息保护政策》</b>，未注册的手机号将自动创建账号</span>
    </div>
  </div>`;
}
function toggleAgree(){
  agreeOn=!agreeOn;
  const b=document.getElementById('agree');
  if(b){ b.classList.toggle('on', agreeOn); b.innerHTML=agreeOn?IC.check:''; }
}
function sendCode(){
  const ph=document.getElementById('lg-phone').value.trim();
  if(!/^1\d{10}$/.test(ph)){ toast('请输入正确的 11 位手机号'); return; }
  cd=60; const btn=document.getElementById('lg-send'); btn.disabled=true; btn.textContent=cd+'s 后重发';
  cdTimer=setInterval(()=>{ cd--; btn.textContent=cd+'s 后重发'; if(cd<=0){ clearInterval(cdTimer); btn.disabled=false; btn.textContent='获取验证码'; } },1000);
  toast('验证码已发送（演示验证码：1234）');
}
function doLogin(){
  const ph=document.getElementById('lg-phone').value.trim(), code=document.getElementById('lg-code').value.trim();
  if(!/^1\d{10}$/.test(ph)){ toast('请输入正确的 11 位手机号'); return; }
  if(!agreeOn){ toast('请先阅读并勾选用户协议'); return; }
  if(code!=='1234'){ toast('验证码错误（演示验证码：1234）'); return; }
  clearInterval(cdTimer);
  if(U.onboarded && U.phone===ph && U.scoreProfile?.phone===ph){
    U.logged=true;
    goTab('home');
    return;
  }
  openOnboard(ph);
}
/* 3 秒快捷登录：一键体验，自动填充演示档案并直接进入首页 */
function quickLogin(){
  clearInterval(cdTimer);
  U.logged=true; U.phone=U.phone||'13201609692';
  if(!U.onboarded){
    Object.assign(U,{
      name:U.name||'张真', grade:U.grade||'初三', school:U.school||'临川一中',
      subjects:U.subjects.length?U.subjects:['语文','数学','英语','物理','化学'],
      total:U.total||'612', examDate:U.examDate||'2026-06-20', dailyH:U.dailyH||3, onboarded:true
    });
  }
  toast('快捷登录成功');
  goTab('home');
}
async function openOnboard(phone){
  const stage=$id('authStage');
  const card=$id('authCard').querySelector('.card');
  beginOnboard(phone);
  const profile=onboarding;
  card.inert=true;
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    await card.animate([{opacity:1},{opacity:0}],{duration:65,fill:'forwards'}).finished;
  }
  if(onboarding!==profile || !card.isConnected) return;

  const layout=stage.querySelector('.auth-layout');
  const panel=stage.querySelector('.auth-panel');
  const brand=stage.querySelector('.auth-brand');
  const title=$id('authTitle');
  const narrow=matchMedia('(max-width: 760px)').matches;
  const theme=stage.dataset.theme;
  const surface=theme==='student' || (theme==='campus' && narrow) ? panel : layout;
  const previous=surface.getBoundingClientRect();
  const previousTop=previous.top+scrollY;
  layout.style.removeProperty('--auth-layout-offset');
  brand.style.setProperty('--auth-brand-height',`${brand.getBoundingClientRect().height}px`);

  $id('toast').classList.remove('show');
  stage.dataset.step='profile';
  title.textContent='完善学习信息';
  card.outerHTML=pageOnboard();
  fillOnboardInputs();
  const expanded=surface.getBoundingClientRect();
  const growth=Math.max(0,expanded.height-previous.height);
  const start=Math.max(0,previousTop-growth/2-(expanded.top+scrollY));
  layout.style.setProperty('--auth-layout-offset',`${start}px`);

  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const current=surface.getBoundingClientRect();
    const top=Math.max(0,previousTop-current.top-scrollY);
    const bottom=Math.max(0,growth-top);
    surface.animate([
      {clipPath: `inset(${top}px 0 ${bottom}px round 24px)`},
      {clipPath:'inset(0px round 24px)'}
    ],{duration:210,easing:'ease-out'});
  }

  const activeTitle=theme==='desk' ? $id('onboard-title') : title;
  activeTitle.focus({preventScroll:true});
  if(narrow){
    activeTitle.scrollIntoView({block:'start',behavior:'instant'});
  }
}
function pageOnboard(){
  return `<form class="card auth-profile" id="onboard-form" novalidate onsubmit="event.preventDefault();nextOnboardForm()">
    <h2 id="onboard-title" tabindex="-1">完善学习信息</h2>
    <div class="onboard-heading"><span>手机号已验证</span><button type="button" onclick="backToLogin()">返回登录</button></div>
    <div class="field"><label for="ob-name">学生姓名<em>*</em></label><input class="input" id="ob-name" placeholder="请输入学生姓名"></div>
    <div class="field"><label id="ob-id-label">身份<em>*</em>（升学类型）</label>
      <div class="segs" id="ob-id" role="group" aria-labelledby="ob-id-label">${['中考','高考'].map(g=>`<button type="button" class="seg ${onboarding.identity===g?'on':''}" aria-pressed="${onboarding.identity===g}" onclick="pickIdentity(this,'${g}')">${g}</button>`).join('')}</div>
    </div>
    <div id="ob-dep">${obDep()}</div>
    <div class="field"><label for="ob-pp">家长联系电话</label><input class="input" id="ob-pp" type="tel" maxlength="11" placeholder="请输入家长联系电话"></div>
    <button class="btn" type="submit">下一步</button>
  </form>`;
}
/* 中考/高考对应的年级与考试科目 */
const GRADES={'中考':['初一','初二','初三'],'高考':['高一','高二','高三']};
const SUBJECTS={
  '中考':['语文','数学','英语','物理','化学','道德与法治','历史'],
  '高考':['语文','数学','英语','物理','历史','化学','生物','地理','政治'],
};
/* 身份切换时：只重绘依赖区块（年级/科目/总分），姓名等输入不受影响 */
function obDep(){
  const {identity,grade,subjects}=onboarding;
  return `<div class="field"><label id="ob-grade-label">年级<em>*</em></label>
      <div class="segs" id="ob-grade" role="group" aria-labelledby="ob-grade-label">${GRADES[identity].map(g=>`<button type="button" class="seg ${grade===g?'on':''}" aria-pressed="${grade===g}" onclick="pickOnboardOption(this,'grade','${g}')">${g}</button>`).join('')}</div>
    </div>
    <div class="field"><label id="ob-subs-label">考试科目<em>*</em>（可多选）</label>
      <div class="segs subgrid" id="ob-subs" role="group" aria-labelledby="ob-subs-label">${SUBJECTS[identity].map(s=>`<button type="button" class="seg ${subjects.includes(s)?'on':''}" aria-pressed="${subjects.includes(s)}" onclick="toggleSub(this,'${s}')">${s}</button>`).join('')}</div>
    </div>
    <div class="field"><label for="ob-total">目前总分数<em>*</em></label><input class="input" id="ob-total" type="number" placeholder="${identity==='高考'?'如：586（满分 750）':'如：612（满分 740）'}"></div>`;
}
function pickIdentity(el,v){
  if(onboarding.identity===v) return;
  const total=$id('ob-total').value;
  pickOnboardOption(el,'identity',v);
  if(!GRADES[v].includes(onboarding.grade)) onboarding.grade='';
  onboarding.subjects=onboarding.subjects.filter(s=>SUBJECTS[v].includes(s));
  $id('ob-dep').innerHTML=obDep();
  $id('ob-total').value=total;
}
function toggleSub(el,s){
  const subjects=onboarding.subjects;
  const i=subjects.indexOf(s);
  if(i>=0) subjects.splice(i,1);
  else subjects.push(s);
  el.classList.toggle('on',i<0);
  el.setAttribute('aria-pressed',String(i<0));
}
function pickOnboardOption(el,key,value){
  onboarding[key]=value;
  for(const option of el.parentNode.children){
    const active=option===el;
    option.classList.toggle('on',active);
    option.setAttribute('aria-pressed',String(active));
  }
}
function backToLogin(){
  const phone=onboarding.phone;
  demoStart();
  const input=$id('lg-phone');
  input.value=phone;
  input.focus();
}
/* 选项就地切换：只改当前选项组的高亮与数据，不重绘页面（不闪烁、不丢滚动位置） */
function pickSeg(el,k,v){
  const box=el.parentNode;
  [...box.children].forEach(c=>c.classList.remove('on'));
  el.classList.add('on');
  U[k]=v;
}
const ONBOARD_SCORE_MAX={
  '中考':{'语文':120,'数学':120,'英语':120,'物理':100,'化学':80,'道德与法治':100,'历史':100},
  '高考':{'语文':150,'数学':150,'英语':150,'物理':100,'历史':100,'化学':100,'生物':100,'地理':100,'政治':100}
};
function beginOnboard(phone){
  const saved=U.phone===phone ? U : null;
  const identity=saved?.identity==='高考'?'高考':'中考';
  onboarding={
    phone,identity,grade:saved?.grade||'',
    subjects:SUBJECTS[identity].filter(subject=>saved?.subjects?.includes(subject)),
    name:saved?.name||'', total:saved?.total||'', parentPhone:saved?.parentPhone||'', scoreReview:null
  };
}
function fillOnboardInputs(){
  $id('ob-name').value=onboarding.name;
  $id('ob-pp').value=onboarding.parentPhone;
  $id('ob-total').value=onboarding.total;
}
function nextOnboardForm(){
  const name=$id('ob-name').value.trim();
  const total=Number($id('ob-total').value);
  const {identity,grade,subjects}=onboarding;
  if(!name){ toast('请填写学生姓名'); $id('ob-name').focus(); return; }
  if(!GRADES[identity].includes(grade)){ toast('请选择年级'); $id('ob-grade').querySelector('button').focus(); return; }
  if(!subjects.length){ toast('请选择考试科目'); $id('ob-subs').querySelector('button').focus(); return; }
  if(!Number.isFinite(total)||total<=0){ toast('请填写目前总分数'); $id('ob-total').focus(); return; }
  Object.assign(onboarding,{name,total,parentPhone:$id('ob-pp').value.trim()});
  $id('toast').classList.remove('show');
  switchOnboardForm(pageOnboardScores(),'确认各科分数');
  renderOnboardScores();
}
function previousOnboardForm(){
  switchOnboardForm(pageOnboard(),'完善学习信息');
  fillOnboardInputs();
}
function switchOnboardForm(markup,title){
  $id('onboard-form').outerHTML=markup;
  const outerTitle=$id('authTitle');
  if(outerTitle) outerTitle.textContent=title;
  const modalSheet=$id('onboard-form').closest('#sheet');
  if(modalSheet) modalSheet.scrollTop=0;
  const heading=outerTitle && $id('authStage').dataset.theme!=='desk' ? outerTitle : $id('onboard-title');
  heading.focus({preventScroll:true});
  if(!modalSheet) heading.scrollIntoView({block:'start',behavior:'instant'});
}
function pageOnboardScores(){
  return `<form class="card auth-profile" id="onboard-form" novalidate onsubmit="event.preventDefault();saveOnboard()">
    <h2 id="onboard-title" tabindex="-1">确认各科分数</h2>
    <div class="onboard-heading"><span>已填写总分 ${onboarding.total} 分</span><button type="button" onclick="previousOnboardForm()">上一步</button></div>
    <section class="onboard-score-review" id="ob-score-review" aria-labelledby="ob-score-title"></section>
    <button class="btn" type="submit">保存并进入首页</button>
  </form>`;
}
// RAG 接入时替换此函数的数据来源。演示估算按参考满分占比分配总分。
function getOnboardScoreReference(identity,subjects,total){
  const maxima=subjects.map(name=>ONBOARD_SCORE_MAX[identity][name]);
  const sum=maxima.reduce((a,b)=>a+b,0);
  const exact=maxima.map(maxScore=>total*maxScore/sum);
  const scores=exact.map(Math.floor);
  if(total<=sum){
    const order=exact.map((value,i)=>({i,remainder:value-scores[i]})).sort((a,b)=>b.remainder-a.remainder);
    const remaining=Math.round(total)-scores.reduce((a,b)=>a+b,0);
    for(const {i} of order.slice(0,remaining)) scores[i]++;
  }
  return subjects.map((name,i)=>({name,maxScore:maxima[i],estimate:total<=sum?scores[i]:null}));
}
function scoreBandOptions(maxScore){
  return Array.from({length:Math.ceil(maxScore/10)},(_,i)=>({
    min:i*10,max:Math.min(i*10+9+(i*10+10===maxScore?1:0),maxScore)
  }));
}
function scoreBandLabel({min,max}){ return min===max?`${max} 分`:`${min}–${max} 分`; }
function renderOnboardScores(){
  const section=$id('ob-score-review');
  const {phone,identity,grade,subjects,total}=onboarding;
  const scope=`${identity}|${grade}`;
  const previous=onboarding.scoreReview;
  const saved=U.scoreProfile;
  const source=previous?.scope===scope ? previous.rows
    : saved?.phone===phone && saved.identity===identity && saved.grade===grade ? (saved.subjects||[]) : [];
  const rows=getOnboardScoreReference(identity,subjects,total).map(row=>{
    const bands=scoreBandOptions(row.maxScore);
    const prior=source.find(item=>item.name===row.name&&item.maxScore===row.maxScore);
    const band=bands.find(item=>item.min===prior?.min&&item.max===prior?.max);
    return {...row,bands,min:band?.min??null,max:band?.max??null};
  });
  onboarding.scoreReview={scope,rows};
  section.innerHTML=`
    <h3 id="ob-score-title">各科成绩雷达图</h3>
    <p class="onboard-score-note">${rows[0].estimate==null
      ? '总分超过所选科目的参考满分，请核对科目或直接选择分数段。'
      : '蓝线是按录入总分等比例分配的演示参考。'}</p>
    <div class="onboard-score-chart" id="ob-score-chart" role="img" aria-label="各科成绩占参考满分的比例"></div>
    <div class="onboard-score-legend">${rows[0].estimate==null?'':'<span>演示参考</span>'}<span class="confirmed">已选分数段中点</span></div>
    <div class="onboard-score-rows">${rows.map((row,i)=>`
      <div class="onboard-score-row">
        <div><label for="ob-score-${i}">${row.name}</label><small>${row.estimate==null?'':`参考 ${row.estimate} 分 · `}满分 ${row.maxScore} 分</small></div>
        <select class="input" id="ob-score-${i}" aria-label="${row.name}分数段" onchange="pickOnboardScoreBand(this,${i})">
          <option value="">选择分数段</option>
          ${row.bands.map(band=>`<option value="${band.min}" ${row.min===band.min?'selected':''}>${scoreBandLabel(band)}</option>`).join('')}
        </select>
      </div>`).join('')}</div>
    <p class="onboard-score-error" id="ob-score-error" role="alert" hidden>请为每一科选择分数段。</p>`;
  drawOnboardScores();
}
function drawOnboardScores(){
  const rows=onboarding.scoreReview.rows;
  const reference=rows.map(row=>row.estimate==null?null:100*row.estimate/row.maxScore);
  const confirmed=rows.map(row=>row.min==null?null:50*(row.min+row.max)/row.maxScore);
  $id('ob-score-chart').innerHTML=radarSvg(rows.map(row=>row.name),reference,270,confirmed);
}
function pickOnboardScoreBand(select,index){
  const row=onboarding.scoreReview.rows[index];
  const band=select.value===''?null:row.bands.find(item=>String(item.min)===select.value);
  row.min=band?.min??null;
  row.max=band?.max??null;
  if(onboarding.scoreReview.rows.every(item=>item.min!=null)) $id('ob-score-error').hidden=true;
  drawOnboardScores();
}
function completedOnboardScoreProfile(){
  const {phone,identity,grade,total,scoreReview:{rows}}=onboarding;
  const missing=rows.findIndex(row=>row.min==null);
  if(missing!==-1){
    $id('ob-score-error').hidden=false;
    $id(`ob-score-${missing}`).focus();
    return null;
  }
  return {phone,identity,grade,total,source:'demo',
    subjects:rows.map(({name,maxScore,estimate,min,max})=>({name,maxScore,estimate,min,max}))};
}
function archiveScoreSummary(){
  const profile=U.scoreProfile;
  if(profile?.subjects?.length && profile.phone===U.phone){
    return profile.subjects.map(row=>`<span class="tag blue">${row.name} ${scoreBandLabel(row)}</span>`).join('');
  }
  return Object.entries(U.scores).map(([name,score])=>`<span class="tag blue">${name} ${score}</span>`).join('');
}
function saveOnboard(){
  const scoreProfile=completedOnboardScoreProfile();
  if(!scoreProfile) return;
  const {phone,identity,grade,subjects,name,total,parentPhone}=onboarding;
  Object.assign(U,{phone,identity,grade,subjects,name,total,parentPhone,scoreProfile,onboarded:true,logged:true});
  onboarding=null;
  closeModal();
  toast('学习信息和各科分数段已保存');
  goTab('home');
}

/* ================= 首页 ================= */
const homeCourseFilters = { query:'', grade:'', subject:'', type:'' };
const HOME_GRADES = {中考:['初一','初二','初三'],高考:['高一','高二','高三']};
const HOME_COURSE_PRIORITY = [
  'skill|中考|数学',
  'sync|中考|物理',
  'tong|中考|数学',
];
const HOME_SUBJECT_ART = {
  语文:'<path d="M29 47c15-8 31-7 46 3 15-10 31-11 46-3v59c-15-8-31-7-46 3-15-10-31-10-46-3Z" fill="#a87755"/><path d="M32 40c14-7 28-6 43 4v59c-15-9-29-10-43-4Z" fill="#fff8e9"/><path d="M75 44c14-10 29-11 43-4v59c-14-6-29-5-43 4Z" fill="#efd8b6"/><path d="m43 55 21 5m-21 8 21 5m-21 8 14 4m30-30 20-5m-20 18 20-5" fill="none" stroke="#ae8665" stroke-width="2.8" stroke-linecap="round"/><path d="m97 96 24-55 5 2-24 55-8 7Z" fill="#885541"/><path d="m121 41 4-9 5 2-4 9Z" fill="#d19369"/>',
  数学:'<path d="M24 111h105M34 123V25m-6 8 6-8 6 8m81 72 8 6-8 6" fill="none" stroke="#6b87af" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M43 50q25 96 52 0" fill="none" stroke="#739acd" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M68 36q28 96 55 0" fill="none" stroke="#345783" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M69 88h24m-6-5 6 5-6 5" fill="none" stroke="#d8a159" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="70" cy="98" r="4" fill="#739acd"/>',
  英语:'<path d="M85 73h26a15 15 0 0 1 15 15v11a15 15 0 0 1-15 15h-6v12l-14-12h-6a15 15 0 0 1-15-15V88a15 15 0 0 1 15-15Z" fill="#e8ae8f"/><path d="M41 32h46a16 16 0 0 1 16 16v20a16 16 0 0 1-16 16H60L42 97V84h-1a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16Z" fill="#a25033"/><text x="43" y="67" font-size="27" font-weight="700" font-family="sans-serif" fill="#fffaf5">Hi!</text><circle cx="88" cy="94" r="2.4" fill="#813f29"/><circle cx="98" cy="94" r="2.4" fill="#813f29"/><circle cx="108" cy="94" r="2.4" fill="#813f29"/>',
  物理:'<g transform="scale(1.5)"><g transform=" "><ellipse cx="50" cy="50" rx="37" ry="15" transform="rotate(0 50 50)" fill="none" stroke="#3b756b" stroke-width="2.8" stroke-dasharray="92 15 65 15"/><ellipse cx="50" cy="50" rx="37" ry="15" transform="rotate(60 50 50)" fill="none" stroke="#91bdb1" stroke-width="2.8" stroke-dasharray="92 15 65 15"/><ellipse cx="50" cy="50" rx="37" ry="15" transform="rotate(-60 50 50)" fill="none" stroke="#3b756b" stroke-width="2.8" stroke-dasharray="92 15 65 15"/><circle cx="50" cy="50" r="8" fill="#d6a767"/><circle cx="20" cy="41" r="5" fill="#91bdb1"/><circle cx="68" cy="76" r="5" fill="#70a497"/></g></g>',
  化学:'<path d="M61 30H89V63L117 112Q122 124 109 125H41Q28 124 33 112L61 63Z" fill="#f6f9ff"/><path d="M44 94H106L117 114Q121 125 109 125H41Q29 125 34 114Z" fill="#9ebbe1"/><path d="M60 30H90M64 31V63L34 113Q29 125 41 125H109Q121 125 116 113L86 63V31" fill="none" stroke="#466c9a" stroke-width="3" stroke-linecap="round"/><circle cx="63" cy="105" r="4" fill="#f7faff"/><circle cx="82" cy="112" r="5" fill="#f7faff"/>',
  道法:'<g transform="rotate(-9 64 74)"><path d="M33 26h49l17 17v69a5 5 0 0 1-5 5H33a5 5 0 0 1-5-5V31a5 5 0 0 1 5-5Z" fill="#f7f1e9"/><path d="M82 26v13a4 4 0 0 0 4 4h13Z" fill="#dacbc1"/><path d="M42 48h24" stroke="#555b76" stroke-width="6" stroke-linecap="round"/><path d="M42 62h42M42 72h35M42 82h24" stroke="#767b90" stroke-width="3" stroke-linecap="round"/></g><g transform="rotate(11 104 98)"><path d="M99 66h9a7 7 0 0 1 7 7c0 4-2 7-5 10l-1 7H98l-1-7c-3-3-5-6-5-10a7 7 0 0 1 7-7Z" fill="#9b6872"/><path d="M99 72h8" stroke="#dbb7bc" stroke-width="2.8" stroke-linecap="round"/><path d="M87 88h34l7 7H80Z" fill="#bc8d97"/><path d="M80 95h48v13a5 5 0 0 1-5 5H85a5 5 0 0 1-5-5Z" fill="#9b6872"/><path d="M80 106h48v2a5 5 0 0 1-5 5H85a5 5 0 0 1-5-5Z" fill="#79515d"/></g>',
  历史:'<path d="M86 56a34 34 0 1 1-68 0 34 34 0 1 1 68 0ZM43 47h18v18H43Z" fill="#b08464" fill-rule="evenodd"/><path d="M29 54a23 23 0 0 1 28-20" fill="none" stroke="#e8caa4" stroke-width="3" stroke-linecap="round"/><path d="M131 87a39 39 0 1 1-78 0 39 39 0 1 1 78 0ZM81 76h22v22H81Z" fill="#784c35" fill-rule="evenodd"/><path d="M118 70a31 31 0 1 1-52 0 31 31 0 0 1 52 0Z" fill="none" stroke="#cfaa82" stroke-width="2.8"/><path d="M81 77h21v21" fill="none" stroke="#d6b28a" stroke-width="2" stroke-linejoin="round"/>',
  地理:'<g transform="scale(1.5)"><circle cx="48" cy="43" r="26" fill="#96c0c8"/><path d="M30 28l9-6 8 7-3 8 10 6-3 12-10 1-8-9-8-5Zm24-8 10 8-2 7-8 2-2 8 12 5 6-7-3-15Z" fill="#477b91"/><path d="M73 22a34 34 0 0 1-48 48" fill="none" stroke="#477b91" stroke-width="4" stroke-linecap="round"/><path d="M49 76v8m-16 0h33" fill="none" stroke="#477b91" stroke-width="4" stroke-linecap="round"/></g>',
  生物:'<path d="M30 67c2-19 19-34 41-34 17 0 21 7 33 10 15 5 24 14 24 29 0 21-18 43-43 44-21 1-25-9-41-13-10-3-20-18-14-36Z" fill="#a5c59e"/><path d="M39 67c4-15 17-24 33-24 13 0 23 8 33 11 11 4 15 10 14 20-2 16-16 32-34 33-18 1-25-8-39-12-7-2-10-15-7-28Z" fill="#d4e7ca"/><path d="M64 66c6-7 20-8 27-2 9 7 8 17-1 24-7 5-20 4-26-2-5-6-5-13 0-20Z" fill="#668d6a"/><circle cx="80" cy="75" r="5" fill="#b2cfad"/><ellipse cx="52" cy="69" rx="6" ry="3" fill="#88af83" transform="rotate(-22 52 69)"/><ellipse cx="100" cy="91" rx="7" ry="3" fill="#88af83" transform="rotate(-24 100 91)"/><circle cx="56" cy="88" r="3" fill="#e0bd6e"/><circle cx="99" cy="64" r="3" fill="#e0bd6e"/>',
  政治:'<path fill="#c5d6ed" d="M29 32H121V113H29Z"/><path fill="none" stroke="#466c9a" stroke-width="4" stroke-linecap="round" d="M75 44V104m-22 0h44M44 55h62M50 55l-13 25h26zm50 0-13 25h26z"/>'
};
function homeCourseStage(){
  return U.identity==='高考'?'高考':'中考';
}

function homeCourseOptions(key){
  const stage = homeCourseStage();
  const options = {
    stage:[['中考','中考'],['高考','高考']],
    grade:[['','全部'],...HOME_GRADES[stage].map(value=>[value,value])],
    subject:[['','全部'],...SUB_BASE.skill[stage].map(value=>[value,value])],
    type:[['','全部'],...COURSES.map(course=>[course.id,course.n])]
  };
  const selected = key==='stage'?stage:homeCourseFilters[key];
  return options[key].map(([value,label])=>`<button type="button" class="seg ${selected===value?'on':''}" data-value="${value}" aria-pressed="${selected===value}" onclick="filterHomeCourses(this,'${key}')">${label}</button>`).join('');
}

function homeCourseMatches(){
  const stage = homeCourseStage();
  const {query,grade,subject,type} = homeCourseFilters;
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return COURSES.flatMap(course=>{
    const grades = course.id==='skill'?HOME_GRADES[stage].slice(2):HOME_GRADES[stage].slice(0,2);
    if((type&&course.id!==type)||(grade&&!grades.includes(grade))) return [];
    return SUB_BASE[course.id][stage]
      .filter(name=>!subject||name===subject)
      .map(name=>subObj(course.id,stage,name))
      .filter(item=>{
        const content = [item.name,item.d,course.n,stage,...grades].join(' ').toLowerCase();
        return terms.every(term=>content.includes(term));
      })
      .map(item=>({...item, typeName:course.n, grades:grades.join('、'), needsTeacher:course.need==='teacher'}));
  }).sort((a,b)=>homeCoursePriority(a.key)-homeCoursePriority(b.key));
}

function homeCoursePriority(key){
  const index = HOME_COURSE_PRIORITY.indexOf(key);
  return index<0?HOME_COURSE_PRIORITY.length:index;
}

function homeCourseTiles(matches){
  return matches.map(course=>{
    const opened = U.activatedSubjects.includes(course.key);
    const art = HOME_SUBJECT_ART[course.sub==='政治'?'道法':course.sub]||HOME_SUBJECT_ART.语文;
    return `<button type="button" class="home-course-tile" data-course="${course.id}" data-subject="${course.sub}" data-key="${course.key}" onclick="tapSubject(this.dataset.course,this.dataset.key)">
      <span class="home-course-cover" aria-hidden="true"><b>${course.sub}<br>${course.typeName}</b>${course.sub==='语文'?'<img class="home-course-art" src="chinese-bamboo-scroll.png" alt="">':'<svg viewBox="0 0 150 150" focusable="false">'+art+'</svg>'}</span>
      <span class="home-course-copy">
        <strong class="home-course-name">${course.name}</strong>
        <span class="home-course-desc">${course.d}</span>
      </span>
      <span class="home-course-footer">
        <span class="home-course-meta"><b>${course.typeName}</b><span>${course.grades}</span></span>
        <span class="home-course-action${opened?' is-opened':''}">${opened?'进入学习':course.needsTeacher?'查看开通方式':'去激活'} <span aria-hidden="true">→</span></span>
      </span>
    </button>`;
  }).join('');
}

function homeCourseResultText(count){
  const {grade,subject,type}=homeCourseFilters;
  const selected=[grade,subject,COURSES.find(course=>course.id===type)?.n].filter(Boolean);
  return [...selected,count+' 门课程'].join(' · ');
}

function homeCourseCatalog(){
  const stage=homeCourseStage();
  if(!HOME_GRADES[stage].includes(homeCourseFilters.grade)) homeCourseFilters.grade='';
  if(!SUB_BASE.skill[stage].includes(homeCourseFilters.subject)) homeCourseFilters.subject='';
  const matches = homeCourseMatches();
  const groups = [['grade','年级'],['subject','学科'],['type','课程类型']];
  return `<section class="home-course-catalog" aria-labelledby="home-course-list-title">
    <div class="home-filter-dock">
      <div class="home-filter-slide">
        <button type="button" class="home-filter-edge" id="home-filter-toggle" aria-label="课程筛选" aria-expanded="false" aria-controls="home-filter-panel" hidden>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="home-filter-panel" id="home-filter-panel">
          <div class="home-course-toolbar">
            <label class="home-course-search"><span class="home-course-search-label">搜索课程</span><input type="search" id="home-course-search" placeholder="搜索课程或科目，例如「数学」" oninput="searchHomeCourses(this.value)"></label>
            <div class="segs" role="group" aria-label="升学方向" data-home-options="stage">${homeCourseOptions('stage')}</div>
          </div>
          ${groups.map(([key,label])=>`<div class="home-course-filter"><span>${label}</span><div class="segs" role="group" aria-label="${label}" data-home-options="${key}">${homeCourseOptions(key)}</div></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="home-filter-end" aria-hidden="true"></div>
    <div class="home-course-heading"><h2 id="home-course-list-title" tabindex="-1">课程列表</h2><span id="home-course-count" role="status">${homeCourseResultText(matches.length)}</span></div>
    <div class="home-filter-summary" id="home-filter-summary" role="group" aria-label="已选筛选条件" hidden></div>
    <div class="home-course-grid" id="home-course-grid">${homeCourseTiles(matches)}</div>
    <div class="home-course-empty" id="home-course-empty" ${matches.length?'hidden':''}><p>没有符合条件的课程</p><button type="button" class="btn lite" onclick="resetHomeCourses()">清除筛选</button></div>
  </section>`;
}

let homeFilterEvents;
function mountHomeFilterDock(){
  homeFilterEvents?.abort();
  const dock=screen.querySelector('.home-filter-dock');
  if(!dock) return;
  const end=screen.querySelector('.home-filter-end');
  const edge=dock.querySelector('.home-filter-edge');
  const panel=dock.querySelector('.home-filter-panel');
  homeFilterEvents=new AbortController();
  const signal=homeFilterEvents.signal;
  function setOpen(open){
    dock.classList.toggle('is-open',open);
    edge.setAttribute('aria-expanded',String(open));
    panel.inert=dock.classList.contains('is-docked')&&!open;
  }
  function sync(){
    const docked=end.getBoundingClientRect().bottom<=screen.getBoundingClientRect().top+1;
    if(docked===dock.classList.contains('is-docked')) return;
    const edgeFocused=document.activeElement===edge;
    dock.classList.toggle('is-docked',docked);
    edge.hidden=!docked;
    if(docked&&panel.contains(document.activeElement)) edge.focus({preventScroll:true});
    setOpen(false);
    if(!docked&&edgeFocused) $id('home-course-search').focus({preventScroll:true});
  }
  edge.addEventListener('click',()=>setOpen(!dock.classList.contains('is-open')));
  dock.addEventListener('keydown',event=>{
    if(event.key!=='Escape'||!dock.classList.contains('is-open')) return;
    event.preventDefault();
    edge.focus({preventScroll:true});
    setOpen(false);
  });
  screen.addEventListener('scroll',sync,{passive:true,signal});
  const resize=new ResizeObserver(()=>{
    dock.style.setProperty('--home-filter-height',`${screen.clientHeight}px`);
    sync();
  });
  resize.observe(screen);
  signal.addEventListener('abort',()=>resize.disconnect(),{once:true});
  $id('home-course-search').value=homeCourseFilters.query;
  updateHomeFilterSummary();
  sync();
}

function searchHomeCourses(value){
  homeCourseFilters.query = value;
  updateHomeCourseTiles();
}

function updateHomeFilterSummary(){
  const {query,grade,subject,type}=homeCourseFilters;
  const filters=[['grade',grade],['subject',subject],['type',COURSES.find(course=>course.id===type)?.n],['query',query.trim()]].filter(([,label])=>label);
  const summary=$id('home-filter-summary');
  const count=filters.length;
  $id('home-filter-toggle').setAttribute('aria-label',count?`课程筛选，已选 ${count} 项`:'课程筛选');
  summary.hidden=!count;
  summary.replaceChildren();
  for(const [key,label] of filters){
    const chip=document.createElement('button');
    chip.type='button';
    chip.className='home-filter-chip';
    chip.textContent=`${label} ×`;
    chip.setAttribute('aria-label',`移除筛选条件：${label}`);
    chip.addEventListener('click',()=>{
      homeCourseFilters[key]='';
      if(key==='query') $id('home-course-search').value='';
      else document.querySelector(`[data-home-options="${key}"]`).innerHTML=homeCourseOptions(key);
      updateHomeCourseTiles();
      (summary.querySelector('button')||$id('home-course-list-title')).focus({preventScroll:true});
    });
    summary.append(chip);
  }
  if(count>1&&$id('home-course-empty').hidden){
    const reset=document.createElement('button');
    reset.type='button';
    reset.className='home-filter-clear';
    reset.textContent='清除筛选';
    reset.addEventListener('click',()=>{
      resetHomeCourses();
      $id('home-course-list-title').focus({preventScroll:true});
    });
    summary.append(reset);
  }
}

function updateHomeCourseTiles(){
  const matches = homeCourseMatches();
  $id('home-course-grid').innerHTML = homeCourseTiles(matches);
  $id('home-course-count').textContent = homeCourseResultText(matches.length);
  $id('home-course-empty').hidden = matches.length>0;
  updateHomeFilterSummary();
}

function filterHomeCourses(button,key){
  const value = button.dataset.value;
  if(key==='stage'){
    if(homeCourseStage()===value) return;
    U.identity=value;
    if(U.setupStep<4) U.grade=value==='高考'?'高二':'初二';
    homeCourseFilters.grade='';
    if(!SUB_BASE.skill[value].includes(homeCourseFilters.subject)) homeCourseFilters.subject='';
    for(const group of ['grade','subject']){
      document.querySelector('[data-home-options="'+group+'"]').innerHTML=homeCourseOptions(group);
    }
    persist();
  }else{
    homeCourseFilters[key]=value;
  }
  [...button.parentElement.children].forEach(option=>{
    option.classList.toggle('on',option===button);
    option.setAttribute('aria-pressed',String(option===button));
  });
  updateHomeCourseTiles();
}

function resetHomeCourses(){
  Object.assign(homeCourseFilters,{query:'',grade:'',subject:'',type:''});
  const input=$id('home-course-search');
  input.value='';
  for(const group of ['grade','subject','type']){
    document.querySelector('[data-home-options="'+group+'"]').innerHTML=homeCourseOptions(group);
  }
  updateHomeCourseTiles();
  input.focus();
}

function pageHome(){ return homeCourseCatalog(); }

function scanQR(){
  openModal(`<h4 style="text-align:center;margin-bottom:6px">扫码</h4>
  <p style="font-size:12.5px;color:var(--ink3);text-align:center;margin-bottom:14px">扫描学生专属二维码，绑定伴学群 / 激活课程</p>
  <canvas id="qr" width="190" height="190"></canvas>
  <button class="btn" onclick="closeModal();toast('已识别：学生专属码 '+(U.name||'同学'))">识别二维码</button>`);
  drawQR();
}
function drawQR(){
  const cv=document.getElementById('qr'); if(!cv) return;
  const c=cv.getContext('2d'), n=25, s=cv.width/n;
  c.fillStyle='#fff'; c.fillRect(0,0,cv.width,cv.height); c.fillStyle='#1B2430';
  let seed=7; const rnd=()=>{ seed=(seed*16807)%2147483647; return seed/2147483647; };
  const fin=(x,y)=>{ c.fillRect(x*s,y*s,7*s,7*s); c.fillStyle='#fff'; c.fillRect((x+1)*s,(y+1)*s,5*s,5*s); c.fillStyle='#1B2430'; c.fillRect((x+2)*s,(y+2)*s,3*s,3*s); };
  fin(1,1); fin(n-8,1); fin(1,n-8);
  for(let y=0;y<n;y++) for(let x=0;x<n;x++){
    if((x<9&&y<9)||(x>n-9&&y<9)||(x<9&&y>n-9)) continue;
    if(rnd()>0.55) c.fillRect(x*s,y*s,s,s);
  }
}

/* ================= 我的 ================= */
function myMenuButton(label, icon, action){
  return `<button type="button" class="my-row" onclick="${action}"><span class="my-menu-icon" aria-hidden="true">${icon}</span><span>${label}</span>${arw()}</button>`;
}

function myDateKey(date){
  const month=String(date.getMonth()+1).padStart(2,'0');
  const day=String(date.getDate()).padStart(2,'0');
  return `${date.getFullYear()}-${month}-${day}`;
}
function myRecentDays(today,count){
  return Array.from({length:count},(_,index)=>{
    const date=new Date(today);
    date.setDate(today.getDate()-count+1+index);
    return date;
  });
}
function studyShortDate(date){ return `${date.getMonth()+1}.${date.getDate()}`; }
function studyWeekDays(date){
  const sunday=new Date(date);
  sunday.setHours(0,0,0,0);
  sunday.setDate(date.getDate()+6-(date.getDay()+6)%7);
  return myRecentDays(sunday,7);
}
const STUDY_HOUR_EXAMPLE=[0.8,1.4,1.7,1.1,2.2,1.3,1.5];
function addStudyHours(amount,type,detail,date=new Date()){
  const hours=U.hours;
  for(const period of ['today','week','total']) hours[period]=+(hours[period]+amount).toFixed(1);
  const byDay=hours.byDay??={};
  const day=myDateKey(date);
  byDay[day]=+((byDay[day]||0)+amount).toFixed(1);
  const time=[date.getHours(),date.getMinutes()].map(value=>String(value).padStart(2,'0')).join(':');
  (hours.entries??=[]).push({day,time,type,detail,minutes:Math.round(amount*60)});
}
function myText(value){
  const escapes={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
  return String(value??'').replace(/[&<>"']/g,char=>escapes[char]);
}
function myHoursChart(days,values){
  const max=Math.max(1,...values.filter(Number.isFinite));
  const points=values.map((value,index)=>Number.isFinite(value)?[24+48*index,64-50*value/max]:null);
  if(points.every(point=>!point)) return '<p class="my-chart-empty">暂无近 7 天学时记录</p>';
  const label=days.map((day,index)=>`${day.getMonth()+1}月${day.getDate()}日 ${points[index]?`${values[index]} 小时`:'无记录'}`).join('，');
  const segments=points.slice(1).map((point,index)=>point&&points[index]?`M${points[index].join(' ')}L${point.join(' ')}`:'').join('');
  return `<svg class="my-hours-chart" viewBox="0 0 336 70" preserveAspectRatio="none" role="img" aria-label="${label}">
    <path class="my-chart-grid" d="M0 14H336M0 39H336M0 64H336"/>
    <path class="my-chart-line" d="${segments}"/>
    ${points.map(point=>point?`<circle cx="${point[0]}" cy="${point[1]}" r="3"/>`:'').join('')}
  </svg><div class="my-chart-days" aria-hidden="true">${days.map(day=>`<span>${'日一二三四五六'[day.getDay()]}</span>`).join('')}</div>`;
}
function myScoreChart(exam){
  if(!exam) return '<p class="my-chart-empty">暂无考试成绩</p>';
  const rows=myScoreRates(exam);
  const scores=rows.length?rows:[['总分',exam.v]];
  return `<div class="my-score-chart" aria-label="${rows.length?'各科得分率':'总分得分率'}">${scores.map(([name,value])=>{
    const percent=Math.round(value);
    return `<div class="my-score-row"><span>${myText(name)}</span><span class="my-score-track" aria-hidden="true"><i style="width:${value}%"></i></span><span>${percent}%</span></div>`;
  }).join('')}</div>`;
}
function myCheckinChart(today,monthDays,checked){
  const todayKey=myDateKey(today);
  const leading=(monthDays[0].getDay()+6)%7;
  const month=today.getMonth()+1;
  return `<div class="my-checkin-chart" role="group" aria-label="${today.getFullYear()} 年 ${month} 月打卡日历，已打卡 ${checked.size} 天">
    ${[...'一二三四五六日'].map(label=>`<span class="my-checkin-weekday" aria-hidden="true">${label}</span>`).join('')}
    ${'<span aria-hidden="true"></span>'.repeat(leading)}
    ${monthDays.map(day=>{
      const key=myDateKey(day);
      const done=checked.has(key);
      const future=key>todayKey;
      const label=`${month}月${day.getDate()}日 · ${done?'已打卡':future?'尚未到达':'未打卡'}`;
      return `<time datetime="${key}" class="my-checkin-day${done?' done':future?' future':''}"${key===todayKey?' aria-current="date"':''} aria-label="${label}" title="${label}">${day.getDate()}</time>`;
    }).join('')}
  </div>`;
}
function myStatCard(title,value,unit,period,chart,action){
  return `<article class="my-stat-card${action?' my-stat-linked':''}">
    <header><h3>${title}</h3><span class="my-stat-period">${period}</span>${action?arw():''}</header>
    <p class="my-stat-value">${value}${unit?` <small>${unit}</small>`:''}</p>
    <div class="my-stat-chart">${chart}</div>
    ${action?`<button class="my-stat-link" type="button" aria-label="${action[0]}" onclick="pushPage(${action[1]})"></button>`:''}
  </article>`;
}
function myPlanPanel(today){
  const week=studyWeekDays(today);
  const [monday,sunday]=[week[0],week[6]];
  const plan=savedStudySchedule(today);
  const [currentWeek,task]=STUDY_PLAN_WEEKS.find(([, , status])=>status==='doing');
  const dateLabel=date=>`${date.getMonth()+1}.${date.getDate()}`;
  return `<section class="my-panel" aria-labelledby="my-plan-heading">
    <h2 id="my-plan-heading">本周学习计划 <small>示例</small></h2>
    <button type="button" class="my-schedule-main my-current-plan" onclick="pushPage(pagePlan)">
      <span class="my-menu-icon" aria-hidden="true">${IC.plan}</span>
      <span class="my-schedule-copy"><b>${currentWeek} · 进行中</b><small>${task}</small></span>
      <span class="my-schedule-action">查看详情</span>${arw()}
    </button>
    <div class="my-week-heading">
      <div><h3>本周学习安排</h3><p>${dateLabel(monday)} – ${dateLabel(sunday)}</p></div>
      <button type="button" class="btn sm lite" onclick="tapSchedule()">查看安排</button>
    </div>
    <ul class="my-week-days" aria-label="周一到周日的学习安排">
      ${week.map((date,index)=>{
        const hours=U.activated&&date.getMonth()===today.getMonth()&&date.getFullYear()===today.getFullYear()?Number(plan[date.getDate()]):0;
        const hasPlan=Number.isFinite(hours)&&hours>0;
        const isToday=myDateKey(date)===myDateKey(today);
        return `<li class="${hasPlan?'scheduled':''}"${isToday?' aria-current="date"':''}>
          <span>周${'一二三四五六日'[index]}</span><time datetime="${myDateKey(date)}">${dateLabel(date)}</time>
          <small>${hasPlan?`${hours} 小时`:'—'}</small>
        </li>`;
      }).join('')}
    </ul>
    ${U.activated?'':'<p class="my-week-note">开通课程后可安排学习时间</p>'}
  </section>`;
}
function myWrongPanel(){
  const wrongs=S.records.filter(record=>!record.ok);
  return `<section class="my-panel my-wrong-panel" aria-labelledby="my-wrong-heading">
    <div class="my-panel-heading"><h2 id="my-wrong-heading">错题记录</h2><span>${wrongs.length} 道</span></div>
    <div class="my-wrong-list">${wrongQuestionRows(wrongs,true)}</div>
  </section>`;
}
function pageMe(){
  const name=U.name||'同学';
  const today=new Date();
  const history=myScoreHistory();
  const exam=history.at(-1);
  const hourDays=myRecentDays(today,7);
  const hours=hourDays.map(day=>U.hours.byDay?.[myDateKey(day)]);
  const sampleHours=!hours.some(Number.isFinite);
  const monthEnd=new Date(today.getFullYear(),today.getMonth()+1,0);
  const monthDays=myRecentDays(monthEnd,monthEnd.getDate());
  const datedCheckins=U.checkins.map(entry=>entry.day).filter(Boolean);
  const sampleCheckins=!datedCheckins.length;
  const checked=sampleCheckins
    ? new Set(myRecentDays(today,14).filter((_,index)=>index!==3&&index!==10).map(myDateKey))
    : new Set(datedCheckins);
  const todayKey=myDateKey(today);
  const shownCheckins=new Set(monthDays.map(myDateKey).filter(key=>key<=todayKey&&checked.has(key)));
  return `<div class="my-hub">
    <header class="my-identity" aria-label="个人资料">
      <span class="my-identity-avatar" aria-hidden="true">${myText(name[0])}</span>
      <div class="my-identity-name"><h1>${myText(U.name?name+'同学':name)}</h1><p>${myText(U.grade||'初三')} · ${myText(U.identity)} <span>学号 00713202</span></p></div>
      <div class="my-identity-actions">
        <button type="button" onclick="pushPage(pageArchive)">学情档案</button>
        <button type="button" onclick="pushPage(pageEditInfo)">修改资料</button>
      </div>
    </header>
    <section aria-labelledby="my-stats-heading">
      <h2 id="my-stats-heading">学习数据</h2>
      <div class="my-stats">
        ${myStatCard('累计学时',U.hours.total.toFixed(1),'小时','近 7 天',myHoursChart(hourDays,sampleHours?STUDY_HOUR_EXAMPLE:hours),['查看学习记录','pageStudyLog'])}
        ${myStatCard('成绩概览',exam?.v??'—',exam?'/ 100 分':'','最近一次',myScoreChart(exam),['查看成绩趋势','pageScores'])}
        ${myStatCard('打卡天数',shownCheckins.size,'天',`${today.getMonth()+1} 月`,myCheckinChart(today,monthDays,shownCheckins))}
      </div>
    </section>
    <div class="my-panels">${myPlanPanel(today)}${myWrongPanel()}</div>
    <details class="my-account">
      <summary>账号与设置</summary>
      <div class="my-account-body">
        ${myMenuButton('设置',IC.check,"toast('已打开设置（演示）')")}
        <p>版本 v0.3.24</p>
        <div class="my-account-actions">
          <button type="button" class="btn ghost" onclick="logout()">退出登录</button>
          <button type="button" class="btn ghost" onclick="toast('演示环境无需关闭')">关闭 APP</button>
        </div>
      </div>
    </details>
  </div>`;
}
function logout(){
  U.logged=false; stack=[];
  agreeOn=false; clearInterval(cdTimer);    /* 回到登录页时重置协议勾选与倒计时 */
  demoStart(); persist(); toast('已退出登录');
}

/* 未开通时说明课表条件，由学生选择是否返回首页。 */
function tapSchedule(){
  if(!U.activated){
    openModal('<h4>专属课程表</h4><p class="sub">开通课程并填写资料后，即可查看课表。</p><button type="button" class="btn" onclick="closeModal();goTab(\'home\')">去选课</button>');
    return;
  }
  if(courseStudy().step===4){ pushPage(pageSetupTime); return; }
  openCourseSetup();
}

/* ================= 课程：列表 / 详情 / 激活 / 课程准备 ================= */
/* 调研文档「课程激活」：点击课程 → 三种课程 → 按升学情况选择对应课程 → 输入激活码
   技巧课/技巧同步课可自助输入激活码，课课通需由报名老师发放激活码激活 */
const COURSES=[
 {id:'skill', n:'技巧课', s:'专注于初三高三技巧提升', b:'中高考答题技巧', bs:'掌握答题规律，精准技巧提升', bg:'linear-gradient(120deg,#DCEBFF,#B9D5FF)', c:'#2456C4', need:'code'},
 {id:'sync',  n:'技巧同步课', s:'初一初二、高一高二同步课技巧提升', b:'技巧同步课', bs:'专注于初一初二、高一高二', bg:'linear-gradient(120deg,#FFEAD3,#FFD7A6)', c:'#C77817', need:'code'},
 {id:'tong',  n:'课课通', s:'初高中非毕业班考试思维植入', b:'承前启后，高效突破', bs:'同步学校框架，升维考点思维', bg:'linear-gradient(120deg,#EAE1FF,#D6C7FF)', c:'#6A5CFF', need:'teacher'},
];
function replacePage(fn, dir){
  const replacing=stack.length>0;
  if(replacing) stack.pop();
  pushPage(fn,dir,replacing);
}

/* ---------- 科目课程库：每个课程、每个升学方向下都有独立课程列表 ---------- */
const SUB_BASE={
  skill:{中考:['语文','数学','英语','物理','化学','道法','历史','地理','生物'],
         高考:['语文','数学','英语','物理','化学','生物','政治','历史','地理']},
  sync: {中考:['语文','数学','英语','物理','化学','道法','历史'],
         高考:['语文','数学','英语','物理','化学','生物','政治']},
  tong: {中考:['语文','数学','英语','物理','化学','生物'],
         高考:['语文','数学','英语','物理','化学','生物']},
};
const SUB_EM={语文:'📖',数学:'📐',英语:'🔤',物理:'🧲',化学:'⚗️',生物:'🧬',政治:'⚖️',历史:'🏛️',地理:'🌏',道法:'📕'};
const SUB_BG={语文:'linear-gradient(135deg,#FFE9DD,#FFD6BF)',数学:'linear-gradient(135deg,#E1ECFF,#C4D9FF)',英语:'linear-gradient(135deg,#E6E1FF,#D3C8FF)',物理:'linear-gradient(135deg,#DDF3FF,#C0E6FF)',化学:'linear-gradient(135deg,#FFF0D6,#FFE1A6)',生物:'linear-gradient(135deg,#DFF5E7,#C2EBD2)',政治:'linear-gradient(135deg,#FFE3E8,#FFCBD6)',历史:'linear-gradient(135deg,#F0E6D9,#E3D2B8)',地理:'linear-gradient(135deg,#DCF3F0,#BFE9E2)',道法:'linear-gradient(135deg,#FFE6E2,#FFCFC7)'};
const SUB_COLOR={语文:'#C76A2C',数学:'#2456C4',英语:'#6A5CFF',物理:'#2C8BC7',化学:'#C78817',生物:'#27A566',政治:'#D4576E',历史:'#9A7540',地理:'#2B9B8E',道法:'#C85E4C'};
const FILTERS=['统招','艺考/体育统招','春考','单招','体育单招'];
const FILTER_SUBS={'统招':null,'艺考/体育统招':['语文','数学','英语','政治','历史','地理'],'春考':['语文','数学','英语'],'单招':['语文','数学','英语','物理','化学'],'体育单招':['语文','数学','英语','政治']};
let detailFilterVal='统招';
function subKey(id,v,s){ return id+'|'+v+'|'+s; }
function subObj(id,v,s){
  const name = id==='skill' ? (v==='高考'?'高考':'中考')+s
             : id==='sync'  ? (v==='高考'?'高中':'初中')+s+'·同步'
             : (v==='高考'?'高中':'初中')+s+'·课课通';
  return {key:subKey(id,v,s), id, v, sub:s, name,
    short:(id==='skill'?(v==='高考'?'高考':'中考'):(v==='高考'?'高中':'初中'))+s,
    d:id==='skill'?'高频考点速解技巧 · 2026版':id==='sync'?'同步校内进度 · 单元技巧精讲':'同步学校框架 · 考点思维植入',
    bg:SUB_BG[s], c:SUB_COLOR[s], em:SUB_EM[s]};
}
function subList(id){
  const v=U.identity==='高考'?'高考':'中考';
  let arr=(SUB_BASE[id]||SUB_BASE.skill)[v]||[];
  const f=FILTER_SUBS[detailFilterVal];
  if(f) arr=arr.filter(s=>f.includes(s));
  return arr.map(s=>subObj(id,v,s));
}
function subjectCoverIcon(subject,width,height){
  if(subject!=='道法'&&subject!=='历史') return '';
  return `<svg viewBox="0 0 150 150" width="${width}" height="${height}" aria-hidden="true" focusable="false">${HOME_SUBJECT_ART[subject]}</svg>`;
}
function subCards(id){
  const subjects=subList(id);
  if(!subjects.length) return '<p class="course-empty">该方向下暂无匹配科目，请切换招生类型。</p>';
  return subjects.map(x=>{
    const on=U.activatedSubjects.includes(x.key);
    return `<button type="button" class="sub-card" onclick="tapSubject('${x.id}','${x.key}')">
      <span class="sc-cover">${subjectCoverIcon(x.sub,64,50)}<b>${x.short}</b><small>2026 版</small></span>
      <span class="sc-name">${x.name}</span><span class="sc-desc">${x.d}</span>
      <span class="sc-btn ${on?'done':''}">${on?'已开通 · 进入学习':'去激活'}</span>
    </button>`;
  }).join('');
}

/* 每个课程卡片都可以进入自己的课程列表 */
function tapCourse(id){ pushPage(()=>pageCourseDetail(id)); }

/* ---------- 课程详情：升学方向 + 招生类型 + 科目课程列表 ---------- */
function pageCourseDetail(id){
  const c=COURSES.find(x=>x.id===id)||COURSES[0];
  const hi=U.identity==='高考';
  return head(c.n+' · 科目课程')+`
  <section class="student-panels card course-toolbar" aria-label="科目筛选">
    <div class="course-filter-row">
      <b>升学方向</b>
      <div class="segs" id="cs-switch" role="group" aria-label="升学方向">
        <button type="button" class="seg ${!hi?'on':''}" aria-pressed="${!hi}" onclick="detailIdentity(this,'中考','${c.id}')">初中 · 中考</button>
        <button type="button" class="seg ${hi?'on':''}" aria-pressed="${hi}" onclick="detailIdentity(this,'高考','${c.id}')">高中 · 高考</button>
      </div>
    </div>
    <div class="course-filter-row">
      <b>招生类型</b>
      <div class="segs" id="cs-filters" role="group" aria-label="招生类型">${FILTERS.map((f,i)=>`<button type="button" class="seg ${f===detailFilterVal?'on':''}" aria-pressed="${f===detailFilterVal}" onclick="detailFilter(this,'${f}','${c.id}')">${i===0?(hi?'高中':'初中')+f:f}</button>`).join('')}</div>
    </div>
  </section>
  <section class="student-panels" aria-labelledby="subject-list-title">
    <div class="subject-list-heading">
      <h2 id="subject-list-title">选择科目</h2>
      <span id="sub-cnt" aria-live="polite">${subList(c.id).length} 门课程</span>
    </div>
    <div class="sub-grid" id="sub-list">${subCards(c.id)}</div>
  </section>
  <div class="card" style="margin-top:12px">
    <h4>激活说明</h4>
    <p class="sub" style="line-height:1.75;margin-top:6px">${c.need==='teacher'?'课课通需由报名老师后台开通，请向老师索取激活码后在此输入。':'本类课程支持输入激活码自助开通（演示激活码：JQ2026）。'}<br>激活后可确认教材与学校进度，再选择进行摸底或直接看课。</p>
  </div>
  ${U.activeCourse===id&&courseStudy().step<4?`<div class="card"><h4>课程准备进行中</h4><button class="btn" onclick="openCourseSetup()">继续填写</button></div>`:''}
  <div style="height:6px"></div>`;
}
function detailIdentity(el,v,id){
  for(const button of el.parentNode.children){
    button.classList.toggle('on',button===el);
    button.setAttribute('aria-pressed',String(button===el));
  }
 
  U.identity=v; if(U.setupStep<4) U.grade=v==='高考'?'高二':'初二';
  const fs=document.getElementById('cs-filters');
  if(fs) [...fs.children].forEach((c,i)=>{ c.textContent=i===0?(v==='高考'?'高中':'初中')+FILTERS[i]:FILTERS[i]; });
  updateSubList(id);
  toast('已切换为'+(v==='高考'?'高中':'初中')+'技巧课程');
}
function detailFilter(el,f,id){
  detailFilterVal=f;
  for(const button of el.parentNode.children){
    button.classList.toggle('on',button===el);
    button.setAttribute('aria-pressed',String(button===el));
  }
  updateSubList(id);
}
function updateSubList(id){
  const box=document.getElementById('sub-list'); if(box) box.innerHTML=subCards(id);
  const cnt=document.getElementById('sub-cnt'); if(cnt) cnt.textContent=subList(id).length+' 门课程';
}

/* ---------- 科目课程 → 激活码 ---------- */
function tapSubject(id,key){
  if(U.activatedSubjects.includes(key)){ selectStudyCourse(id,key); pushPage(pageCoursePlay); return; }
  pushPage(()=>pageCourseActivate(id,key));
}
function pageCourseActivate(id,key){
  const p=key.split('|'), x=subObj(p[0],p[1],p[2]);
  const c=COURSES.find(y=>y.id===x.id)||COURSES[0];
  const hi=x.v==='高考';
  return head(x.name, `<span style="font-size:11px;color:var(--ink3)">课程激活</span>`)+`
  <div class="activation-layout">
    <section class="act-cover" aria-label="课程信息">
      <div class="mini" style="background:${x.bg};color:${x.c}"><span class="yr">EXAM MASTER · 2026版</span><b>${x.short}</b>${subjectCoverIcon(x.sub,38,32)||`<span class="em">${x.em}</span>`}</div>
      <div class="act-course-copy"><span class="act-eyebrow">即将开通</span><div class="nm">${x.name}</div><p>${x.d}</p></div>
    </section>
    <section class="act-info" aria-labelledby="act-info-title">
      <div class="act-section-head"><div><h4 id="act-info-title">核对账号信息</h4><p>请确认以下信息与学员本人一致</p></div><button type="button" class="act-edit" onclick="pushPage(pageEditInfo)">修改信息 <span aria-hidden="true">›</span></button></div>
      <div class="act-info-grid">
        <div class="act-row"><span>姓名</span><b>${U.name||'张同学'}</b></div>
        <div class="act-row"><span>学号</span><b>30755820</b></div>
        <div class="act-row"><span>住宿情况</span><b>1 周回家</b></div>
        <div class="act-row"><span>考生地区</span><b>${hi?'高中':'初中'} · ${U.school||'示范中学'}</b></div>
        <div class="act-row"><span>考试时间</span><b>${U.examDate||(hi?'2027 年高考':'2027 年中考')}</b></div>
        <div class="act-row"><span>考试类型</span><b>${hi?'高考':'中考'}</b></div>
      </div>
    </section>
    <section class="act-code" aria-labelledby="act-code-title">
      <div class="act-section-head"><div><h4 id="act-code-title">激活课程</h4></div></div>
      <div class="act-form"><label for="act-code">激活码</label><input class="input" id="act-code" placeholder="请输入激活码" autocomplete="off" aria-describedby="act-code-help act-code-error" oninput="clearActivationError()">
        <p class="act-code-help" id="act-code-help">${c.need==='teacher'?'课课通需由报名老师后台开通，请输入老师提供的激活码。':'激活码可向报名老师索取。'} 演示激活码：<b>JQ2026</b></p>
        <p class="act-code-error" id="act-code-error" role="alert" hidden></p>
        <button class="btn act-submit" onclick="doJoin('${x.id}','${x.key}')">立即激活</button>
        <p class="act-next">激活成功后，将继续完善课程信息。</p>
      </div>
    </section>
  </div>`;
}
function clearActivationError(){
  const error=document.getElementById('act-code-error');
  const input=document.getElementById('act-code');
  if(error){error.hidden=true;error.textContent='';}
  if(input) input.removeAttribute('aria-invalid');
}
/* 兼容旧入口：不再直接弹激活码，先进课程列表 */
function openJoin(id){ pushPage(()=>pageCourseDetail(id)); }
function doJoin(id,key){
  const el=document.getElementById('act-code');
  const v=el?el.value.trim():'';
  if(v!=='JQ2026'){ const error=document.getElementById('act-code-error'); if(error){error.textContent=v?'激活码错误，请核对后重试。':'请输入激活码。';error.hidden=false;} if(el) el.setAttribute('aria-invalid','true'); return; }
  if(!U.activatedCourses.includes(id)) U.activatedCourses.push(id);
  if(!U.activatedSubjects.includes(key)) U.activatedSubjects.push(key);
  U.activated=true;
  selectStudyCourse(id,key);
  toast('激活成功！伴学群二维码已生成');
  goTab('courses');
  openCourseSetup();
}

/* ---------- 伴学群：四身份确认 + 二维码 ---------- */
let grpRoleVal='学生';
function openGroup(){
  openModal(`<section class="group-modal" aria-labelledby="group-title">
    <div class="group-modal-head"><span class="group-modal-label">伴学服务</span><h4 id="group-title">加入专属伴学群</h4><p>请选择你的身份，确认后领取学习资料。</p></div>
    <div class="group-modal-content"><div class="group-role"><h5>选择身份</h5><div id="grp-seg" class="group-role-grid" aria-label="选择身份">
      ${['学生','家长','报名老师','学管/规划师'].map(r=>`<button type="button" class="group-role-option ${r===grpRoleVal?'on':''}" aria-pressed="${r===grpRoleVal}" onclick="grpRole(this,'${r}')">${r}</button>`).join('')}
    </div></div>
    <div class="group-qr"><div class="group-qr-frame"><canvas id="qr" width="170" height="170" aria-label="演示二维码图案"></canvas></div><b>伴学群二维码</b><p>演示图案，暂不可扫码入群</p></div></div>
    <button type="button" class="btn group-confirm" onclick="grpConfirm()">确认身份</button>
  </section>`);
  drawQR();
}
function grpRole(el,r){
  grpRoleVal=r;
  [...el.parentNode.children].forEach(c=>{const selected=c===el;c.classList.toggle('on',selected);c.setAttribute('aria-pressed',String(selected));});
}
function grpConfirm(){ closeModal(); toast('身份已确认（'+grpRoleVal+'），学习资料已发放'); }

/* ---------- 激活后的课程准备 ---------- */
const COURSE_EXAM_TYPES=['月考','期中考试','期末考试','一模','二模','升学考试'];
// 演示目录只列出用于验证选择、推荐与播放跳转的课题。
const COURSE_DEMOS={
  '中考|数学':{
    textbooks:{
      人教版:[
        ['一元二次方程',['factor','equation']],
        ['二次函数',['quadratic','translation']],
        ['圆',['chord','circle']],
        ['概率初步',['probability']],
      ],
      北师大版:[
        ['一元二次方程',['equation','factor']],
        ['概率的进一步认识',['probability']],
        ['二次函数',['quadratic','translation']],
        ['圆',['chord','circle']],
      ],
    },
    lessons:{
      factor:{answer:0,t:'因式分解与方程求根',question:Q[2].stem,choices:['(x+3)(x−3)','(x−3)²','(x+9)(x−1)']},
      equation:{answer:1,t:'一元二次方程的解法',question:'方程 x² = 9 的解是（　）',choices:['x = 3','x = ±3','x = 9'],before:'factor'},
      quadratic:{answer:0,t:'二次函数图像与系数',question:Q[0].stem,choices:Q[0].opts,before:'factor'},
      translation:{answer:0,t:'二次函数图像的平移',question:Q[5].stem,choices:Q[5].opts,before:'quadratic'},
      chord:{answer:1,t:'垂径定理与弦长计算',question:Q[1].stem,choices:Q[1].opts},
      circle:{answer:0,t:'圆的证明高频模型',question:'同一个圆中，所对圆心角相等的两条弦有什么关系？',choices:['长度相等','互相垂直','一定平行'],before:'chord'},
      probability:{answer:0,t:'概率统计速解技巧',question:Q[3].stem,choices:['3/5','2/3','1/5']},
    },
  },
  '中考|语文':{
    textbooks:{部编版:[['语言文字运用',['words','sentence']],['现代文阅读',['mainIdea','evidence']],['古诗文阅读',['classical']]]},
    lessons:{
      words:{answer:0,t:'词义与语境辨析',question:'遇到多义词时，判断它在文中的含义应优先看什么？',choices:['上下文','字数','文段长度']},
      sentence:{answer:0,t:'句子衔接与修改',question:'给一组句子排序时，最适合先找什么？',choices:['时间或逻辑线索','最长的句子','标点最多的句子'],before:'words'},
      mainIdea:{answer:0,t:'概括段落主要内容',question:'概括段落主要内容时，哪种做法最合适？',choices:['抓住对象和关键事件','罗列全部细节','只摘抄最后一句']},
      evidence:{answer:0,t:'从文章中寻找答题依据',question:'回答阅读题时，哪种做法更有依据？',choices:['结合原文关键语句','只描述自己的感受','只复述题目'],before:'mainIdea'},
      classical:{answer:0,t:'结合语境理解文言词语',question:'遇到不熟悉的文言词语，优先参考什么？',choices:['上下文与句意','现代字形','句子长短']},
    },
  },
};
// 以下目录用于表单演示，版本与课题仅作示例。
const EXAMPLE_TEXTBOOKS={
  中考:{
    英语:['人教版',['校园生活','社团活动与交流','描述日常安排'],['语言运用','一般过去时','阅读并提取信息']],
    物理:['人教版',['运动和力','惯性','二力平衡'],['电流和电路','电路的组成','串联和并联']],
    化学:['人教版',['物质的变化','区分物理变化与化学变化','化学变化中的能量'],['化学方程式','质量守恒定律','化学方程式的配平']],
    道法:['统编版',['个人与社会','认识社会生活','承担社会责任'],['法治教育','法律与生活','依法维护权利']],
    历史:['统编版',['中国古代史','秦汉大一统','隋唐的社会文化'],['中国近代史','近代化的探索','辛亥革命']],
    地理:['人教版',['地球和地图','认识经纬网','阅读等高线地形图'],['中国地理','地形与地势','气候与生活']],
    生物:['人教版',['细胞与生命','观察细胞结构','认识细胞的分裂'],['生物与环境','生态系统的组成','食物链和食物网']],
  },
  高考:{
    语文:['统编版',['现代文阅读','梳理文章论证','概括段落内容'],['古诗文阅读','辨析文言词义','理解古诗意象']],
    数学:['人教 A 版',['函数','函数的定义域','函数的单调性'],['三角函数','认识弧度制','三角函数的图像']],
    英语:['人教版',['学习与交流','阅读校园主题文章','用英语介绍学习计划'],['语法与写作','定语从句','写作中的句间衔接']],
    物理:['人教版',['直线运动','位移和速度','匀变速直线运动'],['相互作用','分析常见受力','力的合成与分解']],
    化学:['人教版',['物质的分类与转化','物质的分类','离子反应'],['化学计量','物质的量','物质的量浓度']],
    生物:['人教版',['细胞的结构','细胞膜的功能','细胞器分工'],['遗传学基础','分离定律','基因与性状']],
    政治:['统编版',['经济与社会','认识市场机制','理解收入分配'],['政治与法治','公民参与','法治社会']],
    历史:['统编版',['中国古代史','多元一体的早期文明','古代国家治理'],['世界史','新航路开辟','工业革命']],
    地理:['人教版',['自然地理','大气受热过程','水循环'],['人文地理','人口迁移','城市空间结构']],
  },
};
const EXAMPLE_STUDY_QUESTIONS={
  '社团活动与交流':[0,'想邀请同学加入篮球社团，哪句表达合适？','Would you like to join the basketball club?','Where did you put my basketball?','How many students are in your class?'],
  '描述日常安排':[0,'哪句话表示“我每天早上七点起床”？','I get up at seven every morning.','I got up late yesterday.','I go to bed at seven every evening.'],
  '一般过去时':[1,'She ___ the science museum last Sunday.','visits','visited','will visit'],
  '阅读并提取信息':[1,'通知写着 “The club meets every Friday at 4 p.m.”。社团什么时候集合？','每周四下午四点','每周五下午四点','每周五上午四点'],
  '惯性':[0,'公交车突然刹车时，站着的乘客容易向前倾。主要原因是什么？','乘客的惯性','乘客的重力消失','公交车转弯'],
  '二力平衡':[2,'一本书静止在水平桌面上。书受到的重力与桌面对它的支持力有什么关系？','大小相等，方向相同','大小不等，方向相反','大小相等，方向相反'],
  '电路的组成':[0,'在电池、小灯泡、开关和导线组成的简单电路中，开关断开时小灯泡会怎样？','熄灭','亮度不变','比原来更亮'],
  '串联和并联':[1,'两盏小灯泡并联，一条支路断开。电源和另一支路都正常，另一盏灯会怎样？','也会熄灭','仍能发光','无法接通电路'],
  '区分物理变化与化学变化':[2,'下列哪一项发生了化学变化？','冰块融化','纸张撕碎','铁钉生锈'],
  '化学变化中的能量':[0,'蜡烛燃烧时，主要以什么形式向周围释放能量？','热和光','声音','电流'],
  '质量守恒定律':[0,'在密闭容器中发生化学反应，反应前后的总质量有什么关系？','相等','一定减小','一定增大'],
  '化学方程式的配平':[1,'配平 2H₂ + O₂ → ___H₂O，水前的系数应是多少？','1','2','4'],
  '认识社会生活':[0,'为社区图书角整理书籍，最能体现哪一种行为？','参与社区公共生活','独自安排课余时间','记录个人消费'],
  '承担社会责任':[2,'小组作业中，你负责整理材料却发现可能无法按时完成。哪种做法更合适？','等交作业时再说','让组员自行猜测进度','尽早沟通并一起调整分工'],
  '法律与生活':[1,'同学借走物品后忘记归还，第一步怎样处理更合适？','擅自拿走同学的物品','说明情况并沟通归还时间','在公开群里辱骂对方'],
  '依法维护权利':[0,'发现自己在网络上的照片被未经同意转发，哪种做法更有助于后续处理？','保留相关记录并向可信渠道求助','转发对方的私人信息','删除所有相关记录'],
  '秦汉大一统':[0,'秦统一后推行哪项措施，方便了各地书面交流？','统一文字','各地自行制定文字','废除书写工具'],
  '隋唐的社会文化':[0,'唐朝的长安汇聚了许多来自不同地区的商人与使者。这最能说明什么？','对外交流活跃','各地完全不通商','城市只承担农业生产'],
  '近代化的探索':[1,'下列哪项是洋务运动中的一类举措？','推广科举考试至各国','兴办近代企业','停止发展近代工业'],
  '辛亥革命':[2,'辛亥革命的重要历史结果是什么？','建立了秦朝','开始了洋务运动','推翻了清朝统治'],
  '认识经纬网':[0,'在经纬网中，哪条线的纬度是 0°？','赤道','本初子午线','北回归线'],
  '阅读等高线地形图':[1,'同一幅等高线地形图上，等高线较密的地方通常表示什么？','坡度较缓','坡度较陡','海拔一定最低'],
  '地形与地势':[1,'概括我国地势的整体特征，哪项较合适？','东高西低','西高东低','南北完全平坦'],
  '气候与生活':[2,'规划户外活动时，哪项信息对判断某一天是否下雨最直接？','学校所在的经度','当地多年平均气温','当地当天的天气预报'],
  '观察细胞结构':[0,'观察植物细胞时，细胞最外侧起支持和保护作用的结构是什么？','细胞壁','细胞核','叶绿体'],
  '认识细胞的分裂':[1,'一个细胞完成一次分裂，通常会形成几个子细胞？','一个','两个','四个'],
  '生态系统的组成':[0,'池塘中的阳光、水、藻类和鱼共同组成了什么？','生态系统','同一个种群','一条食物链'],
  '食物链和食物网':[2,'在「草 → 蝗虫 → 青蛙」这条食物链中，生产者是谁？','蝗虫','青蛙','草'],
  '梳理文章论证':[0,'作者先提出主张，再列出调查数据。调查数据在论证中主要起什么作用？','为主张提供依据','代替全文的标题','转移文章话题'],
  '概括段落内容':[1,'概括议论性段落时，哪种做法最合适？','逐字抄录整段','找中心观点并简述支撑要点','只摘录最长的句子'],
  '辨析文言词义':[2,'判断一个文言词在句中的含义，优先参考什么？','该词的笔画数','文章的篇幅','该词在句中的作用和上下文'],
  '理解古诗意象':[0,'分析古诗中的「明月」时，怎样判断它在这首诗里的作用？','结合诗句和全诗情感判断','看到明月就判断为思乡','只查明月出现了几次'],
  '函数的定义域':[1,'函数 f(x) = 1/(x−2) 的定义域需要排除哪个实数？','0','2','−2'],
  '函数的单调性':[2,'如果 x₁ ＜ x₂ 时总有 f(x₁) ＜ f(x₂)，函数在这个区间上具有怎样的单调性？','单调递减','恒为常数','单调递增'],
  '认识弧度制':[0,'180° 对应多少弧度？','π','π/2','2π'],
  '三角函数的图像':[1,'函数 y = sin x 的最小正周期是多少？','π','2π','4π'],
  '阅读校园主题文章':[2,'短文写道 “The school introduced a reading hour to help students build a daily habit.”。学校开设阅读时段的目的是什么？','减少图书借阅','延长考试时间','帮助学生养成每日阅读习惯'],
  '用英语介绍学习计划':[0,'哪句话最适合用来说明下周的学习计划？','I plan to review two units next week.','I reviewed two units last week.','I used to review in the library.'],
  '定语从句':[1,'The student ___ won the prize is in my class.','where','who','why'],
  '写作中的句间衔接':[2,'I wanted to join the club. ___, the registration had already closed.','For example','As a result','However'],
  '位移和速度':[0,'一名学生向东走 100 米，再向西走 100 米。相对起点的位移是多少？','0 米','100 米向东','200 米向西'],
  '匀变速直线运动':[1,'物体从静止开始，沿直线以 2 m/s² 的加速度运动。3 秒后速度大小是多少？','2 m/s','6 m/s','9 m/s'],
  '分析常见受力':[1,'一本书静止在水平桌面上，忽略空气作用。书受到哪些力？','只有支持力','重力和支持力','重力和滑动摩擦力'],
  '力的合成与分解':[2,'同一直线上有 3 N 和 5 N 两个方向相反的力。合力的大小是多少？','8 N','15 N','2 N'],
  '物质的分类':[0,'下列哪项属于混合物？','空气','蒸馏水','氧气'],
  '离子反应':[1,'将盐酸与氢氧化钠溶液混合，净反应中直接生成水的粒子是哪一对？','Na⁺ 和 Cl⁻','H⁺ 和 OH⁻','Na⁺ 和 H⁺'],
  '物质的量':[2,'使用 n = m/M 计算物质的量时，M 表示什么？','质量','体积','摩尔质量'],
  '物质的量浓度':[0,'将 0.5 mol 溶质配成 1 L 溶液，溶质的物质的量浓度是多少？','0.5 mol/L','1 mol/L','2 mol/L'],
  '细胞膜的功能':[1,'细胞膜对不同物质进出细胞的限制程度不同，体现了什么特性？','所有物质都能自由通过','选择透过性','所有物质都无法通过'],
  '细胞器分工':[2,'真核细胞中，哪种细胞器是合成蛋白质的场所？','液泡','高尔基体','核糖体'],
  '分离定律':[0,'基因型为 Aa 的个体，在正常分离时能产生哪两类配子？','A 和 a','AA 和 aa','Aa 和 Aa'],
  '基因与性状':[1,'同一品种的植物在光照不同的条件下长势不同，这说明什么？','性状完全由基因确定','环境也可能影响性状','基因与性状没有关系'],
  '认识市场机制':[2,'其他条件相近时，某商品供应增加，价格通常会受到什么方向的压力？','上涨压力','不会受任何影响','下行压力'],
  '理解收入分配':[0,'下列哪项属于劳动报酬？','员工获得的工资','存款利息','房屋出租的租金'],
  '公民参与':[1,'社区就公共设施改造征集意见，哪种行为属于有序参与？','破坏施工说明牌','通过公开渠道提交建议','用谣言影响其他居民'],
  '法治社会':[2,'发生公共纠纷时，哪种做法更符合依法解决问题的原则？','私自扣留他人物品','在网上公开散布未经核实的信息','通过协商或相应的调解渠道解决'],
  '多元一体的早期文明':[0,'不同地区考古遗址既有各自特点，也有器物与技术交流。这个现象最能说明什么？','早期文明有多样性，也存在相互联系','各地文化完全相同','各地从未发生交流'],
  '古代国家治理':[1,'秦朝在全国推行郡县制，使地方官员由中央任免。这强化了什么？','地方官职世袭','中央对地方的管理','地方独立制定国策的能力'],
  '新航路开辟':[2,'从世界联系的角度看，新航路开辟带来的一个重要变化是什么？','全球海上贸易就此终止','各大洲之间的来往全部减少','不同大洲之间的联系进一步扩大'],
  '工业革命':[0,'工业革命早期，蒸汽动力的应用直接推动了哪项变化？','机器生产和运输的发展','手工生产全面取代机器','人口完全离开城市'],
  '大气受热过程':[1,'白天，近地面大气直接受热的主要来源是什么？','地球内部热量','地面向外辐射的热量','月球反射的光'],
  '水循环':[2,'海面水分以水汽形式进入大气，对应水循环的哪个环节？','降水','地表径流','蒸发'],
  '人口迁移':[0,'一个人从农村搬到城市工作并长期居住，最典型地体现了什么？','人口迁移','短期旅游','气候变化'],
  '城市空间结构':[1,'商业中心通常设置在交通较方便的地段，最直接的考虑是什么？','减少到访人数','便于顾客接近和商品流通','方便进行规模化农业生产'],
};
// 首个选项是答案。课后题与同一课题的摸底题分别维护。
const COURSE_PRACTICE={
  '因式分解与方程求根':['分解因式：x² − 16。','(x+4)(x−4)','(x−4)²','(x+8)(x−2)'],
  '一元二次方程的解法':['方程 x² = 25 的解是？','x = ±5','x = 5','x = ±25'],
  '二次函数图像与系数':['函数 y = x² − 5x + 6 的图像与 x 轴交于哪两点？','(2, 0) 和 (3, 0)','(−2, 0) 和 (−3, 0)','(1, 0) 和 (6, 0)'],
  '二次函数图像的平移':['把 y = x² 的图像向右平移 2 个单位，得到什么？','y = (x−2)²','y = (x+2)²','y = x²−2'],
  '垂径定理与弦长计算':['圆的半径为 10，圆心到弦的距离为 6。这条弦有多长？','16','8','12'],
  '圆的证明高频模型':['在同一个圆中，两条弦等长，则它们所对的较小圆心角有什么关系？','两角相等','两角互补','两角均为直角'],
  '概率统计速解技巧':['袋中有 2 个红球和 3 个白球，随机摸出 1 个，摸到白球的概率是多少？','3/5','2/5','1/3'],
  '词义与语境辨析':['「这件事很棘手」中的「棘手」是什么意思？','难以处理','很容易完成','手被划伤'],
  '句子衔接与修改':['哪项最适合接在「先把种子放进土里」之后？','再浇适量的水','昨天已经发芽了','所以种子没有重量'],
  '概括段落主要内容':['短文讲小组用调查和访谈找出图书角使用率低的原因。最佳概括是什么？','小组调查图书角使用情况及原因','图书角里摆着不同的书','图书管理员每天上班'],
  '从文章中寻找答题依据':['哪一句最能支持「她提前为活动做好了准备」？','她在活动前一天核对了材料清单','她喜欢晴天','教室里有三排桌子'],
  '结合语境理解文言词语':['「学而时习之」中的「习」在本句中更接近哪个意思？','温习','习惯','风俗'],
  '社团活动与交流':['想邀请同学加入读书社团，哪句表达合适？','Would you like to join the reading club?','Where is the school library?','I borrowed a book yesterday.'],
  '描述日常安排':['哪句表示「我每晚八点读书」？','I read at eight every evening.','I read a book yesterday morning.','I get up at eight every day.'],
  '一般过去时':['We ___ a film yesterday evening.','watched','watch','will watch'],
  '阅读并提取信息':['通知写道 “The library opens at 9 a.m. on Saturdays.”。图书馆周六几点开门？','上午九点','上午八点','晚上九点'],
  '惯性':['公交车突然启动时，站着的乘客容易向后仰。为什么？','身体有保持原来静止状态的趋势','重力突然变大','地面失去支持力'],
  '二力平衡':['一盏灯静止悬挂，重力为 5 N。忽略其他作用，绳对灯的拉力多大？','5 N','0 N','10 N'],
  '电路的组成':['由电池、导线和小灯泡组成的简单电路里，灯泡发光需要电路处于什么状态？','闭合','断开','灯泡两端接同一电极'],
  '串联和并联':['两盏灯串联，其中一盏移除，另一盏会怎样？','熄灭','继续正常发光','亮度增加一倍'],
  '区分物理变化与化学变化':['下列哪项发生了化学变化？','木柴燃烧','玻璃破碎','水分蒸发'],
  '化学变化中的能量':['将燃料燃烧用于加热水，主要利用了反应释放的什么能量？','热能','声能','机械能'],
  '质量守恒定律':['密闭容器反应前含容器总质量为 100 g，反应后称量应为多少？','100 g','90 g','110 g'],
  '化学方程式的配平':['配平 2Mg + O₂ → ___MgO，氧化镁前的系数应是多少？','2','1','3'],
  '认识社会生活':['为社区运动会协助登记，属于哪类活动？','参与社区公共生活','个人身体锻炼','居家整理物品'],
  '承担社会责任':['你答应为班级活动准备音响，但设备坏了。哪种做法更适当？','及时告知并一起寻找替代设备','临时失联','等活动开始再说明'],
  '法律与生活':['发现网购商品型号与订单不符，哪种处理方式合适？','保留订单并和商家沟通','公开商家的个人信息','丢弃商品与订单后再投诉'],
  '依法维护权利':['与服务提供者有纠纷，需要说明交易情况。哪项材料有帮助？','订单和沟通记录','无关同学的聊天记录','无法核对的猜测'],
  '秦汉大一统':['秦统一度量衡，最直接便利了什么？','各地使用相同的计量标准','各地分别采取不同标准','取消商贸中的数量记录'],
  '隋唐的社会文化':['在唐代长安发现来自不同地区的商业和文化活动记录，最能体现什么？','交流与交往活跃','长安与其他地区完全隔绝','长安禁止商业'],
  '近代化的探索':['近代开设机器制造企业，主要反映了哪方面的尝试？','引入近代工业生产方式','恢复手工生产作为唯一方式','取消技术学习'],
  '辛亥革命':['辛亥革命以后，哪一政体在中国结束？','君主专制政体','共和政体','地方行政制度'],
  '认识经纬网':['在经纬网中，哪条线的经度是 0°？','本初子午线','赤道','北回归线'],
  '阅读等高线地形图':['同一图上等高线越稀疏，通常说明坡越怎样？','越缓','越陡','越容易判断朝向'],
  '地形与地势':['从我国地势总体特征推断，很多大江大河的流向是什么？','自西向东','自东向西','全都自南向北'],
  '气候与生活':['比较两地多年平均降水量，最好查哪类资料？','多年气候统计','今天的云量','昨天的温度'],
  '观察细胞结构':['植物细胞中，哪一结构通常储有细胞液？','液泡','细胞壁','细胞核'],
  '认识细胞的分裂':['一个细胞连续分裂两轮，每轮所有细胞均分裂。最终产生几个细胞？','四个','两个','三个'],
  '生态系统的组成':['在校园池塘生态系统中，哪一项属于非生物因素？','光照','水草','鱼'],
  '食物链和食物网':['在「草 → 兔 → 狐」中，哪种生物直接取食生产者？','兔','狐','草'],
  '梳理文章论证':['作者先引用反例，再说明自己的主张为什么仍成立。反例在这里有什么作用？','引出对反对意见的回应','代替文章结论','补充地点描写'],
  '概括段落内容':['一段文字先说读书可以拓宽视野，再举两个例子。概括时先抓住什么？','读书可以拓宽视野这一观点','第二个例子中的人名','段落一共有几句话'],
  '辨析文言词义':['「温故而知新」中的「故」更接近哪一个意思？','学过的内容','故乡','事故'],
  '理解古诗意象':['同是「落叶」，为什么在两首诗里的作用可能不同？','它与各自的语境和情感有关','落叶只代表同一种情感','意象的作用只由字数决定'],
  '函数的定义域':['f(x) = 1/(x+3) 的定义域应排除哪个数？','−3','3','0'],
  '函数的单调性':['f(x) = −2x + 1 在实数范围内如何变化？','单调递减','单调递增','恒为常数'],
  '认识弧度制':['90° 对应多少弧度？','π/2','π','2π'],
  '三角函数的图像':['函数 y = cos x 的最小正周期是多少？','2π','π','4π'],
  '阅读校园主题文章':['通知写道 “The music room will close early on Thursday for repairs.”。提前关门是为了什么？','维修','举办演出','安排考试'],
  '用英语介绍学习计划':['哪句表示「我打算周三练习英语口语」？','I plan to practise speaking English on Wednesday.','I practised speaking English last Wednesday.','I have an English book on my desk.'],
  '定语从句':['The woman ___ teaches us English is from Canada.','who','where','when'],
  '写作中的句间衔接':['It was raining heavily. ___, the match was postponed.','As a result','For example','By the way'],
  '位移和速度':['向北走 60 m 再向南走 20 m，相对起点的位移是什么？','40 m 向北','80 m 向北','40 m 向南'],
  '匀变速直线运动':['初速度为 4 m/s，加速度为 2 m/s²，沿同一直线加速 3 s。末速度是多少？','10 m/s','6 m/s','12 m/s'],
  '分析常见受力':['一个球从手中静止释放，离手后忽略空气作用。它受什么力？','重力','重力和手的支持力','没有受到力'],
  '力的合成与分解':['同一直线上的 4 N 和 7 N 两个力方向相同，合力大小是多少？','11 N','3 N','28 N'],
  '物质的分类':['下列哪项属于纯净物？','蒸馏水','海水','空气'],
  '离子反应':['将硝酸银溶液和氯化钠溶液混合，哪一对离子形成沉淀？','Ag⁺ 和 Cl⁻','Na⁺ 和 NO₃⁻','Na⁺ 和 Ag⁺'],
  '物质的量':['已知一种物质的摩尔质量是 20 g/mol，40 g 该物质为多少物质的量？','2 mol','0.5 mol','800 mol'],
  '物质的量浓度':['用 2 mol 溶质配成 4 L 溶液，物质的量浓度是多少？','0.5 mol/L','2 mol/L','8 mol/L'],
  '细胞膜的功能':['哪项体现细胞膜的选择透过性？','不同分子通过细胞膜受到的限制不同','所有分子总能任意通过','细胞膜完全隔绝所有物质'],
  '细胞器分工':['在植物细胞中，哪一细胞器与光合作用最直接相关？','叶绿体','核糖体','液泡'],
  '分离定律':['基因型为 Bb 的个体在等位基因正常分离时，可以产生哪些配子？','B 和 b','BB 和 bb','只有 Bb'],
  '基因与性状':['同一基因型的植物在缺水与水分充足条件下株高不同，说明什么？','环境可以影响性状表现','缺水一定改变所有基因','基因不参与决定性状'],
  '认识市场机制':['其他条件相近时，需求增加通常对价格产生什么方向的压力？','上涨压力','下行压力','始终没有影响'],
  '理解收入分配':['哪项最接近因提供资产使用权获得的收入？','出租房屋获得的租金','完成工作获得的工资','加班获得的津贴'],
  '公民参与':['街道公开征集公交站点调整意见，哪种做法合适？','在指定渠道提出建议并说明理由','撕毁公告材料','冒用他人姓名提交意见'],
  '法治社会':['遇到邻里矛盾后，哪种行为更符合依法解决纠纷的原则？','保留事实记录并寻求协商或调解','私自扣留对方物品','传播未经证实的消息'],
  '多元一体的早期文明':['在不同地区发现风格不同的遗存，同时也见到相似器物。较合理的理解是什么？','存在地域差异，也可能有文化交流','各地历史完全相同','各地区没有任何交往'],
  '古代国家治理':['如果地方官由中央任免，这体现了中央怎样的治理方式？','加强对地方行政的控制','完全放弃地方行政','把地方官位改为世袭'],
  '新航路开辟':['新航路开辟之后，欧洲、美洲等地区间的海上贸易发生了什么趋势？','联系更频繁','完全停止','只保留沿河贸易'],
  '工业革命':['相较于手工工场，工业革命早期的机器生产使什么发生了变化？','劳动生产方式和生产规模','机器只能用于家庭烹饪','水陆运输停止发展'],
  '大气受热过程':['白天近地面升温，地面获得的能量主要来自哪里？','太阳辐射','地下岩层传热','月球反射的光'],
  '水循环':['水汽在高空冷却后形成云滴，主要对应哪个过程？','凝结','蒸发','下渗'],
  '人口迁移':['某居民到外省就业并长期居住，哪项因素对这次迁移最直接？','就业机会','季节变化','当天降水'],
  '城市空间结构':['大型货运仓库优先布局在高速公路出口附近，主要是为了什么？','缩短货物运输和转运时间','提升地区海拔','增加住户日常通勤距离'],
  '专项平面验算（一）':['长 8 cm、宽 5 cm 的长方形，周长是多少？','26 cm','13 cm','40 cm'],
  '专项平面验算（二）':['底为 10 cm、高为 6 cm 的三角形，面积是多少？','30 cm²','60 cm²','16 cm²'],
};
// 默认演示课与同名已激活课节使用同一道课后题。
// 每课整理做题步骤、知识点和易错提醒。例题可复用本课摸底素材。
const COURSE_REVIEW={
  '因式分解与方程求根':['把两项分别写成平方 → 按 (a+b)(a−b) 展开核对','识别平方差 a²−b²，把它写成 (a+b)(a−b)。','只有式子是两平方项的差，才能直接用平方差公式。'],
  '一元二次方程的解法':['先移项整理成 x² = a → 写出正负平方根并代回','当 x² = a 且 a 大于 0 时，正、负平方根都是解。','开平方后记得同时检查正根和负根。'],
  '二次函数图像与系数':['令 y = 0 并因式分解 → 解出横坐标，写成交点 (x, 0)','求图像与 x 轴的交点时，令 y = 0，再解方程。','方程的根是交点的横坐标，交点的纵坐标为 0。'],
  '二次函数图像的平移':['标出平移的方向和距离 → 左右改 x，上下改常数','左右平移看括号内 x 的变化，上下平移看式子末尾的常数。','向右平移时写成 x 减去相应数值。'],
  '垂径定理与弦长计算':['从圆心向弦作垂线 → 用勾股定理求半弦，再乘 2','过圆心作弦的垂线，得到半条弦和一个直角三角形。','勾股定理求出的是半弦长，求整条弦还要乘 2。'],
  '圆的证明高频模型':['确认两条弦位于同圆或等圆 → 连接圆心，比较圆心角','在同圆中，可在等弦与相等的较小圆心角之间相互推导。','使用等弦关系前，先确认两条弦在同圆或等圆中。'],
  '概率统计速解技巧':['数出所有等可能结果 → 数出符合条件的结果并写成分数','各结果等可能时，概率是符合条件的结果数除以总结果数。','分母要数所有可能结果，分子只数题目关注的结果。'],
  '词义与语境辨析':['读含有目标词的整句 → 将候选词义代回上下文核对','先读词所在的句子，再用上下文判断具体词义。','多义词的常用义未必适合这句话。'],
  '句子衔接与修改':['圈出代词和关联词 → 按逻辑关系排列，再通读检查','先找时间词、关联词和代词，判断句子之间的关系。','不要只看句子长短，要检查前后是否接得上。'],
  '概括段落主要内容':['标出段落的主要对象 → 提炼对象做了什么或作者说明了什么','先找段落谈论的对象，再提炼主要事件或观点。','例子和细节可以帮助判断重点，概括时不必逐个抄写。'],
  '从文章中寻找答题依据':['圈出题干中的关键词 → 回原文找到对应语句并解释依据','先明确题目问什么，再回到原文找能支持答案的语句。','引用原文后要说明它和问题的关系。'],
  '结合语境理解文言词语':['圈出待释词及其宾语 → 将推测的词义代回原句核对','用前后句和词语在句中的作用推断词义。','遇到古今都使用的字，也要检查古义是否相同。'],
  '社团活动与交流':['明确要邀请对方做的事 → 用 Would you like to 加动词原形写成问句','用 Would you like to + 动词原形 发出邀请。','邀请加入某个社团时，join 后面可以直接接社团名称。'],
  '描述日常安排':['圈出频率或时间短语 → 用一般现在时写出日常动作','描述习惯时，用一般现在时搭配 every day 等时间短语。','看到 every morning，先检查句子是否在说经常发生的事。'],
  '一般过去时':['圈出 yesterday 等过去时间 → 把谓语改为过去式，再读整句','描述已经结束的过去事件，常用动词的过去式。','last Sunday、yesterday 等时间提示通常要求检查过去式。'],
  '阅读并提取信息':['确定题目要找哪类信息 → 回原文比对星期、数字和上午下午','先圈出题目问的日期、时间或地点，再回原文定位。','a.m. 表示上午，p.m. 表示下午或晚上，要连同日期一起核对。'],
  '惯性':['分别判断车和乘客原来的状态 → 找出车速变化后身体仍保持的运动趋势','物体具有保持原来运动状态的性质。','分析乘客前倾或后仰时，先判断身体原先的运动状态。'],
  '二力平衡':['选定物体并画受力图 → 检查两力等大、反向是否共线','同一物体受两个力平衡时，两力等大、反向且在同一直线上。','先确认两个力都作用于所研究的同一个物体。'],
  '电路的组成':['从电源一端沿导线追踪 → 检查能否经过灯泡回到另一端','简单电路要形成闭合通路，电流才可持续流过灯泡。','先沿导线从电源一端走一圈，检查能否回到电源另一端。'],
  '串联和并联':['先标出各支路 → 模拟断开其中一路，检查另一条是否闭合','串联只有一条通路，并联有多条支路。','判断一盏灯断开后另一盏灯的状态，要看是否还有独立通路。'],
  '区分物理变化与化学变化':['列出变化前后的物质 → 判断是否出现新物质','判断变化类型时，先看有没有生成新物质。','形状、状态变化本身不能说明发生了化学变化。'],
  '化学变化中的能量':['圈出发光、升温等现象 → 选出现象对应的能量形式','燃烧等化学反应可以伴随热、光等能量变化。','根据现象识别能量形式，例如加热水主要利用热能。'],
  '质量守恒定律':['划定称量范围 → 把容器内外的全部反应产物计入','反应前后比较质量时，要把所有相关物质都计入。','若有气体逸出，只称容器里剩余物质会漏算气体。'],
  '化学方程式的配平':['逐个元素数原子个数 → 调整系数，最后复核两边','通过调整化学式前的系数，使反应前后各元素的原子数相等。','配平时不能改化学式里的下标。'],
  '认识社会生活':['判断活动是否涉及社区共同事务 → 再判断个人是否实际参与','参与社区公共活动，可以了解公共规则并与他人协作。','判断是否参与公共生活，可以看活动是否与社区共同事务有关。'],
  '承担社会责任':['找出自己承担的任务 → 选择能及时沟通和补救的做法','遇到无法按约完成的任务，及时沟通并协助调整。','等到最后一刻才说明困难，会让他人失去协调时间。'],
  '法律与生活':['先列明已发生的事实 → 选择与争议直接相关的沟通方式','处理生活纠纷时，先理清事实，再选择合适的沟通方式。','将对话聚焦在可核实的事实和具体请求上。'],
  '依法维护权利':['找出能说明事实的材料 → 选择可信且合适的求助渠道','遇到权益问题时，保留相关记录，并找可信渠道求助。','保留与问题直接相关的记录，避免扩散无关人员的信息。'],
  '秦汉大一统':['圈出题目关注的是书写还是计量 → 将目标对应到统一措施','统一文字、度量衡等措施有助于不同地区交流和治理。','统一文字主要影响书写交流，统一度量衡主要影响计量。'],
  '隋唐的社会文化':['圈出材料里往来的人员和活动 → 归纳材料能说明的交流现象','可从商人、使者和文化传播等材料看隋唐交流。','从材料推结论时，把结论限定在材料能直接支持的范围内。'],
  '近代化的探索':['先确定题目的历史时期 → 将人物或举措与该时期对照','兴办近代企业是近代化探索的一类实践。','先核对事件的时代背景，再判断某项举措属于哪一阶段。'],
  '辛亥革命':['辨认事件的时代和对象 → 写出与该事件直接相关的结果','理解辛亥革命时，可从清朝统治结束和共和制度建立来梳理。','历史结果要对应本事件，避免把前一时期的洋务运动混进来。'],
  '认识经纬网':['先辨经线和纬线 → 找到 0° 的参照线，再读方向','赤道是 0° 纬线，本初子午线是 0° 经线。','读数时先分清经度和纬度，再看东、西或南、北。'],
  '阅读等高线地形图':['在同一地图上比较线间距 → 用疏密判断坡缓或坡陡','同一图上，等高线越密，坡通常越陡。','判断坡度要看线间距，单看海拔高低不够。'],
  '地形与地势':['先概括海拔的东西差异 → 再沿地势下降方向判断河流大势','我国地势总体西高东低，可用于推断许多主要河流的总体方向。','总体方向可以辅助判断个别河流，具体流向还要看地形图。'],
  '气候与生活':['区分题目问某一天还是多年情况 → 选择天气预报或气候统计','天气关注短时间变化，气候概括多年平均特征。','判断某天是否下雨，应看当天的天气信息。'],
  '观察细胞结构':['看题目问位置还是作用 → 将线索与细胞结构逐项对照','植物细胞的细胞壁位于外侧，起支持和保护作用。','细胞壁和细胞膜是不同结构，答题时看题目问哪种功能。'],
  '认识细胞的分裂':['写下初始细胞数和分裂轮数 → 题设每轮都分裂时逐轮翻倍','在题设每轮所有细胞都分裂的情况下，细胞数每轮翻倍。','多轮分裂要逐轮翻倍，不能每轮固定只加一个。'],
  '生态系统的组成':['按生物因素与非生物因素分类 → 确认题目是否问两者组成的整体','生态系统由生物及其所处的非生物环境共同组成。','水、阳光等非生物因素也属于生态系统。'],
  '食物链和食物网':['先认生产者，再顺着箭头 → 判断谁直接取食谁','先找生产者，再沿箭头看哪些生物取食它。','箭头指向取食者，表示物质和能量传递的方向。'],
  '梳理文章论证':['标出观点、论据和转折句 → 根据每句与观点的关系判断作用','区分作者的观点、支撑观点的材料和对质疑的回应。','举出事实的句子通常承担论据作用，不能仅凭句子位置判断。'],
  '概括段落内容':['先划出中心句 → 将不同论据归并成一两条要点','先指出中心观点，再用短句整理支撑它的要点。','段落里例子最具体，不一定是概括的主体。'],
  '辨析文言词义':['看待释词在句中作什么成分 → 用上下文排除不合句意的词义','结合上下文、词在句中的位置和语法作用解释词义。','不能默认套用现代最常见的词义。'],
  '理解古诗意象':['找到意象出现的诗句 → 结合前后情感判断它在诗中的作用','结合意象所在的诗句及全诗情感判断它的作用。','同一个意象在不同作品中可能表达不同情感。'],
  '函数的定义域':['写出分母不等于 0 等限制 → 解出允许的 x 值范围','先找限制条件。分式中，令分母不等于 0。','排除的是使分母为 0 的 x 值。'],
  '函数的单调性':['在同一指定区间取 x₁ ＜ x₂ → 比较两个函数值的大小','在指定区间里，x 增大时比较 f(x) 是增大还是减小。','描述单调性时要带上所讨论的区间。'],
  '认识弧度制':['写出 180° = π 弧度 → 将角度乘 π/180 并化简','180° 对应 π 弧度，角度转弧度可乘 π/180。','角度值和弧度值单位不同，90° 写成弧度是 π/2。'],
  '三角函数的图像':['先确定一个完整的重复区间 → 计算图像重复一次的横向长度','sin x 和 cos x 的最小正周期均为 2π。','周期要看整段图像重复所需的长度，两个零点间距未必是周期。'],
  '阅读校园主题文章':['圈出问题中的目的或安排 → 回原文定位对应表达','先确定问题问目的还是安排，再从原文找对应语句。','问目的时，留意 to help、in order to 和 for 后面的内容。'],
  '用英语介绍学习计划':['圈出计划和时间 → 用 I plan to 写出动词原形 → 句末补上时间','用 I plan to + 动词原形，表达自己打算做什么。','plan to 后接动词原形，例如 I plan to review，不能写成 I plan to reviewing。','I plan to review my notes this weekend. 我打算这周末复习笔记。'],
  '定语从句':['圈出先行词 → 判断关系词在从句中作什么成分','先找从句修饰的先行词，再判断关系词在从句中作什么成分。','先行词是人且关系词在从句中作主语时，可用 who。'],
  '写作中的句间衔接':['判断两句是转折、因果还是举例 → 代入连接词读一遍','先判断前后句是转折、因果还是举例，再选连接词。','However 表转折，As a result 表结果。'],
  '位移和速度':['选一个正方向 → 将各段位移带符号相加','位移看起点指向终点的变化，计算时要保留方向。','往返移动时把路程相加，并不能得到位移。'],
  '匀变速直线运动':['列出 v₀、a、t → 统一方向后代入 v = v₀ + at','加速度恒定时，用 v = v₀ + at 求末速度。','列式前先统一正方向，再给速度和加速度加正负号。'],
  '分析常见受力':['圈定研究对象 → 逐项核对重力和仍存在的接触作用','先确定研究对象，再逐项找仍然施加作用的物体。','物体离开手后，手的支持力就消失了。'],
  '力的合成与分解':['统一方向 → 给同向和反向的力加上符号后求和','同一直线力同向相加、反向相减，合力方向看较大的方向分量。','方向相反时不能直接把力的大小相加。'],
  '物质的分类':['判断样品包含几种物质 → 只有一种是纯净物，多种是混合物','纯净物只含一种物质，混合物含多种物质。','只看外观均匀无法区分纯净物和混合物。'],
  '离子反应':['列出溶液中的离子 → 划去两边未变化的离子，再检查电荷','写净离子反应时，保留实际参加反应的离子。','在方程两边都未变化的旁观离子应当约去。'],
  '物质的量':['已知质量和摩尔质量时写 n = m/M → 统一单位再代数值','已知质量和摩尔质量时，用 n = m/M。','用 g 和 g/mol 计算时，所得单位是 mol。'],
  '物质的量浓度':['确定溶质的物质的量和溶液体积 → 将体积换成 L，再算 n/V','物质的量浓度是溶质的物质的量除以溶液体积。','体积要用配成的溶液总体积，注意换算为 L。'],
  '细胞膜的功能':['先看题干描述的是允许、限制还是阻隔 → 对应细胞膜的功能','细胞膜对不同物质进出有不同限制，体现选择透过性。','选择透过并不意味着把所有物质都挡在膜外。'],
  '细胞器分工':['圈出题目问的生命活动 → 把活动与对应细胞器匹配','把细胞器和主要功能对应起来，如核糖体与蛋白质合成。','不要把蛋白质合成和光合作用对应到同一结构。'],
  '分离定律':['写出一对等位基因 → 将每个等位基因分到一种配子中','在正常分离时，等位基因分别进入不同配子。','写配子类型时，每种配子只带该位点的一个等位基因。'],
  '基因与性状':['先看两组基因型是否相同 → 再判断性状变化和哪种环境差异有关','性状表现可以同时受基因和环境影响。','环境改变性状，不能据此推断基因必然发生改变。'],
  '认识市场机制':['先确认变化的是供给还是需求 → 在其他条件相近时判断价格压力','在其他条件相近时，可用供给或需求的变化判断价格压力。','供给增加与需求增加通常对价格产生不同方向的压力。'],
  '理解收入分配':['找出获得该笔收入的原因 → 将它归入劳动、资产收益或其他类别','先看收入来自劳动、资产使用还是其他来源。','工资通常对应劳动报酬，租金通常来自提供资产使用权。'],
  '公民参与':['找出题目中的公共事务 → 判断做法是否通过公开渠道表达意见','参与公共事务时，可通过公开渠道提出意见并说明理由。','表达观点前先核实事实，再选择合适的反馈渠道。'],
  '法治社会':['先分清事实和猜测 → 选能保留证据、沟通或调解的做法','处理纠纷时，可通过协商、调解等方式推动解决。','保存事实记录比传播未经证实的信息更有助于解决问题。'],
  '多元一体的早期文明':['比较不同遗存的共同点和差异 → 分别归纳地域特点与交流线索','地域文化各有特点，也可通过遗存看出交流与联系。','器物相似可作为讨论交流的线索，不能据此断定各地完全相同。'],
  '古代国家治理':['圈出谁任免地方官员 → 判断地方权力是否更集中于中央','比较地方治理制度时，重点看地方官员的任免方式。','官员由中央任免与地方官职世袭体现不同的权力关系。'],
  '新航路开辟':['圈出题目限定的角度 → 描述海上通道如何改变跨地区联系','从世界联系来看，新航路开辟促进了不同地区的海上往来。','若题目限定世界联系，回答应聚焦跨地区交流怎样变化。'],
  '工业革命':['确认技术应用在哪个行业 → 用生产或运输的具体变化说明影响','机器和动力的应用改变了生产方式和运输条件。','说明影响时，可分开看生产规模和运输效率。'],
  '大气受热过程':['画出太阳、地面和近地面大气的能量传递箭头 → 按问题辨别直接来源','太阳辐射加热地面，地面辐射再加热近地面大气。','区分近地面大气的直接热源与整个过程的能量来源。'],
  '水循环':['判断水所处的位置和状态变化 → 对照蒸发、凝结、降水或径流','用蒸发、凝结、降水和径流描述水在各环节间的转移。','液态水变成水汽是蒸发，水汽形成云滴是凝结。'],
  '人口迁移':['先确认是否改变常住地 → 再按题干找就业、教育等直接原因','判断人口迁移，先看是否跨地区改变常住地。','短期旅游通常没有改变常住地。'],
  '城市空间结构':['圈出用地类型 → 从客流、货运和交通可达性分析选址','交通条件会影响客流、物流和功能用地布局。','分析选址时，先明确该设施最需要服务的人或运输的货物。'],
  '专项平面验算（一）':['找出长与宽 → 计算 2×(长＋宽) 并标长度单位','长方形周长等于长与宽之和的两倍。','周长用长度单位，面积用平方单位。','长 6 cm、宽 4 cm 的长方形，周长为 2×(6+4) = 20 cm。'],
  '专项平面验算（二）':['找到指定底边及对应的垂直高 → 计算底×高÷2 并标平方单位','三角形面积等于底与对应高的乘积除以 2。','高必须与所选的底垂直。','底为 8 cm、高为 5 cm 的三角形，面积为 8×5÷2 = 20 cm²。'],
};
const EXAMPLE_COURSE_DEMOS=Object.fromEntries(Object.entries(EXAMPLE_TEXTBOOKS).flatMap(([direction,subjects])=>
  Object.entries(subjects).map(([subject,[edition,...chapters]])=>{
    const lessons={};
    const directory=chapters.map(([chapter,...topics],chapterIndex)=>[chapter,topics.map((t,topicIndex)=>{
      const id=`example-${chapterIndex+1}-${topicIndex+1}`;
      const [answer,question,...choices]=EXAMPLE_STUDY_QUESTIONS[t]||[];
      lessons[id]=question?{t,question,choices,answer}:{t};
      return id;
    })]);
    return [direction+'|'+subject,{textbooks:{[edition]:directory},lessons}];
  })
));
function courseDemo(){
  const key=U.activeSubject.split('|').slice(1).join('|');
  return COURSE_DEMOS[key]||EXAMPLE_COURSE_DEMOS[key];
}
function courseStudy(){
  const key=U.activeSubject;
  if(!U.courseStudy[key]){
    const {textbook,nextExam,nextExamTime}=U.setup;
    U.courseStudy[key]={step:U.setupStep===4?4:1,textbook,nextExam,nextExamTime};
  }
  return U.courseStudy[key];
}
function selectStudyCourse(id,key){
  if(U.activeSubject) courseStudy();
  U.courseStudy[key]??={step:1};
  U.activeCourse=id;
  U.activeSubject=key;
  U.setupStep=courseStudy().step;
}
function setStudyStep(step){
  courseStudy().step=step;
  U.setupStep=step;
}
function selectedStudyChapter(){
  const {textbook,lesson}=courseStudy();
  const chapters=courseDemo()?.textbooks[textbook];
  return Array.isArray(chapters)?chapters.find(([,ids])=>ids.includes(lesson)):undefined;
}
function openCourseSetup(){
  const {step}=courseStudy();
  if(step===4){ pushPage(pageCoursePlay); return; }
  pushPage(step===2&&(!courseDemo()||selectedStudyChapter())?pageSetup2:pageSetup1);
}
function setupFrame(step, title, body, foot, extraTop){
  return `<div class="setup-topbar">
    <div class="st-nav"><b>课程准备</b></div>
    <div class="st-ttl"><b>${title}</b><span>（${step}/2）</span></div>
  </div>
  <div class="setup-body">${extraTop||''}<div class="setup-card">${body}</div></div>
  <div class="setup-foot">${foot}</div>`;
}
function setupBack(step){
  if(step===2&&stack[stack.length-2]!==pageCoursePlay){
    setStudyStep(1); replacePage(pageSetup1,'back'); return;
  }
  popPage();
}
function studyField(key,label,text,placeholder,action,required,disabled=false){
  return `<div class="sf"><label for="sf-${key}">${label}${required?'<em>*</em>':''}</label>
    <button type="button" class="sfbox ${text?'on':''}" id="sf-${key}" aria-haspopup="dialog" ${disabled?'disabled':''} onclick="${action}()"><span class="txt">${text||placeholder}</span>${arw()}</button>
  </div>`;
}
function pageSetup1(){
  const demo=courseDemo(), study=courseStudy();
  const hasCatalog=!!demo;
  const textbook=hasCatalog&&Object.hasOwn(demo.textbooks,study.textbook)?study.textbook:'';
  const exampleTextbook=hasCatalog?Object.keys(demo.textbooks)[0]:'';
  const firstChapter=textbook?demo.textbooks[textbook][0]:null;
  const progressPlaceholder=firstChapter?`示例：${firstChapter[0]} · ${demo.lessons[firstChapter[1][0]].t}`:'请先选择教材版本';
  const chapter=selectedStudyChapter();
  const progress=chapter?[chapter[0],study.chapterOnly?'':demo.lessons[study.lesson].t].filter(Boolean).join(' · '):'';
  const tip=`<div class="card" style="background:var(--green-bg);border-color:#CDEEDC;padding:10px 12px;margin-bottom:10px;display:flex;align-items:center;gap:8px;cursor:pointer" onclick="openGroup()">
    <span style="font-size:16px">✅</span><div style="flex:1"><b style="font-size:12.5px">伴学群二维码已自动生成</b><div style="font-size:11px;color:var(--ink3)">学生 / 家长 / 报名老师 / 学管规划师可选</div></div><span style="font-size:12px;color:var(--blue);font-weight:700">查看 ›</span></div>`;
  return setupFrame(1,'教材与学校进度',`
    ${studyField('textbook','教材版本',textbook,hasCatalog?'示例：'+exampleTextbook:'暂无可选版本','pickStudyTextbook',hasCatalog,!hasCatalog)}
    ${studyField('schoolProgress','学校进度',progress,hasCatalog?progressPlaceholder:'暂无章节目录','pickStudyProgress',hasCatalog,!textbook)}
    ${studyField('nextExam','考试时间',nextExamText(),'选择考试类型和日期（选填）','openNextExam',false)}
    ${hasCatalog?'':'<p class="study-note">当前科目暂无演示教材目录，可继续进入下一步。</p>'}
  `, '<button type="button" class="btn" onclick="setup1Next()">下一步（1/2）</button>',tip);
}
function pickStudyTextbook(){
  openModal(`<h4>选择教材版本</h4><div class="optlist">${Object.keys(courseDemo().textbooks).map(name=>`<button type="button" class="${courseStudy().textbook===name?'on':''}" onclick="chooseStudyTextbook('${name}')">${name}</button>`).join('')}</div>`);
}
function chooseStudyTextbook(textbook){
  const study=courseStudy();
  if(study.textbook!==textbook) Object.assign(study,{textbook,lesson:null,chapterOnly:false,result:null,playing:null});
  closeModal(); refresh(); $id('sf-schoolProgress').focus();
}
function pickStudyProgress(){
  const chapters=courseDemo().textbooks[courseStudy().textbook];
  openModal('<h4>选择学校进度</h4><p class="study-note">教材目录示例</p><div id="study-directory"></div>');
  renderStudyDirectory(Math.max(0,chapters.indexOf(selectedStudyChapter())),false);
}
function renderStudyDirectory(index,showTopics){
  const study=courseStudy(), demo=courseDemo(), chapters=demo.textbooks[study.textbook];
  const [chapter,ids]=chapters[index];
  $id('study-directory').innerHTML=`<div class="study-directory ${showTopics?'show-topics':''}">
    <nav class="study-chapters" aria-label="教材章节">${chapters.map(([name],i)=>`<button type="button" aria-pressed="${i===index}" onclick="renderStudyDirectory(${i},true)">${name}</button>`).join('')}</nav>
    <form class="study-topics" onsubmit="event.preventDefault();saveStudyProgress(this,${index})">
      <button type="button" class="study-chapter-back" onclick="renderStudyDirectory(${index},false)">‹ 返回章节</button>
      <h5>${chapter}</h5>
      ${ids.map((id,i)=>`<label><input type="radio" name="lesson" value="${id}" required ${!study.chapterOnly&&id===study.lesson?'checked':''}><span>第 ${i+1} 课 · ${demo.lessons[id].t}</span></label>`).join('')}
      <label><input type="radio" name="lesson" value="chapter" required ${study.chapterOnly&&ids.includes(study.lesson)?'checked':''}><span>只确定到本章</span></label>
      <button type="submit" class="btn">确认进度</button>
    </form>
  </div>`;
  if(showTopics) $id('study-directory').querySelector('input:checked,input').focus();
}
function saveStudyProgress(form,index){
  const study=courseStudy();
  const value=new FormData(form).get('lesson');
  const chapterOnly=value==='chapter';
  const lesson=chapterOnly?courseDemo().textbooks[study.textbook][index][1][0]:value;
  if(study.lesson!==lesson||!!study.chapterOnly!==chapterOnly) Object.assign(study,{lesson,chapterOnly,result:null,playing:null});
  closeModal(); refresh(); $id('sf-schoolProgress').focus();
}
function nextExamText(){
  const {nextExam,nextExamTime}=courseStudy();
  const exam=COURSE_EXAM_TYPES.find(option=>option===nextExam);
  const date=/^\d{4,}-\d{2}-\d{2}$/.test(nextExamTime)?nextExamTime:'';
  return [exam,date].filter(Boolean).join(' · ');
}
function openNextExam(){
  openModal(`<h4>考试时间</h4>
  <form onsubmit="event.preventDefault();saveNextExam()">
    <div class="sf">
      <label for="sf-exam-type">考试类型</label>
      <select id="sf-exam-type" class="input" required>
        <option value="">请选择考试类型</option>
        ${COURSE_EXAM_TYPES.map(exam=>`<option>${exam}</option>`).join('')}
      </select>
    </div>
    <div class="sf">
      <label for="sf-date">考试日期</label>
      <input class="input" id="sf-date" type="date" required>
    </div>
    <button type="submit" class="btn">确定</button>
  </form>`);
  const exam=document.getElementById('sf-exam-type');
  exam.value=courseStudy().nextExam||'';
  document.getElementById('sf-date').value=courseStudy().nextExamTime||'';
  exam.focus();
}
function saveNextExam(){
  const setup=courseStudy();
  setup.nextExam=document.getElementById('sf-exam-type').value;
  setup.nextExamTime=document.getElementById('sf-date').value;
  const button=document.getElementById('sf-nextExam');
  button.querySelector('.txt').textContent=nextExamText();
  button.classList.add('on');
  closeModal();
  button.focus();
  persist();
}
function setup1Next(){
  if(courseDemo()&&!selectedStudyChapter()){
    toast(courseStudy().textbook?'请选择学校正在学的课题':'请选择教材版本'); return;
  }
  setStudyStep(2); replacePage(pageSetup2);
}
function studySkipButton(){
  return '<button type="button" class="btn lite" onclick="skipStudyDiagnostic()">跳过，直接看课</button>';
}
function pageSetup2(){
  const demo=courseDemo();
  const hasQuiz=demo&&!!demo.lessons[studyTopic()].question;
  return setupFrame(2,'薄弱点摸底',`
    ${demo?'':'<p class="study-note">当前科目暂无演示摸底内容</p>'}
    ${demo?`<div class="study-methods">
      ${hasQuiz?`<button type="button" onclick="pushPage(pageStudyQuiz)"><b>在线答题</b></button>`:''}
      <button type="button" onclick="pushPage(pageStudyUpload)"><b>上传试卷</b></button>
    </div>`:''}
  `,studySkipButton());
}
function studyTopic(){
  const {lessons}=courseDemo();
  const id=courseStudy().lesson;
  return Object.hasOwn(lessons,id)?id:Object.keys(lessons)[0];
}
function studyQuizLessons(){
  const {lessons}=courseDemo();
  const topic=studyTopic();
  return [lessons[topic].before,topic].filter(id=>lessons[id]?.question);
}
function pageStudyQuiz(){
  const {lessons}=courseDemo();
  const questions=studyQuizLessons().map(id=>lessons[id]);
  return head('在线答题',captureQuestionButton('答题'))+`
    <form class="card study-task" onsubmit="event.preventDefault();finishStudyDiagnostic('quiz',this)">
      <p class="study-note">演示题目</p>
      ${questions.map((q,index)=>`<fieldset><legend>${index+1}. ${q.question}</legend>
        ${q.choices.map((choice,option)=>`<label><input type="radio" name="answer-${index}" value="${option}" required><span>${choice}</span></label>`).join('')}
      </fieldset>`).join('')}
      <div class="study-actions">${studySkipButton()}<button type="submit" class="btn">提交答题</button></div>
    </form>`;
}
function pageStudyUpload(){
  return head('上传试卷')+`
    <form class="card study-task" onsubmit="event.preventDefault();finishStudyDiagnostic('upload')">
      <h3>选择试卷图片</h3><p class="study-note">试卷图片仅在本机选择，本页提供示例分析。</p>
      <label class="study-file">试卷图片 <input type="file" accept="image/*" required></label>
      <div class="study-actions">${studySkipButton()}<button type="submit" class="btn">查看示例分析</button></div>
    </form>`;
}
function finishStudyDiagnostic(method,form){
  const topic=studyTopic();
  const result={method,lesson:topic,prerequisite:false};
  if(method==='quiz'){
    const answers=new FormData(form);
    const {lessons}=courseDemo();
    const ids=studyQuizLessons();
    const incorrect=ids.filter((id,index)=>answers.get('answer-'+index)!==String(lessons[id].answer));
    result.lesson=incorrect[0]||topic;
    result.prerequisite=result.lesson!==topic;
    result.total=ids.length;
    result.correct=ids.length-incorrect.length;
  }
  courseStudy().result=result;
  stack.pop(); replacePage(pageStudyResult);
}
function pageStudyResult(){
  const study=courseStudy(), result=study.result;
  const lesson=courseDemo().lessons[result.lesson];
  return head('摸底结果')+`<section class="card study-task study-result">
    <p class="study-note">${result.method==='quiz'?'在线答题':'试卷'} · ${result.total?`答对 ${result.correct}/${result.total} 题`:'示例分析'}</p>
    <h2>建议从「${lesson.t}」开始</h2>
    <p>${result.prerequisite?(result.total?'先补本次答错的前置知识，再回到学校正在学的内容。':'先补这节前置课，再回到学校正在学的内容。'):study.chapterOnly?'目前只选到了章节，可以先看该章第一节。':result.method==='upload'?'此顺序按所选学校进度演示。':'可先从当前学校进度对应的课节开始。'}</p>
    <button type="button" class="btn" onclick="enterStudyPlayer(true)">开始学习这一课</button>
  </section>`;
}
function skipStudyDiagnostic(){
  if([pageStudyQuiz,pageStudyUpload].includes(stack[stack.length-1])) stack.pop();
  enterStudyPlayer(false);
}
function enterStudyPlayer(recommended){
  const study=courseStudy();
  study.playing=recommended?study.result.lesson:study.playing??study.lesson;
  setStudyStep(4);
  if(stack[stack.length-2]===pageCoursePlay){ popPage(); return; }
  replacePage(pageCoursePlay);
}

/* ---------- 学习时间：未来 30 天日历打卡 ---------- */
const TIME_SLOTS=[0,1,2,3];
let studyScheduleDraft;
function savedStudySchedule(date){
  const month=myDateKey(date).slice(0,7);
  return U.setup.dayPlanMonth&&U.setup.dayPlanMonth!==month?{}:U.setup.dayPlan||{};
}
function pageSetupTime(){
  const today=new Date();
  const plan={...savedStudySchedule(today)};
  studyScheduleDraft={today,plan,day:today.getDate(),remind:U.setup.callRemind!=='否'};
  return head('学习安排详情')+`<div class="study-detail" id="study-schedule-detail">${studyScheduleContent()}</div>`;
}
function studyScheduleContent(){
  const {today,plan,day,remind}=studyScheduleDraft;
  const year=today.getFullYear(), month=today.getMonth();
  const first=new Date(year,month,1);
  const end=new Date(year,month+1,0).getDate();
  const leading=(first.getDay()+6)%7;
  const week=studyWeekDays(today);
  const scheduled=week.filter(date=>date.getMonth()===month&&Number(plan[date.getDate()])>0);
  const weekHours=scheduled.reduce((sum,date)=>sum+Number(plan[date.getDate()]),0);
  const selected=new Date(year,month,day);
  return `<div class="sd-split sd-schedule">
    <section class="sd-card">
      <div class="sd-heading"><h2>${year} 年 ${month+1} 月</h2><span class="sd-pill doing">本周 ${studyShortDate(week[0])} – ${studyShortDate(week[6])}</span></div>
      <div class="sd-month" role="group" aria-label="选择学习安排日期">
        ${[...'一二三四五六日'].map(label=>`<span class="sd-weekday" aria-hidden="true">${label}</span>`).join('')}
        ${'<span aria-hidden="true"></span>'.repeat(leading)}
        ${Array.from({length:end},(_,index)=>{
          const number=index+1;
          const date=new Date(year,month,number);
          const hours=Number(plan[number])||0;
          return `<button type="button" class="sd-day${date>=week[0]&&date<=week[6]?' in-week':''}" data-schedule-day="${number}" aria-label="${month+1} 月 ${number} 日，${hours?hours+' 小时':'未安排'}" aria-pressed="${number===day}"${number===today.getDate()?' aria-current="date"':''} onclick="selectStudyScheduleDay(${number})"><b>${number}</b>${hours?`<small>${hours} 小时</small>`:''}</button>`;
        }).join('')}
      </div>
      <p class="sd-hint">浅蓝色表示本周，选择日期可编辑学习时长。</p>
    </section>
    <div class="sd-stack">
      <section class="sd-card"><div class="sd-heading"><h2>本周安排</h2></div>
        <div class="sd-mini-metrics"><div><b>${scheduled.length} 天</b>已安排</div><div><b>${weekHours} 小时</b>计划时长</div></div>
        ${scheduled.length?`<ul class="sd-scheduled-list">${scheduled.map(date=>`<li><span>${studyShortDate(date)} · 周${'日一二三四五六'[date.getDay()]}</span><b>${Number(plan[date.getDate()])} 小时</b></li>`).join('')}</ul>`:'<p class="sd-hint">本周暂无安排</p>'}
      </section>
      <section class="sd-card"><div class="sd-heading"><h2>${month+1} 月 ${day} 日 · 周${'日一二三四五六'[selected.getDay()]}</h2><span class="sd-pill doing">已选日期</span></div>
        <span class="sd-hint">学习时长</span>
        <div class="sd-slots" role="group" aria-label="选择学习时长">${TIME_SLOTS.map(hours=>`<button type="button" data-schedule-hours="${hours}" aria-pressed="${(Number(plan[day])||0)===hours}" onclick="setStudyScheduleHours(${hours})">${hours?hours+' 小时':'不安排'}</button>`).join('')}</div>
        <label class="sd-remind">规划师致电提醒<input type="checkbox" ${remind?'checked':''} onchange="studyScheduleDraft.remind=this.checked"></label>
        <div class="sd-save"><button type="button" class="btn" onclick="saveTimePlan()">保存学习时间</button></div>
      </section>
    </div>
  </div>`;
}
function redrawStudySchedule(selector){
  const detail=document.getElementById('study-schedule-detail');
  detail.innerHTML=studyScheduleContent();
  detail.querySelector(selector)?.focus({preventScroll:true});
}
function selectStudyScheduleDay(day){
  studyScheduleDraft.day=day;
  redrawStudySchedule(`[data-schedule-day="${day}"]`);
}
function setStudyScheduleHours(hours){
  const {plan,day}=studyScheduleDraft;
  if(hours) plan[day]=hours;
  else delete plan[day];
  redrawStudySchedule(`[data-schedule-hours="${hours}"]`);
}
function saveTimePlan(){
  const {today,plan,remind}=studyScheduleDraft;
  const lastDay=new Date(today.getFullYear(),today.getMonth()+1,0).getDate();
  const entries=Object.entries(plan).filter(([day,hours])=>Number(day)>=1&&Number(day)<=lastDay&&TIME_SLOTS.includes(Number(hours))&&Number(hours)>0);
  const total=entries.reduce((sum,[,hours])=>sum+Number(hours),0);
  if(!entries.length&&!Object.values(savedStudySchedule(today)).some(hours=>Number(hours)>0)){
    toast('请至少选择 1 天学习时间'); return;
  }
  Object.assign(U.setup,{
    dayPlan:Object.fromEntries(entries.map(([day,hours])=>[day,Number(hours)])),
    dayPlanMonth:myDateKey(today).slice(0,7), callRemind:remind?'是':'否',
    studyDays:entries.length+' 天', studyTime:'共 '+total+' 小时', planSaved:true
  });
  popPage(); toast('学习安排已保存'+(remind&&entries.length?'，将致电提醒':''));
}

/* ---------- 课程播放 ---------- */
let courseChapter=2;
function playerLessonEntries(){
  const demo=courseDemo();
  return demo?Object.entries(demo.lessons):U.activeSubject?[]:CHAPTERS.map((lesson,index)=>[String(index),lesson]);
}
function activeCourseLesson(entries){
  const id=courseDemo()?(courseStudy().playing||studyTopic()):String(courseChapter);
  return entries.find(([key])=>key===id)||entries[0]||[];
}
function recommendedCourseOrder(demo,study){
  const chapters=demo.textbooks[study.textbook]||Object.values(demo.textbooks)[0];
  const ids=chapters.flatMap(([,lessons])=>lessons);
  const topic=studyTopic();
  const remaining=ids.slice(Math.max(0,ids.indexOf(topic)));
  return [...new Set([study.result.lesson,topic,...remaining])].filter(id=>Object.hasOwn(demo.lessons,id));
}
function courseLessonProgress(id){
  return courseStudy().practice?.[id];
}
function courseLessonTitle(lesson){
  return lesson?.t.replace(/^\d+\.\s+/,'');
}
function coursePractice(lesson){
  return COURSE_PRACTICE[courseLessonTitle(lesson)];
}
function courseReviewContent(lesson){
  const title=courseLessonTitle(lesson);
  const notes=COURSE_REVIEW[title];
  if(!notes) return null;
  const [method,keyPoint,mistake,example]=notes;
  const reference=lesson.question?lesson:Object.values(COURSE_DEMOS['中考|数学'].lessons).find(item=>item.t===title);
  return {steps:method.split(' → '),keyPoint,mistake,example:example||(reference?`${reference.question} 答案：${reference.choices[reference.answer]}`:'')};
}
function renderCourseReview(lesson){
  const review=courseReviewContent(lesson);
  if(!review) return '';
  return `<section class="course-player-detail" aria-labelledby="course-review-title">
    <h2 id="course-review-title">本课回顾</h2>
    <dl class="course-review-list">
      <div><dt>知识点</dt><dd>
        <p>${review.keyPoint}</p>
        ${review.example?`<p class="course-review-example">例：${review.example}</p>`:''}
      </dd></div>
      <div id="course-review-method" tabindex="-1"><dt>做题方法</dt><dd>
        <ol>${review.steps.map(step=>`<li>${step}</li>`).join('')}</ol>
        <p class="course-review-caution">易错提醒：${review.mistake}</p>
      </dd></div>
    </dl>
  </section>`;
}
function showCourseReview(){
  popPage();
  const method=$id('course-review-method');
  if(method){
    method.focus({preventScroll:true});
    method.scrollIntoView({block:'center'});
  }
}
function openLessonPractice(id){
  const [key,lesson]=activeCourseLesson(playerLessonEntries());
  if(key!==id||!coursePractice(lesson)) return;
  const study=courseStudy();
  study.practice??={};
  study.practice[id]??={watched:true};
  pushPage(pageLessonPractice);
}
function pageLessonPractice(){
  const [id,lesson]=activeCourseLesson(playerLessonEntries());
  const [question,...choices]=coursePractice(lesson);
  const saved=courseLessonProgress(id);
  const order=choices.map((_,index)=>(index+question.length)%choices.length);
  return head('课后练习',captureQuestionButton('练习'))+`<form class="card study-task" data-practice-lesson="${id}" onsubmit="event.preventDefault();submitLessonPractice(this)">
    <h3>${lesson.t}</h3>
    <fieldset><legend>${question}</legend>
      ${order.map(index=>`<label><input type="radio" name="answer" value="${index}" required ${saved?.answer===index?'checked':''}><span>${choices[index]}</span></label>`).join('')}
    </fieldset>
    ${saved?.answer===undefined?'':`<div class="lesson-practice-feedback">
      <p role="status">${saved.answer===0?'回答正确':'回答有误。正确答案：'+choices[0]}</p>
      ${saved.answer!==0&&courseReviewContent(lesson)?'<button type="button" class="btn sm lite" onclick="showCourseReview()">查看本课要点</button>':''}
    </div>`}
    <button type="submit" class="btn">提交答案</button>
    ${saved?.answer===undefined?'':`<button type="button" class="btn lite lesson-practice-back" onclick="popPage()">返回课程</button>`}
  </form>`;
}
function submitLessonPractice(form){
  const progress=courseLessonProgress(form.dataset.practiceLesson);
  const value=new FormData(form).get('answer');
  if(!progress||value===null) return;
  progress.answer=Number(value);
  refresh();
  screen.querySelector('.lesson-practice-feedback')?.scrollIntoView({block:'nearest'});
}
function pageCoursePlay(){
  const demo=courseDemo();
  const [type,direction,subject]=U.activeSubject.split('|');
  const name=subject?subObj(type,direction,subject).name:'中考数学技巧课';
  const entries=playerLessonEntries();
  const [active,lesson]=activeCourseLesson(entries);
  const current=lesson||{t:name};
  const study=courseStudy();
  const practice=courseLessonProgress(active);
  const progress=practice?.watched?100:current.p||0;
  const recommended=demo&&study.result?recommendedCourseOrder(demo,study):[];
  return head('课程播放',captureQuestionButton('课程'))+`
  <div class="course-player-layout">
    <div class="course-player-main">
      <div class="course-video" aria-label="课程视频演示占位">
        <span class="course-video-tag">试听模式 · 演示画面</span>
        <div class="course-video-center"><button type="button" class="course-video-play" aria-label="播放" onclick="toast('演示页面未接入视频')">▶</button><p>${current.t}</p></div>
        <div class="course-video-bar"><div class="course-video-track"><i style="width:${progress}%"></i></div><div class="course-video-controls"><span>▶</span><span>进度 ${progress}%</span><span class="course-video-spacer"></span><span>演示播放器</span></div></div>
      </div>
      ${U.activeSubject?`<div class="course-study-tools">
        ${demo&&!study.result?`<button type="button" class="btn lite" onclick="pushPage(pageSetup2)">薄弱点测评</button>`:''}
        ${demo&&study.result?`<button type="button" class="btn lite" onclick="pushPage(pageStudyResult)">查看摸底结果</button>`:''}
        <button type="button" class="btn lite" onclick="pushPage(pageSetupTime)">安排学习时间</button>
      </div>`:''}
      ${coursePractice(lesson)?`<section class="course-lesson-practice" aria-label="课后练习">
        <div><h2>课后练习</h2><p>${practice?.answer!==undefined?'本课已作答':practice?.watched?'本课已标记看完':'看完本课后完成 1 道同类题'}</p></div>
        <button type="button" class="btn sm" onclick="openLessonPractice('${active}')">${practice?.answer!==undefined?'查看或重做':progress===100?'开始练习':'标记看完并答题'}</button>
      </section>`:''}
      ${renderCourseReview(lesson)}
    </div>
    <aside class="course-player-sidebar">
      ${recommended.length?`<section class="course-recommendations" aria-label="推荐看课顺序">
        <h3>推荐看课顺序</h3>
        ${study.result.method==='upload'?'<small>试卷分析演示</small>':''}
        <ol>${recommended.map(id=>`<li><button type="button" aria-pressed="${id===active}" onclick="selectCourseChapter('${id}')">${demo.lessons[id].t}</button></li>`).join('')}</ol>
      </section>`:''}
      <section class="course-directory" aria-labelledby="course-directory-title">
        <div class="course-player-sidehead"><h2 id="course-directory-title">课程目录</h2></div>
        <div class="course-player-lessons">
          ${entries.length?entries.map(([id,c],i)=>`<button type="button" class="course-player-lesson ${id===active?'on':''}" ${id===active?'aria-current="true"':''} onclick="selectCourseChapter('${id}')"><span class="course-player-num">${i+1}</span><span class="course-player-text"><b>${c.t}</b></span><span class="course-player-mark">${id===active?'当前':courseLessonProgress(id)?.answer!==undefined?'已练':courseLessonProgress(id)?.watched||c.p===100?'已看':''}</span></button>`).join(''):'<p class="empty">暂无课程</p>'}
        </div>
      </section>
    </aside>
  </div>`;
}
function selectCourseChapter(id){
  if(courseDemo()){
    courseStudy().playing=id;
  }else{
    courseChapter=Number(id);
  }
  refresh();
}
/* ================= 直播 ================= */
const LIVES=[
  {date:'11-12 19:30', title:'二次函数压轴突破', t:'张老师', st:'next'},
  {date:'11-05 19:30', title:'圆的相关证明专题', t:'张老师', st:'replay', dur:'42 分钟'},
  {date:'10-29 19:30', title:'概率与统计速解技巧', t:'李老师', st:'replay', dur:'38 分钟'},
  {date:'10-22 19:30', title:'一元二次方程应用题', t:'张老师', st:'replay', dur:'45 分钟'},
];
function pageLive(){
  return head('直播课堂')+`
  <div class="course-hero" style="background:linear-gradient(135deg,#FF9F3A,#F26B1D)">
    <b>本月直播 · 每月 4 次</b><p>直播支持连麦提问，错过自动生成回放</p>
  </div>
  ${LIVES.map(l=>`
  <div class="card" style="display:flex;gap:12px;align-items:center">
    <div style="width:64px;height:64px;border-radius:14px;flex:none;display:flex;align-items:center;justify-content:center;${l.st==='next'?'background:var(--red-bg);color:#E4574F':'background:var(--blue-bg);color:var(--blue)'}">
      <div style="text-align:center"><div style="font-size:20px;font-weight:800;line-height:1.1">${l.date.slice(3,6)}</div><div style="font-size:9px">${l.st==='next'?'待开播':'回放'}</div></div>
    </div>
    <div style="flex:1;min-width:0"><b style="font-size:14px">${l.title}</b>
      <small style="display:block;color:var(--ink3);font-size:11.5px;margin-top:2px">${l.date} · ${l.t}${l.dur?' · '+l.dur:''}</small></div>
    <button class="btn sm ${l.st==='next'?'':'lite'}" onclick="${l.st==='next'?"toast('已预约，开播前 15 分钟提醒你')":"toast('正在播放回放（演示）')"}">${l.st==='next'?'预约提醒':'看回放'}</button>
  </div>`).join('')}`;
}

/* ================= 试卷 / 答题 ================= */
function pagePapers(){
  return head('试卷')+`
  <div class="paper-choices" role="group" aria-label="试卷与测验入口">
    ${Object.entries(PAPERS).map(([k,p])=>`
      <button type="button" class="paper-choice" data-paper="${k}" onclick="startPaper('${k}')">
        <span class="paper-choice-icon" aria-hidden="true">${IC.doc}</span>
        <span class="paper-choice-copy"><b>${p.name}</b><small>${p.desc}</small></span>
        ${arw()}
      </button>`).join('')}
    <button type="button" class="paper-choice" data-paper="ai" onclick="pushPage(pageAiAssessment)">
      <span class="paper-choice-icon" aria-hidden="true">${IC.ai}</span>
      <span class="paper-choice-copy"><b>AI 测验</b><small>测评卷与讲评课</small></span>
      ${arw()}
    </button>
  </div>`;
}
function startPaper(k){
  S.paper=k; S.idx=0; S.ans={}; S.done=false; S.m='text'; hwStrokes=0;
  pushPage(pageExam);
}
function activeExamDraft(){
  return stack.at(-1)===pageWrongRedo?wrongRedoAttempt:S;
}
function examAnswerFields(q,draft){
  if(!q.opts) return `<div id="ans-area">${ansArea(draft)}</div>`;
  return q.opts.map((option,index)=>`<div class="opt ${draft.ans[q.id]===index?'on':''}" onclick="pickOpt(this,${index})"><span class="ol">${'ABCD'[index]}</span>${option}</div>`).join('');
}
function questionIsCorrect(q,answer){
  return q.opts?answer===q.ans:answer!==undefined&&String(answer).replace(/\s/g,'')===q.ans.replace(/\s/g,'');
}
function pageExam(){
  const q=Q[S.idx], p=PAPERS[S.paper];
  const answered=Object.keys(S.ans).length;
  return head(p.name, `<div class="capture-question-actions">${captureQuestionButton('答题')}<span id="q-count" style="font-size:12px;color:var(--ink3)" onclick="openSheet()">答题卡 ${answered}/${Q.length}</span></div>`)+`
  <div class="qbar">第 <b>${S.idx+1}</b> 题 / 共 ${Q.length} 题 · ${q.type==='single'?'单选题':q.type==='fill'?'填空题':'解答题'}</div>
  <div class="stem">${q.stem}</div>
  ${examAnswerFields(q,S)}
  <div style="display:flex;gap:9px;margin-top:16px">
    ${S.idx>0?'<button class="btn ghost" style="flex:1" onclick="S.idx--;refresh()">上一题</button>':''}
    ${S.idx<Q.length-1?'<button class="btn" style="flex:2" onclick="nextQ()">下一题</button>':'<button class="btn green" style="flex:2" onclick="submitPaper()">交卷并评分</button>'}
  </div>
  <div class="dots" style="margin-top:14px">${Q.map((_,i)=>`<i class="${i===S.idx?'on':''}"></i>`).join('')}</div>`;
}
/* 非选择题的作答区：切换作答方式时只重绘这一块，不整页刷新 */
function ansArea(draft=activeExamDraft()){
  const q=Q[draft.idx];
  return `<div class="field"><label>作答方式</label>
      <div class="segs">
        ${[['text','文字输入'],['pen','点星笔手写'],['photo','拍照上传']].map(([k,t])=>`<span class="seg ${draft.m===k?'on':''}" onclick="activeExamDraft().m='${k}';swapAns()">${t}</span>`).join('')}
      </div>
    </div>
    ${draft.m==='text'?`<input class="input" id="fill-ans" placeholder="输入作答内容" value="${myText(draft.ans[q.id])}" oninput="activeExamDraft().ans[${q.id}]=this.value">`:''}
    ${draft.m==='pen'?`<canvas id="hw" width="500" height="300"></canvas><div style="display:flex;gap:8px;margin-top:8px"><button class="btn ghost sm" onclick="clearHw()">清空</button><span style="font-size:11px;color:var(--ink3);align-self:center">点星笔书写痕迹将实时上传</span></div>`:''}
    ${draft.m==='photo'?`<div class="answerbox" onclick="toast('已模拟拍照上传，AI 识别作答内容')"><div style="text-align:center;color:var(--ink3);font-size:12.5px;padding:8px 0">${IC.camera.replace('<svg','<svg style="width:26px;height:26px;fill:none;stroke:#9AA3B0;stroke-width:1.7"')}<br>点击拍照上传作答</div></div>`:''}`;
}
function swapAns(){
  const box=document.getElementById('ans-area');
  if(!box) return;
  box.innerHTML=ansArea();
  if(activeExamDraft().m==='pen') initHw();
}
function pickOpt(el,i){
  const draft=activeExamDraft(); draft.ans[Q[draft.idx].id]=i;
  const box=el.parentNode;
  [...box.children].forEach(c=>c.classList.remove('on'));
  el.classList.add('on');
  const cnt=document.getElementById('q-count');
  if(cnt) cnt.textContent='答题卡 '+Object.keys(draft.ans).length+'/'+Q.length;
}
function nextQ(){ S.idx++; refresh(); }
let hwStrokes=0;
function clearHw(){ hwStrokes=0; initHw(); }
function initHw(){
  const cv=document.getElementById('hw'); if(!cv) return;
  const ctx=cv.getContext('2d'); ctx.lineWidth=3.4; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.strokeStyle='#2F66E0';
  let drawing=false;
  const pt=e=>{ const r=cv.getBoundingClientRect(); const t=e.touches?e.touches[0]:e;
    return {x:(t.clientX-r.left)*cv.width/r.width, y:(t.clientY-r.top)*cv.height/r.height}; };
  cv.onpointerdown=e=>{ drawing=true; hwStrokes++; const p=pt(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); e.preventDefault(); };
  cv.onpointermove=e=>{ if(!drawing) return; const p=pt(e); ctx.lineTo(p.x,p.y); ctx.stroke(); e.preventDefault(); };
  window.onpointerup=()=>{ drawing=false; };
}
function openSheet(){
  const answered=Object.keys(S.ans).length;
  openModal(`<h4>答题卡</h4><p class="sub">已完成 ${answered} / ${Q.length} 题</p>
  <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin:14px 0">
    ${Q.map((q,i)=>`<div style="aspect-ratio:1;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;cursor:pointer;background:${S.ans[q.id]!==undefined?'var(--blue)':'#F0F2F6'};color:${S.ans[q.id]!==undefined?'#fff':'var(--ink3)'}" onclick="S.idx=${i};closeModal();refresh()">${i+1}</div>`).join('')}
  </div>
  <button class="btn green" onclick="closeModal();submitPaper()">交卷并评分</button>`);
}
function submitPaper(){
  /* 防御：提交前读取当前输入框，避免极端情况漏采答案 */
  const live=document.getElementById('fill-ans');
  if(live && Q[S.idx] && !Q[S.idx].opts && live.value!=='') S.ans[Q[S.idx].id]=live.value;
  let right=0;
  Q.forEach(q=>{
    const a=S.ans[q.id];
    const ok=questionIsCorrect(q,a);
    if(ok) right++;
    const exist=S.records.find(r=>r.q===q.id);
    if(exist){ exist.ok=ok; exist.d='11-10'; } else S.records.push({d:'11-10', q:q.id, ok, kp:q.kp});
  });
  addStudyHours(0.5,'练习答题',PAPERS[S.paper]?.name||'试卷练习');
  S.result={right, wrong:Q.length-right};
  pushPage(pageReport);
}
function pageReport(){
  const {right,wrong}=S.result;
  return head('评分结果')+`
  <div class="card" style="text-align:center;padding:22px">
    <div style="font-size:12.5px;color:var(--ink3)">本次练习 ${Q.length} 题</div>
    <div class="scorebig"><b>${right}</b><span>/ ${Q.length} 题 正确</span></div>
    <div style="display:flex;gap:9px;margin-top:14px">
      <div style="flex:1;background:var(--green-bg);border-radius:12px;padding:10px"><b style="color:#1E9E5C;font-size:18px">${right}</b><div style="font-size:11px;color:#1E9E5C">答对</div></div>
      <div style="flex:1;background:var(--red-bg);border-radius:12px;padding:10px"><b style="color:#E4574F;font-size:18px">${wrong}</b><div style="font-size:11px;color:#E4574F">答错</div></div>
      <div style="flex:1;background:var(--blue-bg);border-radius:12px;padding:10px"><b style="color:var(--blue);font-size:18px">+30min</b><div style="font-size:11px;color:var(--blue)">学时累计</div></div>
    </div>
  </div>
  <div class="card"><h4>逐题解析</h4>
    ${Q.map((q,i)=>{
      const a=S.ans[q.id];
      const ok=questionIsCorrect(q,a);
      return `<div class="cell" onclick="S.idx=${i};pushPage(pageAnalysis)">
        <div class="ci" style="background:${ok?'var(--green-bg)':'var(--red-bg)'};color:${ok?'#1E9E5C':'#E4574F'}">${ok?IC.check:IC.pen}</div>
        <div class="ct"><b>第 ${i+1} 题 · ${ok?'回答正确':'回答错误'}</b><small>考点：${q.kp} · 点击查看解析</small></div>${arw()}</div>`;
    }).join('')}
  </div>
  <button class="btn lite" onclick="popPage();popPage()">返回试卷</button>`;
}
function pageAnalysis(){
  const q=Q[S.idx];
  const navigation=`
    ${S.idx>0?'<button class="btn ghost" style="flex:1" onclick="S.idx--;refresh()">上一题</button>':''}
    ${S.idx<Q.length-1?'<button class="btn" style="flex:1" onclick="S.idx++;refresh()">下一题</button>':'<button class="btn" style="flex:1" onclick="popPage()">返回结果</button>'}`;
  return renderQuestionAnalysis(S.idx,S.ans[q.id],navigation);
}
function renderQuestionAnalysis(index,a,navigation){
  const q=Q[index];
  const ok=questionIsCorrect(q,a);
  return head('题目解析')+`
  <div class="qbar">第 <b>${index+1}</b> 题 · <span class="tag ${ok?'green':'red'}">${ok?'回答正确':'回答错误'}</span></div>
  <div class="stem">${q.stem}</div>
  ${q.opts?q.opts.map((o,i)=>`<div class="opt ${i===q.ans?'ok':(a===i?'bad':'')}"><span class="ol">${'ABCD'[i]}</span>${o}</div>`).join(''):
    `<div class="ana"><div class="al"><span class="dot"></span>你的作答</div><p>${a!==undefined&&a!==''?myText(a):'（未作答）'}</p></div>
     <div class="ana"><div class="al"><span class="dot" style="background:var(--green)"></span>正确答案</div><p>${q.ans}</p></div>`}
  <div class="ana"><div class="al"><span class="dot"></span>解析</div><p>${q.ana}</p></div>
  <div class="ana" style="display:flex;align-items:center;gap:8px"><div class="al" style="margin:0"><span class="dot" style="background:var(--gold)"></span>考点</div><span class="tag blue">${q.kp}</span><span class="spacer" style="flex:1"></span><span style="font-size:11.5px;color:var(--ink3);cursor:pointer" onclick="toast('已举报，老师会尽快核实')">举报</span></div>
  <div style="display:flex;gap:9px;margin-top:14px">
    ${navigation}
  </div>`;
}

/* ================= 答题记录（日历） ================= */
function pageCalendar(){
  const days=[...new Set(S.records.map(r=>r.d))];
  const now=new Date();
  const y=now.getFullYear(), m=now.getMonth();
  const first=new Date(y,m,1), dow=first.getDay(), total=new Date(y,m+1,0).getDate();
  const today=now.getDate();
  let cells='';
  for(let i=0;i<dow;i++) cells+='<div class="day out"></div>';
  for(let d=1;d<=total;d++){
    const ds=String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const done=days.includes(ds);
    cells+=`<div class="day ${done?'done':''} ${d===today?'today':''}" onclick="${done?`toast('${ds}：练习 ${S.records.filter(r=>r.d===ds).length} 题')`:''}">${d}</div>`;
  }
  const byKp={};
  S.records.forEach(r=>{ byKp[r.kp]=(byKp[r.kp]||0)+(r.ok?1:0); });
  const kps=Object.keys(byKp);
  return head('答题记录')+`
  <div class="cal">
    <div class="chead"><span class="nav" onclick="toast('演示仅展示本月')"><svg viewBox="0 0 24 24" style="width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:2"><path d="M15 5l-7 7 7 7"/></svg></span><b>${y} 年 ${m+1} 月</b><span class="nav" onclick="toast('演示仅展示本月')"><svg viewBox="0 0 24 24" style="width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:2"><path d="M9 5l7 7-7 7"/></svg></span></div>
    <div class="grid">${['日','一','二','三','四','五','六'].map(w=>`<div class="wd">${w}</div>`).join('')}${cells}</div>
    <p style="font-size:11px;color:var(--ink3);margin-top:10px">● 打卡日期共 ${days.length} 天 · 点击日期查看当日练习</p>
  </div>
  <div class="card"><h4>已练科目进度</h4><p class="sub">按考点统计正确题数</p>
    <div style="margin-top:10px">
    ${kps.length?kps.map(k=>{
      const t=S.records.filter(r=>r.kp===k).length;
      return `<div class="sbar"><div class="srow"><b>${k}</b><div class="track"><i style="width:${Math.round(byKp[k]/Math.max(...Object.values(byKp))*100)}%"></i></div><span>${byKp[k]}/${t}</span></div></div>`;
    }).join(''):'<div class="empty">暂无练习记录</div>'}
    </div>
  </div>
  <div class="card"><h4>练习明细</h4>
    ${S.records.slice().reverse().slice(0,8).map(r=>{
      const q=Q.find(x=>x.id===r.q);
      return `<div class="cell" onclick="S.idx=Q.findIndex(x=>x.id===${r.q});pushPage(pageAnalysis)"><div class="ci" style="background:${r.ok?'var(--green-bg)':'var(--red-bg)'};color:${r.ok?'#1E9E5C':'#E4574F'}">${r.ok?IC.check:IC.pen}</div><div class="ct"><b>${r.d} · ${q?('第 '+r.q+' 题'):'题 ' + r.q}</b><small>${r.kp} · ${r.ok?'正确':'错误'}</small></div>${arw()}</div>`;
    }).join('')}
  </div>`;
}

/* ================= AI 测评 ================= */
function pageAiAssessment(){
  return head('AI 测验')+`
  <section class="ai-assessment" aria-label="AI 测验">
    <header class="papers-panel-heading"><p>了解薄弱知识点，完成测评后可查看讲评课</p></header>
    <div class="ai-assessment-tabs" role="tablist" aria-label="测评内容">
      <button type="button" role="tab" aria-selected="true" id="at-t1" onclick="aiTab(0)">测评卷</button>
      <button type="button" role="tab" aria-selected="false" id="at-t2" onclick="aiTab(1)">测评讲评课</button>
    </div>
    <div id="at-list">${aiTestList()}</div>
  </section>`;
}
function aiTab(i){
  document.getElementById('at-t1').setAttribute('aria-selected',String(i===0));
  document.getElementById('at-t2').setAttribute('aria-selected',String(i===1));
  document.getElementById('at-list').innerHTML = i===0?aiTestList():aiCourseList();
}
function aiTestList(){
  return `<section class="ai-assessment-panel"><div class="ai-assessment-heading"><div><h3>选择测评卷</h3><p>根据年级与成绩动态命题</p></div><span>${AITESTS.length} 套</span></div>
  ${AITESTS.map((t,i)=>`<div class="ai-assessment-row"><div class="ai-assessment-icon">${IC.ai}</div><div class="ai-assessment-text"><b>${t}</b><small>3 题 · 演示测评 · ${i===1?'已完成':'未作答'}</small></div><button class="btn sm" onclick="startAiTest(${i})">点击作答</button></div>`).join('')}
  </section>`;
}
function aiCourseList(){
  return `<section class="ai-assessment-panel"><div class="ai-assessment-heading"><div><h3>测评讲评课</h3><p>完成测评卷后，老师针对错题开设 1 对 1 讲评</p></div></div>
  ${AITESTS.slice(0,2).map((t,i)=>`<div class="ai-assessment-row"><div class="ai-assessment-icon lesson">${IC.live}</div><div class="ai-assessment-text"><b>${t.slice(2,4)}测评讲评</b><small>${i===0?'待预约':'已完成 · 错题 4 道'}</small></div><button class="btn sm lite" onclick="toast('已预约讲评课，老师将致电确认时间')">${i===0?'预约':'回看'}</button></div>`).join('')}
  </section>`;
}
function startAiTest(i){
  T={paper:AITESTS[i], idx:0, ans:{}, n:3};
  pushPage(pageAiAnswer);
}
let T=null;
function pageAiAnswer(){
  const q=Q[T.idx];
  return head(T.paper, `<div class="capture-question-actions">${captureQuestionButton('测评')}<span id="ai-count" style="font-size:12px;color:var(--ink3)" onclick="toast('AI 测评不可回退修改已交答案')">答题卡 ${Object.keys(T.ans).length}/${T.n}</span></div>`)+`
  <div class="qbar">AI 组卷 · 第 <b>${T.idx+1}</b> 题 / 共 ${T.n} 题 · 难度自适应</div>
  <div class="stem">${q.stem}</div>
  ${q.opts? q.opts.map((o,i)=>`<div class="opt ${T.ans[q.id]===i?'on':''}" onclick="pickAiOpt(this,${i})"><span class="ol">${'ABCD'[i]}</span>${o}</div>`).join('') :
    `<input class="input" placeholder="输入作答内容" value="${T.ans[q.id]||''}" oninput="T.ans[${q.id}]=this.value">`}
  <div style="display:flex;gap:9px;margin-top:16px">
    ${T.idx<T.n-1?'<button class="btn" style="flex:2" onclick="T.idx++;refresh()">下一题</button>':'<button class="btn green" style="flex:2" onclick="submitAiTest()">提交测评</button>'}
  </div>
  <div class="dots" style="margin-top:14px">${Array.from({length:T.n},(_,i)=>`<i class="${i===T.idx?'on':''}"></i>`).join('')}</div>`;
}
function pickAiOpt(el,i){
  const q=Q[T.idx]; T.ans[q.id]=i;
  const box=el.parentNode;
  [...box.children].forEach(c=>c.classList.remove('on'));
  el.classList.add('on');
  const cnt=document.getElementById('ai-count');
  if(cnt) cnt.textContent='答题卡 '+Object.keys(T.ans).length+'/'+T.n;
}
function submitAiTest(){
  let right=0;
  Q.slice(0,T.n).forEach(q=>{
    const a=T.ans[q.id];
    const ok=q.opts?a===q.ans:(a!==undefined&&String(a).replace(/\s/g,'')===q.ans.replace(/\s/g,''));
    if(ok) right++;
  });
  T.report={right, wrong:T.n-right, score:Math.round(right/T.n*100),
    subs:{数学:88, 物理:72, 英语:85, 化学:64}, week:Math.round(right/T.n*10)};
  pushPage(pageAiReport);
}
function returnToAiTests(){
  popPage();
  popPage();
  document.getElementById('at-t1')?.focus();
}
function pageAiReport(){
  const r=T.report;
  const subs=Object.entries(r.subs);
  return head('测评报告')+`
  <div class="card" style="background:linear-gradient(135deg,#6A5CFF,#3D7EFF);border:0;color:#fff">
    <div style="display:flex;align-items:center;gap:8px;font-size:12px;opacity:.9">${IC.ai.replace('<svg','<svg style="width:15px;height:15px;fill:none;stroke:#fff;stroke-width:2"')} AI 自主研发 · 个性化评分</div>
    <div class="scorebig" style="justify-content:flex-start;padding:10px 0 4px"><b style="color:#fff">${r.score}</b><span style="color:rgba(255,255,255,.8)">综合得分 · ${T.paper}</span></div>
    <div style="display:flex;gap:9px;margin-top:10px">
      <div style="flex:1;background:rgba(255,255,255,.16);border-radius:12px;padding:9px;text-align:center"><b style="font-size:17px">${r.right}</b><div style="font-size:10.5px;opacity:.85">答对</div></div>
      <div style="flex:1;background:rgba(255,255,255,.16);border-radius:12px;padding:9px;text-align:center"><b style="font-size:17px">${r.wrong}</b><div style="font-size:10.5px;opacity:.85">答错</div></div>
      <div style="flex:1;background:rgba(255,255,255,.16);border-radius:12px;padding:9px;text-align:center"><b style="font-size:17px">${r.week}</b><div style="font-size:10.5px;opacity:.85">薄弱点</div></div>
    </div>
  </div>
  <div class="card"><h4>学科掌握度</h4><p class="sub">由本次测评与历史成绩综合评定</p>
    <div style="margin-top:12px">
      ${subs.map(([k,v])=>`<div class="sbar"><div class="srow"><b>${k}</b><div class="track"><i style="width:${v}%"></i></div><span>${v}%</span></div></div>`).join('')}
    </div>
  </div>
  <div class="card"><h4>能力雷达</h4>${radarSvg(subs.map(s=>s[0]), subs.map(s=>s[1]), 250)}</div>
  <div class="card"><h4>知识漏洞定位</h4><p class="sub">AI 建议优先补强前 2 项，已同步给规划师</p>
    ${['圆的相关证明（几何）','化学方程式配平（数与式）','概率与统计（概率统计）'].map((k,i)=>`
    <div class="cell"><div class="ci" style="background:${i<2?'var(--red-bg)':'var(--orange-bg)'};color:${i<2?'#E4574F':'#E8862C'}">${i<2?'!':IC.star}</div>
    <div class="ct"><b>${k}</b><small>掌握度 ${[42,55,68][i]}% · 建议 ${['3 天专项','2 天专项','1 天巩固'][i]}</small></div>
    <button class="btn sm lite" onclick="toast('已生成《${k.split('（')[0]}》专项练习（演示）')">练一练</button></div>`).join('')}
  </div>
  <button class="btn lite" onclick="returnToAiTests()">返回测评列表</button>`;
}

/* ================= 打卡 / 学习记录 ================= */
function pageCheckin(){
  const now=new Date();
  return head('学习打卡')+`
  <div class="datechip">${IC.plan.replace('<svg','<svg style="width:18px;height:18px;fill:none;stroke:var(--blue);stroke-width:1.8"')} <b>${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日</b></div>
  <p class="sub" style="margin-bottom:12px">每天上传学习内容，有助于老师了解你的学习情况与学习效果</p>
  <div class="card">
    <div class="field"><label>学习内容</label><textarea class="input" id="ck-txt" placeholder="今日学习科目：数学&#10;今日学习内容：…（示例）"></textarea></div>
    <div class="field"><label>学习图片 <span style="color:var(--ink3);font-weight:500" id="ck-n">(0/3)</span></label>
      <div class="imgrow" id="ck-imgs">
        <div class="imgadd" onclick="addImg()"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>上传图片</div>
      </div>
    </div>
    <button class="btn" onclick="doCheckin()">打 卡</button>
  </div>
  <div class="card"><h4>近期打卡</h4>
    ${U.checkins.length?U.checkins.map(c=>`<div class="cell"><div class="ci" style="background:var(--green-bg);color:#27A566">${IC.check}</div><div class="ct"><b>${c.date}</b><small>${c.txt}</small></div><span class="tag gray">${c.imgs} 图</span></div>`).join(''):'<div class="empty">还没有打卡记录，从今天开始吧</div>'}
  </div>`;
}
let ckImgs=0;
function addImg(){
  if(ckImgs>=3){ toast('最多上传 3 张图片'); return; }
  ckImgs++;
  const row=document.getElementById('ck-imgs');
  row.lastElementChild.insertAdjacentHTML('beforebegin','<div class="imgth">已上传'+ckImgs+'</div>');
  row.querySelectorAll('.imgadd')[0].style.display = ckImgs>=3?'none':'flex';
  document.getElementById('ck-n').textContent=`(${ckImgs}/3)`;
}
function doCheckin(){
  const txt=document.getElementById('ck-txt').value.trim();
  if(!txt){ toast('请填写学习内容'); return; }
  const now=new Date();
  const day=myDateKey(now);
  U.checkins.unshift({day, date:day.slice(5), txt, imgs:ckImgs});
  addStudyHours(0.2,'学习打卡',txt,now);
  ckImgs=0; refresh(); toast('打卡成功，已同步给伴学老师');
}
function studyHoursTrend(days,values){
  const limit=Math.max(2.5,Math.ceil(Math.max(...values)*2)/2);
  const points=values.map((value,index)=>[69+82*index,128-value/limit*106]);
  const path=points.map(([x,y],index)=>`${index?'L':'M'}${x} ${y}`).join(' ');
  const labels=days.map((day,index)=>`${day.getMonth()+1}.${day.getDate()} ${values[index]} 小时`).join('，');
  return `<svg class="sd-trend" viewBox="0 0 600 140" preserveAspectRatio="none" role="img" aria-label="${labels}">
    ${Array.from({length:6},(_,index)=>{
      const y=22+index*106/5;
      const value=+(limit*(1-index/5)).toFixed(2);
      return `<path class="sd-gridline" d="M28 ${y}H599"/><text x="23" y="${y+3}" text-anchor="end">${value}</text>`;
    }).join('')}
    <path d="${path}L561 128L69 128Z" class="sd-area"/><path class="sd-line" d="${path}"/>
    ${points.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3"/>`).join('')}
  </svg><div class="sd-trend-dates" aria-hidden="true">${days.map(day=>`<span>${studyShortDate(day)}</span>`).join('')}</div>`;
}
function pageStudyLog(){
  const today=new Date();
  const days=myRecentDays(today,7);
  const recorded=days.map(day=>U.hours.byDay?.[myDateKey(day)]);
  const sample=!Object.keys(U.hours.byDay||{}).length;
  const values=sample?STUDY_HOUR_EXAMPLE:recorded.map(value=>Number.isFinite(value)?value:0);
  const recent=values.reduce((total,value)=>total+value,0);
  const todayKey=myDateKey(today);
  const history=U.hours.entries||[];
  const entries=sample?[
    {time:'20:40',type:'课程学习',detail:'数学 · 二次函数专项',minutes:48},
    {time:'19:50',type:'练习答题',detail:'模拟测试卷',minutes:30},
    {time:'19:30',type:'学习打卡',detail:'今日学习内容',minutes:12}
  ]:history.filter(entry=>entry.day===todayKey).slice().reverse();
  const entriesByType=new Map();
  for(const entry of history) entriesByType.set(entry.type,(entriesByType.get(entry.type)||0)+entry.minutes);
  const totalMinutes=[...entriesByType.values()].reduce((total,minutes)=>total+minutes,0);
  const shares=sample?[['课程学习',46],['练习答题',30],['AI 测评',14],['答疑',10]]
    :[...entriesByType].map(([type,minutes])=>[type,minutes/totalMinutes*100]);
  const metrics=[['今日学习',values.at(-1),IC.clock],['近 7 天',recent,IC.plan],['累计学时',U.hours.total,IC.chart]];
  return head('学时记录')+`<div class="study-detail">
    <div class="sd-metrics">
      ${metrics.map(([label,value,icon],index)=>`<div class="sd-card sd-metric"><span class="sd-icon" aria-hidden="true">${icon}</span><div><span>${label}${sample&&index<2?' · 示例':''}</span><p><b>${value.toFixed(1)}</b> 小时</p></div></div>`).join('')}
    </div>
    <div class="sd-split sd-hours-split">
      <section class="sd-card"><div class="sd-heading"><h2>学时趋势</h2><span>${studyShortDate(days[0])} – ${studyShortDate(today)} · 小时${sample?' · 示例':''}</span></div>${studyHoursTrend(days,values)}</section>
      <section class="sd-card"><div class="sd-heading"><h2>时长构成</h2><span>${sample?'示例':'有明细的学时'}</span></div>
      ${shares.length?`<div class="sd-composition" aria-hidden="true">${shares.map(([type,value],i)=>`<i class="sd-segment-${i%4}" style="flex:${value}"></i>`).join('')}</div>
      <ul class="sd-legend">${shares.map(([type,value],i)=>`<li><i class="sd-segment-${i%4}"></i><span>${myText(type)}</span><b>${Math.round(value)}%</b></li>`).join('')}</ul>`:'<p class="sd-empty">暂无学时明细</p>'}</section>
    </div>
    <section class="sd-card"><div class="sd-heading"><h2>今日明细</h2><span>${today.getMonth()+1} 月 ${today.getDate()} 日 · ${entries.length} 条记录${sample?' · 示例':''}</span></div>
      ${entries.length?`<div class="sd-table-wrap"><table class="sd-table"><thead><tr><th scope="col">时间</th><th scope="col">学习类型</th><th scope="col">内容</th><th scope="col">用时</th></tr></thead><tbody>
        ${entries.map(entry=>`<tr><td>${myText(entry.time)}</td><td>${myText(entry.type)}</td><td>${myText(entry.detail)}</td><td><b>${entry.minutes} 分钟</b></td></tr>`).join('')}
      </tbody></table></div>`:'<p class="sd-empty">今天暂无学时明细</p>'}
    </section>
  </div>`;
}

/* ================= 档案 / 信息 ================= */
function pageArchive(){
  const name=U.name||'同学';
  return head('学生档案')+`
  <div class="mehero">
    <div class="avatar">${name[0]}</div>
    <div style="flex:1"><b style="font-size:17px">${name} · ${U.grade||'初三'}228班</b>
      <div style="font-size:11.5px;opacity:.85;margin-top:3px">${U.school||'未填写学校'} · 学号 00713202</div></div>
    <span class="go" style="color:#fff;font-size:11.5px;cursor:pointer" onclick="pushPage(pageEditInfo)">查看详情 ›</span>
  </div>
  <div class="card"><h4>基本信息</h4>
    ${[['升学类型',U.identity],['年级',U.grade||'未选择'],['考试科目',U.subjects.length?U.subjects.join('、'):'未选择'],['目前总分数',U.total?U.total+' 分':'未填写'],['考试时间',U.examDate||'2026-06-20'],['家长联系电话',U.parentPhone||'未填写']].map(([k,v])=>`
    <div class="cell"><div class="ct"><b style="font-size:12.5px;color:var(--ink2);font-weight:600">${k}</b></div><span style="font-size:13px;font-weight:700">${v}</span></div>`).join('')}
    <div class="cell"><div class="ct"><b style="font-size:12.5px;color:var(--ink2);font-weight:600">各科成绩</b></div>
      <span class="archive-score-tags">${archiveScoreSummary()}</span></div>
  </div>
  <div class="card"><h4>管理记录</h4><p class="sub">规划师与老师的跟进记录</p>
    ${U.manage.map(m=>`<div class="cell"><div class="ci" style="background:var(--blue-bg);color:var(--blue)">${IC.doc}</div><div class="ct"><b>${m.d} · ${m.t}</b><small>${m.s}</small></div></div>`).join('')}
  </div>
  <section class="card archive-trend" aria-labelledby="archive-trend-title">
    <div class="archive-trend-header">
      <h4 id="archive-trend-title">学情成绩走势</h4>
      <button type="button" class="btn sm lite" onclick="pushPage(pageScores)">进入成绩总览</button>
    </div>
    <div class="archive-trend-chart">${lineChart(U.scoresHis, 340, 170)}</div>
  </section>`;
}
function pageEditInfo(){
  return head('修改信息')+`
  <div class="card" style="text-align:center">
    <div class="avatar" style="margin:0 auto;background:var(--blue-bg);color:var(--blue);border-color:var(--blue-bg)">${(U.name||'学')[0]}</div>
    <p style="font-size:11.5px;color:var(--ink3);margin-top:8px">点击更换头像（演示）</p>
  </div>
  <div class="card">
    <div class="field"><label>年级</label>
      <div class="segs">${['初一','初二','初三','高一','高二','高三'].map(g=>`<span class="seg ${U.grade===g?'on':''}" onclick="pickSeg(this,'grade','${g}')">${g}</span>`).join('')}</div>
    </div>
    <div class="field"><label>性别</label>
      <div class="segs">${['男','女'].map(g=>`<span class="seg ${U.gender===g?'on':''}" onclick="pickSeg(this,'gender','${g}')">${g}</span>`).join('')}</div>
    </div>
    <div class="field"><label>学校名称</label><input class="input" id="ed-school" value="${U.school}"></div>
    <div class="field"><label>住宿情况</label>
      <div class="segs">${['走读','住宿'].map(g=>`<span class="seg ${U.board===g?'on':''}" onclick="pickSeg(this,'board','${g}')">${g}</span>`).join('')}</div>
    </div>
    <div class="field"><label>每日学习时长（小时）</label><input class="input" id="ed-hours" type="number" value="${U.dailyH}"></div>
    <div class="field"><label>家长手机号</label><input class="input" id="ed-pp" type="tel" maxlength="11" value="${U.parentPhone}"></div>
    <button class="btn" onclick="saveEdit()">提 交</button>
  </div>`;
}
function collectEdit(){
  const g=id=>document.getElementById(id);
  if(g('ed-school')) U.school=g('ed-school').value.trim()||U.school;
  if(g('ed-hours')){ const h=+g('ed-hours').value; if(h) U.dailyH=h; }
  if(g('ed-pp')) U.parentPhone=g('ed-pp').value.trim();
}
function saveEdit(){
  collectEdit();
  toast('信息已更新'); popPage();
}

/* ================= 成绩总览 / 错题 ================= */
function myScoreHistory(){
  return U.scoresHis.flatMap((entry,index)=>{
    if(!Number.isFinite(entry?.v)||entry.v<0||entry.v>100) return [];
    const example=DEMO_SCORE_HISTORY[index];
    return [example?.m===entry.m&&example.v===entry.v&&entry.demo!==false&&!entry.subjects ? example : entry];
  });
}
function myScoreRates(exam){
  return (Array.isArray(exam.subjects)?exam.subjects:[]).flatMap(({name,score,max})=>
    typeof name==='string'&&Number.isFinite(score)&&Number.isFinite(max)&&max>0&&score>=0&&score<=max
      ? [[name,score/max*100]] : []);
}
function scoreTrend(history,subject){
  const points=history.flatMap(exam=>{
    const rate=subject?myScoreRates(exam).find(([name])=>name===subject)?.[1]:exam.v;
    return rate===undefined?[]:[{m:exam.m,v:Math.round(rate),demo:exam.demo}];
  });
  if(!points.length) return '<p class="empty">暂无成绩记录</p>';
  const data=points.slice(-6);
  return `<p class="sub">${points.length} 次记录${points.length>6?' · 最近 6 次':''}${data.some(point=>point.demo)?' · 含示例数据':''}</p>
    <div class="my-score-trend">${lineChart(data,440,190)}</div>`;
}
function updateScoreTrend(select){
  const history=myScoreHistory();
  const subject=select.value?scoreTrendSubjects(history)[Number(select.value)-1]:'';
  document.getElementById('my-score-trend').innerHTML=scoreTrend(history,subject);
}
function scoreTrendSubjects(history){
  return [...new Set(history.flatMap(exam=>myScoreRates(exam).map(([name])=>name)))];
}
function pageScores(){
  const history=myScoreHistory();
  const subjects=scoreTrendSubjects(history);
  return head('成绩趋势')+`
  <section class="card my-trend-card">
    <div class="my-trend-heading"><h4>历次成绩走势</h4><select class="input" aria-label="查看总分或科目" onchange="updateScoreTrend(this)">
      <option value="">总分</option>${subjects.map((name,index)=>`<option value="${index+1}">${myText(name)}</option>`).join('')}
    </select></div>
    <div id="my-score-trend" aria-live="polite">${scoreTrend(history,'')}</div>
  </section>
  <div class="card"><h4>历次成绩</h4>
    ${history.slice().reverse().map(exam=>`<div class="cell"><div class="ct"><b>${myText(exam.m)}</b><small>满分 100${exam.demo?' · 示例':''}</small></div><b>${exam.v}</b></div>`).join('')||'<div class="empty">暂无成绩记录</div>'}
  </div>
  <button class="btn lite" onclick="openScoreInput()">录入新成绩</button>`;
}
function openScoreInput(){
  openModal(`<h4>录入成绩</h4><p class="sub">模拟：上传试卷后 AI 识别分数（试卷分析）</p>
  <div class="field" style="margin-top:12px"><label>考试名称</label><input class="input" id="sc-name" placeholder="如：11 月月考"></div>
  <div class="field"><label>分数</label><input class="input" id="sc-val" type="number" placeholder="0-100"></div>
  <p style="font-size:11.5px;color:var(--orange);background:var(--orange-bg);border-radius:10px;padding:9px 12px;margin-bottom:12px">提示：是否将成绩变更至本月模考？确认后同步学情档案</p>
  <div style="display:flex;gap:9px"><button class="btn ghost" style="flex:1" onclick="closeModal()">取消</button><button class="btn" style="flex:1" onclick="saveScore()">继续</button></div>`);
}
function saveScore(){
  const n=document.getElementById('sc-name').value.trim()||'最新考试';
  const score=document.getElementById('sc-val').value.trim();
  const v=Number(score);
  if(!score||!Number.isFinite(v)||v<0||v>100){ toast('请输入 0-100 的分数'); return; }
  U.scoresHis.push({m:n, v, demo:false}); closeModal(); refresh(); toast('成绩已录入，学情档案已更新');
}
function pageWrong(){
  const wrongs=S.records.filter(r=>!r.ok);
  const kpCount={};
  wrongs.forEach(r=>kpCount[r.kp]=(kpCount[r.kp]||0)+1);
  return head('错题记录')+`
  <div class="card" style="display:flex;gap:10px;text-align:center">
    <div style="flex:1"><b style="font-size:22px;color:#E4574F">${wrongs.length}</b><div style="font-size:11px;color:var(--ink3)">累计错题</div></div>
    <div style="flex:1"><b style="font-size:22px;color:#E8862C">${Object.keys(kpCount).length}</b><div style="font-size:11px;color:var(--ink3)">涉及考点</div></div>
    <div style="flex:1"><b style="font-size:22px;color:var(--blue)">${wrongs.length?Math.round(wrongs.filter(r=>r.re).length/wrongs.length*100):0}%</b><div style="font-size:11px;color:var(--ink3)">已重做正确</div></div>
  </div>
  <div class="card"><h4>考点分布</h4>
    ${Object.keys(kpCount).length?Object.entries(kpCount).map(([k,c])=>`<div class="sbar"><div class="srow"><b>${k}</b><div class="track"><i style="width:${c/Math.max(...Object.values(kpCount))*100}%;background:linear-gradient(90deg,#FF9F3A,#F25C54)"></i></div><span>${c} 题</span></div></div>`).join(''):'<div class="empty">没有错题，继续保持！</div>'}
  </div>
  <div class="card"><h4>错题列表</h4>
    ${wrongQuestionRows(wrongs)}
  </div>`;
}
function wrongQuestionRows(wrongs,fullQuestion=false){
  if(!wrongs.length) return '<div class="empty">太棒了，暂无错题！</div>';
  return wrongs.map(record=>{
    const index=Q.findIndex(question=>question.id===record.q);
    const stem=Q[index]?.stem;
    const text=!stem?'第 '+record.q+' 题':fullQuestion?stem:stem.slice(0,20)+'…';
    const description=`<span class="ct"><b>${myText(text)}</b><small>${myText(record.d)} · ${myText(record.kp)}${record.re?' · 已重做':''}</small></span>`;
    const question=index<0?description:`<button type="button" class="my-wrong-question" onclick="S.idx=${index};pushPage(pageAnalysis)">${description}</button>`;
    return `<div class="cell"><div class="ci wrong-type-icon" aria-hidden="true">${IC.pen}</div>${question}
      ${index<0?'':`<button type="button" class="btn sm lite" onclick="startWrongRedo(${Q[index].id})">重做</button>`}</div>`;
  }).join('');
}
let wrongRedoAttempt;
function startWrongRedo(qid){
  const index=Q.findIndex(question=>question.id===qid);
  if(index<0||!S.records.some(record=>record.q===qid&&!record.ok)) return;
  wrongRedoAttempt={idx:index,ans:{},m:'text'};
  pushPage(pageWrongRedo);
}
function pageWrongRedo(){
  const draft=wrongRedoAttempt;
  const q=Q[draft.idx];
  return head('错题重做',`<div class="capture-question-actions">${captureQuestionButton('答题')}</div>`)+`
    <div class="qbar">${q.type==='single'?'单选题':q.type==='fill'?'填空题':'解答题'} · ${q.kp}</div>
    <div class="stem">${q.stem}</div>
    ${examAnswerFields(q,draft)}
    <div style="margin-top:16px"><button type="button" class="btn" onclick="submitWrongRedo()">提交答案</button></div>`;
}
function submitWrongRedo(){
  const draft=wrongRedoAttempt;
  const q=Q[draft.idx];
  const answer=draft.ans[q.id];
  if(!q.opts&&draft.m!=='text'){ toast('请使用文字输入提交评分'); return; }
  if(q.opts?answer===undefined:!String(answer??'').trim()){
    toast(q.opts?'请选择答案':'请填写答案');
    return;
  }
  const record=S.records.find(item=>item.q===q.id&&!item.ok);
  if(record&&questionIsCorrect(q,answer)) record.re=true;
  replacePage(pageWrongRedoAnalysis);
}
function pageWrongRedoAnalysis(){
  const {idx,ans}=wrongRedoAttempt;
  return renderQuestionAnalysis(idx,ans[Q[idx].id],'<button type="button" class="btn" onclick="popPage()">返回错题记录</button>');
}

/* ================= 教材 / 资料 ================= */
function pageTextbook(){
  return head('个性化教材')+`
  <div class="book-progress"><div><span>中考数学 · 专属讲义</span><h2>讲义学习进度</h2><p>按薄弱考点排序 · 每周更新 2 篇</p><div class="book-progress-track"><i></i></div></div><strong>2 <small>/ 30 篇已学完</small></strong></div>
  <div class="card book-directory"><h4>讲义目录（30 篇）</h4><p class="sub">按薄弱考点排序，已完成 2 篇</p>
    ${['第 1 篇 圆的相关证明入门','第 2 篇 垂径定理与弦心距','第 3 篇 圆周角与圆内接四边形','第 4 篇 化学方程式配平技巧','第 5 篇 概率与统计速解','第 6 篇 二次函数图像与系数'].map((t,i)=>`
    <div class="cell" onclick="toast('打开《${t}》（演示 · 共 12 页）')"><div class="ci" style="background:${i<2?'var(--green-bg)':'var(--blue-bg)'};color:${i<2?'#27A566':'var(--blue)'}">${i<2?IC.check:IC.doc}</div><div class="ct"><b>${t}</b><small>${i<2?'已学完 · 可打印':'待学习 · 12 页'}</small></div>${arw()}</div>`).join('')}
  </div>
  <button class="btn" onclick="toast('已发送打印任务（演示）：第 3 篇 圆周角与圆内接四边形')">打印下一篇教材</button>
  <div class="card" style="margin-top:12px"><h4>教材实体</h4><p class="sub">每月随资料包寄出纸质版</p>
    <div style="height:110px;border-radius:14px;background:linear-gradient(135deg,#EAF0FA,#DCE7FA);display:flex;align-items:center;justify-content:center;gap:14px;margin-top:8px">
      ${['语文','数学','英语'].map((s,i)=>`<div style="width:56px;height:78px;border-radius:6px;background:linear-gradient(160deg,#2F66E0,#4C86FF);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:12px;font-weight:800;transform:rotate(${(i-1)*4}deg);box-shadow:0 6px 14px -6px rgba(47,102,224,.5)"><span style="font-size:9px;opacity:.8">考试大师</span>${s}</div>`).join('')}
    </div>
  </div>`;
}
function pageMaterials(){
  return head('资料领取')+`
  <div class="materials-summary"><div><span>资料领取</span><h2>学霸专属资料包</h2><p>全科资料库 · 真题模拟 · 学霸手册 · 免费邮寄</p></div><strong>${U.materials.length+2} <small>/ 4 项</small></strong></div>
  <div class="card materials-list"><h4>资料清单</h4>
    ${[['全科资料库','九科笔记 + 高频考点速记',1],['真题模拟','近五年中考/高考真题汇编',1],['学霸手册','错题整理模板 + 记忆卡',0],['冲刺密卷','考前 30 天押题卷（限量）',0]].map(([t,d,ok])=>`
    <div class="cell"><div class="ci" style="background:${ok?'var(--blue-bg)':'var(--line2)'};color:${ok?'var(--blue-d)':'var(--ink2)'}">${IC.star}</div><div class="ct"><b>${t}</b><small>${d}</small></div><span class="material-state">${ok?(U.materials.includes(t)?'已领取':'可领取'):'待解锁'}</span>
    <button class="btn sm${ok&&!U.materials.includes(t)?'':' lite'}" onclick="claim(this,'${t}')">${ok?(U.materials.includes(t)?'已领取':'领取'):'待解锁'}</button></div>`).join('')}
  </div>
  <p class="sub" style="text-align:center">已领取 ${U.materials.length+2} / 4 项 · 领取后 3 个工作日内寄出</p>`;
}
function claim(btn,t){
  if(btn.textContent==='待解锁'){ toast('完成本周末直播课后解锁《'+t+'》'); return; }
  if(!U.materials.includes(t)){ U.materials.push(t); toast('《'+t+'》领取成功，已加入邮寄清单'); btn.textContent='已领取'; btn.classList.add('lite'); const state=btn.parentElement.querySelector('.material-state'); if(state) state.textContent='已领取'; }
  else toast('《'+t+'》已领取过啦');
}

/* ================= 答疑 ================= */
function pageQa(){
  return `
  <div class="hd" style="padding-bottom:8px"><span class="spacer"></span>
    <button class="btn ghost sm" onclick="pushPage(pageQaHistory)">答疑记录</button></div>
  <div class="chatwrap">
    <div class="msgs" id="msgs">
      ${CHAT.msgs.map(m=>m.who==='sys'?`<div class="msg sys">${m.txt}</div>`:`<div class="msg ${m.who}">${m.txt}</div>`).join('')}
    </div>
    <div class="chiprow">
      <span class="chip" onclick="ask('这道二次函数题不会，帮我看看：y = x² − 4x + 3 与 x 轴交点')">📐 发一道数学题</span>
      <span class="chip" onclick="ask('英语完形填空总是错一半，怎么提分？')">📝 问学习方法</span>
      <span class="chip" onclick="toHuman()">🙋 转人工答疑</span>
    </div>
    <div class="inputbar">
      <span class="cam" onclick="toast('已模拟上传题目截图，AI 识别中…')">${IC.camera}</span>
      <input class="input" id="qa-in" placeholder="输入你的问题…" style="flex:1" onkeydown="if(event.key==='Enter')sendMsg()">
      <button class="send" onclick="sendMsg()"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button>
    </div>
  </div>`;
}
const AI_REPLIES=[
 '好的，我们一步步来看 👇\n① 先令 y = 0，把交点问题转化为方程 x² − 4x + 3 = 0；\n② 因式分解得 (x−1)(x−3) = 0；\n③ 所以交点横坐标为 x₁=1、x₂=3。\n需要我再出一道同类型题给你练吗？',
 '这是个很典型的方法问题：\n① 完形填空先通读全文抓主旨，不要逐题选；\n② 优先复现原则：上下文出现过的词优先考虑；\n③ 每天精读 1 篇 + 积累 10 个选项词汇，两周见效。\n已为你生成 14 天提升计划，可在「学习计划」查看。',
];
let aiIdx=0;
function sendMsg(){
  const inp=document.getElementById('qa-in'); const v=inp.value.trim();
  if(!v) return; inp.value='';
  CHAT.msgs.push({who:'me', txt:v});
  renderMsgs();
  const box=document.getElementById('msgs');
  box.insertAdjacentHTML('beforeend','<div class="msg ai typing" id="typing"><i></i><i></i><i></i></div>');
  box.scrollTop=box.scrollHeight;
  setTimeout(()=>{
    const t=document.getElementById('typing'); if(t) t.remove();
    CHAT.msgs.push({who:'ai', txt:AI_REPLIES[aiIdx++%AI_REPLIES.length]});
    renderMsgs();
  }, 1300);
}
function ask(q){ CHAT.msgs.push({who:'me', txt:q}); goTab('qa'); renderMsgs();
  setTimeout(()=>{ CHAT.msgs.push({who:'ai', txt:AI_REPLIES[aiIdx++%AI_REPLIES.length]}); renderMsgs(); },1300);
}
function toHuman(){
  CHAT.msgs.push({who:'sys', txt:'已转接人工 · 王老师（数学组）加入对话'});
  CHAT.msgs.push({who:'ai', txt:'同学你好，我是王老师 👋 刚看了 AI 给你的解析，思路没问题。你在第②步因式分解时容易卡壳，我发你 3 道梯度练习，做完发我照片，我逐题批改。'});
  renderMsgs();
}
function renderMsgs(){
  const box=document.getElementById('msgs'); if(!box) return;
  box.innerHTML=CHAT.msgs.map(m=>m.who==='sys'?`<div class="msg sys">${m.txt}</div>`:`<div class="msg ${m.who}">${m.txt}</div>`).join('');
  box.scrollTop=box.scrollHeight;
}
function pageQaHistory(){
  return head('答疑记录')+`
  <section class="qa-history" aria-label="答疑记录列表">
    <div class="qa-history-intro">
      <div><span class="qa-history-eyebrow">学习支持</span><h2>每一次提问，都值得回看</h2><p>回顾之前的问题与答疑方式，继续解决学习中的疑惑。</p></div>
      <button type="button" class="qa-history-ask" onclick="popPage();goTab('qa')">继续提问 <span aria-hidden="true">→</span></button>
    </div>
    <div class="qa-history-summary" aria-label="示例答疑概况">
      <div><span>本周答疑</span><strong>12 <small>次</small></strong></div>
      <div><span>平均响应</span><strong>8 <small>秒</small></strong></div>
      <p>以下为演示记录</p>
    </div>
    <section class="qa-history-list" aria-labelledby="qa-history-list-title">
      <div class="qa-history-list-head"><div><h3 id="qa-history-list-title">历史记录</h3><p>按时间查看之前的答疑</p></div><span>共 3 条示例</span></div>
      <div class="qa-history-row"><div class="qa-history-icon ai">${IC.ai}</div><div class="qa-history-content"><div class="qa-history-tags"><span>AI 答疑</span><span class="qa-history-status">满意</span></div><h4>二次函数与 x 轴交点</h4><p>昨天 20:15</p></div></div>
      <div class="qa-history-row"><div class="qa-history-icon teacher">${IC.people}</div><div class="qa-history-content"><div class="qa-history-tags"><span class="teacher">人工答疑</span><span class="qa-history-status">已批改</span></div><h4>垂径定理求弦心距</h4><p>11-06 19:40 · 王老师</p></div></div>
      <div class="qa-history-row"><div class="qa-history-icon ai">${IC.ai}</div><div class="qa-history-content"><div class="qa-history-tags"><span>AI 答疑</span><span class="qa-history-status">已转人工复核</span></div><h4>概率基本事件</h4><p>11-05 21:02</p></div></div>
    </section>
    <aside class="qa-history-aside"><h3>答疑概况</h3><p>这里展示的是示例记录。你可以继续提问，获得解题思路。</p><button type="button" onclick="popPage();goTab('qa')">继续提问 →</button></aside>
  </section>`;
}

/* ================= 规划之路 ================= */
const STUDY_PLAN_WEEKS=[['第 1 周','补几何漏洞：圆的证明专项（配套教材第 1-3 篇）','done'],['第 2 周','化学方程式配平 + 每日 20 分钟早读','done'],['第 3 周','数学压轴题突破 + 周六直播串讲','doing'],['第 4 周','全真模考 2 轮 + 考前心态调整','todo']];
const CURRENT_WEEK_TASKS=[
  ['压轴题基础练习','数学 · 二次函数综合','done',IC.check],
  ['数学压轴题突破','数学 · 圆的证明与综合题','doing',IC.pen],
  ['周六直播串讲','本周重点题型','todo',IC.plan]
];
function studyPlanStatus(status){
  return `<span class="sd-pill ${status}">${{done:'已完成',doing:'进行中',todo:'待开始'}[status]}</span>`;
}
function studyPlanContent(selected){
  const current=STUDY_PLAN_WEEKS.findIndex(([, ,state])=>state==='doing');
  const today=new Date();
  today.setDate(today.getDate()+7*(selected-current));
  const week=studyWeekDays(today);
  const [title,task,status]=STUDY_PLAN_WEEKS[selected];
  const isCurrent=selected===current;
  const tasks=isCurrent?CURRENT_WEEK_TASKS:[[task,'',status,status==='done'?IC.check:IC.plan]];
  const completed=STUDY_PLAN_WEEKS.filter(([, ,state])=>state==='done').length;
  return `<div class="sd-plan-banner"><div><h2>30 天冲刺方案</h2><p>${title} · ${studyShortDate(week[0])} – ${studyShortDate(week[6])} · 示例</p></div>
    <div><b>${completed} / ${STUDY_PLAN_WEEKS.length}</b><p>已完成周数</p></div></div>
    <div class="sd-weeks" role="group" aria-label="查看各周计划">${STUDY_PLAN_WEEKS.map(([name,,state],index)=>
      `<button type="button" data-study-week="${index}" aria-pressed="${selected===index}" onclick="selectStudyPlanWeek(${index})"><b>${name}</b>${studyPlanStatus(state)}</button>`
    ).join('')}</div>
    <div class="sd-split">
      <section class="sd-card"><div class="sd-heading"><h2>${isCurrent?'本周':title}任务</h2><span>已完成 ${tasks.filter(([, ,state])=>state==='done').length} / ${tasks.length}</span></div>
      ${tasks.map(([name,description,state,icon])=>`<div class="sd-task"><span class="sd-icon" aria-hidden="true">${icon}</span><div><b>${name}</b>${description?`<small>${description}</small>`:''}</div>${studyPlanStatus(state)}</div>`).join('')}
      </section>
      <div class="sd-stack">
        <section class="sd-card"><div class="sd-heading"><h2>${isCurrent?'本周':title}重点</h2></div>
          <div class="sd-task"><span class="sd-icon" aria-hidden="true">${IC.plan}</span><div><b>${isCurrent?'数学压轴题突破':task}</b>${isCurrent?'<small>练习综合题，在周六串讲中复盘解题步骤。</small>':''}</div></div>
        </section>
        <section class="sd-card"><div class="sd-heading"><h2>规划师跟进</h2><button type="button" class="btn sm lite" onclick="toast('已提醒规划师，将按约定时间致电')">提醒</button></div>
          <div class="sd-follow"><b>李规划师</b><span>下次回访 · 周四 19:00</span></div>
        </section>
      </div>
    </div>`;
}
function selectStudyPlanWeek(index){
  const detail=document.getElementById('study-plan-detail');
  detail.innerHTML=studyPlanContent(index);
  detail.querySelector(`[data-study-week="${index}"]`)?.focus({preventScroll:true});
}
function pagePlan(){
  const current=STUDY_PLAN_WEEKS.findIndex(([, ,state])=>state==='doing');
  return head('学习计划详情')+`<div class="study-detail" id="study-plan-detail">${studyPlanContent(current)}</div>`;
}

/* ================= 左侧导航 ================= */
const MODS=[
  ['M1 注册建档','验证码登录 → 完善信息（建档）→ 退出登录', 'login'],
  ['M2 课程学习','三种课程 → 各自科目课程列表 → 选科目输激活码 JQ2026 → 教材与学校进度 → 薄弱点摸底或直接看课', 'courses'],
  ['M3 练习测评','试卷 → 答题（三种作答）→ 解析 → 答题卡日历', 'practice'],
  ['M3 AI 测评','测评命题 → 作答 → AI 报告（雷达图/漏洞）', 'aitest'],
  ['M4 答疑服务','AI 先行答疑 → 一键转人工 → 答疑记录', 'qa'],
  ['M5 学情伴学','学习打卡 / 学习记录 / 成绩总览 / 学生档案', 'me'],
  ['首页主控台','轮播 / 快捷入口 / 课程表 / 三维一体 / 教程', 'home'],
];
document.getElementById('mods').innerHTML = MODS.map((m,i)=>{
  const color=['#3D7EFF','#E8862C','#27A566','#6A5CFF','#E4574F','#1B9E9E','#2F66E0'][i];
  return `<button onclick="demoNav('${m[2]}')"><span class="no" style="background:${color}1A;color:${color}">${m[0].split(' ')[0]}</span><span style="flex:1">${m[0].split(' ')[1]||m[0]}<small>${m[1]}</small></span></button>`;
}).join('');
function demoNav(k){
  closeModal();
  if(k==='login'){ U.logged=false; U.onboarded=false; demoStart(); return; }
  if(!U.logged){ demoStart(); toast('请先登录（验证码 1234）'); return; }
  if(k==='courses') goTab('courses');
  else if(k==='qa') goTab('qa');
  else if(k==='me') goTab('me');
  else if(k==='home') goTab('home');
  else if(k==='practice'||k==='aitest') openSidePage('discover','pagePapers');
}

/* ---------- 启动 ---------- */
(function(){
  const c = document.getElementById('clock');
  const tick = ()=>{ const d=new Date(); c.textContent = String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); };
  tick(); setInterval(tick, 30000);
})();
// 手写画布在页面渲染后初始化
const _origSetHTML=setHTML;
setHTML=function(...args){ _origSetHTML(...args); setTimeout(initHw,30); };

/* ==================================================================
   桌面网页版适配层
   复用 H5 原型全部页面与业务逻辑，只替换「外壳 / 导航 / 布局」语义
   ================================================================== */
const STORE_KEY='exam-master-web-v1';
const TAB_NAMES={home:'首页',discover:'发现',qa:'在线答疑',me:'我的'};
const $id=id=>document.getElementById(id);

/* ---------- 本机状态持久化（纯前端，无后端） ---------- */
let demoResetSnapshot;
function persist(){
  try{ localStorage.setItem(STORE_KEY, JSON.stringify(demoResetSnapshot||{U,S,CHAT})); }catch(e){}
}
function restore(){
  try{
    const raw=localStorage.getItem(STORE_KEY); if(!raw) return;
    const d=JSON.parse(raw);
    if(d.U) Object.assign(U,d.U);
    const oldLessonIds=['factor','equation','quadratic','circle','probability','translation','chord'];
    for(const [key,study] of Object.entries(U.courseStudy)){
      if(!key.endsWith('|中考|数学')) continue;
      if(typeof study.schoolLesson==='number'){
        study.lesson??=oldLessonIds[study.schoolLesson];
        study.chapterOnly??=study.schoolChapterOnly;
      }
      if(typeof study.lastLesson==='number') study.playing??=oldLessonIds[study.lastLesson];
      if(typeof study.result?.lesson==='number'){
        const id=oldLessonIds[study.result.lesson];
        study.result=id?{...study.result,lesson:id}:null;
      }
    }
    if(d.S) Object.assign(S,d.S);
    if(d.CHAT && Array.isArray(d.CHAT.msgs)) CHAT.msgs=d.CHAT.msgs;
  }catch(e){}
}
function resetDemo(){
  const key=U.activatedSubjects.includes(U.activeSubject)
    ? U.activeSubject
    : U.activatedSubjects[0]||subKey('skill','中考','数学');
  const [course,identity]=key.split('|');
  demoResetSnapshot={U:{
    activated:true,
    activeCourse:course,
    activeSubject:key,
    activatedCourses:[course],
    activatedSubjects:[key],
    identity,
    grade:identity==='高考'?'高三':'初三',
  }};
  persist();
  location.hash=''; location.reload();
}

/* ---------- 登录分屏 / 应用外壳切换 ---------- */
function setAuth(on){
  topAccountMenu.open=false;
  document.body.classList.toggle('is-auth',!!on);
  if(!on) updateChrome();
}
function updateChrome(){
  const nm=U.name?U.name+'同学':'同学';
  const av=(U.name||'同')[0];
  if($id('topName')) $id('topName').textContent=nm;
  if($id('topAvatar')) $id('topAvatar').textContent=av;

}

/* ---------- 面包屑 ---------- */
function updateCrumb(title,parent){
  const box=$id('crumb'); if(!box) return;
  const nested=stack.length>0;
  $id('pageBack').hidden=!nested;
  box.innerHTML='<span class="crumb-root">'+parent+'</span><span class="crumb-sep" aria-hidden="true">/</span><b aria-current="page">'+title+'</b>';
  box.classList.toggle('context-only',nested&&!!screen.querySelector('.page > .hd,.page > .setup-topbar'));
}
function titleFromHTML(html){
  let m=html.match(/class="st-ttl"[\s\S]*?<b>([^<]+)<\/b>/);
  if(m) return m[1];
  m=html.match(/<div class="hd"[\s\S]*?<b>([^<]+)<\/b>/);
  if(m) return m[1];
  m=html.match(/class="login-hero"[\s\S]*?<h2>([^<]+)<\/h2>/);
  if(m) return m[1];
  return '详情';
}

/* ---------- 页面布局判定 ---------- */
function layoutOf(html,cls){
  if(cls==='page-chat'||html.indexOf('chatwrap')>=0) return 'chat';
  if(html.indexOf('setup-topbar')>=0) return 'setup';
  if(html.indexOf('class="stem"')>=0||html.indexOf('class="opt')>=0) return 'narrow';
  if(html.indexOf('act-cover')>=0||html.indexOf('tdgrid')>=0) return 'narrow';
  if(html.indexOf('class="cal"')>=0||html.indexOf('试听模式')>=0) return 'narrow';
  return 'grid';
}

/* ---------- 路由覆盖：保留原型逻辑，换桌面外壳语义 ---------- */
const _baseSetHTML=setHTML;
setHTML=function(html,cls){
  _baseSetHTML(html,cls);
  const courseSearch=$id('home-course-search');
  if(courseSearch) courseSearch.value=homeCourseFilters.query;
  mountHomeFilterDock();
  const p=document.querySelector('#screen .page');
  if(p){
    p.classList.add('layout-'+layoutOf(html,cls));
    const current=stack[stack.length-1]||sidePageRoot?.render;
    if(current===pageSetup1) p.classList.add('setup-step-one');
    if(current===pageSetup2) p.classList.add('study-setup');
    if([pageQaHistory,pageArchive,pageEditInfo,pageScores,pageWrong,pageCalendar,pageCheckin].includes(current)) p.classList.add('personal-detail');
    if([pageStudyLog,pagePlan,pageSetupTime].includes(current)) p.classList.add('study-detail-page');
    if(current===pageArchive) p.classList.add('detail-archive');
    if([pagePapers,pageAiAssessment,pageTextbook,pageMaterials].includes(current)) p.classList.add('discover-detail');
    if(current===pagePapers) p.classList.add('detail-papers');
    if(current===pageTextbook) p.classList.add('detail-book');
    if(current===pageMaterials) p.classList.add('detail-materials');
    if(current===pageCoursePlay) p.classList.add('course-player-page');
  }
  updateCrumb(titleFromHTML(html),TAB_NAMES[curTab]||'考试大师');
  updateChrome();
  persist();
};
goTab=function(name,root=null){
  if(name==='courses') name='home';
  const pages={home:pageHome,qa:pageQa,me:pageMe};
  const render=root?.render||pages[name];
  if(!render) return;
  stack=[];parentScroll.length=0;sidePageRoot=root;navDir='fwd';curTab=name;setAuth(false);
  if(name==='discover') setOpenSideGroup(name);
  tabbar.querySelectorAll('.side-sub [aria-current]').forEach(button=>button.removeAttribute('aria-current'));
  root?.button?.setAttribute('aria-current','page');
  const html=render();
  setHTML(html,!root&&name==='qa'?'page-chat':'');
  updateCrumb(root?titleFromHTML(html):TAB_NAMES[name],root?TAB_NAMES[name]:'考试大师');
  $id('appShell').dataset.section = name;
  tabbar.style.removeProperty('display');
  tabbar.querySelectorAll('.tb').forEach(button => {
    const active = button.dataset.tab === name;
    button.classList.toggle('on', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  updateChrome();persist();
};
pushPage=function(fn,dir,replacing=false){
  if(!replacing) parentScroll[stack.length]=screen.scrollTop;
  navDir=dir||'fwd';stack.push(fn);setAuth(false);
  delete $id('appShell').dataset.section;
  const html=fn();
  setHTML(html);
  updateCrumb(titleFromHTML(html),TAB_NAMES[curTab]||'考试大师');
  persist();
};
/* popPage / refresh 仍使用原型实现，内部会调用上面覆盖后的 goTab/setHTML */

/* 登录态总入口：未登录 → 分屏登录页；已登录 → 应用首页 */
demoStart=function(){
  stack=[];sidePageRoot=null;curTab='home';navDir='fwd';closeModal();
  tabbar.querySelectorAll('.tb').forEach(b=>b.classList.remove('on'));
  if(U.logged){ setAuth(false); goTab('home'); return; }
  setAuth(true);
  onboarding=null;
  $id('authStage').removeAttribute('data-step');
  $id('authTitle').textContent='验证码登录';
  $id('authCard').innerHTML=pageLogin();
  updateChrome();
};

/* 一级菜单同一时间最多展开一组。 */
function setOpenSideGroup(name){
  tabbar.querySelectorAll('[data-side-group]').forEach(group=>{
    const open=group.dataset.sideGroup===name;
    const button=group.querySelector('.side-category');
    const submenu=group.querySelector('.side-sub');
    group.dataset.expanded=String(open);
    button.setAttribute('aria-expanded',String(open));
    submenu.inert=!open;
    submenu.setAttribute('aria-hidden',String(!open));
  });
}
tabbar.querySelectorAll('[data-side-group] .side-category').forEach(button=>{
  button.addEventListener('click',()=>{
    const group=button.closest('[data-side-group]');
    setOpenSideGroup(group.dataset.expanded==='true'?null:group.dataset.sideGroup);
  });
});

/* 侧栏二级菜单直接打开栏目首页 */
function openSidePage(tab,page){
  const pages={
    pagePapers,pageCheckin,pageLive,pageTextbook,pageMaterials,
    pageArchive,pageScores,pageWrong
  };
  const render=pages[page];
  if(!render) return;
  const button=tabbar.querySelector('[data-side-page="'+page+'"]');
  goTab(tab,{render,button});
}

/* 选中背景使用同一个图层，切换时由当前动画位置继续。 */
let sideIndicatorFrame=0;
function updateSideIndicator(){
  sideIndicatorFrame=0;
  let target=tabbar.querySelector('.side-sub [aria-current="page"]') || tabbar.querySelector('.tb.on');
  if(target){
    const group=target.closest('[data-side-group]');
    if(group && group.dataset.expanded!=='true') target=group.querySelector('.side-category');
  }
  const navRect=tabbar.getBoundingClientRect();
  if(!target || !navRect.width || !navRect.height){ tabbar.classList.remove('indicator-visible'); return; }
  const rect=target.getBoundingClientRect();
  tabbar.style.setProperty('--indicator-x', (rect.left-navRect.left)+'px');
  tabbar.style.setProperty('--indicator-y', (rect.top-navRect.top)+'px');
  tabbar.style.setProperty('--indicator-width', rect.width+'px');
  tabbar.style.setProperty('--indicator-height', rect.height+'px');
  tabbar.classList.add('indicator-visible');
}
function scheduleSideIndicator(){
  if(!sideIndicatorFrame) sideIndicatorFrame=requestAnimationFrame(updateSideIndicator);
}
new MutationObserver(scheduleSideIndicator).observe(tabbar,{subtree:true,attributes:true,attributeFilter:['aria-current','class','data-expanded']});
if(typeof ResizeObserver!=='undefined'){
  const observer=new ResizeObserver(scheduleSideIndicator);
  observer.observe(tabbar);
  tabbar.querySelectorAll('[data-side-group]').forEach(group=>observer.observe(group));
}
window.addEventListener('resize',scheduleSideIndicator);
tabbar.addEventListener('click',scheduleSideIndicator);
tabbar.classList.add('has-indicator');
scheduleSideIndicator();

const sidebar = $id('sidebar');
const sidebarDesktop = matchMedia('(min-width: 681px)');
function setSidebarCompact(compact){
  $id('appShell').classList.toggle('sidebar-compact', compact);
}
sidebarDesktop.addEventListener('change', () => setSidebarCompact(true));
sidebar.addEventListener('pointerenter', event => {
  if(sidebarDesktop.matches && event.pointerType === 'mouse') setSidebarCompact(false);
});
sidebar.addEventListener('pointerleave', event => {
  if(sidebarDesktop.matches && event.pointerType === 'mouse') setSidebarCompact(true);
});

const authStage = $id('authStage');
const authThemes = authStage.querySelectorAll('[data-auth-theme]');
authThemes.forEach(button => {
  button.addEventListener('click', () => {
    authStage.dataset.theme = button.dataset.authTheme;
    authThemes.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
  });
});

function openNotifications(){
  openModal(`<h4>消息通知</h4><p class="sub" style="margin-top:4px">最近 7 天的服务提醒</p>
    <div class="list" style="margin-top:14px;padding:0 12px">
      <div class="cell"><div class="ci" style="background:var(--blue-bg);color:var(--blue)">${IC.plan}</div><div class="ct"><b>本周学习计划已更新</b><small>今天 08:30 · 新增 3 节技巧课</small></div></div>
      <div class="cell"><div class="ci" style="background:var(--orange-bg);color:#E8862C">${IC.live}</div><div class="ct"><b>直播提醒</b><small>11-12 19:30 · 二次函数压轴突破</small></div></div>
      <div class="cell"><div class="ci" style="background:var(--green-bg);color:#27A566">${IC.people}</div><div class="ct"><b>规划师回访</b><small>周四 19:00 · 李规划师</small></div></div>
    </div>
    <button class="btn" style="margin-top:14px" onclick="closeModal()">知道了</button>`);
}

const topAccountMenu=$id('topAccountMenu');
document.addEventListener('click',event=>{
  if(topAccountMenu.open&&!topAccountMenu.contains(event.target)) topAccountMenu.open=false;
});

/* ---------- 键盘快捷键 ---------- */
document.addEventListener('keydown',e=>{
  const tag=(e.target&&e.target.tagName)||'';
  const typing=tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT';
  if(e.key==='Escape'){
    const root=$id('modal-root');
    if(root&&root.classList.contains('show')) closeModal();
    else if(topAccountMenu.open){
      topAccountMenu.open=false;
      topAccountMenu.querySelector('summary').focus();
    }
    else if(!typing&&stack.length) goBack();
    return;
  }
  if(e.altKey&&e.key==='ArrowLeft'&&stack.length){ e.preventDefault(); goBack(); }
});
/* ---------- 启动（在原型启动脚本之后执行，接管外壳） ---------- */
(function boot(){
  restore();
  U.logged=false;
  demoStart();
  setInterval(persist,3000);
  window.addEventListener('beforeunload',persist);
  updateChrome();
})();

