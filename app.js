/* ===== 源自 H5 原型的完整交互逻辑（保留） ===== */

/* ================= 状态 ================= */
const U = {
  logged:false, onboarded:false,
  name:'', grade:'', gender:'男', school:'', identity:'中考', examDate:'', dailyH:'3',
  subjects:[], total:'', scores:{数学:88, 物理:82, 英语:85, 语文:90}, parentPhone:'',
  activated:false, activeCourse:'', activeSubject:'', activatedCourses:[], activatedSubjects:[], setupStep:0,
  setup:{schoolProgress:'', textbook:'', nextExam:'', nextExamTime:'', subjectScore:'', plannerTime:'', remark:'',
         stars:[8,1,1,1], evalMethod:'', uploadCount:0, analysisDone:false, studyTime:'', studyDays:'',
         dayPlan:{}, callRemind:'是', planSaved:false},
  materials:[], hours:{today:0.0, week:2.4, total:36.5},
  checkins:[{date:'11-07', txt:'完成二次函数专项 20 题，整理错题 3 道', imgs:2}],
  manage:[{d:'11-06', t:'规划师致电回访', s:'调整学习计划：每晚增加 30 分钟英语阅读'},
          {d:'11-02', t:'月考成绩录入', s:'10 月月考 4 科成绩已建档'}],
  scoresHis:[{m:'9月月考',v:78},{m:'10月月考',v:82},{m:'期中',v:85},{m:'11月周测',v:88}],
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
  const pages = {home:pageHome, discover:pageDiscover,  qa:pageQa, me:pageMe};
  setHTML(pages[name](), name==='qa'?'page-chat':'');
  tabbar.querySelectorAll('.tb').forEach(b=>b.classList.toggle('on', b.dataset.tab===name));
  tabbar.style.display='flex';
}
function pushPage(fn, dir){ navDir = dir||'fwd'; stack.push(fn); setHTML(fn()); tabbar.style.display='none'; }
function popPage(){
  stack.pop(); navDir='back';
  if(!stack.length){ goTab(curTab==='discover'?'home':curTab); return; }
  setHTML(stack[stack.length-1]());
}
function refresh(){ navDir='back'; if(stack.length) setHTML(stack[stack.length-1]()); else goTab(curTab); }
function head(title, extra){
  return '<div class="hd"><button type="button" class="backbtn" aria-label="返回上一页" onclick="popPage()"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><b>'+title+'</b><span class="spacer"></span>'+(extra||'')+'</div>';
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
function closeModal(){ document.getElementById('modal-root').classList.remove('show'); }

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
  const pad={l:34,r:14,t:16,b:26}, iw=w-pad.l-pad.r, ih=h-pad.t-pad.b;
  const vs=data.map(d=>d.v), min=Math.min(...vs)-4, max=Math.max(...vs)+3;
  const x=i=>pad.l+iw*i/(data.length-1), y=v=>pad.t+ih*(1-(v-min)/(max-min));
  let grid='',labels='';
  [min,Math.round((min+max)/2),max].forEach(v=>{
    grid+='<line x1="'+pad.l+'" y1="'+y(v)+'" x2="'+(w-pad.r)+'" y2="'+y(v)+'" stroke="#ECEFF3"/>';
    labels+='<text x="'+(pad.l-7)+'" y="'+(y(v)+4)+'" text-anchor="end" font-size="9.5" fill="#9AA3B0">'+v+'</text>';
  });
  data.forEach((d,i)=>{
    labels+='<text x="'+x(i)+'" y="'+(h-8)+'" text-anchor="middle" font-size="9.5" fill="#9AA3B0">'+d.m+'</text>';
    labels+='<circle cx="'+x(i)+'" cy="'+y(d.v)+'" r="4" fill="#fff" stroke="#3D7EFF" stroke-width="2.2"/><text x="'+x(i)+'" y="'+(y(d.v)-9)+'" text-anchor="middle" font-size="10" font-weight="800" fill="#1B2430">'+d.v+'</text>';
  });
  let path=''; data.forEach((d,i)=>{ path+=(i?' L ':'M ')+x(i)+' '+y(d.v); });
  const area=path+' L '+x(data.length-1)+' '+(pad.t+ih)+' L '+pad.l+' '+(pad.t+ih)+' Z';
  return '<svg viewBox="0 0 '+w+' '+h+'" style="width:100%"><path d="'+area+'" fill="rgba(61,126,255,.08)"/><path d="'+path+'" fill="none" stroke="#3D7EFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'+grid+labels+'</svg>';
}
function radarSvg(labels, vals, size){
  size=size||250; const cx=size/2, cy=size/2+4, R=size/2-42, n=labels.length;
  const pt=(i,r)=>{ const a=-Math.PI/2+2*Math.PI*i/n; return [cx+r*Math.cos(a), cy+r*Math.sin(a)]; };
  let webs='',axes='',vlbl='',poly='';
  for(let ring=1;ring<=4;ring++){
    let pts=''; for(let i=0;i<n;i++){ const p=pt(i,R*ring/4); pts+=p[0]+','+p[1]+' '; }
    webs+='<polygon points="'+pts+'" fill="none" stroke="#E4EAF2"/>';
  }
  labels.forEach((lb,i)=>{
    const p=pt(i,R), pl=pt(i,R+16);
    axes+='<line x1="'+cx+'" y1="'+cy+'" x2="'+p[0]+'" y2="'+p[1]+'" stroke="#E4EAF2"/>';
    vlbl+='<text x="'+pl[0]+'" y="'+pl[1]+'" text-anchor="middle" font-size="10.5" fill="#5A6472" font-weight="600">'+lb+'</text>';
  });
  vals.forEach((v,i)=>{ const p=pt(i,R*v/100); poly+=(i?' ':'M')+p[0]+' '+p[1]; });
  const dots=vals.map((v,i)=>{ const p=pt(i,R*v/100); return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3.5" fill="#3D7EFF"/>'; }).join('');
  return '<svg viewBox="0 0 '+size+' '+size+'" style="width:100%">'+webs+axes+vlbl+
    '<polygon points="'+poly.trim()+'" fill="rgba(61,126,255,.18)" stroke="#3D7EFF" stroke-width="2"/>'+dots+'</svg>';
}

/* ================= 登录 / 建档 ================= */
let agreeOn=false, cd=0, cdTimer=null;
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
  U.logged=true; U.phone=ph;
  toast('登录成功');
  if(!U.onboarded){ pushPage(pageOnboard); } else { demoStart(); }
}
/* 3 秒快捷登录：一键体验，自动填充演示档案并直接进入首页 */
function quickLogin(){
  clearInterval(cdTimer);
  U.logged=true; U.phone=U.phone||'19900000000';
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
function pageOnboard(){
  return `<div class="hd"><b>完善信息</b><span class="spacer"></span><span style="font-size:12px;color:var(--ink3);cursor:pointer" onclick="backToLogin()">返回登录</span></div>`+`
  <p class="sub" style="font-size:12.5px;color:var(--ink3);margin-bottom:14px">输入学生相关信息，便于老师快速了解学生，为您制定专属学习计划</p>
  <div class="card">
    <div class="field"><label>学生姓名<em>*</em></label><input class="input" id="ob-name" value="${U.name}" placeholder="请输入学生姓名"></div>
    <div class="field"><label>身份<em>*</em>（升学类型）</label>
      <div class="segs" id="ob-id">${['中考','高考'].map(g=>`<span class="seg ${U.identity===g?'on':''}" onclick="pickIdentity(this,'${g}')">${g}</span>`).join('')}</div>
    </div>
    <div id="ob-dep">${obDep()}</div>
    <div class="field"><label>家长联系电话</label><input class="input" id="ob-pp" type="tel" maxlength="11" value="${U.parentPhone}" placeholder="请输入家长联系电话"></div>
    <button class="btn" onclick="saveOnboard()">完善资料</button>
  </div>`;
}
/* 中考/高考对应的年级与考试科目 */
const GRADES={'中考':['初一','初二','初三'],'高考':['高一','高二','高三']};
const SUBJECTS={
  '中考':['语文','数学','英语','物理','化学','道德与法治','历史'],
  '高考':['语文','数学','英语','物理','历史','化学','生物','地理','政治'],
};
/* 身份切换时：只重绘依赖区块（年级/科目/总分），姓名等输入不受影响 */
function obDep(){
  const grades=GRADES[U.identity]||GRADES['中考'];
  const subs=SUBJECTS[U.identity]||SUBJECTS['中考'];
  return `<div class="field"><label>年级<em>*</em></label>
      <div class="segs" id="ob-grade">${grades.map(g=>`<span class="seg ${U.grade===g?'on':''}" onclick="pickSeg(this,'grade','${g}')">${g}</span>`).join('')}</div>
    </div>
    <div class="field"><label>考试科目<em>*</em>（可多选）</label>
      <div class="segs subgrid" id="ob-subs">${subs.map(s=>`<span class="seg ${U.subjects.includes(s)?'on':''}" onclick="toggleSub(this,'${s}')">${s}</span>`).join('')}</div>
    </div>
    <div class="field"><label>目前总分数<em>*</em></label><input class="input" id="ob-total" type="number" value="${U.total||''}" placeholder="${U.identity==='高考'?'如：586（满分 750）':'如：612（满分 740）'}"></div>`;
}
function pickIdentity(el,v){
  const totalEl=document.getElementById('ob-total');
  if(totalEl) U.total=totalEl.value;      /* 切身份前先保存已填总分 */
  pickSeg(el,'identity',v);
  if(U.grade && !(GRADES[v]||[]).includes(U.grade)) U.grade='';
  U.subjects=U.subjects.filter(s=>(SUBJECTS[v]||[]).includes(s));
  const box=document.getElementById('ob-dep');
  if(box) box.innerHTML=obDep();
}
function toggleSub(el,s){
  const i=U.subjects.indexOf(s);
  if(i>=0){ U.subjects.splice(i,1); el.classList.remove('on'); }
  else{ U.subjects.push(s); el.classList.add('on'); }
}
function backToLogin(){ U.logged=false; stack=[]; navDir='fwd'; demoStart(); }
/* 选项就地切换：只改当前选项组的高亮与数据，不重绘页面（不闪烁、不丢滚动位置） */
function pickSeg(el,k,v){
  const box=el.parentNode;
  [...box.children].forEach(c=>c.classList.remove('on'));
  el.classList.add('on');
  U[k]=v;
}
function saveOnboard(){
  const name=document.getElementById('ob-name').value.trim();
  const total=document.getElementById('ob-total').value;
  if(!name){ toast('请填写学生姓名'); return; }
  if(!U.identity){ toast('请选择身份（中考/高考）'); return; }
  if(!U.grade){ toast('请选择年级'); return; }
  if(!U.subjects.length){ toast('请选择考试科目'); return; }
  if(!total||+total<=0){ toast('请填写目前总分数'); return; }
  U.name=name; U.total=+total;
  U.parentPhone=document.getElementById('ob-pp').value.trim();
  U.onboarded=true;
  closeModal(); toast('信息已提交，老师将在 24 小时内致电确认学习计划');
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

function pageMe(){
  const name=U.name||'同学';
  const active=U.activatedCourses.length>0;
  const scanIcon='<svg viewBox="0 0 24 24"><path d="M4 9V4h5m6 0h5v5M4 15v5h5m6 0h5v-5M4 12h16"/><path d="M8 8h2v2H8zm6 6h2v2h-2z"/></svg>';
  const quick=[
    ['直播课堂',IC.live,'pushPage(pageLive)'],
    ['学习计划',IC.plan,'pushPage(pagePlan)'],
    ['打卡记录',IC.check,'pushPage(pageCheckin)']
  ];
  const records=[
    ['学习记录',IC.clock,'pushPage(pageStudyLog)'],
    ['成绩总览',IC.chart,'pushPage(pageScores)'],
    ['错题记录',IC.pen,'pushPage(pageWrong)'],
    ['答题记录',IC.doc,'pushPage(pageCalendar)'],
    ['答疑记录',IC.chat,'pushPage(pageQaHistory)']
  ];
  return `<div class="my-hub">
    <header class="my-identity" aria-label="个人资料">
      <span class="my-identity-avatar" aria-hidden="true">${name[0]}</span>
      <div class="my-identity-name"><h1>${U.name?name+'同学':'同学'}</h1><p>${U.grade||'初三'} · ${U.identity} <span>学号 00713202</span></p></div>
      <div class="my-identity-actions">
        <button type="button" onclick="pushPage(pageArchive)">学情档案</button>
        <button type="button" onclick="pushPage(pageEditInfo)">修改资料</button>
      </div>
    </header>
    <div class="my-workspace">
      <section aria-label="学习数据">
        <dl class="my-stat-lines">
          <div><dt>累计学时</dt><dd>${(U.hours.total).toFixed(1)} <small>小时</small></dd></div>
          <div><dt>做题数</dt><dd>${S.records.length} <small>题</small></dd></div>
          <div><dt>打卡天数</dt><dd>${U.checkins.length} <small>天</small></dd></div>
        </dl>
      </section>
      <div class="my-feature-list">
        ${myMenuButton('学习安排',IC.plan,'tapSchedule()')}
        ${active?myMenuButton('课程章节',IC.play,'pushPage(pageCoursePlay)'):''}
        ${myMenuButton('扫码',scanIcon,'scanQR()')}
        ${active?myMenuButton('伴学群',IC.people,'openGroup()'):''}
        ${quick.map(item=>myMenuButton(...item)).join('')}
        ${records.map(item=>myMenuButton(...item)).join('')}
      </div>
    </div>
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
  U.logged=false; U.onboarded=false; stack=[];
  agreeOn=false; clearInterval(cdTimer);    /* 回到登录页时重置协议勾选与倒计时 */
  demoStart(); toast('已退出登录');
}

/* 未开通时说明课表条件，由学生选择是否返回首页。 */
function tapSchedule(){
  if(!U.activated){
    openModal('<h4>专属课程表</h4><p class="sub">开通课程并填写资料后，即可查看课表。</p><button type="button" class="btn" onclick="closeModal();goTab(\'home\')">去选课</button>');
    return;
  }
  if(U.setupStep===4){ pushPage(pageSetupDone); return; }
  pushPage(SETUP_PAGES[U.setupStep||1]);
}

/* ================= 发现 ================= */
function pageDiscover(){
  return `
  <section class="student-panels discover-catalog" aria-labelledby="discover-title">
    <div class="discover-heading"><div><h2 id="discover-title">学习资源</h2><p>找到适合当前学习的试卷、教材和资料</p></div></div>
    <label class="discover-search"><span>搜索资源</span><input id="discover-search" type="search" placeholder="搜索试卷、教材或资料" oninput="filterDiscover()"></label>
    <div class="discover-filters" aria-label="资源分类">
      <button type="button" class="on" data-discover-filter="all" aria-pressed="true" onclick="filterDiscover('all')">全部</button>
      <button type="button" data-discover-filter="paper" aria-pressed="false" onclick="filterDiscover('paper')">试卷</button>
      <button type="button" data-discover-filter="book" aria-pressed="false" onclick="filterDiscover('book')">教材</button>
      <button type="button" data-discover-filter="material" aria-pressed="false" onclick="filterDiscover('material')">资料</button>
      <button type="button" data-discover-filter="tool" aria-pressed="false" onclick="filterDiscover('tool')">工具</button>
    </div>
    <div class="discover-resources">
      <button type="button" class="discover-resource" data-category="paper" onclick="pushPage(pagePapers)"><div class="ci" style="background:var(--blue-bg);color:var(--blue)">${IC.doc}</div><div class="ct"><b>试卷</b><small>模拟测试卷 · 同步测试卷 · 区域测试卷</small></div>${arw()}</button>
      <button type="button" class="discover-resource" data-category="book" onclick="pushPage(pageTextbook)"><div class="ci" style="background:#F1EFFA;color:#7A5CD6">${IC.book}</div><div class="ct"><b>个性化教材</b><small>30 篇专属讲义 · 按漏洞定制</small></div>${arw()}</button>
      <button type="button" class="discover-resource" data-category="material" onclick="pushPage(pageMaterials)"><div class="ci" style="background:var(--orange-bg);color:#E8862C">${IC.star}</div><div class="ct"><b>资料领取</b><small>全科资料库 · 真题模拟 · 学霸手册</small></div>${arw()}</button>
      <button type="button" class="discover-resource" data-category="tool" onclick="pushPage(pageAiTest)"><div class="ci" style="background:var(--green-bg);color:#27A566">${IC.chart}</div><div class="ct"><b>AI 测评</b><small>评估学习情况 · 找到薄弱知识点</small></div>${arw()}</button>
    </div>
    <p class="discover-empty" hidden>没有找到相关资源，请调整搜索内容或分类。</p>
  </section>`;
}
function filterDiscover(category){
  const catalog=document.querySelector('.discover-catalog');
  if(!catalog) return;
  if(category){ catalog.querySelectorAll('[data-discover-filter]').forEach(button=>{const active=button.dataset.discoverFilter===category;button.classList.toggle('on',active);button.setAttribute('aria-pressed',String(active));}); }
  const active=catalog.querySelector('[data-discover-filter].on').dataset.discoverFilter;
  const query=catalog.querySelector('#discover-search').value.trim().toLowerCase();
  let visible=0;
  catalog.querySelectorAll('.discover-resource').forEach(item=>{const show=(active==='all'||item.dataset.category===active)&&item.textContent.toLowerCase().includes(query);item.hidden=!show;if(show) visible++;});
  catalog.querySelector('.discover-empty').hidden=visible!==0;
}

/* ================= 课程：列表 / 详情 / 激活 / 三步信息采集 ================= */
/* 调研文档「课程激活」：点击课程 → 三种课程 → 按升学情况选择对应课程 → 输入激活码
   技巧课/技巧同步课可自助输入激活码，课课通需由报名老师发放激活码激活 */
const COURSES=[
 {id:'skill', n:'技巧课', s:'专注于初三高三技巧提升', b:'中高考答题技巧', bs:'掌握答题规律，精准技巧提升', bg:'linear-gradient(120deg,#DCEBFF,#B9D5FF)', c:'#2456C4', need:'code'},
 {id:'sync',  n:'技巧同步课', s:'初一初二、高一高二同步课技巧提升', b:'技巧同步课', bs:'专注于初一初二、高一高二', bg:'linear-gradient(120deg,#FFEAD3,#FFD7A6)', c:'#C77817', need:'code'},
 {id:'tong',  n:'课课通', s:'初高中非毕业班考试思维植入', b:'承前启后，高效突破', bs:'同步学校框架，升维考点思维', bg:'linear-gradient(120deg,#EAE1FF,#D6C7FF)', c:'#6A5CFF', need:'teacher'},
];
const SETUP_PAGES={1:null,2:null,3:null};
function replacePage(fn, dir){ if(stack.length) stack.pop(); pushPage(fn, dir||'fwd'); }

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
    <p class="sub" style="line-height:1.75;margin-top:6px">${c.need==='teacher'?'课课通需由报名老师后台开通，请向老师索取激活码后在此输入。':'本类课程支持输入激活码自助开通（演示激活码：JQ2026）。'}<br>激活后自动生成伴学群二维码，完成 3 步信息采集后由 AI 生成专属课程表。</p>
  </div>
  ${U.activated&&U.setupStep>0&&U.setupStep<4?`<div class="card" style="background:var(--blue-bg);border-color:#CFE0FF"><h4>信息采集进行中 · 第 ${U.setupStep}/3 步</h4><button class="btn" style="margin-top:10px" onclick="pushPage(SETUP_PAGES[U.setupStep])">继续填写</button></div>`:''}
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
  if(U.activatedSubjects.includes(key)){ pushPage(pageCoursePlay); return; }
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
  U.activated=true; U.activeCourse=id; U.activeSubject=key;
  if(!U.setupStep) U.setupStep=1;
  toast('激活成功！伴学群二维码已生成');
  goTab('courses');
  pushPage(SETUP_PAGES[U.setupStep]);
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

/* ---------- 三步信息采集：通用框架 ---------- */
function setupFrame(step, title, body, foot, extraTop){
  return `<div class="setup-topbar">
    <div class="st-nav"><button class="sb" onclick="setupBack(${step})"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><b>专属课程表</b></div>
    <div class="st-ttl"><b>${title}</b><span>(${step}/3)</span></div>
  </div>
  <div class="setup-body">${extraTop||''}<div class="setup-card">${body}</div></div>
  <div class="setup-foot">${foot}</div>`;
}
function setupBack(step){
  if(step===1){ goTab('courses'); return; }
  U.setupStep=step-1; replacePage(SETUP_PAGES[step-1],'back');
}
const SETUP_OPTS={
  schoolProgress:['同步校内进度','略快于学校进度','一轮复习中','二轮复习中','暂时落后于学校进度'],
  textbook:['人教版','部编版','北师大版','苏教版','沪教版','外研版'],
  nextExam:['月考','期中考试','期末考试','一模','二模','升学考试'],
  plannerTime:['工作日晚上 19:00-21:00','周末上午 09:00-11:00','周末下午 14:00-17:00','暂不预约，等老师联系'],
};
const SETUP_LABEL={schoolProgress:'学校进度',textbook:'教材版本',nextExam:'下次考试',plannerTime:'规划师预约时间'};
function sfBox(key,label,req,ph){
  const v=U.setup[key];
  return `<div class="sf"><label>${label}${req?'<em>*</em>':''}</label>
    <div class="sfbox ${v?'on':''}" id="sf-${key}" onclick="setupPick('${key}')"><span class="txt" id="sft-${key}">${v||ph}</span>${arw()}</div></div>`;
}
function pageSetup1(){
  const s=U.setup;
  const tip=`<div class="card" style="background:var(--green-bg);border-color:#CDEEDC;padding:10px 12px;margin-bottom:10px;display:flex;align-items:center;gap:8px;cursor:pointer" onclick="openGroup()">
    <span style="font-size:16px">✅</span><div style="flex:1"><b style="font-size:12.5px">伴学群二维码已自动生成</b><div style="font-size:11px;color:var(--ink3)">学生 / 家长 / 报名老师 / 学管规划师可选</div></div><span style="font-size:12px;color:var(--blue);font-weight:700">查看 ›</span></div>`;
  return setupFrame(1,'完善个人信息',`
    ${sfBox('schoolProgress','学校进度',true,'请选择学校进度')}
    ${sfBox('textbook','教材版本',true,'请选择教材版本')}
    ${sfBox('nextExam','下次考试',true,'请选择下次考试')}
    ${sfBox('nextExamTime','下次考试时间',true,'请选择下次考试时间')}
    <div class="sf"><label>当前科目分数<em>*</em></label>
      <div class="sfbox ${s.subjectScore?'on':''}"><input id="sf-score" type="number" placeholder="请输入当前科目分数" value="${s.subjectScore}" oninput="U.setup.subjectScore=this.value;this.parentNode.classList.add('on')"><span class="unit">分</span></div></div>
    ${sfBox('plannerTime','规划师预约时间',false,'请选择规划师预约时间')}
    <div class="sf"><label>预约备注</label>
      <div class="sfbox ${s.remark?'on':''}"><textarea id="sf-remark" placeholder="请输入预约备注" oninput="U.setup.remark=this.value;this.parentNode.classList.add('on')">${s.remark}</textarea></div></div>
    <div style="height:2px"></div>
  `,`<button class="btn" onclick="setup1Next()">下一步（1/3）</button>`, tip);
}
function setupPick(key){
  if(key==='nextExamTime'){ setupDate(); return; }
  const opts=SETUP_OPTS[key]||[];
  openModal(`<h4>选择${SETUP_LABEL[key]||''}</h4><div class="optlist">
    ${opts.map(o=>`<button class="${U.setup[key]===o?'on':''}" onclick="setupSet('${key}',this)">${o}</button>`).join('')}
  </div>`);
}
function setupSet(key,el){
  U.setup[key]=el.textContent.trim();
  const t=document.getElementById('sft-'+key), b=document.getElementById('sf-'+key);
  if(t) t.textContent=U.setup[key]; if(b) b.classList.add('on');
  closeModal();
}
function setupDate(){
  openModal(`<h4>选择下次考试时间</h4><p class="sub">请选择考试日期</p>
  <input class="input" id="sf-date" type="date" value="${U.setup.nextExamTime||''}" style="margin:12px 0">
  <button class="btn" onclick="setupDateSave()">确定</button>`);
}
function setupDateSave(){
  const v=document.getElementById('sf-date').value;
  if(!v){ toast('请选择考试日期'); return; }
  U.setup.nextExamTime=v;
  const t=document.getElementById('sft-nextExamTime'), b=document.getElementById('sf-nextExamTime');
  if(t) t.textContent=v; if(b) b.classList.add('on');
  closeModal();
}
function setup1Next(){
  const s=U.setup;
  const r=document.getElementById('sf-remark'); if(r) s.remark=r.value.trim();
  const sc=document.getElementById('sf-score'); if(sc) s.subjectScore=sc.value;
  if(!s.schoolProgress){ toast('请选择学校进度'); return; }
  if(!s.textbook){ toast('请选择教材版本'); return; }
  if(!s.nextExam){ toast('请选择下次考试'); return; }
  if(!s.nextExamTime){ toast('请选择下次考试时间'); return; }
  if(!s.subjectScore||+s.subjectScore<=0){ toast('请输入当前科目分数'); return; }
  U.setupStep=2; replacePage(pageSetup2); toast('个人信息已保存');
}

/* ---------- 第二步：能力自评 ---------- */
const SELF_EVAL=[
 {t:'字音与字形', tags:['字形','字音','多音字','形近字','易错字']},
 {t:'词语的理解与运用', tags:['词的构成','词义','词语的色彩','熟语','词语的来源','词类的划分']},
 {t:'语言的表达与运用', tags:['仿写句子','压缩语段','语段图表','选用句式','句子排序','拟广告词','材料阅读','巧用修辞','扩写改写续写']},
 {t:'病句的辨析与修改', tags:['基本题型','辨析方法','常见病因','修改原则']},
];
function starText(n){ return n>=9?'完全掌握，可适当拔高':n>=7?'比较擅长，只需规划重点知识':n>=4?'基本掌握，需要巩固':'没有掌握，重点规划'; }
function pageSetup2(){
  return setupFrame(2,'自我评价',`
    <p style="font-size:11.5px;color:var(--ink3);margin:-2px 0 12px">根据系统提供的知识模块进行自我评价，算法将据此定位问题与知识漏洞</p>
    ${SELF_EVAL.map((e,i)=>`<div class="sev" id="sev-${i}">
      <h5>${i+1}. ${e.t}</h5>
      <div class="ktags">${e.tags.map(t=>`<span class="ktag">${t}</span>`).join('')}</div>
      <div class="stars" id="stars-${i}">${Array.from({length:10},(_,k)=>`<i class="${k<U.setup.stars[i]?'on':''}" onclick="setupStar(${i},${k+1})">★</i>`).join('')}</div>
      <p id="sevp-${i}">${starText(U.setup.stars[i])}</p>
    </div>`).join('')}
  `,`<button class="btn ghost" onclick="setupBack(2)">上一步</button><button class="btn" onclick="setup2Next()">下一步（2/3）</button>`);
}
function setupStar(i,n){
  U.setup.stars[i]=n;
  const box=document.getElementById('stars-'+i);
  [...box.children].forEach((c,k)=>c.classList.toggle('on',k<n));
  document.getElementById('sevp-'+i).textContent=starText(n);
}
function setup2Next(){ U.setupStep=3; replacePage(pageSetup3); }

/* ---------- 第三步：学情提交 ---------- */
function pageSetup3(){
  const s=U.setup;
  return setupFrame(3,'学情提交',`
    <div class="stepsec"><span class="no">01</span><b>选择学情测评方式</b><em>*</em></div>
    <div class="scard ${s.uploadCount?'done':''}" id="sc-upload">
      <div class="si">${IC.doc}</div>
      <div class="st"><b>上传试卷</b><small>${s.uploadCount?'已上传 '+s.uploadCount+' 张试卷图片':'完成对应学科标准化测评试题'}</small></div>
      <button class="smini" onclick="event.stopPropagation();setupUpload()">${s.uploadCount?'继续上传':'上传图片'}</button>
    </div>
    <div class="scard ${s.analysisDone?'done':''}" id="sc-analysis" onclick="setupAnalysis()">
      <div class="si">${IC.chart}</div>
      <div class="st"><b>学情分析</b><small>${s.analysisDone?'答题完成 · 已生成学情分析':'完成对应学科标准化测评试题'}</small></div>${arw()}
    </div>
    <div class="stepsec" style="margin-top:18px"><span class="no">02</span><b>学习时间（必选）</b><em>*</em></div>
    <div class="scard ${s.studyTime?'done':''}" id="sc-time" onclick="pushPage(pageSetupTime)">
      <div class="si">7</div>
      <div class="st"><b>填写学习时间</b><small>${s.studyTime?'未来 30 天已规划 · '+s.studyDays+' · '+s.studyTime:'完成学习时间相关内容填写'}</small></div>${arw()}
    </div>
    <div style="height:6px"></div>
  `,`<button class="btn" onclick="setupSubmit()">提交（3/3）</button>`);
}
function setupUpload(){
  U.setup.uploadCount++; U.setup.evalMethod='upload';
  const c=document.getElementById('sc-upload'); c.classList.add('done');
  c.querySelector('.st small').textContent='已上传 '+U.setup.uploadCount+' 张试卷图片';
  c.querySelector('.smini').textContent='继续上传';
  toast('已模拟上传试卷图片，AI 正在识别');
}
function setupAnalysis(){
  openModal(`<h4>学情分析 · 在线答题</h4><p class="sub">完成对应学科标准化测评试题，系统将定位知识漏洞</p>
  <div style="background:var(--blue-bg);border-radius:12px;padding:12px;margin:12px 0;font-size:12.5px;color:var(--ink2);line-height:1.9">
    测评范围：${U.setup.textbook||'当前教材'} · ${U.setup.nextExam||'下次考试'}<br>题量：10 题 · 预计 5 分钟
  </div>
  <button class="btn" onclick="setupAnalysisDone()">完成测评</button>`);
}
function setupAnalysisDone(){
  U.setup.analysisDone=true; U.setup.evalMethod=U.setup.evalMethod||'analysis';
  closeModal();
  const c=document.getElementById('sc-analysis');
  if(c){ c.classList.add('done'); c.querySelector('.st small').textContent='答题完成 · 已生成学情分析'; }
  toast('学情分析已完成');
}
function setupSubmit(){
  const s=U.setup;
  if(!s.evalMethod&&!s.analysisDone){ toast('请选择学情测评方式（上传试卷或学情分析）'); return; }
  if(!s.studyTime){ toast('请填写学习时间'); return; }
  U.setupStep=4; replacePage(pageSetupDone); toast('提交成功，AI 课程规划已生成');
}

/* ---------- 学习时间：未来 30 天日历打卡 ---------- */
const TIME_SLOTS=[0,1,2,3];
function pageSetupTime(){
  const now=new Date(), y=now.getFullYear(), m=now.getMonth();
  const first=new Date(y,m,1).getDay(), days=new Date(y,m+1,0).getDate();
  const sel=U.setup.dayPlan||{};
  let cells='';
  for(let i=0;i<first;i++) cells+='<div></div>';
  for(let d=1;d<=days;d++){
    const h=sel[d]||0;
    cells+=`<div class="tday ${h?'on':''}" onclick="toggleDay(${d})"><b>${d}</b><span>${h?h+'h':'—'}</span></div>`;
  }
  const cnt=Object.values(sel).filter(v=>v>0).length, total=Object.values(sel).reduce((a,b)=>a+b,0);
  return head('学习时间规划 - 日历打卡')+`
  <div class="card" style="padding:12px">
    <div class="segs" style="margin-bottom:12px">
      <span class="seg" onclick="toast('历史打卡记录：暂无')">历史</span>
      <span class="seg on" onclick="toast('点击日期即可设置当日学习时长')">+ 选择学习时间</span>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <b style="font-size:13.5px">${y} 年 ${m+1} 月</b><span style="font-size:11.5px;color:var(--ink3)">未来 30 天可规划</span>
    </div>
    <div class="tdgrid">${['日','一','二','三','四','五','六'].map(w=>`<div class="tw">${w}</div>`).join('')}${cells}</div>
    <div style="display:flex;gap:12px;font-size:11px;color:var(--ink3);margin-top:10px">
      <span>🟢 已选 <b id="td-cnt">${cnt}</b> 天</span><span>🕒 总时长 <b id="td-total">${total}</b> 小时</span>
    </div>
  </div>
  <div class="card">
    <h4>学习提醒</h4><p class="sub">规划师可现在致电提醒学习</p>
    <div class="segs" style="margin-top:12px" id="td-remind">
      <span class="seg ${U.setup.callRemind!=='否'?'on':''}" onclick="modalSeg(this)">现在致电提醒</span>
      <span class="seg ${U.setup.callRemind==='否'?'on':''}" onclick="modalSeg(this)">暂不提醒</span>
    </div>
  </div>
  <button class="btn" onclick="saveTimePlan()">保存学习时间</button>`;
}
function modalSeg(el){ [...el.parentNode.children].forEach(c=>c.classList.remove('on')); el.classList.add('on'); }
function toggleDay(d){
  U.setup.dayPlan=U.setup.dayPlan||{};
  const cur=U.setup.dayPlan[d]||0;
  U.setup.dayPlan[d]=cur>=3?0:cur+1;
  const el=event.currentTarget, h=U.setup.dayPlan[d];
  el.classList.toggle('on',h>0); el.querySelector('span').textContent=h?h+'h':'—';
  const vals=Object.values(U.setup.dayPlan);
  document.getElementById('td-cnt').textContent=vals.filter(v=>v>0).length;
  document.getElementById('td-total').textContent=vals.reduce((a,b)=>a+b,0);
}
function saveTimePlan(){
  const plan=U.setup.dayPlan||{}, vals=Object.values(plan);
  const cnt=vals.filter(v=>v>0).length, total=vals.reduce((a,b)=>a+b,0);
  if(!cnt){ toast('请至少选择 1 天学习时间'); return; }
  const r=document.querySelector('#td-remind .seg.on');
  U.setup.callRemind=r&&r.textContent.includes('暂不')?'否':'是';
  U.setup.studyDays=cnt+' 天'; U.setup.studyTime='共 '+total+' 小时';
  U.setup.planSaved=true;
  popPage(); toast('未来 30 天学习时间已保存'+(U.setup.callRemind==='是'?'，将致电提醒':''));
}

/* ---------- 完成：AI 课程规划 + 专属课程表 ---------- */
function pageSetupDone(){
  const s=U.setup, avg=(s.stars.reduce((a,b)=>a+b,0)/s.stars.length).toFixed(1);
  return `<div class="setup-topbar">
    <div class="st-nav"><button class="sb" onclick="goTab('home')"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><b>专属课程表</b></div>
    <div class="st-ttl"><b>AI 课程规划已生成</b><span>完成</span></div>
  </div>
  <div class="setup-body">
    <div class="card" style="margin-bottom:10px">
      <h4>① 学情摘要</h4>
      ${[['学校进度',s.schoolProgress],['教材版本',s.textbook],['下次考试',(s.nextExam||'—')+' · '+(s.nextExamTime||'—')],['当前科目分数',(s.subjectScore||'—')+' 分'],['能力自评均分',avg+' / 10'],['学习时间',(s.studyDays||'—')+' · '+(s.studyTime||'—')]].map(([k,v])=>`<div class="cell" style="padding:9px 2px"><div class="ct"><b style="font-size:12px;color:var(--ink2);font-weight:600">${k}</b></div><span style="font-size:12.5px;font-weight:700">${v||'—'}</span></div>`).join('')}
    </div>
    <div class="card" style="margin-bottom:10px">
      <h4>② AI 课程规划</h4>
      <p class="sub">按知识漏洞定制 · 每周 3 节技巧课 + 1 次直播</p>
      <div class="sched" style="margin-top:12px">
        ${['周一','周二','周三','周四','周五'].map((d,i)=>`<div class="sc ${i<3?'on':''}"><b>${d}</b><span>${i<3?'技巧课':'休息'}</span></div>`).join('')}
      </div>
      <div style="margin-top:12px;font-size:12px;color:var(--ink2);line-height:2">
        <div>✅ 信息采集完成 · 已定位重点知识模块</div>
        <div>✅ 能力自评完成 · 已生成知识漏洞图谱</div>
        <div>✅ 学情测评完成 · 个性化教材排期中</div>
      </div>
    </div>
    <div class="card" style="margin-bottom:10px">
      <h4>③ 后续服务</h4>
      <div class="cell" onclick="pushPage(pageTextbook)"><div class="ci" style="background:#F1EFFA;color:#7A5CD6">${IC.book}</div><div class="ct"><b>个性化教材</b><small>可查看 / 打印电子教材</small></div>${arw()}</div>
      <div class="cell" onclick="openGroup()"><div class="ci" style="background:var(--green-bg);color:#27A566">${IC.people}</div><div class="ct"><b>伴学群</b><small>身份确认后进群领资料</small></div>${arw()}</div>
    </div>
  </div>
  <div class="setup-foot">
    <button class="btn ghost" onclick="openGroup()">伴学群</button>
    <button class="btn" onclick="pushPage(pageCoursePlay)">进入课程学习</button>
  </div>`;
}
SETUP_PAGES[1]=pageSetup1; SETUP_PAGES[2]=pageSetup2; SETUP_PAGES[3]=pageSetup3;

function playChap(i){
  const c=CHAPTERS[i];
  openModal(`<h4>${c.t}</h4><p class="sub">${c.d}</p>
  <div style="height:150px;border-radius:14px;margin:12px 0;background:linear-gradient(135deg,#2F3A4E,#4A5A78);display:flex;align-items:center;justify-content:center;color:#fff">
    <div style="text-align:center"><div style="font-size:34px">▶</div><div style="font-size:11px;opacity:.8;margin-top:4px">${c.p===0?'开始学习':c.p===100?'重新观看':'继续学习 · '+c.p+'%'}</div></div>
  </div>
  <button class="btn" onclick="closeModal();courseChapter=${i};pushPage(pageCoursePlay);toast('已切换：${c.t}（演示）')">进入播放页</button>`);
}
let courseChapter=2;
function pageCoursePlay(){
  const current=CHAPTERS[courseChapter]||CHAPTERS[2];
  return head('课程播放')+`
  <div class="course-player-layout">
    <div class="course-player-main">
      <div class="course-video" aria-label="课程视频演示占位">
        <span class="course-video-tag">试听模式 · 演示画面</span>
        <div class="course-video-center"><button type="button" class="course-video-play" aria-label="播放" onclick="toast('演示页面未接入视频')">▶</button><p>${current.t}</p></div>
        <div class="course-video-bar"><div class="course-video-track"><i style="width:${current.p}%"></i></div><div class="course-video-controls"><span>▶</span><span>进度 ${current.p}%</span><span class="course-video-spacer"></span><span>演示播放器</span></div></div>
      </div>
      <section class="course-player-detail"><h2>${current.t}</h2><p class="course-player-meta">张老师 · 中考数学技巧课 · 共 5 章 41 讲</p>
        <div class="course-player-tabs" role="tablist" aria-label="课程信息"><button type="button" role="tab" aria-selected="true" onclick="coursePlayerTab(0)">课程简介</button><button type="button" role="tab" aria-selected="false" onclick="coursePlayerTab(1)">学习提示</button><button type="button" role="tab" aria-selected="false" onclick="coursePlayerTab(2)">课程评价</button></div>
        <div class="course-player-tabbody" id="course-player-tabbody"><h3>关于本课程</h3><p>中考数学技巧课 · 共 5 章 41 讲 · 搭配点星笔随堂作答</p></div>
      </section>
    </div>
    <aside class="course-player-sidebar"><div class="course-player-sidehead"><h2>课程目录</h2><p>共 5 章 41 讲</p></div><div class="course-player-section">课程章节</div><div class="course-player-lessons">
      ${CHAPTERS.map((c,i)=>`<button type="button" class="course-player-lesson ${i===courseChapter?'on':''}" ${i===courseChapter?'aria-current="true"':''} onclick="selectCourseChapter(${i})"><span class="course-player-num">${i+1}</span><span class="course-player-text"><b>${c.t}</b><small>${c.d}</small></span><span class="course-player-mark">${i===courseChapter?'当前':c.p===100?'✓':''}</span></button>`).join('')}
    </div><p class="course-player-foot">当前为演示页面，尚未接入视频播放。</p></aside>
  </div>`;
}
function selectCourseChapter(i){
  if(!CHAPTERS[i]) return;
  courseChapter=i; refresh(); toast('已切换章节（演示）');
}
function coursePlayerTab(i){
  const tabs=document.querySelectorAll('.course-player-tabs [role="tab"]');
  const body=document.getElementById('course-player-tabbody');
  if(!body||i<0||i>2) return;
  tabs.forEach((tab,n)=>tab.setAttribute('aria-selected',String(n===i)));
  body.innerHTML=[
    '<h3>关于本课程</h3><p>中考数学技巧课 · 共 5 章 41 讲 · 搭配点星笔随堂作答</p>',
    '<h3>随堂学习</h3><p>可搭配点星笔进行随堂作答，书写痕迹实时上传给老师批阅。</p>',
    '<h3>课程评价</h3><p class="course-player-rating">★★★★★　4.9</p><p>“讲得特别清楚，二次函数那章看完月考直接多了 8 分，点星笔写完自动上传，老师还会批改。”</p><p>— 初三 林同学 · 家长已确认</p>'
  ][i];
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
  <div class="discover-detail-intro"><h2>选择题库</h2><p class="sub">三大题库 · 作答后自动批改并计入答题记录</p></div>
  <div class="paper-choices">
  ${Object.entries(PAPERS).map(([k,p])=>`
  <div class="card paper-choice" style="cursor:pointer" onclick="startPaper('${k}')">
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:52px;height:52px;border-radius:14px;flex:none;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:15px;${k==='mock'?'background:linear-gradient(135deg,#4C86FF,#2F66E0)':k==='sync'?'background:linear-gradient(135deg,#34C77B,#1E9E5C)':'background:linear-gradient(135deg,#FFB13A,#F26B1D)'}">${p.name[0]}</div>
      <div style="flex:1"><b style="font-size:15px">${p.name}</b><small style="display:block;color:var(--ink3);font-size:11.5px;margin-top:3px">${p.desc}</small></div>${arw()}
    </div>
  </div>`).join('')}</div>
  <div class="card paper-method"><h4>答题方式</h4><p class="sub">支持文字输入、点星笔手写、拍照上传三种作答方式，点星笔书写痕迹实时上传给老师批阅</p></div>`;
}
function startPaper(k){
  S.paper=k; S.idx=0; S.ans={}; S.done=false; S.m='text'; hwStrokes=0;
  pushPage(pageExam);
}
function pageExam(){
  const q=Q[S.idx], p=PAPERS[S.paper];
  const answered=Object.keys(S.ans).length;
  return head(p.name, `<span id="q-count" style="font-size:12px;color:var(--ink3)" onclick="openSheet()">答题卡 ${answered}/${Q.length}</span>`)+`
  <div class="qbar">第 <b>${S.idx+1}</b> 题 / 共 ${Q.length} 题 · ${q.type==='single'?'单选题':q.type==='fill'?'填空题':'解答题'}</div>
  <div class="stem">${q.stem}</div>
  ${q.opts? q.opts.map((o,i)=>`<div class="opt ${S.ans[q.id]===i?'on':''}" onclick="pickOpt(this,${i})"><span class="ol">${'ABCD'[i]}</span>${o}</div>`).join('') : `<div id="ans-area">${ansArea()}</div>`}
  <div style="display:flex;gap:9px;margin-top:16px">
    ${S.idx>0?'<button class="btn ghost" style="flex:1" onclick="S.idx--;refresh()">上一题</button>':''}
    ${S.idx<Q.length-1?'<button class="btn" style="flex:2" onclick="nextQ()">下一题</button>':'<button class="btn green" style="flex:2" onclick="submitPaper()">交卷并评分</button>'}
  </div>
  <div class="dots" style="margin-top:14px">${Q.map((_,i)=>`<i class="${i===S.idx?'on':''}"></i>`).join('')}</div>`;
}
/* 非选择题的作答区：切换作答方式时只重绘这一块，不整页刷新 */
function ansArea(){
  const q=Q[S.idx];
  return `<div class="field"><label>作答方式</label>
      <div class="segs">
        ${[['text','文字输入'],['pen','点星笔手写'],['photo','拍照上传']].map(([k,t])=>`<span class="seg ${S.m===k?'on':''}" onclick="S.m='${k}';swapAns()">${t}</span>`).join('')}
      </div>
    </div>
    ${S.m==='text'?`<input class="input" id="fill-ans" placeholder="输入作答内容" value="${String(S.ans[q.id]||'').replace(/"/g,'&quot;')}" oninput="S.ans[${q.id}]=this.value">`:''}
    ${S.m==='pen'?`<canvas id="hw" width="500" height="300"></canvas><div style="display:flex;gap:8px;margin-top:8px"><button class="btn ghost sm" onclick="clearHw()">清空</button><span style="font-size:11px;color:var(--ink3);align-self:center">点星笔书写痕迹将实时上传</span></div>`:''}
    ${S.m==='photo'?`<div class="answerbox" onclick="toast('已模拟拍照上传，AI 识别作答内容')"><div style="text-align:center;color:var(--ink3);font-size:12.5px;padding:8px 0">${IC.camera.replace('<svg','<svg style="width:26px;height:26px;fill:none;stroke:#9AA3B0;stroke-width:1.7"')}<br>点击拍照上传作答</div></div>`:''}`;
}
function swapAns(){
  const box=document.getElementById('ans-area');
  if(!box) return;
  box.innerHTML=ansArea();
  if(S.m==='pen') initHw();
}
function pickOpt(el,i){
  const q=Q[S.idx]; S.ans[q.id]=i;
  const box=el.parentNode;
  [...box.children].forEach(c=>c.classList.remove('on'));
  el.classList.add('on');
  const cnt=document.getElementById('q-count');
  if(cnt) cnt.textContent='答题卡 '+Object.keys(S.ans).length+'/'+Q.length;
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
    const ok = q.opts ? a===q.ans : (a!==undefined && String(a).replace(/\s/g,'')===q.ans.replace(/\s/g,''));
    if(ok) right++;
    const exist=S.records.find(r=>r.q===q.id);
    if(exist){ exist.ok=ok; exist.d='11-10'; } else S.records.push({d:'11-10', q:q.id, ok, kp:q.kp});
  });
  U.hours.today=+(U.hours.today+0.5).toFixed(1); U.hours.week=+(U.hours.week+0.5).toFixed(1); U.hours.total=+(U.hours.total+0.5).toFixed(1);
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
      const ok=q.opts?a===q.ans:(a!==undefined&&String(a).replace(/\s/g,'')===q.ans.replace(/\s/g,''));
      return `<div class="cell" onclick="S.idx=${i};pushPage(pageAnalysis)">
        <div class="ci" style="background:${ok?'var(--green-bg)':'var(--red-bg)'};color:${ok?'#1E9E5C':'#E4574F'}">${ok?IC.check:IC.pen}</div>
        <div class="ct"><b>第 ${i+1} 题 · ${ok?'回答正确':'回答错误'}</b><small>考点：${q.kp} · 点击查看解析</small></div>${arw()}</div>`;
    }).join('')}
  </div>
  <button class="btn lite" onclick="popPage();popPage();goTab('discover')">返回</button>`;
}
function pageAnalysis(){
  const q=Q[S.idx];
  const a=S.ans[q.id];
  const ok=q.opts?a===q.ans:(a!==undefined&&String(a).replace(/\s/g,'')===q.ans.replace(/\s/g,''));
  return head('题目解析')+`
  <div class="qbar">第 <b>${S.idx+1}</b> 题 · <span class="tag ${ok?'green':'red'}">${ok?'回答正确':'回答错误'}</span></div>
  <div class="stem">${q.stem}</div>
  ${q.opts?q.opts.map((o,i)=>`<div class="opt ${i===q.ans?'ok':(a===i?'bad':'')}"><span class="ol">${'ABCD'[i]}</span>${o}</div>`).join(''):
    `<div class="ana"><div class="al"><span class="dot"></span>你的作答</div><p>${a!==undefined&&a!==''?String(a):'（未作答）'}</p></div>
     <div class="ana"><div class="al"><span class="dot" style="background:var(--green)"></span>正确答案</div><p>${q.ans}</p></div>`}
  <div class="ana"><div class="al"><span class="dot"></span>解析</div><p>${q.ana}</p></div>
  <div class="ana" style="display:flex;align-items:center;gap:8px"><div class="al" style="margin:0"><span class="dot" style="background:var(--gold)"></span>考点</div><span class="tag blue">${q.kp}</span><span class="spacer" style="flex:1"></span><span style="font-size:11.5px;color:var(--ink3);cursor:pointer" onclick="toast('已举报，老师会尽快核实')">举报</span></div>
  <div style="display:flex;gap:9px;margin-top:14px">
    ${S.idx>0?'<button class="btn ghost" style="flex:1" onclick="S.idx--;refresh()">上一题</button>':''}
    ${S.idx<Q.length-1?'<button class="btn" style="flex:1" onclick="S.idx++;refresh()">下一题</button>':'<button class="btn" style="flex:1" onclick="popPage()">返回结果</button>'}
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
function pageAiTest(){
  return head('AI 测评')+`
  <section class="ai-assessment" aria-label="AI 测评">
    <div class="ai-assessment-intro"><h2>了解学习情况，找到薄弱知识点</h2><p>选择测评卷作答，完成后可查看测评讲评课。</p></div>
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
  return head(T.paper, `<span id="ai-count" style="font-size:12px;color:var(--ink3)" onclick="toast('AI 测评不可回退修改已交答案')">答题卡 ${Object.keys(T.ans).length}/${T.n}</span>`)+`
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
  <button class="btn lite" onclick="popPage();popPage()">返回测评列表</button>`;
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
  U.checkins.unshift({date:String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0'), txt, imgs:ckImgs});
  U.hours.today=+(U.hours.today+0.2).toFixed(1); U.hours.week=+(U.hours.week+0.2).toFixed(1); U.hours.total=+(U.hours.total+0.2).toFixed(1);
  ckImgs=0; refresh(); toast('打卡成功，已同步给伴学老师');
}
function pageStudyLog(){
  return head('学习记录')+`
  <div class="course-hero">
    <b>今日学习 ${(U.hours.today).toFixed(1)} 小时</b>
    <p>坚持每天学习，向目标考试时间冲刺</p>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
    <div class="card" style="margin:0;text-align:center"><div style="font-size:11.5px;color:var(--ink3)">本周学习时长</div><b style="font-size:22px;color:var(--blue)">${(U.hours.week).toFixed(1)}<span style="font-size:12px"> 小时</span></b></div>
    <div class="card" style="margin:0;text-align:center"><div style="font-size:11.5px;color:var(--ink3)">合计时长</div><b style="font-size:22px;color:var(--blue)">${(U.hours.total).toFixed(1)}<span style="font-size:12px"> 小时</span></b></div>
  </div>
  <div class="card"><h4>时长构成</h4>
    ${[['课程学习',46],['练习答题',30],['AI 测评',14],['答疑',10]].map(([k,v])=>`<div class="sbar"><div class="srow"><b>${k}</b><div class="track"><i style="width:${v}%"></i></div><span>${v}%</span></div></div>`).join('')}
  </div>
  <div class="card"><h4>今日明细</h4>
    ${U.hours.today>0?`<div class="cell"><div class="ci" style="background:var(--blue-bg);color:var(--blue)">${IC.pen}</div><div class="ct"><b>练习答题 +30 分钟</b><small>模拟测试卷 · ${S.result?S.result.right:2} 题正确</small></div></div>
    ${U.checkins.length?`<div class="cell"><div class="ci" style="background:var(--green-bg);color:#27A566">${IC.check}</div><div class="ct"><b>学习打卡 +12 分钟</b><small>${U.checkins[0].txt.slice(0,16)}…</small></div></div>`:''}`
    :'<div class="empty">今天还没有学习记录<br>去「试卷」或「学习打卡」积累学时吧</div>'}
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
      <span style="font-size:12px">${Object.entries(U.scores).map(([k,v])=>`<span class="tag blue" style="margin-left:4px">${k} ${v}</span>`).join('')}</span></div>
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
function pageScores(){
  return head('成绩总览')+`
  <div class="card"><h4>成绩走势</h4><p class="sub">大考成绩折线 · ${U.scoresHis.length} 次记录</p>
    <div style="margin-top:8px">${lineChart(U.scoresHis, 340, 180)}</div>
  </div>
  <div class="card"><h4>历次成绩</h4>
    ${U.scoresHis.slice().reverse().map(s=>`<div class="cell"><div class="ct"><b>${s.m}</b><small>总分 100 · 年级排名 ${120-s.v} 名</small></div><b style="font-size:17px;color:var(--blue)">${s.v}</b></div>`).join('')}
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
  const v=+document.getElementById('sc-val').value;
  if(!v||v<0||v>100){ toast('请输入 0-100 的分数'); return; }
  U.scoresHis.push({m:n, v}); closeModal(); refresh(); toast('成绩已录入，学情档案已更新');
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
    ${wrongs.length?wrongs.map(r=>{ const q=Q.find(x=>x.id===r.q);
      return `<div class="cell" onclick="S.idx=Q.findIndex(x=>x.id===${r.q});pushPage(pageAnalysis)"><div class="ci" style="background:var(--red-bg);color:#E4574F">${IC.pen}</div><div class="ct"><b>${q?q.stem.slice(0,14)+'…':'第 '+r.q+' 题'}</b><small>${r.d} · ${r.kp}${r.re?' · 已重做':''}</small></div><button class="btn sm lite" onclick="event.stopPropagation();markRedo(${r.q})">重做</button></div>`;}).join('')
    :'<div class="empty">太棒了，暂无错题！</div>'}
  </div>`;
}
function markRedo(qid){
  const r=S.records.find(x=>x.q===qid);
  if(r && !r.re){ r.re=true; toast('已加入重做队列，完成解析后自动更新'); refresh(); }
  else toast('该题已在重做队列中');
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
function pagePlan(){
  return head('规划之路')+`
  <div class="card" style="background:linear-gradient(135deg,#6A5CFF,#3D7EFF);border:0;color:#fff">
    <b style="font-size:16px">AI 课程规划 · 30 天冲刺方案</b>
    <p style="font-size:12px;opacity:.85;margin-top:4px">基于测评报告 + 目标考试时间自动生成</p>
  </div>
  <div class="card"><h4>规划时间线</h4>
    ${[['第 1 周','补几何漏洞：圆的证明专项（配套教材第 1-3 篇）','done'],['第 2 周','化学方程式配平 + 每日 20 分钟早读','done'],['第 3 周','数学压轴题突破 + 周六直播串讲','doing'],['第 4 周','全真模考 2 轮 + 考前心态调整','todo']].map(([w,t,st],i)=>`
    <div class="cell"><div class="ci" style="background:${st==='done'?'var(--green-bg)':st==='doing'?'var(--blue-bg)':'#F1F2F5'};color:${st==='done'?'#27A566':st==='doing'?'var(--blue)':'#9AA3B0'}">${st==='done'?IC.check:st==='doing'?IC.clock:IC.plan}</div>
    <div class="ct"><b>${w}</b><small>${t}</small></div><span class="tag ${st==='done'?'green':st==='doing'?'blue':'gray'}">${st==='done'?'已完成':st==='doing'?'进行中':'待开始'}</span></div>`).join('')}
  </div>
  <div class="card"><h4>规划师跟进</h4>
    <div class="cell"><div class="ci" style="background:var(--orange-bg);color:#E8862C">${IC.people}</div><div class="ct"><b>李规划师 · 每周致电回访</b><small>下次回访：周四 19:00（可修改）</small></div><button class="btn sm lite" onclick="toast('已提醒规划师，将按约定时间致电')">提醒</button></div>
  </div>`;
}

/* ================= 左侧导航 ================= */
const MODS=[
  ['M1 注册建档','验证码登录 → 完善信息（建档）→ 退出登录', 'login'],
  ['M2 课程学习','三种课程 → 各自科目课程列表 → 选科目输激活码 JQ2026 → 完善个人信息/自评/学情 3 步 → AI 课程规划', 'courses'],
  ['M3 练习测评','试卷 → 答题（三种作答）→ 解析 → 答题卡日历', 'practice'],
  ['M3 AI 测评','测评命题 → 作答 → AI 报告（雷达图/漏洞）', 'aitest'],
  ['M4 答疑服务','AI 先行答疑 → 一键转人工 → 答疑记录', 'qa'],
  ['M5 学情伴学','学习打卡 / 学习记录 / 成绩总览 / 学生档案', 'discover'],
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
  else if(k==='discover') goTab('discover');
  else if(k==='home') goTab('home');
  else if(k==='practice'){ goTab('discover'); pushPage(pagePapers); }
  else if(k==='aitest'){ goTab('home'); pushPage(pageAiTest); }
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
function persist(){
  try{ localStorage.setItem(STORE_KEY, JSON.stringify({U,S,CHAT})); }catch(e){}
}
function restore(){
  try{
    const raw=localStorage.getItem(STORE_KEY); if(!raw) return;
    const d=JSON.parse(raw);
    if(d.U) Object.assign(U,d.U);
    if(d.S) Object.assign(S,d.S);
    if(d.CHAT && Array.isArray(d.CHAT.msgs)) CHAT.msgs=d.CHAT.msgs;
  }catch(e){}
}
function resetDemo(){
  try{ localStorage.removeItem(STORE_KEY); }catch(e){}
  location.hash=''; location.reload();
}

/* ---------- 登录分屏 / 应用外壳切换 ---------- */
function setAuth(on){
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
  const back='<button class="crumb-back" title="返回上一页" onclick="popPage()"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>';
  box.innerHTML=back+'<span class="crumb-root">'+parent+'</span><span class="crumb-sep">/</span><b>'+title+'</b>';
  const hasContentBack = stack.length > 0 && !!screen.querySelector('.page > .hd .backbtn, .page > .setup-topbar .sb');
  box.classList.toggle('has-back',stack.length>0 && !hasContentBack);
  box.classList.toggle('context-only',hasContentBack);
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
  if(html.indexOf('act-cover')>=0||html.indexOf('tdgrid')>=0||html.indexOf('id="ob-name"')>=0) return 'narrow';
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
    const current=stack[stack.length-1];
    if([pageQaHistory,pageStudyLog,pageArchive,pageEditInfo,pageScores,pageWrong,pageCalendar,pageCheckin].includes(current)) p.classList.add('personal-detail');
    if(current===pageStudyLog) p.classList.add('detail-study');
    if(current===pageArchive) p.classList.add('detail-archive');
    if([pagePapers,pageTextbook,pageMaterials,pageAiTest].includes(current)) p.classList.add('discover-detail');
    if(current===pagePapers) p.classList.add('detail-papers');
    if(current===pageTextbook) p.classList.add('detail-book');
    if(current===pageMaterials) p.classList.add('detail-materials');
    if(current===pageAiTest) p.classList.add('detail-ai');
    if(current===pageCoursePlay) p.classList.add('course-player-page');
  }
  updateCrumb(titleFromHTML(html),TAB_NAMES[curTab]||'考试大师');
  updateChrome();
  persist();
};
goTab=function(name){
  if(name==='courses') name='home';
  stack=[];navDir='fwd';curTab=name;setAuth(false);
  if(name==='discover') setOpenSideGroup(name);
  tabbar.querySelectorAll('.side-sub [aria-current]').forEach(button=>button.removeAttribute('aria-current'));
  const pages={home:pageHome,discover:pageDiscover,qa:pageQa,me:pageMe};
  setHTML(pages[name](),name==='qa'?'page-chat':'');
  updateCrumb(TAB_NAMES[name],'考试大师');
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
pushPage=function(fn,dir){
  navDir=dir||'fwd';stack.push(fn);setAuth(false);
  tabbar.querySelectorAll('.side-sub [aria-current]').forEach(button=>button.removeAttribute('aria-current'));
  delete $id('appShell').dataset.section;
  const html=fn();
  setHTML(html);
  updateCrumb(titleFromHTML(html),TAB_NAMES[curTab]||'考试大师');
  persist();
};
/* popPage / refresh 仍使用原型实现，内部会调用上面覆盖后的 goTab/setHTML */

/* 登录态总入口：未登录 → 分屏登录页；已登录 → 应用首页 */
demoStart=function(){
  stack=[];curTab='home';navDir='fwd';closeModal();
  tabbar.querySelectorAll('.tb').forEach(b=>b.classList.remove('on'));
  if(U.logged){ setAuth(false); goTab('home'); return; }
  setAuth(true);
  const card=$id('authCard');
  if(card) card.innerHTML=pageLogin();
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

/* 侧栏二级入口沿用各栏目原有导航路径 */
function openSidePage(tab,page){
  goTab(tab);
  const pages={
    pagePapers,pageAiTest,pageCheckin,pageLive,pageTextbook,pageMaterials,
    pageArchive,pageScores,pageWrong
  };
  if(pages[page]){
    pushPage(pages[page]);
    const button=document.querySelector('[data-side-page="'+page+'"]');
    if(button) button.setAttribute('aria-current','page');
  }
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

const sidebarToggle = $id('sideToggle');
const sidebarMedium = matchMedia('(max-width: 999px)');
function setSidebarCompact(compact){
  $id('appShell').classList.toggle('sidebar-compact', compact);
  sidebarToggle.setAttribute('aria-expanded', String(!compact));
  sidebarToggle.title = compact ? '展开侧边栏' : '收起侧边栏';
  sidebarToggle.setAttribute('aria-label', sidebarToggle.title);
}
setSidebarCompact(sidebarMedium.matches);
sidebarMedium.addEventListener('change', event => setSidebarCompact(event.matches));
sidebarToggle.addEventListener('click', () => {
  setSidebarCompact(sidebarToggle.getAttribute('aria-expanded') === 'true');
});

const authStage = $id('authStage');
const authThemes = authStage.querySelectorAll('[data-auth-theme]');
authThemes.forEach(button => {
  button.addEventListener('click', () => {
    authStage.dataset.theme = button.dataset.authTheme;
    authThemes.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
  });
});

/* ---------- 顶栏搜索（纯前端页面索引） ---------- */
const SEARCH_ITEMS=[
  {t:'首页主控台',d:'轮播 · 快捷入口 · 专属课程表',k:'首页 home 主控台 课程表',run:()=>goTab('home')},
  {t:'首页课程列表',d:'三种课程 · 查看科目 · 激活',k:'课程中心 课程 courses 技巧课 课课通',run:()=>goTab('home')},
  {t:'技巧课科目列表',d:'按升学方向与招生类型筛选',k:'科目 列表 课程详情 激活',run:()=>{goTab('courses');pushPage(()=>pageCourseDetail('skill'));}},
  {t:'课程激活',d:'输入激活码 JQ2026',k:'激活码 开通 激活课程',run:()=>{goTab('courses');pushPage(()=>pageCourseDetail('skill'));toast('点任一科目卡片进入激活页');}},
  {t:'三步信息采集',d:'完善信息 → 自我评价 → 学情提交',k:'信息采集 专属课程表 setup',run:()=>{U.activated=true;if(!U.setupStep)U.setupStep=1;goTab('courses');pushPage(SETUP_PAGES[U.setupStep]||pageSetup1);}},
  {t:'课程播放',d:'5 章 41 讲 · 章节列表',k:'播放 章节 视频 课程学习',run:()=>{goTab('courses');pushPage(pageCoursePlay);}},
  {t:'直播课堂',d:'每月 4 次 · 支持回放',k:'直播 回放 预约',run:()=>{goTab('home');pushPage(pageLive);}},
  {t:'AI 测评',d:'测评命题 · 作答 · AI 报告',k:'AI 测评 雷达图 知识漏洞',run:()=>{goTab('home');pushPage(pageAiTest);}},
  {t:'试卷',d:'模拟 / 同步 / 区域测试卷',k:'试卷 答题 练习 题库',run:()=>{goTab('discover');pushPage(pagePapers);}},
  {t:'答题卡日历',d:'打卡日期 · 已练科目进度',k:'答题记录 日历 进度',run:()=>{goTab('discover');pushPage(pageCalendar);}},
  {t:'错题记录',d:'错题归档 · 考点统计 · 重做',k:'错题 考点 重做',run:()=>{goTab('discover');pushPage(pageWrong);}},
  {t:'成绩总览',d:'成绩走势 · 录入新成绩',k:'成绩 分数 折线 排名',run:()=>{goTab('discover');pushPage(pageScores);}},
  {t:'学习打卡',d:'上传学习内容与照片',k:'打卡 图片 每日',run:()=>{goTab('discover');pushPage(pageCheckin);}},
  {t:'学习记录',d:'今日 / 本周 / 累计学时',k:'学时 时长 记录',run:()=>{goTab('discover');pushPage(pageStudyLog);}},
  {t:'学生档案',d:'基本信息 · 管理记录 · 走势',k:'档案 信息 学校 年级',run:()=>{goTab('me');pushPage(pageArchive);}},
  {t:'修改信息',d:'年级 / 学校 / 每日学习时长',k:'修改 资料 设置',run:()=>{goTab('me');pushPage(pageEditInfo);}},
  {t:'个性化教材',d:'30 篇 AI 定制讲义',k:'教材 讲义 打印',run:()=>{goTab('discover');pushPage(pageTextbook);}},
  {t:'资料领取',d:'全科资料库 · 真题 · 学霸手册',k:'资料 领取 邮寄',run:()=>{goTab('discover');pushPage(pageMaterials);}},
  {t:'规划之路',d:'30 天冲刺时间线 · 规划师跟进',k:'规划 计划 时间线',run:()=>{goTab('home');pushPage(pagePlan);}},
  {t:'在线答疑',d:'AI 先行答疑 · 一键转人工',k:'答疑 提问 AI 人工',run:()=>goTab('qa')},
  {t:'答疑记录',d:'历史答疑留痕',k:'答疑 记录 历史',run:()=>{goTab('qa');pushPage(pageQaHistory);}},
  {t:'我的',d:'学时 / 做题数 / 打卡天数',k:'我的 个人中心 退出登录',run:()=>goTab('me')},
];
let _searchList=[];
function renderSearch(q){
  const box=$id('searchResults'); if(!box) return;
  q=(q||'').trim().toLowerCase();
  if(!q){ box.classList.remove('show'); box.innerHTML=''; return; }
  _searchList=SEARCH_ITEMS.filter(x=>(x.t+x.d+x.k).toLowerCase().indexOf(q)>=0).slice(0,8);
  box.innerHTML=_searchList.length?_searchList.map((x,i)=>'<button onclick="runSearch('+i+')"><i>'+(i+1)+'</i><span>'+x.t+'<small>'+x.d+'</small></span></button>').join(''):'<div class="sr-empty">没有找到相关页面</div>';
  box.classList.add('show');
}
function runSearch(i){
  const it=_searchList[i]; if(!it) return;
  const box=$id('searchResults'),inp=$id('searchInput');
  if(box) box.classList.remove('show');
  if(inp) inp.value='';
  it.run();
}
function openNotifications(){
  openModal(`<h4>消息通知</h4><p class="sub" style="margin-top:4px">最近 7 天的服务提醒</p>
    <div class="list" style="margin-top:14px;padding:0 12px">
      <div class="cell"><div class="ci" style="background:var(--blue-bg);color:var(--blue)">${IC.plan}</div><div class="ct"><b>本周学习计划已更新</b><small>今天 08:30 · 新增 3 节技巧课</small></div></div>
      <div class="cell"><div class="ci" style="background:var(--orange-bg);color:#E8862C">${IC.live}</div><div class="ct"><b>直播提醒</b><small>11-12 19:30 · 二次函数压轴突破</small></div></div>
      <div class="cell"><div class="ci" style="background:var(--green-bg);color:#27A566">${IC.people}</div><div class="ct"><b>规划师回访</b><small>周四 19:00 · 李规划师</small></div></div>
    </div>
    <button class="btn" style="margin-top:14px" onclick="closeModal()">知道了</button>`);
}

/* ---------- 键盘快捷键 ---------- */
document.addEventListener('keydown',e=>{
  const tag=(e.target&&e.target.tagName)||'';
  const typing=tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT';
  if(e.key==='Escape'){
    const root=$id('modal-root');
    if(root&&root.classList.contains('show')) closeModal();
    else if($id('searchResults')) $id('searchResults').classList.remove('show');
    else if(!typing&&stack.length) popPage();
    return;
  }
  if(e.key==='/'&&!typing){ e.preventDefault(); const i=$id('searchInput'); if(i) i.focus(); }
  if(e.altKey&&e.key==='ArrowLeft'&&stack.length){ e.preventDefault(); popPage(); }
});
document.addEventListener('click',e=>{
  const box=$id('searchResults');
  if(box && !e.target.closest('.searchbox')) box.classList.remove('show');
});

/* ---------- 启动（在原型启动脚本之后执行，接管外壳） ---------- */
(function boot(){
  const si=$id('searchInput');
  if(si) si.addEventListener('input',e=>renderSearch(e.target.value));
  restore();
  U.logged=false;
  demoStart();
  setInterval(persist,3000);
  window.addEventListener('beforeunload',persist);
  updateChrome();
})();

