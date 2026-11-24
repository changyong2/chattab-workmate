const assert=require('node:assert/strict');
const A=require('./dist/answers.js');
const W=require('./dist/model.js');
const R=require('./dist/roles.js');
assert.equal(W.questions.length,24);
for(let d=0;d<8;d++)assert.equal(W.questions.filter(q=>q.dim===d).length,3);
for(const value of W.values)assert(W.questions.some(q=>q.value===value.id));
for(const q of W.questions){
  const original=A.optionsFor(q);
  assert.equal(original.length,4);
  assert.equal(new Set(original.map(o=>o.text)).size,4,`duplicate options: ${q.id}`);
  assert.equal(new Set(original.map(o=>o.id)).size,4);
  assert(original.every(o=>o.text&&!/가까워요|조금 더 이쪽|^A$|^B$/.test(o.text)));
  assert.deepEqual(A.orderedOptions(q,123),A.orderedOptions(q,123));
  assert.deepEqual(A.orderedOptions(q,456).map(o=>o.id).sort(),[1,2,3,4]);
  for(const role of R.roles){
    const adapted=R.questionFor(q,role.id,123);
    assert.equal(adapted.dim,q.dim);assert.equal(adapted.value,q.value);
    assert.equal(new Set(adapted.options.map(o=>o.text)).size,4);
    assert(adapted.context);
    for(const o of adapted.options)assert.equal(o.point,original.find(x=>x.id===o.id).point);
  }
}
assert(W.questions.some(q=>JSON.stringify(A.orderedOptions(q,123).map(o=>o.id))!=='[1,2,3,4]'));
const a={name:'올리버 🧩',role:'pm',scale:6,funAnswers:[0,1,0,1],answers:W.questions.map(q=>q.id%4+1)};
const b={name:'동료',role:'dev',scale:6,funAnswers:[0,1,0,1],answers:a.answers.map(v=>5-v)};
assert(W.encode(a).startsWith('WM6.'));
assert.deepEqual(W.decode(W.encode(a)),a);
assert.throws(()=>W.decode(W.encode(a).slice(0,-1)+'!'));
assert.throws(()=>W.encode({...a,name:''}));
assert.throws(()=>W.encode({...a,answers:Array(24).fill(5)}));
assert.throws(()=>W.encode({...a,role:'invented-role'}));
assert.equal(W.match(a,b).score,W.match(b,a).score);
assert(W.match(a,b).score>=0&&W.match(a,b).score<=100);
const same={...a,name:'같은 응답',role:'design'};
assert.equal(W.match(a,same).shared,100);
const ranks=W.ranking(a,[a,b,same]);
assert.equal(ranks.length,2);assert(ranks.every(r=>r.person.name!==a.name));
for(const role of R.roles){
  const p={...a,role:role.id};
  assert.deepEqual(W.decode(W.encode(p)),p);
  assert.equal(W.match(p,b).score,W.match(a,b).score);
  assert.deepEqual(W.ranking(p,[p,b,same]).map(r=>[r.person.name,r.score]),ranks.map(r=>[r.person.name,r.score]));
}
const e=W.evidence(a,same);assert.equal(e.same.length,3);
for(const q of e.same){assert.equal(a.answers[q.id],same.answers[q.id]);assert.equal(W.answerLabel(q,a.answers[q.id]),A.optionsFor(q).find(o=>o.id===a.answers[q.id]).text);}
assert.throws(()=>W.decode('WM5.old.hash'));
assert.throws(()=>W.encode({...a,funAnswers:[0,1]}));
assert.throws(()=>W.encode({...a,funAnswers:[0,1,0,3]}));
assert.equal(W.questions.length+W.funQuestions.length+require('./dist/work-life-model.js').questions.length,40);
const opposite={...a,name:'역할 반대',answers:W.questions.map(q=>q.dim<6?a.answers[q.id]:5-a.answers[q.id])};
assert.equal(W.match({...a,answers:Array(24).fill(1)},{...a,name:'반대',answers:W.questions.map(q=>q.dim<6?1:4)}).score,100);
const funChanged={...a,funAnswers:a.funAnswers.map(v=>1-v)};
assert.deepEqual(W.scores(a),W.scores(funChanged));
assert.equal(W.match(a,b).score,W.match(funChanged,b).score);
assert.equal(W.match(a,{...a,name:'같은 취향'}).funSame,4);
assert.equal(W.match(a,{...funChanged,name:'다른 취향'}).funSame,0);
assert.equal(W.teamCompatibility(a,[a]),null);
assert.equal(W.teamCompatibility(a,[a,{...a,name:'같은 리듬'}]).score,100);
assert.equal(W.teamCompatibility({...a,answers:Array(24).fill(1)},[{...a,answers:Array(24).fill(1)},{...a,name:'반대 리듬',answers:Array(24).fill(4)}]).score,0);
assert(W.demoPeople().every(W.validProfile));
console.log('Passed: 40-item schema, 3 items per dimension, role-independent matching, WM6 Unicode/tamper checks, old-code rejection, non-scoring games and leave-one-out team compatibility.');
