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
  function personalBase(name,dims){
    const clear=[...dims].filter(d=>d.direction!=='mixed'&&Math.max(d.leftCount,d.rightCount)>=2).sort((a,b)=>b.strength-a.strength||a.dim-b.dim),top=clear[0];
    if(!top)return {title:`${name}님은 상황을 보며 방식을 고르는 동료예요.`,paragraphs:['이번 응답은 한 방향으로 뚜렷하게 모이기보다, 상황에 따라 다른 행동을 고른 모습이에요. 정해진 유형 하나보다 어떤 장면에서 어떤 방식을 골랐는지 살펴보면 나를 더 잘 설명할 수 있어요.','다음 협업에서는 “이번에는 어떻게 시작하고, 언제 함께 확인하면 편할까?”부터 이야기해보세요.']};
    const say=d=>phrases[d.dim][d.direction==='left'?2:3];
    return {title:`${name}님, 당신은 ‘${phrases[top.dim][top.direction==='left'?0:1]}’!`,paragraphs:[clear.slice(0,2).map(say).join(' '),`함께 일할 때는 ‘${top.name}’에 대한 기대를 먼저 나눠보세요. 내가 편한 방식과 동료가 기대하는 방식을 미리 맞춰볼 수 있어요.`]};
  }
  function mateBase(person,mate,W,A,profile){
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
  function teamBase({n,satisfaction,life,work,priorityNames,temperature}){
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
  const agreements=[
    ['배경을 먼저 확인하고 싶은 사람에게는 목표·이전 결정·참고 자료를 함께 건네보세요.','생각할 시간이 길어져 보일 때는 “어디까지 확인하면 시작할 수 있을까?”를 먼저 맞춰보세요.','배경을 같이 읽는 시간과 작은 예시를 만들어볼 시간을 각각 정해보세요.'],
    ['글로 정리하는 사람과 말로 푸는 사람이 만났다면, 짧은 메모를 먼저 주고 10분만 함께 이야기해보세요.','짧은 대답이 무관심을, 긴 글이 고집을 뜻하지는 않아요. 어떤 방식에서 서로 이해가 빨라지는지 확인해보세요.','논의 전 핵심 세 줄을 공유하고, 대화 뒤 결정 한 줄을 남겨보세요.'],
    ['자주 확인하는 방식은 재작업을 줄일 수 있고, 모아서 확인하는 방식은 집중을 지킬 수 있어요. 둘 중 하나를 정답으로 두지 말고 공유할 순간을 정해보세요.','조용히 일하는 시간을 “공유를 안 한다”로, 잦은 질문을 “혼자 못 한다”로 읽기 전에 기대하는 주기를 물어보세요.','지금 바로 알릴 변화와 다음 점검까지 모아둘 질문을 나눠보세요.'],
    ['계획을 세밀하게 정하는 방식과 해보며 바꾸는 방식 사이에서는, 바꾸지 않을 목표와 바꿔도 되는 방법을 나눠보세요.','계획을 바꾸자는 말이 약속을 가볍게 여긴다는 뜻은 아니고, 순서를 정하자는 말이 변화를 막겠다는 뜻도 아니에요.','이번 주에 고정할 일 두 개와 실험해도 되는 일 한 개를 정해보세요.'],
    ['초안을 일찍 주고받고 싶다면 “아직 결정 전”이라는 표시와 지금 받고 싶은 피드백을 같이 적어보세요.','다듬은 뒤 보여주는 사람에게 공유가 늦는 이유를, 일찍 보여주는 사람에게 지금 필요한 피드백의 범위를 먼저 물어보세요.','첫 초안을 언제 볼지, 그때는 방향·완성도 중 무엇을 볼지 먼저 정해보세요.'],
    ['확인하고 싶은 조건이 많은 사람과 일단 시험하고 싶은 사람이 만났다면, 확인할 조건과 되돌릴 범위를 함께 정해보세요.','신중함이 항상 느림은 아니고, 빠른 시도가 항상 무모함은 아니에요. 이번 결정에서 무엇을 지킬지 말로 맞춰보세요.','적용 전 확인할 조건 두 개와 문제가 생기면 되돌릴 방법 하나를 정해보세요.'],
    ['정리와 확장 중 누구에게 무엇이 편한지 물어보고, 이번 일에서 맡고 싶은 역할을 직접 골라보세요.','아이디어를 많이 보탠다고 정리를 못 하는 것도, 구조를 잡는다고 새 생각이 없는 것도 아니에요. 이번 응답에서 먼저 끌린 역할의 차이예요.','아이디어를 넓히는 시간과 안을 정리하는 시간을 나누고 역할은 서로 골라보세요.'],
    ['처음 가능성을 여는 일과 끝까지 완성하는 일 중 이번에 각자 맡고 싶은 구간을 먼저 물어보세요.','시작을 좋아한다고 마무리를 못 하는 것도, 완성을 고른다고 새 시도를 꺼린다는 뜻도 아니에요.','첫 예시를 만들 사람과 사용하기 좋게 다듬을 사람을 정하되, 서로 역할을 바꿔볼 기회도 남겨두세요.']
  ];
  const pct=(count,n)=>n?Math.round(count/n*100):0;
  const fixed=value=>Number(value).toFixed(2);
  const source=(q,answers)=>({label:`설문 ${q.surveyNumber}번`,question:q.text,answers});
  function personal(name,dims){
    const story=personalBase(name,dims),clear=[...dims].filter(d=>d.direction!=='mixed'&&Math.max(d.leftCount,d.rightCount)>=2).sort((a,b)=>b.strength-a.strength||a.dim-b.dim);
    const focus=(clear.length?clear:[...dims].sort((a,b)=>a.strength-b.strength||a.dim-b.dim)).slice(0,2);
    story.sections=focus.map((d,i)=>{
      const evidence=d.evidence||d.examples,opposite=d.direction==='left'?d.rightCount:d.leftCount;
      return {heading:i===0?'이 별명이 나온 진짜 단서':'함께 봐야 입체적인 두 번째 모습',
        body:d.direction==='mixed'?`‘${d.name}’는 세 답변이 한쪽으로 뚜렷하게 모이지 않았어요. ‘${d.left}’ ${d.leftCount}개와 ‘${d.right}’ ${d.rightCount}개를 함께 골랐으므로, 상황에 따라 다른 접근을 택한 것으로 읽었어요.`:`‘${d.name}’의 세 상황 중 ${d.direction==='left'?d.leftCount:d.rightCount}개에서 ‘${d.label}’ 쪽 행동을 골랐어요.${opposite?` 반대 방향의 행동도 ${opposite}개 있어 “언제나 그렇다”로 묶지는 않았어요.`:' 세 상황의 방향이 같아 이번 응답에서 비교적 선명한 단서로 골랐어요.'}`,
        evidence:evidence.slice(0,2).map(({q,option})=>source(q,[{name:'내가 고른 행동',text:option.text}])),
        note:`이 관점의 3문항 전체는 아래 ‘${d.name}’에서 확인할 수 있어요.`};
    });
    const top=focus[0],mixed=dims.filter(d=>d.direction==='mixed');
    if(top){
      story.sections.push({heading:'동료에게 건네는 나의 사용 설명서',body:agreements[top.dim][0]+' '+agreements[top.dim][1],prompt:agreements[top.dim][2]});
      const ties=clear.filter(d=>Math.abs(d.strength-(clear[0]?.strength||0))<1e-9);
      story.method=`업무 상황 24개를 8개 관점으로 나눠 각 3개 답변을 읽었어요. 별명은 가장 뚜렷한 관점을 대표로 고른 재미 표현이에요.${ties.length>1?` 같은 강도로 나온 관점이 ${ties.length}개라 별명 하나가 나의 전체 스타일을 뜻하지 않아요.`:''}${mixed.length?` ${mixed.length}개 관점은 한 방향으로 묶기 어려워 ‘상황에 따라 선택’으로 표시했어요.`:''} 밸런스 게임과 업무·생활 의견은 이 판단에 넣지 않았어요.`;
    }
    return story;
  }
  function mate(person,other,W,A,profile,{people=[]}={}){
    const story=mateBase(person,other,W,A,profile),m=W.match(person,other),a=profile.analyze(person,W,A),b=profile.analyze(other,W,A);
    const same=W.questions.filter(q=>person.answers[q.id]===other.answers[q.id]),sameRhythm=same.filter(q=>q.dim<6);
    const gaps=a.slice(0,6).map((d,i)=>({a:d,b:b[i],gap:Math.abs(d.mean-b[i].mean)})).sort((x,y)=>y.gap-x.gap||x.a.dim-y.a.dim);
    const closest=[...gaps].sort((x,y)=>x.gap-y.gap||x.a.dim-y.a.dim)[0],largest=gaps[0];
    const comparison=q=>source(q,[{name:person.name,text:A.optionsFor(q).find(o=>o.id===person.answers[q.id]).text},{name:other.name,text:A.optionsFor(q).find(o=>o.id===other.answers[q.id]).text}]);
    const ranks=people.length?W.ranking(person,people):[],leaders=ranks.filter(r=>r.score===ranks[0]?.score);
    const rankText=ranks.length?(leaders.length>1?`다른 참가자 ${ranks.length}명과 비교했고, 최고 점수 ${m.score}%인 동료가 ${leaders.length}명이에요. ${leaders.map(r=>r.person.name).join(' · ')}님은 공동 최고이며, 한 명의 독점 정답을 뜻하지 않아요.`:`다른 참가자 ${ranks.length}명과 비교한 응답 궁합 중 ${other.name}님이 가장 높았어요.${ranks[1]?` 다음 점수와는 ${m.score-ranks[1].score}%p 차이예요.`:''}`):'선택한 두 사람의 응답을 같은 기준으로 비교했어요.';
    story.sections=[
      {heading:`궁합률 ${m.score}%는 이렇게 나왔어요`,wide:true,body:rankText,
        table:{caption:'반올림 전 점수와 가중치',columns:['비교 항목','응답 비교값','반영 비중','궁합률에 더한 점수'],rows:[['협업 리듬 6개 관점',fixed(m.rawShared)+'%', '85%',fixed(m.sharedContribution)+'점'],['협업 기여 방식 2개 관점',fixed(m.rawBalance)+'%', '15%',fixed(m.balanceContribution)+'점']]},
        evidence:W.questions.filter(q=>q.dim===6).slice(0,1).map(comparison),
        note:`반올림 전 합계 ${fixed(m.rawScore)}점을 정수로 반올림해 ${m.score}%로 표시했어요. 리듬은 비슷할수록, 기여 방식은 다를수록 점수를 주는 워크숍용 가정이에요. 후자는 실제 분담이 잘된다는 보장이 아니며, 밸런스 게임은 0% 반영이에요.`},
      {heading:'말을 줄여도 통할 수 있는 부분',body:`24개 업무 상황 중 ${same.length}개에서 같은 행동을 골랐어요. 이 중 협업 리듬에 해당하는 18개 상황에서는 ${sameRhythm.length}개가 같아요. 가장 가까운 관점은 ‘${closest.a.name}’이고 평균 차이는 ${fixed(closest.gap)}점이에요.${same.length===0?' 같은 행동이 없어도 관점 평균이 가까워 점수가 비슷하게 나올 수 있어요.':` 아래 답변이 “닮았다”는 설명의 실제 근거예요.`}`,
        evidence:(sameRhythm.length?sameRhythm:same.length?same:W.questions.filter(q=>q.dim===closest.a.dim)).slice(0,2).map(comparison)},
      {heading:largest.gap>=1?'같은 팀이 되면 먼저 맞춰볼 지점':'평균이 가까워도 이유까지 같지는 않아요',
        body:`차이가 가장 큰 리듬은 ‘${largest.a.name}’예요. ${person.name}님은 ‘${largest.a.label}’, ${other.name}님은 ‘${largest.b.label}’이며 평균 차이는 ${fixed(largest.gap)}점이에요. ${largest.gap>=1?agreements[largest.a.dim][1]:'여섯 리듬 모두 차이가 1점 미만이지만, 아래에서 고른 행동과 그 이유를 따로 확인해보면 좋아요.'}`,
        evidence:W.questions.filter(q=>q.dim===largest.a.dim).sort((q,r)=>Number(person.answers[r.id]!==other.answers[r.id])-Number(person.answers[q.id]!==other.answers[q.id])||q.id-r.id).slice(0,2).map(comparison),prompt:agreements[largest.a.dim][2]},
      {heading:'업무 궁합 옆에 붙인 취향 보너스',body:`밸런스 게임은 네 개 중 ${m.funSame}개가 같아요. ${m.funSame>=3?'업무 밖에서도 대화를 이어갈 취향 동맹일지도요.':'다른 답을 고른 이유부터 들어보면 좋은 팀미팅 안건이 생겨요.'} 아래 선택은 업무 능력이나 궁합률의 근거로 쓰지 않았어요.`,
        evidence:[W.funQuestions.find(q=>person.funAnswers[q.id]!==other.funAnswers[q.id])||W.funQuestions[3]].map(q=>source(q,[{name:person.name,text:q.options[person.funAnswers[q.id]]},{name:other.name,text:q.options[other.funAnswers[q.id]]}]))}
    ];
    return story;
  }
  function team(data){
    const story=teamBase(data);if(!story)return story;
    const {n,satisfaction,life,work,priorityNames,temperature,signals={}}=data;
    const lead=work.filter(([name,count])=>priorityNames.includes(name)&&count>0).sort((a,b)=>b[1]-a[1])[0];
    const changes=[...life].sort((a,b)=>b.counts[1]+b.counts[2]-a.counts[1]-a.counts[2]),change=changes[0];
    const keep=[...life].sort((a,b)=>b.counts[0]-a.counts[0])[0];
    const counts=values=>[values.filter(v=>v===4||v===5).length,values.filter(v=>v===3).length,values.filter(v=>v===1||v===2).length,values.filter(v=>v===6).length];
    const workFeel=counts(satisfaction.work),lifeFeel=counts(satisfaction.life);
    story.intro=[...(temperature?[story.paragraphs[0]]:[]),`회의·협의를 거쳐 일하는 과정이 편하다는 답은 ${n}명 중 ${workFeel[0]}명(${pct(workFeel[0],n)}%), 회식·점심 등 함께 지내는 운영이 편하다는 답은 ${lifeFeel[0]}명(${pct(lifeFeel[0],n)}%)예요. 생활의 불편과 업무 진행의 불편은 따로 보고, 유지할 점과 바꿀 점을 골라보면 좋겠어요.`];
    story.sections=[];
    if(temperature){
      const polarized=temperature.count>0&&temperature.warm/temperature.count>=.25&&temperature.cold/temperature.count>=.25;
      story.sections.push({heading:polarized?'평균 온도 안에 서로 다른 체감이 있어요':'팀 온도에서 무엇을 읽었나요?',
        body:temperature.count?`${temperature.total}명 중 판단 보류 ${temperature.unknown}명을 빼고 ${temperature.count}명으로 계산했어요. 따뜻하거나 먼저 챙기는 분위기 ${temperature.warm}명(${pct(temperature.warm,temperature.count)}%), 조심스럽거나 필요한 말 위주인 분위기 ${temperature.cold}명(${pct(temperature.cold,temperature.count)}%), 실온 ${temperature.count-temperature.warm-temperature.cold}명이에요.${polarized?' 따뜻함과 조심스러움이 각각 25% 이상이므로 평균 온도만으로 팀 전체가 같다고 읽지 않았어요.':' 이 값은 업무 성과가 아니라 의견과 도움 요청을 꺼낼 때의 편안함이에요.'}`:'모든 응답이 판단 보류여서 0°C로 바꾸거나 차가운 팀이라고 설명하지 않았어요.',
        evidence:[{label:'설문 9번',question:'내 의견을 말하거나 동료에게 도움을 부탁할 때의 분위기',detail:temperature.degrees===null?'계산할 응답 없음':`유효 ${temperature.count}명 · 평균 ${temperature.degrees}°C · 판단 보류 ${temperature.unknown}명`}],prompt:'“어떤 상황에서는 편하게 말했고, 어떤 상황에서는 말을 아꼈나요?”를 한 가지씩 나눠보세요.'});
    }
    const paired=satisfaction.work.filter((v,i)=>v<=5&&satisfaction.life[i]<=5).length;
    const lifeHigher=satisfaction.work.filter((v,i)=>v<=5&&satisfaction.life[i]<=5&&satisfaction.life[i]>v).length;
    story.sections.push({heading:'함께 지내는 편안함과 일의 편안함을 따로 읽어요',
      body:`편함 비율은 모두 전체 ${n}명을 분모로 했고, 중간이나 판단 보류를 불편함으로 합치지 않았어요.${paired?` 두 질문 모두 판단한 ${paired}명 중 ${lifeHigher}명은 업무 진행보다 함께 지내는 운영을 더 편하게 답했어요.`:''} 불편한 사람이 누구인지를 추정하기보다 회의·협의 과정과 생활 운영 중 어느 장면을 이야기할지 고르는 자료예요.`,
      table:{caption:'편안함 질문의 전체 응답 분포',columns:['질문','편함','중간','불편함','판단 보류'],rows:[['설문 3번 · 업무 진행',...workFeel.map(v=>v+'명')],['설문 16번 · 함께 지내기',...lifeFeel.map(v=>v+'명')]]}});
    const ruleTies=lead?work.filter(([name,count])=>priorityNames.includes(name)&&count===lead[1]):[];
    const keepSignal=signals.workKeep;
    const keepTop=keepSignal?keepSignal.question.options.map((name,i)=>({name,count:keepSignal.counts[i],i})).filter(x=>x.i<6&&x.count>0).sort((a,b)=>b.count-a.count||a.i-b.i)[0]:null;
    story.sections.push({heading:'새 규칙은 선호이고, 현재 팀의 잘못을 뜻하지 않아요',
      body:lead?`새 팀을 꾸린다면 ‘${lead[0]}’를 고른 사람이 ${lead[1]}명(${pct(lead[1],n)}%)이에요.${ruleTies.length>1?` 같은 수로 나온 규칙이 ${ruleTies.length}개라 공동 최다로 읽었어요.`:''}${lead[1]>n/2?' 전체의 과반이 고른 규칙이라 이번 팀에서도 적용할지 이야기할 만해요.':' 최다 선택이지만 과반은 아니므로 팀 전체가 동의한다고 보지는 않았어요.'}${keepTop?` 이미 도움이 됐던 습관에서는 ‘${keepTop.name}’를 ${keepTop.count}명이 골랐어요. 새 규칙을 더할 때 이런 습관을 함께 살려볼 수 있어요.`:''}`:'구체적인 규칙을 고른 응답이 없어요. 공통규칙을 두고 싶지 않은 선택과 판단 보류를 따로 확인해야 해요.',
      evidence:[...(lead?[{label:'설문 13번 · 최대 3개 복수 선택',question:'새 팀에서 지켰으면 하는 공통규칙',detail:work.filter(([name,count])=>priorityNames.includes(name)&&count>0).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([name,count])=>`${name}: ${count}/${n}명(${pct(count,n)}%)`).join(' / ')}]:[]),...(keepTop?[{label:'설문 6번 · 복수 선택',question:keepSignal.question.text,detail:`${keepTop.name}: ${keepTop.count}/${n}명`}]:[])],prompt:'가장 표가 많은 규칙 하나를 골라 “어떤 상황에, 누가, 어떻게 확인할까?”까지 정해보세요.',note:'복수 선택 질문이므로 비율을 더하면 100%를 넘을 수 있어요.'});
    if(change&&keep&&change.counts[1]+change.counts[2]===0&&keep.counts[0]===0){
      story.sections.push({heading:'아직 유지·변경의 방향을 고르기 어려워요',body:'생활 항목에 유지·조정·중단을 고른 응답이 없고 판단 보류만 있어요. 참여 경험이 있는지, 각 운영 방식을 알고 있는지부터 확인해야 하므로 특정 항목을 유지하거나 없애자고 정리하지 않았어요.',evidence:[{label:'설문 19번',question:'생활 항목별 유지·조정·중단·판단 보류',detail:`${life.length}개 항목 모두 판단 보류뿐이에요.`}],prompt:'팀에서 실제로 어떤 방식을 운영 중인지 먼저 설명하고 의견을 다시 들어보세요.'});
    }else if(change&&keep){
      const changeCount=change.counts[1]+change.counts[2],ties=life.filter(x=>x.counts[1]+x.counts[2]===changeCount).length;
      const split=[...life].filter(x=>x.counts[0]>0&&x.counts[1]+x.counts[2]>0).sort((a,b)=>Math.min(b.counts[0],b.counts[1]+b.counts[2])-Math.min(a.counts[0],a.counts[1]+a.counts[2]))[0];
      story.sections.push({heading:'운영 방식을 바꾸고 싶은 것과 없애고 싶은 것은 달라요',
        body:`${keep.counts[0]?`‘${keep.name}’는 유지가 ${keep.counts[0]}명(${pct(keep.counts[0],n)}%)으로 ${life.filter(x=>x.counts[0]===keep.counts[0]).length>1?'공동 ':''}최다예요.`:'생활 항목에서 유지로 고른 응답은 없어요.'} ${changeCount?`변경 의견은 ‘${change.name}’가 ${changeCount}명으로 ${ties>1?'공동 ':''}최다지만, 그 안은 조정 ${change.counts[1]}명과 중단 ${change.counts[2]}명으로 나뉘어요. ${change.counts[1]>change.counts[2]?'활동 자체보다 운영 방식을 바꾸려는 선택이 더 많으니 무엇이 불편했는지부터 확인해보세요.':change.counts[2]>change.counts[1]?'중단 의견이 조정보다 많지만, 유지·판단 보류까지 함께 보고 다음 결정을 정해야 해요.':'조정과 중단의 수가 같아 같은 변경 의견으로 뭉뚱그리기 어려워요.'}`:'조정·중단 의견은 없지만, 판단 보류를 유지에 찬성한 표로 바꾸지는 않았어요.'}${split?` ‘${split.name}’처럼 유지(${split.counts[0]}명)와 변경(${split.counts[1]+split.counts[2]}명)이 함께 있는 항목도 있어요.`:''}`,
        table:{caption:'설문 19번 · 유지와 변경을 함께 보는 근거',columns:['생활 항목','유지','조정','중단','판단 보류'],rows:[change,...(keep.name!==change.name?[keep]:[]),...(split&&split.name!==change.name&&split.name!==keep.name?[split]:[])].map(x=>[x.name,...x.counts.map(v=>v+'명')])},prompt:'“그만하고 싶은가요, 아니면 어떤 부분만 바꾸면 괜찮을까요?”를 나눠 물어보세요.'});
    }
    const method=signals.changeMethod;
    if(method){const ranked=method.question.options.map((name,i)=>({name,count:method.counts[i],i})).filter(x=>x.i<4&&x.count>0).sort((a,b)=>b.count-a.count||a.i-b.i);const preferred=ranked[0];
      if(preferred)story.sections.push({heading:'이번 팀미팅에서 바로 정해볼 작은 실험',body:`규칙을 바꾸는 과정에서는 ‘${preferred.name}’를 ${preferred.count}명(${pct(preferred.count,n)}%)이 골랐어요. 가장 많은 절차 선호 중 하나이지, 이미 합의가 끝났다는 뜻은 아니에요. 안건을 한꺼번에 늘리기보다 규칙이나 생활 운영 하나를 골라 시도하고 확인할 시점을 함께 정해보세요.`,evidence:[{label:'설문 33번',question:method.question.text,detail:ranked.slice(0,2).map(x=>`${x.name}: ${x.count}명`).join(' / ')}],prompt:'“무엇을 한 번 바꿔보고, 언제 다시 이야기할까?”를 회의가 끝나기 전에 한 줄로 남겨보세요.'});}
    if(life.length&&life.every(x=>x.counts[0]+x.counts[1]+x.counts[2]===0))story.title='생활 룰은 아직 판단 보류, 익숙해질 시간부터 필요해요.';
    const commentCount=signals.commentCount||0;
    story.method=`업무·생활 코드 ${n}명분에서 항목별 선택 수를 집계했어요. 이름이나 개인 성향 코드와 연결하지 않았어요.${commentCount?` 선택 서술 의견이 ${commentCount}건 있어요. 아래 원문도 함께 읽고, 숫자만으로 이유를 단정하지 말아주세요.`:' 서술 의견의 이유를 자동으로 추측하거나 실제 발언처럼 만들어 쓰지 않았어요.'} 질문에 판단 보류가 있으면 별도로 표시했어요.`;
    return story;
  }
  function html(story,esc,label='결과를 문장으로 읽으면'){
    if(!story)return '';
    return `<section class="result-story" aria-label="${esc(label)}"><p class="story-label">${esc(label)}</p><h2>${esc(story.title)}</h2><div class="story-paragraphs">${(story.intro||story.paragraphs).map(p=>`<p>${esc(p)}</p>`).join('')}</div>${story.sections?`<div class="story-chapters">${story.sections.map(section=>`<article class="story-chapter ${section.wide?'story-chapter-wide':''}"><h3>${esc(section.heading)}</h3><p>${esc(section.body)}</p>${section.table?`<div class="reason-table-wrap"><table class="reason-table"><caption>${esc(section.table.caption)}</caption><thead><tr>${section.table.columns.map(c=>`<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${section.table.rows.map(row=>`<tr>${row.map((v,i)=>i?`<td>${esc(String(v))}</td>`:`<th scope="row">${esc(String(v))}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`:''}${section.evidence?.length?`<div class="reason-evidence">${section.evidence.map(e=>`<div class="reason-source"><span>${esc(e.label)}</span><p class="reason-question">${esc(e.question)}</p>${e.detail?`<p>${esc(e.detail)}</p>`:''}${(e.answers||[]).map(a=>`<p class="reason-answer"><b>${esc(a.name)}</b><br>“${esc(a.text)}”</p>`).join('')}</div>`).join('')}</div>`:''}${section.prompt?`<div class="reason-prompt"><span>함께 써볼 질문·약속</span><p>${esc(section.prompt)}</p></div>`:''}${section.note?`<p class="micro">${esc(section.note)}</p>`:''}</article>`).join('')}</div>`:''}${story.method?`<p class="story-method">${esc(story.method)}</p>`:''}</section>`;
  }
  const api={personal,mate,team,html};root.ResultStories=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
