(function(root){
  const labels=['매우 불만족','불만족','보통','만족','매우 만족','판단하기 어려워요'];
  const lifeNames=['근무·휴가 공유','회식 당번제','생일 챙기기','간식 운영','좌석 변경','격주 팀 점심','칼퇴 운영'];
  const lifeDescriptions=['공유캘린더를 기본으로 하고 특이사항만 별도 공유','당번제로 회식 준비','회식 당번이 생일 챙기기','견과류 비치와 여행 간식 구비','연 2회 뽑기','격주, 선택 참여','칼퇴 운영'];
  const questions=[
    {id:'workSatisfaction',text:'현재 팀에서 일하는 방식에 전반적으로 얼마나 만족하나요?',type:'single',options:labels},
    {id:'workKeep',text:'지금 일하는 방식 중 앞으로도 유지하면 좋겠는 것은 무엇인가요?',type:'multi',options:['위클리에서 진행 상황과 이슈 나누기','차수마다 회고하기','회고에서 개선할 일 정하기','과제별로 관련된 사람이 모여 협의하기','결정 사항을 글로 남기기','상황에 맞게 진행 방식 조정하기','기타','특별히 없어요'],exclusive:[7]},
    {id:'retrospective',text:'최근 두 차수의 회고에서 정한 개선 사항은 실제 업무에 얼마나 적용됐나요?',type:'single',options:['거의 적용되지 않았어요','일부만 적용됐어요','절반 정도 적용됐어요','대부분 적용됐어요','꾸준히 적용됐어요','정한 개선 사항이 없거나 잘 모르겠어요']},
    {id:'workPriorities',text:'일하는 방식에서 팀이 공통 기준을 정하면 좋겠는 것은 무엇인가요?',type:'multi',max:3,options:['급건의 우선순위를 누가 정할지','과제별 담당과 최종 결정자','업무 협의에 사용할 채널','결정 사항을 기록할 곳','위클리에서 공유할 내용과 범위','회고에서 정한 개선을 확인하는 방법','집중 시간과 회의 시간 조율','기타','지금보다 공통 기준을 늘릴 필요는 없어요','잘 모르겠어요'],exclusive:[8,9]},
    {id:'lifeSatisfaction',text:'현재 팀 생활 방식에 전반적으로 얼마나 만족하나요?',type:'single',options:labels},
    {id:'lifeRules',text:'아래 팀 생활 방식 각각에 대해 어떻게 하면 좋겠나요?',type:'grid',rows:lifeNames,descriptions:lifeDescriptions,options:['그대로 유지','일부 조정','중단','경험이 없어 판단하기 어려워요']},
    {id:'lifeChangeComment',text:'일부 조정하거나 중단하고 싶은 항목은 무엇을 어떻게 바꾸면 좋을까요?',type:'text',optional:true},
    {id:'lifeKeepComment',text:'팀 생활에서 그대로 이어갔으면 하는 점이 있다면 적어주세요.',type:'text',optional:true},
    {id:'burden',text:'팀 생활 룰이 바뀔 때 적응하거나 챙기는 데 얼마나 부담을 느끼나요?',type:'single',options:['전혀 부담스럽지 않아요','별로 부담스럽지 않아요','보통이에요','부담스러운 편이에요','매우 부담스러워요','변경을 경험하지 않아 판단하기 어려워요']},
    {id:'changeMethod',text:'팀 생활 룰을 바꿀 필요가 생기면 어떤 방식으로 정하면 좋겠나요?',type:'single',options:['의견을 모아 변경안을 정하고 바로 적용하기','일정 기간 시범 운영한 뒤 계속할지 정하기','정기적으로 의견을 모으는 시점에 함께 검토하기','상황에 따라 변경 방법을 다르게 정하기','기타','잘 모르겠어요']},
    {id:'newLife',text:'새로 시도해보고 싶은 팀 생활 방식이 있나요?',type:'multi',max:2,options:['칭찬·감사 공유','가벼운 문화 활동','스터디·지식 공유','신규 멤버 온보딩 버디','워크숍 정례화','기타','지금 방식으로 충분해요','잘 모르겠어요'],exclusive:[6,7]},
    {id:'comment',text:'일하는 방식이나 팀 생활에 대해 위 질문에서 다루지 못한 의견이 있나요?',type:'text',optional:true}
  ];
  function visible(q,a){return !q.conditional||Array.isArray(a.lifeRules)&&a.lifeRules.some(v=>v===1||v===2);}
  function validAnswer(q,v){
    if(q.type==='text')return (v===undefined&&q.optional)||(typeof v==='string'&&v.length<=2000);
    if(q.type==='single')return Number.isInteger(v)&&v>=0&&v<q.options.length;
    if(q.type==='grid')return Array.isArray(v)&&v.length===q.rows.length&&v.every(x=>Number.isInteger(x)&&x>=0&&x<q.options.length);
    return Array.isArray(v)&&v.length>0&&v.length<=(q.max||q.options.length)&&new Set(v).size===v.length&&v.every(x=>Number.isInteger(x)&&x>=0&&x<q.options.length)&&(!v.some(x=>q.exclusive?.includes(x))||v.length===1);
  }
  function complete(a){return !!a&&typeof a==='object'&&!Array.isArray(a)&&questions.every(q=>(!visible(q,a)||validAnswer(q,a[q.id]))&&(a[q.id+'Other']===undefined||typeof a[q.id+'Other']==='string'&&a[q.id+'Other'].length<=500));}
  function valid(p){return p&&p.version===2&&typeof p.id==='string'&&/^[a-zA-Z0-9-]{8,80}$/.test(p.id)&&complete(p.answers);}
  function checksum(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return (h>>>0).toString(36);}
  function clean(p){const answers={};for(const q of questions)if(visible(q,p.answers)){if(p.answers[q.id]!==undefined)answers[q.id]=p.answers[q.id];const other=q.options?.indexOf('기타');if(other>=0&&(p.answers[q.id]===other||Array.isArray(p.answers[q.id])&&p.answers[q.id].includes(other))&&p.answers[q.id+'Other'])answers[q.id+'Other']=p.answers[q.id+'Other'];}return {version:2,id:p.id,answers};}
  function encode(p){if(!valid(p))throw Error('업무·생활 문항을 확인해주세요.');const raw=JSON.stringify(clean(p));const b64=btoa(Array.from(new TextEncoder().encode(raw),c=>String.fromCharCode(c)).join('')).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');return `WL2.${b64}.${checksum(b64)}`;}
  function decode(code){try{if(code.length>60000)throw 0;const [tag,b64,hash,...extra]=code.split('.');if(tag!=='WL2'||extra.length||checksum(b64)!==hash)throw 0;const raw=new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(atob(b64.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0)));const p=JSON.parse(raw);if(!valid(p))throw 0;return clean(p);}catch{throw Error('업무·생활 코드가 온전하지 않아요. WL2부터 끝까지 복사해주세요.');}}
  const key='wm-work-life-v2';
  function load(){try{const s=JSON.parse(localStorage.getItem(key));if(s&&Array.isArray(s.responses)&&s.responses.every(valid))return s;}catch{}return {responses:[]};}
  const api={questions,lifeNames,lifeDescriptions,visible,validAnswer,complete,valid,encode,decode,load,key};root.WorkLife=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
