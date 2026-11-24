(function(root){
  const phrases=[
    ['맥락 없으면 시동 안 거는 인간 내비게이션','일단 실행 버튼부터 누르는 돌격대장','새로운 일을 받으면 지난 기록과 배경을 살핀 뒤 시작하는 행동을 더 골랐어요.','새로운 일을 받으면 작은 시도로 감을 잡고 다음 선택을 하는 행동을 더 골랐어요.'],
    ['회의도 문서 한 장으로 평정하는 기록 마법사','말하면서 답을 찾아내는 라이브 해설가','의견을 글로 정리하고 기록으로 전하는 쪽에 응답이 모였어요.','대화를 주고받으며 생각과 의견을 맞추는 쪽에 응답이 모였어요.'],
    ['질문을 숙성시켜 한 번에 푸는 집중 장인','중간 공유가 끊기면 손이 근질거리는 중계 캐스터','진행 상황과 질문을 모아 한 번에 맞추는 행동을 더 골랐어요.','작은 변화도 짧게 자주 공유하며 맞추는 행동을 더 골랐어요.'],
    ['계획표에 세계 평화를 담는 작전 사령관','변수가 와도 경로를 다시 찾는 현장 지휘관','함께 할 일과 순서를 구체적으로 정하는 쪽에 응답이 모였어요.','방향은 함께 보되 상황에 따라 할 일을 조정하는 쪽에 응답이 모였어요.'],
    ['초안도 퇴고하고 보여주는 완성도 수호자','미완성도 당당히 중계하는 초안 방송국','어느 정도 정리한 뒤 피드백을 구하는 행동을 더 골랐어요.','거친 초안이나 떠오른 생각부터 동료와 나누는 행동을 더 골랐어요.'],
    ['배포 버튼 앞에서 한 번 더 묻는 안전벨트','작게 내고 다음 판을 여는 실행 가속기','결정 전에 조건과 영향을 더 확인하는 쪽에 응답이 모였어요.','작게 결정하고 실행 결과로 다음 선택을 이어가는 쪽에 응답이 모였어요.'],
    ['흩어진 의견을 줄 세우는 맥락 교통정리반','안건 하나에 가능성 열 개를 켜는 아이디어 발전소','협업 상황에서 구조와 맥락을 정리하는 행동을 더 골랐어요.','협업 상황에서 다른 관점과 가능성을 보태는 행동을 더 골랐어요.'],
    ['마지막 빈틈까지 지켜내는 엔딩 수문장','아무도 안 연 문부터 여는 첫발 개척자','일을 이어가며 빈틈을 메우고 마무리하는 행동을 더 골랐어요.','첫 안과 작은 시도로 일을 출발시키는 행동을 더 골랐어요.']
  ];
  function personal(name,dims){
    const clear=[...dims].filter(d=>d.direction!=='mixed'&&Math.max(d.leftCount,d.rightCount)>=2).sort((a,b)=>b.strength-a.strength||a.dim-b.dim),top=clear[0];
    if(!top)return {title:`${name}님은 상황을 보며 방식을 고르는 동료예요.`,paragraphs:['이번 응답은 한 방향으로 뚜렷하게 모이기보다, 상황에 따라 다른 행동을 고른 모습이에요. 정해진 유형 하나보다 어떤 장면에서 어떤 방식을 골랐는지 살펴보면 나를 더 잘 설명할 수 있어요.','다음 협업에서는 “이번에는 어떻게 시작하고, 언제 함께 확인하면 편할까?”부터 이야기해보세요.']};
    const say=d=>phrases[d.dim][d.direction==='left'?2:3];
    return {title:`${name}님, 당신은 ‘${phrases[top.dim][top.direction==='left'?0:1]}’!`,paragraphs:[clear.slice(0,2).map(say).join(' '),`함께 일할 때는 ‘${top.name}’에 대한 기대를 먼저 나눠보세요. 내가 편한 방식과 동료가 기대하는 방식을 미리 맞춰볼 수 있어요.`]};
  }
  function mate(person,mate,W,A,profile){
    const a=profile.analyze(person,W,A),b=profile.analyze(mate,W,A),chemistry=W.match(person,mate);
    const common=a.slice(0,6).filter((d,i)=>d.direction!=='mixed'&&d.direction===b[i].direction&&Math.max(d.leftCount,d.rightCount)>=2&&Math.max(b[i].leftCount,b[i].rightCount)>=2&&Math.abs(d.mean-b[i].mean)<=.5).sort((x,y)=>Math.abs(x.mean-b[x.dim].mean)-Math.abs(y.mean-b[y.dim].mean)||x.dim-y.dim)[0];
    const gap=a.slice(0,6).map((d,i)=>({a:d,b:b[i],gap:Math.abs(d.mean-b[i].mean)})).sort((x,y)=>y.gap-x.gap||x.a.dim-y.a.dim)[0];
    const paragraphs=[];
    if(common)paragraphs.push(`두 분은 ‘${common.name}’에서 ‘${common.label}’ 쪽 행동을 함께 더 골랐어요. 일을 시작하기 전부터 맞춰볼 수 있는 공통점이에요.`);
    else paragraphs.push('두 분의 응답에서 한 방향으로 뚜렷하게 모인 공통 리듬은 찾기 어려웠어요. 아래 실제 선택을 비교하며 각자 떠올린 업무 장면부터 나눠보면 좋아요.');
    if(gap.gap>=1)paragraphs.push(`가장 먼저 맞춰볼 것은 ‘${gap.a.name}’예요. ${person.name}님은 ‘${gap.a.label}’, ${mate.name}님은 ‘${gap.b.label}’로 나타났어요. 다음 과제에서는 이 부분을 어떻게 맞출지 먼저 정해보세요.`);
    else paragraphs.push('여섯 가지 협업 리듬에서 두 분의 응답 차이는 모두 1점 미만이에요. 같은 선택에도 이유는 다를 수 있으니, 최근 실제 사례 하나씩을 이야기해보세요.');
    const role=a.slice(6).find(d=>d.direction!=='mixed'&&b[d.dim].direction!=='mixed'&&d.direction!==b[d.dim].direction);
    if(role)paragraphs.push(`‘${role.name}’에서는 ‘${role.label}’와 ‘${b[role.dim].label}’로 방향이 달랐어요. 서로 맡고 싶은 구간을 나눠볼 단서가 될 수 있어요.`);
    paragraphs.push(`밸런스 게임은 네 개 중 ${chemistry.funSame}개가 같아요. ${chemistry.funSame>=3?'회의가 끝나도 할 얘기가 남을 취향 동맹!':'다른 선택의 이유를 듣는 것부터 이미 팀미팅 안건이에요.'} 이 보너스 취향은 궁합률에 더하지 않았어요.`);return {title:chemistry.score>=85?'눈빛으로 다음 액션까지 통할 것 같은 업무 듀오!':chemistry.score>=65?'닮은 리듬에 다른 한 스푼, 합 맞춰볼 맛 나는 듀오!':'자동 찰떡은 아니지만, 서로 번역기를 맞춰볼 듀오!',paragraphs};
  }
  function team({n,satisfaction,life,work,priorityNames,temperature}){
    if(!n)return null;
    const paragraphs=[];
    if(temperature){
      if(temperature.degrees===null)paragraphs.push('팀 온도는 아직 판단을 보류한 응답뿐이에요. 서로를 알아갈 시간이 더 필요할 수 있어요.');
      else if(temperature.warm>temperature.count/2)paragraphs.push(`채팅탭의 팀 온도는 ${temperature.degrees}°C예요. 응답한 ${temperature.count}명 중 ${temperature.warm}명이 의견과 도움 요청을 편하게 꺼내거나 서로 먼저 챙기는 분위기를 골랐어요. 이 온기를 유지할 작은 습관을 찾아보면 좋겠어요.`);
      else if(temperature.cold>temperature.count/2)paragraphs.push(`채팅탭의 팀 온도는 ${temperature.degrees}°C예요. 응답한 ${temperature.count}명 중 ${temperature.cold}명이 말을 꺼내기 조심스럽거나 필요한 말 위주로 한다고 답했어요. 이번 팀미팅에서는 결론보다 각자의 이야기를 듣는 시간을 먼저 가져보면 좋겠어요.`);
      else paragraphs.push(`채팅탭의 팀 온도는 ${temperature.degrees}°C예요. 편하게 느끼는 정도가 한쪽으로 모이지 않았어요. 평균 온도 하나로 팀을 단정하기보다 어떤 상황에서 말하기 편하거나 어려운지 나눠보세요.`);
    }
    for(const [key,title] of [['work','회의·협의를 거쳐 업무를 진행하는 과정'],['life','회식·점심 등 함께 지내는 운영 방식']]){
      const values=satisfaction[key],yes=values.filter(v=>v===4||v===5).length,no=values.filter(v=>v===1||v===2).length,unknown=values.filter(v=>v===6).length;
      paragraphs.push(yes>n/2?`${title}은 편하다는 응답이 ${n}명 중 ${yes}명으로 과반이에요.`:no>n/2?`${title}은 불편하다는 응답이 ${n}명 중 ${no}명으로 과반이에요. 불편했던 장면부터 함께 짚어보면 좋겠어요.`:unknown>=n/2?`${title}은 판단을 보류한 응답이 ${n}명 중 ${unknown}명이에요. 지금 자료만으로 편안함을 한쪽으로 정리하기는 어려워요.`:`${title}은 편하다와 불편하다 중 어느 쪽도 과반이 아니에요. 하나의 평가로 묶기보다 응답의 분포를 함께 살펴보세요.`);
    }
    const change=[...life].sort((a,b)=>b.counts[1]+b.counts[2]-a.counts[1]-a.counts[2])[0],keep=[...life].sort((a,b)=>b.counts[0]-a.counts[0])[0];
    const hasChange=change&&change.counts[1]+change.counts[2]>0;
    const lead=work.filter(([name,count])=>priorityNames.includes(name)&&count>0).sort((a,b)=>b[1]-a[1])[0];
    if(lead)paragraphs.push(`업무에서는 ‘${lead[0]}’를 새 팀의 공통규칙으로 고른 응답이 ${lead[1]}명으로 가장 많았어요${work.filter(([name,count])=>priorityNames.includes(name)&&count===lead[1]).length>1?'(공동 최다)':''}. 지금 채팅탭에서도 지킬 규칙으로 삼을지 이야기해보면 좋겠어요.`);
    else paragraphs.push('팀의 구체적인 공통규칙에 표가 모이지 않았어요. “공통규칙을 따로 두고 싶지 않다”와 “잘 모르겠다”를 구분해 아래 응답을 확인해보세요.');
    if(keep?.counts[0])paragraphs.push(`생활에서는 ‘${keep.name}’의 유지 의견이 ${keep.counts[0]}명으로 가장 많았어요${life.filter(x=>x.counts[0]===keep.counts[0]).length>1?'(공동 최다)':''}.`);
    if(hasChange)paragraphs.push(`한편 ‘${change.name}’는 일부 조정 ${change.counts[1]}명, 중단 ${change.counts[2]}명으로 변경 의견이 가장 많았어요${life.filter(x=>x.counts[1]+x.counts[2]===change.counts[1]+change.counts[2]).length>1?'(공동 최다)':''}. ‘없애기’로 묶기 전에 어떤 부분을 바꾸고 싶은지부터 확인해보세요.`);
    else paragraphs.push('생활 룰에는 조정·중단 의견이 없었어요. 유지와 판단 보류의 비율을 구분해서 읽어주세요.');
    return {title:lead&&hasChange?'업무의 기준은 맞추고, 생활 룰은 필요한 곳만 수리할 타이밍!':hasChange?'팀 생활, 전면 공사보다 불편한 부분부터 리모델링!':'일단 현행 유지파? 판단 보류표까지 열어보고 이야기해요.',paragraphs};
  }
  function html(story,esc,label='결과를 문장으로 읽으면'){
    if(!story)return '';
    return `<section class="result-story" aria-label="${esc(label)}"><p class="story-label">${esc(label)}</p><h2>${esc(story.title)}</h2><div class="story-paragraphs">${story.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div></section>`;
  }
  const api={personal,mate,team,html};root.ResultStories=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
