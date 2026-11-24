(function(root){
  const questions=[
  {
    "id": "workSatisfaction",
    "text": "최근 한 달, 채팅탭에서 회의로 방향을 맞추고 필요한 사람과 협의하며 맡은 일을 진행하는 과정은 전반적으로 어땠나요?",
    "type": "single",
    "options": [
      "진행하기 매우 불편했어요",
      "불편한 점이 있는 편이었어요",
      "좋은 점과 불편한 점이 비슷했어요",
      "대체로 일하기 편했어요",
      "매우 일하기 편했어요",
      "함께 일한 기간이나 경험이 부족해요"
    ]
  },
  {
    "id": "workKeep",
    "text": "채팅탭에서 앞으로도 계속했으면 하는 일하는 습관은 무엇인가요? 실제로 경험했고 도움이 됐던 것을 골라주세요.",
    "type": "multi",
    "options": [
      "위클리에서 서로의 진행 상황과 막힌 점 나누기",
      "일정한 주기로 업무를 돌아보는 회고하기",
      "회고에서 다음에 바꿔볼 행동 정하기",
      "과제에 필요한 사람끼리 모여 짧게 협의하기",
      "결정한 내용과 이유를 글로 남기기",
      "상황이 달라지면 계획을 함께 조정하기",
      "기타",
      "아직 유지하고 싶은 습관을 고르기 어려워요"
    ],
    "exclusive": [
      7
    ]
  },
  {
    "id": "teamTemperature",
    "text": "요즘 채팅탭에서 내 의견을 말하거나 동료에게 도움을 부탁할 때, 팀 분위기는 어떤 온도에 가깝나요?",
    "type": "single",
    "options": [
      "얼음 깨는 중 · 말을 꺼내기 많이 조심스러워요",
      "조금 쌀쌀 · 꼭 필요한 말 위주로 하게 돼요",
      "실온 · 업무 이야기는 무난하게 나눠요",
      "따뜻 · 의견도 도움 요청도 편하게 꺼내요",
      "온기 충전 · 서로 먼저 묻고 챙겨주는 편이에요",
      "아직 함께한 경험이 적어 판단하기 어려워요"
    ]
  },
  {
    "id": "workPriorities",
    "text": "내가 새 팀을 꾸린다면, 함께 일할 때 꼭 지켰으면 하는 공통규칙은 무엇인가요? 최대 3개를 골라주세요.",
    "type": "multi",
    "max": 3,
    "options": [
      "급한 요청이 오면 기존 일과 우선순위를 함께 정하기",
      "과제를 시작할 때 담당자와 최종 결정자를 정하기",
      "업무를 논의할 메신저방이나 채널을 정해두기",
      "결정 사항은 모두가 찾을 수 있는 한곳에 기록하기",
      "주간 공유는 진행 상황과 막힌 점 위주로 짧게 하기",
      "회고에서 정한 개선은 다음 회고 때 확인하기",
      "집중할 시간을 미리 공유하고 그 시간의 회의 줄이기",
      "기타",
      "팀 전체의 공통규칙을 따로 두고 싶지 않아요",
      "아직 잘 모르겠어요"
    ],
    "exclusive": [
      8,
      9
    ]
  },
  {
    "id": "lifeSatisfaction",
    "text": "채팅탭의 회식·팀 점심·생일 챙기기·간식·좌석 변경처럼, 업무 외에 함께 지내는 활동과 운영 방식은 나에게 얼마나 편한가요?",
    "type": "single",
    "options": [
      "참여하거나 챙기기가 매우 불편해요",
      "불편한 점이 있는 편이에요",
      "편한 점과 불편한 점이 비슷해요",
      "대체로 편하게 참여하고 지내요",
      "지금 방식이 매우 편하고 좋아요",
      "참여하거나 경험한 적이 적어 판단하기 어려워요"
    ]
  },
  {
    "id": "lifeRules",
    "text": "채팅탭에서 함께 지내는 규칙을 점검하려고 해요. 아래 각 항목을 보고, 지금처럼 유지할지·운영 방법을 바꿀지·그만할지 하나씩 골라주세요. 모르는 항목은 판단 보류를 골라도 돼요.",
    "type": "grid",
    "rows": [
      "근무·휴가 공유",
      "회식 당번제",
      "생일 챙기기",
      "간식 운영",
      "좌석 변경",
      "격주 팀 점심",
      "퇴근 시간 존중"
    ],
    "descriptions": [
      "근무·휴가는 공유캘린더로 확인하고 특이사항만 따로 알리는 방식",
      "회식 준비를 당번이 돌아가며 맡는 방식",
      "생일을 맞은 동료를 회식 당번이 챙기는 방식",
      "견과류를 비치하고 여행 간식을 함께 나누는 방식",
      "일 년에 두 번 뽑기로 자리를 바꾸는 방식",
      "격주로 팀 점심을 잡고 원하는 사람이 참여하는 방식",
      "정해둔 퇴근 시간을 지킬 수 있도록 서로 배려하는 방식"
    ],
    "options": [
      "지금 운영 방식 그대로 유지하기",
      "활동은 하되 운영 방법 바꾸기",
      "이 활동이나 규칙은 그만하기",
      "경험이 없거나 내용을 몰라 판단 보류"
    ]
  },
  {
    "id": "lifeChangeComment",
    "text": "위에서 살펴본 회식·팀 점심·생일·간식·좌석·근무 및 퇴근 규칙 중, 바꾸거나 그만하고 싶은 것이 있나요? 있다면 항목과 바라는 방식을 적어주세요.",
    "type": "text",
    "optional": true,
    "hint": "예: 회식 준비를 혼자 맡기 부담스러워요. 두 사람이 같이 준비하면 좋겠어요. 바꿀 점이 없으면 비워도 돼요."
  },
  {
    "id": "lifeKeepComment",
    "text": "회식·팀 점심·생일·간식·좌석·근무 및 퇴근 규칙 중 “이건 채팅탭에서 계속했으면 좋겠다” 싶은 것이 있나요? 그 이유나 좋았던 경험을 적어주세요.",
    "type": "text",
    "optional": true,
    "hint": "예: 팀 점심이 선택 참여라 부담이 없었고, 평소 대화가 적었던 동료와 이야기할 수 있었어요. 떠오르는 것이 없으면 비워도 돼요."
  },
  {
    "id": "burden",
    "text": "예를 들어 회식 당번 순서나 팀 점심 요일처럼, 팀에서 정해둔 생활 규칙이 바뀔 때 새 방식을 기억하고 맞추는 일은 나에게 얼마나 부담인가요?",
    "type": "single",
    "options": [
      "바뀌어도 전혀 부담스럽지 않아요",
      "크게 신경 쓰이지 않는 편이에요",
      "상황에 따라 부담이 다르게 느껴져요",
      "새 방식을 챙기는 일이 부담스러운 편이에요",
      "자주 바뀌면 많이 피곤하고 부담스러워요",
      "규칙 변경을 경험하지 않아 잘 모르겠어요"
    ]
  },
  {
    "id": "changeMethod",
    "text": "팀 점심 운영에 불편하다는 의견이 나왔다고 해볼게요. 지금 방식을 바꾸기로 한다면, 어떤 과정을 거치는 것이 좋겠나요?",
    "type": "single",
    "options": [
      "의견을 모아 새 방법을 정하고 다음 팀 점심부터 적용하기",
      "몇 번만 새 방법으로 해본 뒤 계속할지 함께 정하기",
      "정기 팀미팅에 안건으로 올려 다른 규칙과 함께 검토하기",
      "불편을 겪는 사람들과 상황을 확인한 뒤 변경 절차 정하기",
      "기타",
      "아직 잘 모르겠어요"
    ]
  },
  {
    "id": "newLife",
    "text": "채팅탭 동료들과 조금 더 편하게 가까워지기 위해, 새로 해보고 싶은 활동이 있나요? 실제로 참여해볼 만한 것을 최대 2개 골라주세요.",
    "type": "multi",
    "max": 2,
    "options": [
      "고마웠던 동료나 도움받은 일을 짧게 나누기",
      "원하는 사람끼리 가벼운 문화 활동하기",
      "내가 아는 업무 팁이나 도구를 서로 소개하기",
      "새 멤버가 편하게 물어볼 수 있는 버디 정하기",
      "가끔 업무를 벗어나 대화하는 워크숍 열기",
      "기타",
      "새 활동을 늘리지 않고 지금 정도로 지내고 싶어요",
      "아직 잘 모르겠어요"
    ],
    "exclusive": [
      6,
      7
    ]
  },
  {
    "id": "comment",
    "text": "이번 팀미팅에서 채팅탭 동료들과 꼭 이야기하고 싶은 것이 있나요? 함께 일하면서 좋았던 점, 불편했던 점, 서로에게 바라는 점 중 하나를 적어주세요.",
    "type": "text",
    "optional": true,
    "hint": "실제 겪은 상황과 바라는 변화를 함께 적으면 대화하기 좋아요. 특정 사람의 이름은 적지 않아도 돼요."
  }
];
  const lifeNames=questions.find(q=>q.id==='lifeRules').rows;
  const lifeDescriptions=questions.find(q=>q.id==='lifeRules').descriptions;
  function visible(q,a){return !q.conditional||Array.isArray(a.lifeRules)&&a.lifeRules.some(v=>v===1||v===2);}
  function validAnswer(q,v){
    if(q.type==='text')return (v===undefined&&q.optional)||(typeof v==='string'&&v.length<=2000);
    if(q.type==='single')return Number.isInteger(v)&&v>=0&&v<q.options.length;
    if(q.type==='grid')return Array.isArray(v)&&v.length===q.rows.length&&v.every(x=>Number.isInteger(x)&&x>=0&&x<q.options.length);
    return Array.isArray(v)&&v.length>0&&v.length<=(q.max||q.options.length)&&new Set(v).size===v.length&&v.every(x=>Number.isInteger(x)&&x>=0&&x<q.options.length)&&(!v.some(x=>q.exclusive?.includes(x))||v.length===1);
  }
  function complete(a){return !!a&&typeof a==='object'&&!Array.isArray(a)&&questions.every(q=>(!visible(q,a)||validAnswer(q,a[q.id]))&&(a[q.id+'Other']===undefined||typeof a[q.id+'Other']==='string'&&a[q.id+'Other'].length<=500));}
  function valid(p){return p&&p.version===3&&typeof p.id==='string'&&/^[a-zA-Z0-9-]{8,80}$/.test(p.id)&&complete(p.answers);}
  function checksum(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return (h>>>0).toString(36);}
  function clean(p){const answers={};for(const q of questions)if(visible(q,p.answers)){if(p.answers[q.id]!==undefined)answers[q.id]=p.answers[q.id];const other=q.options?.indexOf('기타');if(other>=0&&(p.answers[q.id]===other||Array.isArray(p.answers[q.id])&&p.answers[q.id].includes(other))&&p.answers[q.id+'Other'])answers[q.id+'Other']=p.answers[q.id+'Other'];}return {version:3,id:p.id,answers};}
  function encode(p){if(!valid(p))throw Error('업무·생활 문항을 확인해주세요.');const raw=JSON.stringify(clean(p));const b64=btoa(Array.from(new TextEncoder().encode(raw),c=>String.fromCharCode(c)).join('')).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');return `WL3.${b64}.${checksum(b64)}`;}
  function decode(code){try{if(code.length>60000)throw 0;const [tag,b64,hash,...extra]=code.split('.');if(tag!=='WL3'||extra.length||checksum(b64)!==hash)throw 0;const raw=new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(atob(b64.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0)));const p=JSON.parse(raw);if(!valid(p))throw 0;return clean(p);}catch{throw Error('업무·생활 코드가 온전하지 않아요. WL3부터 끝까지 복사해주세요.');}}
  const key='wm-work-life-v3';
  function load(){try{const s=JSON.parse(localStorage.getItem(key));if(s&&Array.isArray(s.responses)&&s.responses.every(valid))return s;}catch{}return {responses:[]};}
  function temperature(values){const valid=values.filter(v=>Number.isInteger(v)&&v>=0&&v<=4);return {degrees:valid.length?Math.round(valid.reduce((sum,v)=>sum+10+20*v,0)/valid.length):null,count:valid.length,total:values.length,unknown:values.length-valid.length,warm:valid.filter(v=>v>=3).length,cold:valid.filter(v=>v<=1).length,counts:[0,1,2,3,4].map(v=>valid.filter(x=>x===v).length)};}
  const api={questions,lifeNames,lifeDescriptions,temperature,visible,validAnswer,complete,valid,encode,decode,load,key};root.WorkLife=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
