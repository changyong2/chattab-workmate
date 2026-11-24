/* Workshop conversation aid. Scores are transparent heuristics, not validated assessments. */
(function (root) {
  const dimensions = [
    {name:'시작하는 방식',left:'생각을 모은 뒤',right:'일단 작게 해보기',kind:'rhythm'},
    {name:'의견을 나누는 방식',left:'글로 정리해서',right:'대화로 풀면서',kind:'rhythm'},
    {name:'함께 맞추는 주기',left:'모아서 깊게',right:'짧게 자주',kind:'rhythm'},
    {name:'계획을 다루는 방식',left:'순서가 선명하게',right:'상황에 유연하게',kind:'rhythm'},
    {name:'피드백을 받는 순간',left:'어느 정도 다듬은 뒤',right:'거친 초안부터',kind:'rhythm'},
    {name:'결정하는 기준',left:'확실함을 더 챙겨',right:'속도를 더 챙겨',kind:'rhythm'},
    {name:'자연스럽게 맡는 역할',left:'구조와 맥락 정리',right:'가능성과 아이디어 확장',kind:'role'},
    {name:'힘이 나는 구간',left:'마무리와 완성',right:'첫 시도와 출발',kind:'role'}
  ];
  // Three concrete prompts per dimension. Original action rows remain stable.
  const values = [{"id": "company", "text": "카카오를 위해 행동합니다."}, {"id": "user", "text": "사용자의 문제를 해결합니다."}, {"id": "goal", "text": "높은 목표를 추구합니다."}, {"id": "beyond", "text": "경험으로 한계짓지 않습니다."}, {"id": "ownership", "text": "이름에 기대어 일하지 않습니다."}, {"id": "honest", "text": "솔직하고 소신있게 말합니다."}, {"id": "cross", "text": "경계를 넘나들며 협업합니다."}, {"id": "commit", "text": "결정을 존중하고 헌신합니다."}];
  const groups = [
  [
    [
      "새 일을 받으면, 나는 보통?",
      "자료부터 살펴본다",
      "작게 만들어본다",
      "user"
    ],
    [
      "처음 해보는 방법을 쓰려면?",
      "다른 사례부터 찾아본다",
      "직접 한번 해본다",
      "beyond"
    ],
    [
      "내 일은 아니지만 도움이 필요해 보이면?",
      "어떤 상황인지 먼저 알아본다",
      "도울 수 있는 일부터 해본다",
      "ownership"
    ],
    [
      "다른 팀과 새 일을 시작한다면?",
      "지금까지의 기록부터 읽는다",
      "함께 볼 예시부터 만든다",
      "cross"
    ],
    [
      "목표를 더 높여보자고 하면?",
      "지금과 무엇이 달라야 할지 정리한다",
      "가능할지 작은 실험을 해본다",
      "goal"
    ],
    [
      "늘 하던 방법이 안 통하면?",
      "다른 방법을 찾아 비교한다",
      "새 방법을 하나 골라 해본다",
      "beyond"
    ]
  ],
  [
    [
      "회의에서 내 생각이 다르면?",
      "글로 정리해서 말한다",
      "그 자리에서 이야기한다",
      "honest"
    ],
    [
      "사용자가 불편할 부분을 발견하면?",
      "내용을 적어서 전달한다",
      "담당자와 바로 이야기한다",
      "user"
    ],
    [
      "다른 팀과 생각이 다르다면?",
      "다른 점을 글로 정리한다",
      "만나서 이야기를 나눈다",
      "cross"
    ],
    [
      "정해진 방향을 동료에게 전한다면?",
      "글로 남겨 전달한다",
      "직접 설명하며 맞춘다",
      "commit"
    ],
    [
      "내 의견의 이유를 설명할 때는?",
      "자료와 예시를 써서 보여준다",
      "대화하면서 풀어낸다",
      "ownership"
    ],
    [
      "우리 팀만 편해지는 안 같다면?",
      "걱정되는 점을 글로 남긴다",
      "관련 팀과 직접 이야기한다",
      "company"
    ]
  ],
  [
    [
      "다른 팀과 일할 때 더 편한 쪽은?",
      "시간을 잡고 한 번에 맞추기",
      "필요할 때 짧게 자주 맞추기",
      "cross"
    ],
    [
      "사용자 반응을 동료에게 전할 때는?",
      "몇 가지 모아서 공유한다",
      "눈에 띌 때마다 공유한다",
      "user"
    ],
    [
      "어려운 일을 하다가 막히면?",
      "점검 시간에 모아서 이야기한다",
      "막힐 때마다 짧게 물어본다",
      "goal"
    ],
    [
      "함께 정한 일을 진행할 때는?",
      "한 단계 끝나면 같이 확인한다",
      "진행 중에도 자주 확인한다",
      "commit"
    ],
    [
      "동료에게 물어볼 게 여러 개라면?",
      "모아서 한 번에 물어본다",
      "하나씩 그때그때 물어본다",
      "cross"
    ],
    [
      "동료에게 아쉬운 점을 말할 때는?",
      "리뷰 시간에 정리해서 말한다",
      "그 일이 생겼을 때 말한다",
      "honest"
    ]
  ],
  [
    [
      "같이 할 일이 정해지면?",
      "순서와 일정을 먼저 잡는다",
      "큰 방향만 잡고 조정하며 한다",
      "commit"
    ],
    [
      "회사에서 더 급한 일이 생기면?",
      "바꿀 계획부터 정리한다",
      "바로 할 수 있는 일부터 바꾼다",
      "company"
    ],
    [
      "담당자가 없어 내가 맡은 일이라면?",
      "할 일과 순서를 먼저 정한다",
      "가능한 것부터 손을 댄다",
      "ownership"
    ],
    [
      "어려운 목표에 도전할 때는?",
      "중간 목표와 순서를 세운다",
      "해보면서 방법을 바꿔간다",
      "goal"
    ],
    [
      "사용자 반응이 예상과 다르면?",
      "새 계획을 맞춘 뒤 움직인다",
      "바꿀 수 있는 것부터 바꾼다",
      "user"
    ],
    [
      "새로운 협업 방식을 써본다면?",
      "간단한 규칙부터 정한다",
      "써보면서 규칙을 만든다",
      "beyond"
    ]
  ],
  [
    [
      "새 아이디어는 언제 보여주는 편인가요?",
      "조금 다듬은 다음",
      "생각이 떠오른 초반부터",
      "beyond"
    ],
    [
      "사용자 문제를 잘 짚었는지 물어볼 때는?",
      "내 생각을 정리한 다음",
      "아직 헷갈릴 때부터",
      "user"
    ],
    [
      "다른 팀의 의견을 듣고 싶다면?",
      "볼 만한 초안을 갖춘 다음",
      "초안을 만드는 중간부터",
      "cross"
    ],
    [
      "다른 의견도 듣고 싶을 때는?",
      "내 대안까지 준비해서 묻는다",
      "고민 중인 상태로 묻는다",
      "honest"
    ],
    [
      "결과물을 더 좋게 만들고 싶다면?",
      "스스로 점검한 뒤 보여준다",
      "일찍 보여주고 같이 다듬는다",
      "goal"
    ],
    [
      "다른 동료의 일을 도와줄 때는?",
      "내 나름의 답을 찾아서 전한다",
      "단서부터 공유하며 같이 본다",
      "ownership"
    ]
  ],
  [
    [
      "되돌릴 수 있는 작은 개선이라면?",
      "영향을 더 확인하고 진행한다",
      "작게 내놓고 반응을 본다",
      "user"
    ],
    [
      "둘 다 괜찮은 방법 같다면?",
      "조금 더 비교해본다",
      "지금 골라서 해본다",
      "goal"
    ],
    [
      "다른 팀에 줄 영향이 걱정되면?",
      "조건을 더 확인한 뒤 한다",
      "작은 범위에서 먼저 확인한다",
      "company"
    ],
    [
      "정한 일을 하다 작은 의문이 생기면?",
      "확인하고 다음으로 간다",
      "되돌릴 수 있는 부분부터 한다",
      "commit"
    ],
    [
      "경험만으로 답하기 어렵다면?",
      "자료를 더 찾아본다",
      "짧게 실험해본다",
      "beyond"
    ],
    [
      "완성도와 일정, 둘 다 챙기기 어렵다면?",
      "할 일을 줄여 완성도를 높인다",
      "작게 먼저 내고 보완한다",
      "user"
    ]
  ],
  [
    [
      "여러 팀이 모인 회의에서 나는?",
      "나온 의견을 정리하는 편",
      "새로운 관점을 더하는 편",
      "cross"
    ],
    [
      "사용자 불편을 다룬 초안을 보면?",
      "빠진 조건을 채우고 싶다",
      "다른 해결법도 떠오른다",
      "user"
    ],
    [
      "함께 갈 방향이 정해지면?",
      "구체적으로 할 일을 정리한다",
      "그 안에서 더 해볼 일을 찾는다",
      "commit"
    ],
    [
      "여러 팀이 함께 잘되려면 무엇부터?",
      "각 방법의 영향을 정리한다",
      "팀을 넘는 새 대안을 제안한다",
      "company"
    ],
    [
      "당연하던 생각을 바꿔보자는 자리라면?",
      "무엇을 바꿀지 콕 짚는다",
      "다른 가능성을 넓혀본다",
      "beyond"
    ],
    [
      "직급과 상관없이 의견을 보탤 때는?",
      "빠진 근거나 조건을 짚는다",
      "새로운 시각을 꺼낸다",
      "honest"
    ]
  ],
  [
    [
      "어려운 목표를 향할 때 더 끌리는 일은?",
      "빈틈을 채워 완성하기",
      "첫 가능성 만들어보기",
      "goal"
    ],
    [
      "팀에 필요한 일을 직접 고른다면?",
      "진행하던 일을 끝내기",
      "아직 아무도 안 한 일 시작하기",
      "company"
    ],
    [
      "새로운 도전을 나눠 맡는다면?",
      "기존 것을 더 좋게 만들기",
      "처음 해보는 것 시작하기",
      "beyond"
    ],
    [
      "함께 정한 방향에 힘을 보탤 때는?",
      "끝까지 확인하며 마무리하기",
      "첫 결과를 만들어 출발시키기",
      "commit"
    ],
    [
      "내 담당 밖의 일을 돕는다면?",
      "받은 초안을 완성하기",
      "첫 초안을 만들어 건네기",
      "ownership"
    ],
    [
      "다른 팀과 같이 할 때 더 손이 가는 건?",
      "빈틈을 메워 끝까지 이어가기",
      "첫 안을 만들어 시작하기",
      "cross"
    ]
  ]
];
  const questions = [];
  for(const round of [0,2,4]) for(let dim=0;dim<8;dim++) {
    const [text,left,right,value]=groups[dim][round];
    questions.push({id:questions.length,dim,sourceRound:round,text,left,right,value});
  }
  const funQuestions=[
    {id:0,text:'긴급 회의에 딱 하나만 가져갈 수 있다면?',options:['반박 불가, 한 장짜리 완벽한 문서','아무것도 없지만 같이 그릴 화이트보드'],labels:['문서 한 장 승부사','화이트보드 즉흥파']},
    {id:1,text:'팀미팅 치트키를 하나 얻는다면?',options:['모든 회의가 30분이면 자동 종료','모든 회의록이 5초 만에 자동 완성'],labels:['회의 타이머 수호자','회의록 자동화 전도사']},
    {id:2,text:'점심 뒤 공짜 한 시간이 생겼다. 단 하나만 고른다면?',options:['각자 흩어져 조용히 완전 충전','다 같이 가벼운 미니 외출'],labels:['혼자 충전 만렙','함께 놀기 만렙']},
    {id:3,text:'다음 프로젝트에 초능력을 하나 장착한다면?',options:['미래의 버그와 문제를 미리 보기','모든 반복 업무를 자동으로 지우기'],labels:['미래 문제 레이더','반복 업무 삭제 요정']}
  ];
  function validFun(a){return Array.isArray(a)&&a.length===4&&a.every(v=>v===0||v===1);}
  function validProfile(p){return !!p&&typeof p.name==='string'&&p.name.trim().length>0&&p.name.length<=20&&['dev','pm','design'].includes(p.role)&&p.scale===6&&Array.isArray(p.answers)&&p.answers.length===24&&p.answers.every(a=>Number.isInteger(a)&&a>=1&&a<=4)&&validFun(p.funAnswers);}
  function checksum(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return (h>>>0).toString(36);}
  function encode(p){if(!validProfile(p))throw Error('40문항 버전의 업무 성향·밸런스 게임과 닉네임을 확인해주세요.');const raw=JSON.stringify([6,p.name.trim(),p.answers.join(''),p.role,p.funAnswers.join('')]);const b64=btoa(Array.from(new TextEncoder().encode(raw),c=>String.fromCharCode(c)).join('')).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');return `WM6.${b64}.${checksum(b64)}`;}
  function decode(code){try{if(code.length>2000)throw 0;const [tag,b64,hash,...extra]=code.trim().split('.');if(tag!=='WM6'||extra.length||checksum(b64)!==hash)throw 0;const raw=new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(atob(b64.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0)));const [v,name,answers,role,fun]=JSON.parse(raw);if(v!==6||typeof answers!=='string'||!/^[1-4]{24}$/.test(answers)||typeof fun!=='string'||!/^[01]{4}$/.test(fun))throw 0;const p={name,answers:[...answers].map(Number),role,scale:6,funAnswers:[...fun].map(Number)};if(!validProfile(p))throw 0;return p;}catch{throw Error('40문항 버전 WM6 코드가 필요해요. 이전 WM5 코드는 함께 집계하지 않아요.');}}
  function scores(p){if(!validProfile(p))throw Error('새 설문의 완성된 응답이 필요해요.');return dimensions.map((_,d)=>questions.filter(q=>q.dim===d).reduce((s,q)=>s+root.WorkmateAnswers.optionsFor(q).find(o=>o.id===p.answers[q.id]).point,0)/3);}
  function match(a,b){const x=scores(a),y=scores(b);const shared=x.slice(0,6).reduce((s,v,i)=>s+1-Math.abs(v-y[i])/3,0)/6;const balance=x.slice(6).reduce((s,v,i)=>s+Math.abs(v-y[i+6])/3,0)/2;return {score:Math.round(100*(.85*shared+.15*balance)),shared:Math.round(shared*100),balance:Math.round(balance*100),a:x,b:y,funSame:a.funAnswers.filter((v,i)=>v===b.funAnswers[i]).length};}
  function teamCompatibility(person,people){const others=people.filter(p=>p.name!==person.name&&validProfile(p));if(!others.length)return null;const mine=scores(person),otherScores=others.map(scores),team=dimensions.map((_,i)=>otherScores.reduce((sum,x)=>sum+x[i],0)/others.length);const fit=mine.slice(0,6).reduce((sum,x,i)=>sum+1-Math.abs(x-team[i])/3,0)/6;return {score:Math.round(fit*100),others:others.length,team,mine};}
  function ranking(person,people){return people.filter(p=>p!==person&&p.name!==person.name).map(p=>({person:p,...match(person,p)})).sort((a,b)=>b.score-a.score||a.person.name.localeCompare(b.person.name,'ko'));}
  function evidence(a,b){
    const m=match(a,b),point=(p,q)=>root.WorkmateAnswers.optionsFor(q).find(o=>o.id===p.answers[q.id]).point;
    const same=questions.filter(q=>q.dim<6&&a.answers[q.id]===b.answers[q.id]).slice(0,3);
    const close=questions.filter(q=>q.dim<6&&a.answers[q.id]!==b.answers[q.id]).sort((q,r)=>Math.abs(point(a,q)-point(b,q))-Math.abs(point(a,r)-point(b,r)));
    return {same,close:close.slice(0,Math.max(0,3-same.length)),gap:dimensions.map((d,i)=>({...d,dim:i,gap:Math.abs(m.a[i]-m.b[i])})).filter(d=>d.dim<6).sort((a,b)=>b.gap-a.gap)[0],role:dimensions.map((d,i)=>({...d,dim:i,gap:Math.abs(m.a[i]-m.b[i])})).slice(6).sort((a,b)=>b.gap-a.gap)[0]};
  }
  function answerLabel(q,value){return root.WorkmateAnswers.optionsFor(q).find(o=>o.id===value)?.text||'이전 설문의 응답';}
  function demoPeople(){const seeds=[['모모',[1,2,3,1,3,2,1,1]],['루카',[1,2,3,1,3,2,4,4]],['누리',[4,4,1,4,2,4,4,4]],['도담',[4,4,1,4,2,4,1,1]],['보리',[2,1,4,2,4,2,1,3]],['유자',[2,1,4,2,4,2,4,1]]];return seeds.map(([name,values],i)=>({name,role:['pm','dev','design'][i%3],scale:6,funAnswers:[i%2,Math.floor(i/2)%2,(i+1)%2,Math.floor(i/3)%2],answers:questions.map(q=>Math.min(4,values[q.dim]+((q.id+i*2)%11===0?1:0)))}));}
  const choices=[1,2,3,4];
  const api={dimensions,questions,values,choices,funQuestions,validFun,demoPeople,encode,decode,scores,match,teamCompatibility,ranking,evidence,answerLabel,validProfile};
  root.Workmate=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
