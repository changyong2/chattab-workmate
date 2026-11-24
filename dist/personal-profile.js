(function(root){
  function analyze(person,W,A){
    if(!W.validProfile(person)||person.scale!==8)throw Error('현재 메이트 설문 24문항이 필요해요.');
    return W.dimensions.map((d,dim)=>{
      const evidence=W.questions.filter(q=>q.dim===dim).map(q=>({q,option:A.optionsFor(q).find(o=>o.id===person.answers[q.id])}));
      const mean=evidence.reduce((sum,x)=>sum+x.option.point,0)/evidence.length;
      const left=evidence.filter(x=>x.option.point<3).length,right=evidence.length-left;
      const direction=mean<=2.5?'left':mean>=3.5?'right':'mixed';
      const examples=evidence.filter(x=>direction==='mixed'||(direction==='left'?x.option.point<3:x.option.point>3)).slice(0,2);
      return {...d,dim,mean,leftCount:left,rightCount:right,total:evidence.length,direction,
        position:(mean-1.5)/3*100,label:direction==='mixed'?'상황에 따라 고르게 선택':direction==='left'?d.left:d.right,
        evidence,examples,strength:Math.abs(mean-3)};
    });
  }
  function teamHtml(person,people,W,esc){
    const fit=W.teamCompatibility(person,people);
    if(!fit)return `<section class="panel team-fit"><h2>채팅탭과의 궁합</h2><p class="note-text">다른 참가자의 코드가 모이면 나를 뺀 팀의 평균 리듬과 비교해드려요.</p></section>`;
    const title=fit.score>=80?'채팅탭 기본 설정과 찰떡 싱크!':fit.score>=60?'팀과 닮은 구석도, 나만의 고집도 있는 믹스형!':'채팅탭에 다른 리듬을 가져오는 새 플러그인!';
    const gaps=W.dimensions.slice(0,6).map((d,i)=>({...d,gap:Math.abs(fit.mine[i]-fit.team[i])})).sort((a,b)=>a.gap-b.gap||a.name.localeCompare(b.name,'ko'));
    const far=gaps[gaps.length-1],near=gaps[0],fmt=v=>v.toFixed(2);
    return `<section class="panel team-fit"><span class="pill">이번 참가자 기준 · 협업 리듬 비교</span><h2>${title}</h2><div class="team-fit-score"><strong>${fit.score}<small>%</small></strong><span>채팅탭과의 궁합</span></div><p class="note-text">나를 제외한 ${fit.others}명의 평균과 비교했어요. 가장 가까운 관점 중 하나는 ‘${esc(near.name)}’(차이 ${fmt(near.gap)}점)예요. ${far.gap>=1?`‘${esc(far.name)}’에서는 ${fmt(far.gap)}점 차이가 있어 먼저 기대를 맞춰보면 좋아요.`:'여섯 리듬 모두 팀 평균과 1점 미만 차이예요. 평균이 비슷해도 실제로 고른 행동과 이유까지 같다는 뜻은 아니에요.'} 팀 평균은 이번에 코드를 제출한 사람들 기준이라 참가자가 바뀌면 결과도 달라져요.</p><div class="reason-table-wrap"><table class="reason-table"><caption>나를 제외한 팀과의 실제 비교 · 낮은 값은 왼쪽, 높은 값은 오른쪽 성향</caption><thead><tr><th scope="col">협업 리듬 · 왼쪽 ↔ 오른쪽</th><th scope="col">나</th><th scope="col">팀 평균</th><th scope="col">차이</th></tr></thead><tbody>${W.dimensions.slice(0,6).map((d,i)=>`<tr><th scope="row">${esc(d.name)}<small>${esc(d.left)} ↔ ${esc(d.right)}</small></th><td>${fmt(fit.mine[i])}</td><td>${fmt(fit.team[i])}</td><td>${fmt(Math.abs(fit.mine[i]-fit.team[i]))}</td></tr>`).join('')}</tbody></table></div><p class="micro">평균은 1.50~4.50 범위예요. 여섯 차이의 평균 ${fmt(fit.meanGap)}점을 가능한 최대 차이 3점과 비교했어요. 100 × (1 − 평균 차이 ÷ 3) = ${fmt(fit.rawScore)} → 반올림 ${fit.score}%. 계산은 화면에 반올림하기 전 값으로 해요.</p><div class="reason-prompt"><span>같이 일하기 전에 맞춰볼 한 가지</span><p>“${esc(far.name)}에 대해 나는 어떤 방식을 편하게 느끼고, 팀에서는 보통 어떻게 하나요?”를 물어보세요. 궁합률은 닮은 정도이지 능력·성과·소속감 점수가 아니에요. 팀의 새 플러그인도 설정 대화는 필요하니까요.</p></div></section>`;
  }
  function funHtml(person,W,esc){
    return `<section class="panel"><span class="pill">밸런스 게임 · 점수와 별개인 보너스</span><h2>업무 모드 OFF, 이런 동료입니다</h2><div class="fun-badges">${W.funQuestions.map((q,i)=>`<div><strong>${esc(q.labels[person.funAnswers[i]])}</strong><p class="micro">${esc(q.options[person.funAnswers[i]])}</p></div>`).join('')}</div><p class="micro">이 네 선택은 업무 성향이나 궁합률에 더하지 않아요. 팀미팅에서 이유를 물어볼 대화 카드예요.</p></section>`;
  }
  function html(person,{W,A,R,esc,people=[]}){
    const dims=analyze(person,W,A);
    const text=d=>d.direction==='mixed'?`세 상황에서 ‘${d.left}’ 쪽 행동 ${d.leftCount}개, ‘${d.right}’ 쪽 행동 ${d.rightCount}개를 골랐어요. 한 방향으로 묶기보다 상황별 선택을 함께 살펴보세요.`:`관련 세 상황에서 ‘${d.label}’ 쪽 행동을 ${d.direction==='left'?d.leftCount:d.rightCount}번 골랐어요.`;
    return `<section class="personal-profile" aria-labelledby="personal-title"><div class="insight-heading"><div class="eyebrow">MY WORKING STYLE</div><h2 id="personal-title">${esc(person.name)}님의 협업 성향</h2>${root.ResultStories.html(root.ResultStories.personal(person.name,dims),esc,'나의 업무 캐릭터 · 재미로 과장한 별명')}<p class="note-text">최근 업무에서 고른 24개 행동을 8가지 관점으로 정리했어요. 직군과 업무·생활 의견은 분석에 넣지 않아요.</p></div>${teamHtml(person,people,W,esc)}${funHtml(person,W,esc)}<div class="profile-dimensions">${dims.map(d=>`<article class="panel profile-dimension"><div class="flex spread"><h3>${esc(d.name)}</h3><span class="pill">${d.dim<6?'협업 리듬':'협업 기여 방식'}</span></div><p class="profile-label">${esc(d.label)}</p><div class="profile-axis" role="img" aria-label="${esc(d.name)}: ${esc(d.label)}. ${esc(d.left)} 쪽 ${d.leftCount}개, ${esc(d.right)} 쪽 ${d.rightCount}개"><span class="profile-midpoint"></span><i style="left:${5+d.position*.9}%"></i></div><div class="bar-labels"><span>${esc(d.left)} · ${d.leftCount}/3</span><span>${esc(d.right)} · ${d.rightCount}/3</span></div><p class="micro">${esc(text(d))}</p><details><summary>내가 고른 행동 살펴보기</summary>${d.evidence.map(({q,option})=>{const actual=R.questionFor(q,person.role).options.find(o=>o.id===option.id);return `<div class="evidence"><span class="evidence-label">설문 ${q.surveyNumber}번</span><p class="q">${esc(q.text)}</p><p>“${esc(actual.text)}”</p></div>`;}).join('')}</details></article>`).join('')}</div><details class="panel"><summary>이 결과를 읽는 방법</summary><p class="note-text">각 관점은 3문항으로 구성돼요. 행동마다 미리 정한 위치(1.5·2.5·3.5·4.5)의 평균을 점으로 표시하고, 평균이 2.5 이하 또는 3.5 이상이면 해당 방향을 설명해요. 가운데에 가까우면 상황별로 다른 선택을 했다고 표시해요. 좌우 개수는 선택한 행동의 방향을 센 값이며, 점의 위치는 행동별 위치를 반영하므로 개수만으로 정해지지 않아요. 백분위·능력 점수·MBTI가 아니며, 이번 설문에서 선택한 행동을 돌아보기 위한 결과예요.</p></details></section>`;
  }
  const api={analyze,html,teamHtml,funHtml};root.PersonalProfile=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
