(function(root){
  function analyze(person,W,A){
    if(!W.validProfile(person)||person.scale!==5)throw Error('현재 메이트 설문 48문항이 필요해요.');
    return W.dimensions.map((d,dim)=>{
      const evidence=W.questions.filter(q=>q.dim===dim).map(q=>({q,option:A.optionsFor(q).find(o=>o.id===person.answers[q.id])}));
      const mean=evidence.reduce((sum,x)=>sum+x.option.point,0)/evidence.length;
      const left=evidence.filter(x=>x.option.point<3).length,right=evidence.length-left;
      const direction=mean<=2.5?'left':mean>=3.5?'right':'mixed';
      const examples=evidence.filter(x=>direction==='mixed'||(direction==='left'?x.option.point<3:x.option.point>3)).slice(0,2);
      return {...d,dim,mean,leftCount:left,rightCount:right,total:evidence.length,direction,
        position:(mean-1.5)/3*100,label:direction==='mixed'?'상황에 따라 고르게 선택':direction==='left'?d.left:d.right,
        examples,strength:Math.abs(mean-3)};
    });
  }
  function html(person,{W,A,R,esc}){
    const dims=analyze(person,W,A),highlights=[...dims].filter(d=>d.direction!=='mixed').sort((a,b)=>b.strength-a.strength||a.dim-b.dim).slice(0,2);
    const text=d=>d.direction==='mixed'?`여섯 상황에서 ‘${d.left}’ 쪽 행동 ${d.leftCount}개, ‘${d.right}’ 쪽 행동 ${d.rightCount}개를 골랐어요. 한 방향으로 묶기보다 상황별 선택을 함께 살펴보세요.`:`관련 여섯 상황에서 ‘${d.label}’ 쪽 행동을 ${d.direction==='left'?d.leftCount:d.rightCount}번 골랐어요.`;
    return `<section class="personal-profile" aria-labelledby="personal-title"><div class="insight-heading"><div class="eyebrow">MY WORKING STYLE</div><h2 id="personal-title">${esc(person.name)}님의 협업 성향</h2><p class="note-text">최근 업무에서 고른 48개 행동을 8가지 관점으로 정리했어요. 직군과 업무·생활 의견은 분석에 넣지 않아요.</p></div><div class="profile-highlights">${highlights.length?highlights.map(d=>`<article class="panel"><span class="micro">${esc(d.name)}</span><h3>${esc(d.label)}</h3><p class="note-text">${esc(text(d))}</p><p class="micro">함께 일하기 전에 물어보기</p><p>“이번에도 ${esc(d.label)} 진행하면 편할까요?”</p></article>`).join(''):'<article class="panel"><h3>상황에 따라 접근을 다르게 골랐어요</h3><p class="note-text">특정 방향으로 뚜렷하게 모인 관점이 없어요. 아래에서 실제 고른 행동을 하나씩 살펴보세요.</p></article>'}</div><div class="profile-dimensions">${dims.map(d=>`<article class="panel profile-dimension"><div class="flex spread"><h3>${esc(d.name)}</h3><span class="pill">${d.dim<6?'협업 리듬':'협업 기여 방식'}</span></div><p class="profile-label">${esc(d.label)}</p><div class="profile-axis" role="img" aria-label="${esc(d.name)}: ${esc(d.label)}. ${esc(d.left)} 쪽 ${d.leftCount}개, ${esc(d.right)} 쪽 ${d.rightCount}개"><span class="profile-midpoint"></span><i style="left:${5+d.position*.9}%"></i></div><div class="bar-labels"><span>${esc(d.left)} · ${d.leftCount}/6</span><span>${esc(d.right)} · ${d.rightCount}/6</span></div><p class="micro">${esc(text(d))}</p><details><summary>내가 고른 행동 살펴보기</summary>${d.examples.map(({q,option})=>{const actual=R.questionFor(q,person.role).options.find(o=>o.id===option.id);return `<div class="evidence"><p class="q">${esc(q.text)}</p><p>“${esc(actual.text)}”</p></div>`;}).join('')}</details></article>`).join('')}</div><details class="panel"><summary>이 결과를 읽는 방법</summary><p class="note-text">각 관점은 6문항으로 구성돼요. 행동마다 미리 정한 위치(1.5·2.5·3.5·4.5)의 평균을 점으로 표시하고, 평균이 2.5 이하 또는 3.5 이상이면 해당 방향을 설명해요. 가운데에 가까우면 상황별로 다른 선택을 했다고 표시해요. 좌우 개수는 선택한 행동의 방향을 센 값이며, 점의 위치는 행동별 위치를 반영하므로 개수만으로 정해지지 않아요. 백분위·능력 점수·MBTI가 아니며, 이번 설문에서 선택한 행동을 돌아보기 위한 결과예요.</p></details></section>`;
  }
  const api={analyze,html};root.PersonalProfile=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
