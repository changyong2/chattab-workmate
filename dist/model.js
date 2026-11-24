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
  const questions = [
  {
    "id": 0,
    "dim": 0,
    "text": "처음 맡는 업무를 받았다. 비슷한 일을 해본 적은 없다. 가장 먼저 무엇을 하겠나요?",
    "optionsText": [
      "관련 문서와 이전 기록을 읽으며 배경을 파악한다",
      "해본 적 있는 동료에게 설명을 듣고 시작한다",
      "내가 이해한 결과물의 모습을 간단히 그려본다",
      "지금 할 수 있는 작은 부분부터 직접 해본다"
    ],
    "value": "user"
  },
  {
    "id": 1,
    "dim": 1,
    "text": "회의에서 동료가 제안한 방법과 내 생각이 다르다. 내 의견을 어떻게 전하겠나요?",
    "optionsText": [
      "회의가 끝난 뒤 내 생각과 이유를 글로 정리해 보낸다",
      "메신저에 다른 점을 짧게 적고 답변을 받는다",
      "회의 뒤 동료와 잠깐 따로 이야기한다",
      "회의 중 그 자리에서 내 생각을 말하고 같이 논의한다"
    ],
    "value": "honest"
  },
  {
    "id": 2,
    "dim": 2,
    "text": "동료와 2주 동안 하나의 일을 함께 맡았다. 진행 상황을 어떤 주기로 맞추면 편한가요?",
    "optionsText": [
      "처음에 역할을 정하고 중간 점검 때 한 번에 맞춘다",
      "정해둔 요일에 진행 상황과 질문을 모아서 맞춘다",
      "중요한 변화나 막히는 일이 생길 때마다 짧게 맞춘다",
      "작은 작업이 끝날 때마다 수시로 서로 확인한다"
    ],
    "value": "cross"
  },
  {
    "id": 3,
    "dim": 3,
    "text": "동료와 다음 달까지 끝낼 일을 맡았다. 시작 전에 계획을 어느 정도 정하고 싶나요?",
    "optionsText": [
      "할 일 전체와 순서, 마감일을 정하고 시작한다",
      "큰 일정과 첫 주에 할 일을 정하고 시작한다",
      "최종 목표와 당장 할 일만 정하고 나머지는 열어둔다",
      "최종 목표를 맞춘 뒤 해보면서 순서와 방법을 정한다"
    ],
    "value": "commit"
  },
  {
    "id": 4,
    "dim": 4,
    "text": "채팅탭을 더 편하게 만들 아이디어가 떠올랐다. 언제 동료에게 보여주겠나요?",
    "optionsText": [
      "필요한 이유와 예상 결과까지 정리한 뒤 보여준다",
      "핵심을 설명할 예시 하나를 만든 뒤 보여준다",
      "아직 정리 중인 초안에 고민하는 점을 적어 보여준다",
      "생각이 떠올랐을 때 바로 꺼내고 함께 모양을 잡는다"
    ],
    "value": "beyond"
  },
  {
    "id": 5,
    "dim": 5,
    "text": "매주 쓰는 진행 상황 공유 글의 형식을 바꿔보자는 의견이 나왔다. 불편하면 기존 형식으로 돌아갈 수 있다. 나라면 어떻게 시작하겠나요?",
    "optionsText": [
      "기존 글과 새 형식을 비교해 빠지는 내용이 없는지 먼저 확인한다",
      "꼭 담아야 할 내용 몇 가지만 동료와 맞춘 뒤 바꾼다",
      "다음 공유 글 하나에만 새 형식을 시험해본다",
      "이번 주부터 새 형식으로 쓰고 반응에 따라 고친다"
    ],
    "value": "user"
  },
  {
    "id": 6,
    "dim": 6,
    "text": "동료들과 같은 일을 어떻게 진행할지 이야기 중이다. 서로 다른 의견이 여러 개 나왔다. 나는 어떤 일을 보태고 싶나요?",
    "optionsText": [
      "나온 의견을 비슷한 주제끼리 묶어 정리한다",
      "서로 다르게 이해한 조건이나 빠진 내용을 짚는다",
      "아직 나오지 않은 관점이나 사례를 보탠다",
      "기존 의견과 다른 새로운 해결 방법을 제안한다"
    ],
    "value": "cross"
  },
  {
    "id": 7,
    "dim": 7,
    "text": "팀이 새 기능을 준비하며 할 일을 나누고 있다. 같은 시간을 쓸 수 있다면 어떤 역할을 맡고 싶나요?",
    "optionsText": [
      "이미 나온 안에서 빠진 조건과 문제를 찾아 채운다",
      "어느 정도 만든 결과물을 쓰기 좋게 끝까지 다듬는다",
      "새로 시도할 방법의 예시를 만들어 보탠다",
      "아직 안 해본 방법을 처음부터 시험해 가능성을 확인한다"
    ],
    "value": "goal"
  },
  {
    "id": 8,
    "dim": 0,
    "text": "동료가 낯선 업무에서 막혀 도움을 요청했다. 나도 그 업무를 자세히 알지는 못한다. 무엇부터 하겠나요?",
    "optionsText": [
      "지금까지의 기록을 읽으며 어떤 상황인지 먼저 파악한다",
      "동료에게 어디서 막혔고 무엇을 해봤는지 설명을 듣는다",
      "내가 생각한 해결 흐름을 간단한 예시로 제안한다",
      "함께 손댈 수 있는 작은 부분부터 바로 해본다"
    ],
    "value": "ownership"
  },
  {
    "id": 9,
    "dim": 1,
    "text": "동료와 같은 문제를 두고 해결 방법이 갈렸다. 서로 다른 이유를 확인하려면 어떻게 하겠나요?",
    "optionsText": [
      "두 방법의 차이와 내 근거를 문서로 정리해 공유한다",
      "메신저로 궁금한 점을 하나씩 주고받는다",
      "동료와 잠깐 통화하거나 만나 각자의 이유를 듣는다",
      "같은 예시를 함께 보면서 그 자리에서 의견을 맞춘다"
    ],
    "value": "cross"
  },
  {
    "id": 10,
    "dim": 2,
    "text": "내가 맡은 일을 하다 막혔다. 당장 마감이 급한 상황은 아니고, 동료에게 물어볼 수 있다. 언제 도움을 구하는 편인가요?",
    "optionsText": [
      "다음 점검 시간까지 질문을 모아 한 번에 묻는다",
      "그날 안에 질문을 정리해 한 번에 묻는다",
      "조금 더 살펴본 뒤에도 막히면 그때 묻는다",
      "막힌 부분이 생기면 동료에게 바로 짧게 묻는다"
    ],
    "value": "goal"
  },
  {
    "id": 11,
    "dim": 3,
    "text": "여러 사람에게 걸쳐 있어 담당자가 불분명했던 일을 내가 맡게 됐다. 최종적으로 해결해야 할 문제는 정해져 있다. 어떻게 진행하겠나요?",
    "optionsText": [
      "필요한 일을 모두 적고 순서와 일정을 정한다",
      "큰 단계를 나누고 처음 며칠 할 일부터 정한다",
      "가장 먼저 해볼 일 하나를 골라 시작한다",
      "바로 해결할 수 있는 부분부터 하고 다음 일을 정한다"
    ],
    "value": "ownership"
  },
  {
    "id": 12,
    "dim": 4,
    "text": "기능을 바꾸는 안을 정리하고 있다. 동료의 의견을 받아야 한다면, 어떤 상태의 안을 보여주며 무엇을 물어보겠나요?",
    "optionsText": [
      "거의 정리한 안을 보여주며 빠진 조건이 있는지 묻는다",
      "핵심 예시를 보여주며 놓친 부분을 묻는다",
      "만드는 중인 초안을 보여주며 어느 방향이 나을지 묻는다",
      "문제와 고민만 먼저 공유하고 어떤 접근이 좋을지 묻는다"
    ],
    "value": "cross"
  },
  {
    "id": 13,
    "dim": 5,
    "text": "내가 정리한 기획이나 기술 변경안이 다른 사람의 작업에도 영향을 준다는 사실을 알았다. 변경하기 전에 무엇을 먼저 하겠나요?",
    "optionsText": [
      "영향받는 사람들과 필요한 조건을 모두 확인한다",
      "영향받는 사람과 꼭 확인할 범위를 정한다",
      "영향이 적은 부분부터 따로 시험해 결과를 공유한다",
      "금방 되돌릴 수 있는 작은 부분만 바꾸고 함께 상태를 본다"
    ],
    "value": "company"
  },
  {
    "id": 14,
    "dim": 6,
    "text": "리더가 이번 과제의 목표와 큰 방향을 정해줬다. 내가 맡을 세부 작업은 아직 정하지 않았다. 나는 어떤 일을 먼저 보태고 싶나요?",
    "optionsText": [
      "정해진 내용과 해야 할 일을 목록으로 정리한다",
      "역할이나 일정 중 아직 정하지 않은 부분을 찾는다",
      "정해진 목표 안에서 다른 구현 방법이나 접근을 찾아본다",
      "같은 목표를 더 잘 달성할 새 아이디어를 제안한다"
    ],
    "value": "commit"
  },
  {
    "id": 15,
    "dim": 7,
    "text": "갑자기 처음 해보는 과제를 받았다. 참고할 자료는 있지만 그대로 쓸 수는 없다. 내가 먼저 손대고 싶은 부분은 무엇인가요?",
    "optionsText": [
      "참고 자료에서 빠진 조건을 채워 쓸 수 있게 완성한다",
      "기존 방법을 새 과제에 맞게 수정해 적용한다",
      "기존 방법과 다른 새 방법을 작은 예시로 만들어본다",
      "기존 자료와 별개로 새로운 흐름을 처음부터 시험한다"
    ],
    "value": "beyond"
  },
  {
    "id": 16,
    "dim": 0,
    "text": "리더가 지금보다 더 높은 목표를 제안했다. 방법은 아직 정해지지 않았다. 가장 먼저 무엇을 하겠나요?",
    "optionsText": [
      "현재 결과와 새 목표가 얼마나 다른지 자료로 확인한다",
      "비슷한 목표를 달성한 사례를 동료와 찾아본다",
      "목표를 이뤘을 때의 모습을 간단한 예시로 만든다",
      "이번 주에 바로 해볼 작은 실험을 정한다"
    ],
    "value": "goal"
  },
  {
    "id": 17,
    "dim": 1,
    "text": "동료가 내 제안을 보고 “왜 이 방법이 좋다고 생각해?”라고 물었다. 어떻게 설명하겠나요?",
    "optionsText": [
      "근거와 예상 결과를 정리한 문서를 보여준다",
      "핵심 이유와 예시를 짧은 메시지로 보낸다",
      "내 생각을 먼저 말한 뒤 동료의 질문을 받는다",
      "질문을 주고받으며 함께 생각을 풀어간다"
    ],
    "value": "ownership"
  },
  {
    "id": 18,
    "dim": 2,
    "text": "동료에게 확인할 질문이 여러 개 생겼다. 지금 답을 받아도 되고 오후에 받아도 되는 상황이다. 어떻게 묻겠나요?",
    "optionsText": [
      "질문을 다 모은 뒤 시간을 잡아 한 번에 묻는다",
      "오후에 정리된 질문 목록 하나를 보낸다",
      "같은 주제의 질문 몇 개씩 묶어 보낸다",
      "생각나는 질문부터 하나씩 바로 묻는다"
    ],
    "value": "cross"
  },
  {
    "id": 19,
    "dim": 3,
    "text": "작업 중 예상하지 못한 사용자 반응이 확인됐다. 최종 목표는 그대로지만 진행 방법을 바꿔야 한다. 어떻게 움직이겠나요?",
    "optionsText": [
      "무엇을 바꿀지 전체 계획을 다시 정리한 뒤 움직인다",
      "가까운 일정과 다음 할 일을 동료와 다시 맞춘다",
      "바꿀 수 있는 부분부터 골라 반영한다",
      "작게 바꿔본 결과를 보면서 다음 변경을 정한다"
    ],
    "value": "user"
  },
  {
    "id": 20,
    "dim": 4,
    "text": "맡은 결과물의 방향은 정해졌다. 더 잘 만들기 위해 동료의 피드백을 받고 싶다. 어느 시점에 보여주겠나요?",
    "optionsText": [
      "혼자 끝까지 점검한 뒤 완성에 가까운 버전을 보여준다",
      "중요한 부분을 만든 뒤 첫 의견을 받는다",
      "중간에 만든 부분부터 보여주며 함께 고친다",
      "구체적으로 만들기 전부터 피드백 시간을 잡는다"
    ],
    "value": "goal"
  },
  {
    "id": 21,
    "dim": 5,
    "text": "새로 제안된 방법을 써도 될지 판단해야 한다. 내 경험만으로는 답하기 어렵고, 다음 주까지 결정하면 된다. 무엇부터 하겠나요?",
    "optionsText": [
      "관련 자료와 다른 사례를 더 찾아 비교한다",
      "그 방법을 써본 동료에게 경험을 묻는다",
      "간단한 예시 하나로 문제가 없는지 확인한다",
      "짧게 직접 써보고 나온 결과로 결정한다"
    ],
    "value": "beyond"
  },
  {
    "id": 22,
    "dim": 6,
    "text": "채팅탭의 기존 화면이나 기능을 새롭게 개선해보자는 논의가 시작됐다. 내가 더 하고 싶은 역할은 무엇인가요?",
    "optionsText": [
      "현재 방식의 어떤 점이 문제인지 구체적으로 정리한다",
      "지금 안에서 바꾸면 효과가 클 부분을 찾는다",
      "다른 서비스의 사례를 가져와 새 관점을 보탠다",
      "기존 방식에 얽매이지 않는 새로운 안을 그려본다"
    ],
    "value": "beyond"
  },
  {
    "id": 23,
    "dim": 7,
    "text": "내 일이 조금 일찍 끝나 동료의 과제를 도울 수 있게 됐다. 동료가 둘 다 필요하다고 한다면 어느 쪽을 맡고 싶나요?",
    "optionsText": [
      "이미 만든 초안에서 빠진 부분을 채워 마무리한다",
      "거의 완성된 부분을 검토하고 더 쓰기 좋게 다듬는다",
      "새로 생각한 방법의 예시를 만들어 보탠다",
      "아직 시작하지 못한 부분의 첫 초안을 만든다"
    ],
    "value": "ownership"
  }
];
  const funQuestions = [
  {
    "id": 0,
    "text": "채팅탭 업무 중 나에게만 평생 하나의 능력이 생긴다면? 둘 다 가질 수는 없다.",
    "options": [
      "복잡한 내용을 누구나 이해할 한 장의 문서로 바로 정리하기",
      "말로 설명하면 머릿속 생각이 눈앞에 그림으로 바로 나타나기"
    ],
    "labels": [
      "한 장 문서 마법사",
      "생각 시각화 능력자"
    ]
  },
  {
    "id": 1,
    "text": "채팅탭에서 나에게만 다음 초능력 중 하나가 생긴다면 무엇을 고르겠나요?",
    "options": [
      "회의가 끝나면 내가 할 일이 30초 안에 끝나기",
      "다시 찾고 싶은 결정 사항이나 대화를 1초 만에 찾아내기"
    ],
    "labels": [
      "회의 뒤 액션 30초 컷",
      "결정 사항 인간 검색엔진"
    ]
  },
  {
    "id": 2,
    "text": "오늘 할 일을 모두 마쳤고 퇴근까지 자유 시간 1시간이 생겼다. 같은 선택을 한 동료와 보낼 수 있다면?",
    "options": [
      "각자 조용히 쉬거나 산책하며 혼자 충전하기",
      "희망하는 동료들과 카페에 가서 수다 떨기"
    ],
    "labels": [
      "혼자 충전 만렙",
      "카페 수다 충전 만렙"
    ]
  },
  {
    "id": 3,
    "text": "이번 팀미팅이 끝난 뒤, 동료에게 둘 중 한마디를 들을 수 있다면 무엇이 더 좋겠나요?",
    "options": [
      "“너랑 하면 복잡한 일도 풀리더라.”",
      "“너랑 하면 어려운 얘기도 편하게 하게 돼.”"
    ],
    "labels": [
      "복잡한 일을 풀어주는 해결 메이트",
      "어려운 얘기도 편하게 하는 대화 메이트"
    ]
  }
];
  function validFun(a){return Array.isArray(a)&&a.length===4&&a.every(v=>v===0||v===1);}
  function validProfile(p){return !!p&&typeof p.name==='string'&&p.name.trim().length>0&&p.name.length<=20&&['dev','pm','design'].includes(p.role)&&p.scale===8&&Array.isArray(p.answers)&&p.answers.length===24&&p.answers.every(a=>Number.isInteger(a)&&a>=1&&a<=4)&&validFun(p.funAnswers);}
  function checksum(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return (h>>>0).toString(36);}
  function encode(p){if(!validProfile(p))throw Error('40문항 버전의 업무 성향·밸런스 게임과 닉네임을 확인해주세요.');const raw=JSON.stringify([8,p.name.trim(),p.answers.join(''),p.role,p.funAnswers.join('')]);const b64=btoa(Array.from(new TextEncoder().encode(raw),c=>String.fromCharCode(c)).join('')).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');return `WM8.${b64}.${checksum(b64)}`;}
  function decode(code){try{if(code.length>2000)throw 0;const [tag,b64,hash,...extra]=code.trim().split('.');if(tag!=='WM8'||extra.length||checksum(b64)!==hash)throw 0;const raw=new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(atob(b64.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0)));const [v,name,answers,role,fun]=JSON.parse(raw);if(v!==8||typeof answers!=='string'||!/^[1-4]{24}$/.test(answers)||typeof fun!=='string'||!/^[01]{4}$/.test(fun))throw 0;const p={name,answers:[...answers].map(Number),role,scale:8,funAnswers:[...fun].map(Number)};if(!validProfile(p))throw 0;return p;}catch{throw Error('40문항 버전 WM8 코드가 필요해요. 이전 문항의 코드는 함께 집계하지 않아요.');}}
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
  function demoPeople(){const seeds=[['모모',[1,2,3,1,3,2,1,1]],['루카',[1,2,3,1,3,2,4,4]],['누리',[4,4,1,4,2,4,4,4]],['도담',[4,4,1,4,2,4,1,1]],['보리',[2,1,4,2,4,2,1,3]],['유자',[2,1,4,2,4,2,4,1]]];return seeds.map(([name,values],i)=>({name,role:['pm','dev','design'][i%3],scale:8,funAnswers:[i%2,Math.floor(i/2)%2,(i+1)%2,Math.floor(i/3)%2],answers:questions.map(q=>Math.min(4,values[q.dim]+((q.id+i*2)%11===0?1:0)))}));}
  const choices=[1,2,3,4];
  const api={dimensions,questions,values,choices,funQuestions,validFun,demoPeople,encode,decode,scores,match,teamCompatibility,ranking,evidence,answerLabel,validProfile};
  root.Workmate=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
