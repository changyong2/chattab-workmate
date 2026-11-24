const assert=require('node:assert/strict');
const A=require('./dist/answers.js');
const W=require('./dist/model.js');
const R=require('./dist/roles.js');
assert.equal(W.questions.length,48);
for(let d=0;d<8;d++)assert.equal(W.questions.filter(q=>q.dim===d).length,6);
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
const a={name:'올리버 🧩',role:'pm',scale:5,answers:W.questions.map(q=>q.id%4+1)};
const b={name:'동료',role:'dev',scale:5,answers:a.answers.map(v=>5-v)};
assert(W.encode(a).startsWith('WM5.'));
assert.deepEqual(W.decode(W.encode(a)),a);
assert.throws(()=>W.decode(W.encode(a).slice(0,-1)+'!'));
assert.throws(()=>W.encode({...a,name:''}));
assert.throws(()=>W.encode({...a,answers:Array(48).fill(5)}));
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
for(const legacy of [
 {name:'기존',answers:Array(48).fill(3)},
 {name:'기존',role:'pm',answers:Array(48).fill(3)},
 {name:'기존',role:'pm',scale:4,answers:Array(48).fill(2)}
])assert.deepEqual(W.decode(W.encode(legacy)),legacy);
console.log('Passed: 48 questions / 192 distinct actions; all 3 jobs; stable shuffled choices; WM5 Unicode roundtrip and tamper checks; legacy decoding; position-independent IDs; symmetric, job-independent matching; evidence points to actual selected action.');
