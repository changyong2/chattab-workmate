const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const A=require('./dist/answers.js'),W=require('./dist/model.js'),X=require('./dist/work-life-model.js');
global.WorkLife=X;
const M=require('./dist/mixed-survey.js');
const p={...W.demoPeople()[0],page:0,orderSeed:123,extraAnswers:Object.fromEntries(X.questions.map(q=>[q.id,q.type==='grid'?Array(q.rows.length).fill(0):q.type==='multi'?[0]:q.type==='text'?'의견':0]))};
const plan=M.itemsFor(W,X);
assert.equal(plan.length,40);assert.equal(plan.filter(x=>x.kind==='fun').length,4);
assert.equal(new Set(plan.map(x=>x.kind+':'+x.q.id)).size,40);
const nodes=new Map(),node=()=>({textContent:'',style:{},classList:{toggle(){}},setAttribute(){},scrollIntoView(){},focus(){},querySelector(){return node();}});
const app={innerHTML:'',querySelector(s){if(!nodes.has(s))nodes.set(s,node());return nodes.get(s);},querySelectorAll(){return[];}};
global.window={scrollTo(){},WorkmateAnswers:A};
let done=false;const render=()=>M.render({app,p,W,R:require('./dist/roles.js'),esc:String,persist(){},finish(){done=true;},back(){}});
render();let shown=0;
for(let i=0;i<5;i++){assert.equal(p.page,i);shown+=(app.innerHTML.match(/class="question"/g)||[]).length;app.querySelector('#mixed-next').onclick();}
assert.equal(shown,40);assert(done);
p.page=0;p.answers[0]=null;done=false;render();app.querySelector('#mixed-next').onclick();assert(!done);assert(app.querySelector('#mixed-error').textContent.includes('확인'));p.answers[0]=1;
function browserContext(mode,hash,storage,search=''){
  const elements=new Map(),app={innerHTML:''},create=()=>({textContent:'',style:{},classList:{toggle(){},add(){},remove(){}},setAttribute(){},remove(){},addEventListener(){}});
  const context={TextEncoder,TextDecoder,Uint8Array,Uint32Array,btoa,atob,URLSearchParams,URL,Blob,crypto:require('node:crypto').webcrypto,console,setTimeout(){return 0;},clearTimeout(){},navigator:{clipboard:{writeText(){return Promise.resolve();}}},location:{hash,search,replace(url){context.redirect=url;}},localStorage:{getItem(k){return storage[k]??null;},setItem(k,v){storage[k]=v;},removeItem(k){delete storage[k];}},document:{body:{dataset:{mode,...(mode==='host'?{page:'mate'}:{})}},documentElement:{classList:{toggle(){}}},querySelector(s){if(s==='#app')return app;if(s==='.reveal-stage')return null;if(!elements.has(s))elements.set(s,create());return elements.get(s);},querySelectorAll(){return[];}}};
  context.window=context;context.addEventListener=()=>{};context.scrollTo=()=>{};context.matchMedia=()=>({matches:true});vm.createContext(context);
  for(const file of ['answers','model','roles','work-life-model','mixed-survey','work-life-host','insights','dashboard','result-stories','personal-profile','app'])vm.runInContext(fs.readFileSync('dist/'+file+'.js','utf8'),context,{filename:file+'.js'});
  return {context,app,elements};
}
const complete=browserContext('', '#complete',{'wm-participant-v7':JSON.stringify(p)});
assert(complete.app.innerHTML.includes('40문항 완료'));
assert(complete.app.innerHTML.includes('WM7.'));assert(complete.app.innerHTML.includes('WL3.'));
const profile=browserContext('host','#profile',{},'?sample=1');
assert(profile.app.innerHTML.includes('채팅탭과의 궁합'));assert(profile.app.innerHTML.includes('밸런스 게임'));
const mate=browserContext('host','#results',{},'?sample=1');
assert(mate.app.innerHTML.includes('두근두근'));
vm.runInContext('showMatch(host.people[0])',mate.context);
assert(mate.app.innerHTML.includes('메이트 궁합률'));assert(mate.app.innerHTML.includes('밸런스 게임은 네 개 중'));
const old={'wm-participant-v5':JSON.stringify({...p,answers:Array(48).fill(1),scale:5})};
browserContext('', '#survey',old);assert(old['wm-participant-v5']);
console.log('Passed: all 40 items across five pages, missing-answer guard, real completion WM7/WL3 codes, sample personal/team compatibility, mate reveal narrative and old storage preservation.');
