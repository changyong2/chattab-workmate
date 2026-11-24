const assert=require('node:assert/strict');
const X=require('./dist/work-life-model.js');
assert.equal(X.questions.length,12);
assert.equal(X.temperature([0]).degrees,10);
assert.equal(X.temperature([4]).degrees,90);
assert.equal(X.temperature([0,4]).degrees,50);
assert.deepEqual(X.temperature([5,5]),{degrees:null,count:0,total:2,unknown:2,warm:0,cold:0,counts:[0,0,0,0,0]});
const mixed=X.temperature([0,3,4,5]);
assert.equal(mixed.count,3);assert.equal(mixed.warm,2);assert.equal(mixed.cold,1);assert.equal(mixed.unknown,1);assert.equal(mixed.degrees,57);
const A=require('./dist/answers.js'),W=require('./dist/model.js'),R=require('./dist/roles.js');
for(const q of W.questions){
  const original=R.questionFor(q,'pm',123);
  for(const role of R.roles)assert.deepEqual(R.questionFor(q,role.id,123),original);
  assert.equal(A.optionsFor(q).length,4);
}
const S=require('./dist/result-stories.js');
const data={n:4,satisfaction:{work:[3,3,4,5],life:[3,3,4,5]},life:[{name:'팀 점심',counts:[3,1,0,0]}],work:[['한곳에 기록하기',3]],priorityNames:['한곳에 기록하기']};
assert(S.team({...data,temperature:X.temperature([0,0,1,5])}).paragraphs.some(p=>p.includes('말을 꺼내기 조심')));
assert(S.team({...data,temperature:X.temperature([3,3,4,5])}).paragraphs.some(p=>p.includes('편하게 꺼내')));
assert(S.team({...data,temperature:X.temperature([5,5,5,5])}).paragraphs.some(p=>p.includes('판단을 보류')));
const vm=require('node:vm'),fs=require('node:fs');
function renderTeam(responses,search){const app={innerHTML:''};const ctx={WorkLife:{...X,load:()=>({responses})},ResultStories:S,location:{search},URLSearchParams,document:{querySelector:()=>app,querySelectorAll:()=>[]}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/work-life-results.js','utf8'),ctx);return app.innerHTML;}
const demoHtml=renderTeam([],'?sample=1');
assert(demoHtml.includes('70<small>°C'));
assert(demoHtml.includes(X.questions.find(q=>q.id==='workPriorities').options[0]));
assert(!demoHtml.includes('선택된 공통규칙이 없어요'));
const answers=Object.fromEntries(X.questions.map(q=>[q.id,q.type==='grid'?Array(q.rows.length).fill(0):q.type==='multi'?[0]:q.type==='text'?'':0]));
const realHtml=renderTeam([{version:3,id:'test-respondent',answers}],'');
assert(realHtml.includes('10<small>°C'));
assert(!realHtml.includes('가상 응답 12명'));
console.log('Passed: temperature scale, excluded unknowns, mixed distributions, grounded team narratives and identical scenarios across jobs.');
