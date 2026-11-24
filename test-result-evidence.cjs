const assert=require('node:assert/strict');
const W=require('./dist/model.js'),A=require('./dist/answers.js'),P=require('./dist/personal-profile.js'),S=require('./dist/result-stories.js'),X=require('./dist/work-life-model.js');
global.WorkLife=X;
const M=require('./dist/mixed-survey.js');
M.itemsFor(W,X).forEach((item,i)=>assert.equal(item.q.surveyNumber,i+1));
const p={name:'가람',role:'pm',scale:8,answers:Array(24).fill(1),funAnswers:[0,1,0,1]},b={...p,name:'나래',answers:Array(24).fill(4)},c={...b,name:'다래'};
const dims=P.analyze(p,W,A),personal=S.personal(p.name,dims);
assert(personal.method.includes('같은 강도'));
for(const d of dims){assert.equal(d.evidence.length,3);for(const e of d.evidence)assert.equal(e.option.id,p.answers[e.q.id]);}
for(const e of personal.sections[0].evidence){assert(W.questions.some(q=>e.label.includes(` ${q.surveyNumber}번`)&&q.text===e.question&&A.optionsFor(q).some(o=>o.text===e.answers[0].text&&o.id===p.answers[q.id])));}
for(const other of [p,b,...W.demoPeople()]){const m=W.match(p,other);assert.equal(Math.round(m.sharedContribution+m.balanceContribution),m.score);assert(Math.abs(m.rawScore-(.85*m.rawShared+.15*m.rawBalance))<1e-9);}
const tied=S.mate(p,b,W,A,P,{people:[p,b,c]});assert(tied.sections[0].body.includes('공동 최고'));assert.equal(tied.sections[0].table.rows[0][2],'85%');
for(const section of tied.sections)for(const e of section.evidence||[])for(const answer of e.answers){const person=answer.name===p.name?p:b,q=[...W.questions,...W.funQuestions].find(q=>q.text===e.question);assert(q);const expected=Array.isArray(q.labels)?q.options[person.funAnswers[q.id]]:A.optionsFor(q).find(o=>o.id===person.answers[q.id]).text;assert.equal(answer.text,expected);}
const fit=W.teamCompatibility(p,[p,b]);assert.equal(fit.others,1);assert.equal(fit.meanGap,3);assert.equal(fit.score,0);assert(P.teamHtml(p,[p,b],W,String).includes('나를 제외한 1명'));
const base={n:10,satisfaction:{work:Array(10).fill(6),life:Array(10).fill(6)},life:[{name:'팀 점심',counts:[0,0,0,10]}],work:[['기준 정하기',2]],priorityNames:['기준 정하기'],temperature:X.temperature([0,0,0,0,0,4,4,4,4,4])};
const team=S.team(base);assert(team.sections.some(x=>x.body.includes('과반은 아니')));assert(team.sections.some(x=>x.heading.includes('고르기 어려워요')));assert(team.title.includes('판단 보류'));assert(team.sections[0].body.includes('각각 25% 이상'));
const changed=S.team({...base,life:[{name:'팀 점심',counts:[0,7,3,0]}]});assert(changed.sections.some(x=>x.body.includes('유지로 고른 응답은 없어요')));assert(changed.sections.some(x=>x.body.includes('조정 7명과 중단 3명')));
const escape=s=>String(s).replace(/</g,'&lt;');const html=S.html({title:'<title>',paragraphs:['<p>'],sections:[{heading:'<heading>',body:'<body>',table:{caption:'<caption>',columns:['<col>'],rows:[['<cell>']]},evidence:[{label:'<label>',question:'<question>',answers:[{name:'<name>',text:'<answer>'}]}],prompt:'<prompt>',note:'<note>'}],method:'<method>'},escape);
for(const word of ['title','p','heading','body','caption','col','cell','label','question','name','answer','prompt','note','method'])assert(html.includes('&lt;'+word+'>'));
console.log('Passed: all 40 source numbers, exact personal/mate evidence, tied results, weighted score arithmetic, leave-self-out team fit, split temperature, minority/unknown life opinions and escaped source tables.');
