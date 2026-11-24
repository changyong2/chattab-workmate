(function(){
  const app=document.querySelector('#app');
  const demo=new URLSearchParams(location.search).get('sample')==='1';
  const X=WorkLife,real=X.load().responses;
  const n=demo?12:real.length;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Fictional responses only. Never read or modify the named mate-code store here.
  const satisfaction=demo?{work:[1,2,3,3,3,4,4,4,4,4,5,5],life:[2,3,4,4,4,4,4,4,5,5,5,5]}:{work:real.map(p=>p.answers.workSatisfaction+1),life:real.map(p=>p.answers.lifeSatisfaction+1)};
  const life=[
    {name:'근무·휴가 공유',counts:[10,1,0,1]},
    {name:'회식 당번제',counts:[3,7,2,0]},
    {name:'생일 챙기기',counts:[7,3,1,1]},
    {name:'간식 운영',counts:[9,2,0,1]},
    {name:'좌석 변경',counts:[4,4,3,1]},
    {name:'격주 팀 점심',counts:[8,3,1,0]},
    {name:'칼퇴 운영',counts:[9,1,0,2]}
  ];
  if(!demo)life.forEach((x,i)=>x.counts=[0,1,2,3].map(v=>real.filter(p=>p.answers.lifeRules[i]===v).length));
  const work=demo?[['급건의 우선순위를 누가 정할지',9],['과제별 담당과 최종 결정자',7],['결정 사항을 기록할 곳',6],['집중 시간과 회의 시간 조율',5],['업무 협의에 사용할 채널',4],['회고 개선을 확인하는 방법',3],['위클리 공유 범위',2]]:X.questions.find(q=>q.id==='workPriorities').options.map((name,i)=>[name,real.filter(p=>p.answers.workPriorities.includes(i)).length]).sort((a,b)=>b[1]-a[1]);
  const percent=count=>n?Math.round(count/n*100):0;
  const legend=labels=>`<div class="balance-legend">${labels.map((s,i)=>`<span><i class="balance-color-${i}"></i>${s}</span>`).join('')}</div>`;
  const stack=(counts,labels)=>`<div class="balance-stack" role="img" aria-label="${counts.map((c,i)=>`${labels[i]} ${c}명 (${percent(c)}%)`).join(', ')}">${counts.map((c,i)=>c?`<span class="balance-color-${i}" style="width:${c/n*100}%" aria-hidden="true">${c>=2?percent(c)+'%':''}</span>`:'').join('')}</div>`;
  function satisfactionCard(key,title){
    const a=satisfaction[key],counts=[a.filter(v=>v===4||v===5).length,a.filter(v=>v===3).length,a.filter(v=>v<=2).length,a.filter(v=>v===6).length];
    return `<article class="panel"><div class="flex spread"><h3>${title}</h3><span class="micro">${n}명 응답</span></div><div class="balance-headline"><strong>${percent(counts[0])}%</strong><span>만족 · 매우 만족<br>${counts[0]}명 / ${n}명</span></div>${stack(counts,['만족','보통','불만','판단 보류'])}<p class="micro">만족 ${counts[0]}명 · 보통 ${counts[1]}명 · 불만 ${counts[2]}명 · 보류 ${counts[3]}명</p></article>`;
  }
  function details(){
    if(demo)return '';
    return `<section class="panel"><h2>전체 문항과 서술 의견</h2><p class="micro">서술 내용은 작성자를 알아볼 수 있는 표현이 있는지 확인한 뒤 함께 보세요.</p>${X.questions.filter(q=>q.type!=='grid').map(q=>{
      const included=real.filter(p=>X.visible(q,p.answers));
      const notes=included.map(p=>p.answers[q.id+'Other']).filter(Boolean);
      let body='';
      if(q.type==='text'){const comments=included.map(p=>p.answers[q.id]).filter(Boolean);body=comments.length?comments.map(t=>`<p class="notice" style="white-space:pre-wrap">${esc(t)}</p>`).join(''):'<p class="micro">작성된 의견이 없어요.</p>';}
      else body=q.options.map((name,i)=>{const count=included.filter(p=>Array.isArray(p.answers[q.id])?p.answers[q.id].includes(i):p.answers[q.id]===i).length;return `<div class="insight-option"><div class="insight-option-label"><span>${esc(name)}</span><strong>${count}명</strong></div><div class="insight-track" aria-hidden="true"><span style="width:${included.length?count/included.length*100:0}%"></span></div></div>`;}).join('');
      return `<details class="insight-detail"><summary>${esc(q.text)}</summary><p class="micro">${included.length}명 대상${q.type==='multi'?' · 복수 선택':''}</p>${body}${notes.map(t=>`<p class="notice">기타: ${esc(t)}</p>`).join('')}</details>`;
    }).join('')}</section>`;
  }
  function render(){
    if(!n){
      app.innerHTML=`<section class="page wide"><div class="eyebrow">WORK & LIFE</div><h1>우리의 업무·생활 방식</h1><p class="sub">만족도의 균형과 유지·변경 의견을 함께 살펴봐요.</p><section class="panel"><h2>아직 수집한 결과가 없어요</h2><p class="note-text">주최자 페이지에서 WL1 코드를 등록하면 실제 결과를 볼 수 있어요. 가상 응답으로도 미리 볼 수 있어요.</p><a class="btn primary" href="?sample=1">가상 응답 12명으로 미리보기</a></section></section>`;return;
    }
    const priorities=[...life].sort((a,b)=>(b.counts[1]+b.counts[2])-(a.counts[1]+a.counts[2]));
    const preserve=[...life].sort((a,b)=>b.counts[0]-a.counts[0]);
    app.innerHTML=`<section class="page wide work-life-dashboard"><div class="eyebrow">WORK & LIFE</div><h1>잘 맞는 것, 맞춰볼 것</h1><p class="sub">업무와 생활에서 무엇을 유지하고 어디를 조정할지 함께 봐요.</p>${demo?'<div class="sample-banner">미리보기 · 가상 응답 12명으로 만든 예시입니다. 실제 수집 결과가 아니에요.</div>':`<p class="notice">등록된 업무·생활 코드 ${n}명분을 집계했어요. 메이트 코드와 별도로 취합한 결과예요.</p>`}
      <section aria-labelledby="findings-title"><h2 id="findings-title">먼저 이야기할 세 가지</h2><div class="finding-grid">
      <a class="panel finding-card" href="#life-balance"><span class="micro">조정·중단 의견이 가장 많아요</span><h3>${priorities[0].name}</h3><strong>${priorities[0].counts[1]+priorities[0].counts[2]}명 <small>/ ${n}명</small></strong><p>일부 조정 ${priorities[0].counts[1]}명 · 중단 ${priorities[0].counts[2]}명</p><span class="micro">유지 의견과 함께 보기 ↓</span></a>
      <a class="panel finding-card" href="#work-priorities"><span class="micro">업무 기준을 정해달라는 의견</span><h3>${work[0][0]}</h3><strong>${work[0][1]}명 <small>/ ${n}명</small></strong><p>공통 기준이 필요한 항목으로 선택</p><span class="micro">개선 요구 전체 보기 ↓</span></a>
      <a class="panel finding-card" href="#life-balance"><span class="micro">유지 의견이 가장 많아요</span><h3>${preserve[0].name}</h3><strong>${preserve[0].counts[0]}명 <small>/ ${n}명</small></strong><p>현재 방식 그대로 유지 선택</p><span class="micro">유지·변경 균형 보기 ↓</span></a></div></section>
      <section aria-labelledby="satisfaction-title"><div class="insight-heading"><h2 id="satisfaction-title">업무와 생활, 만족도의 균형</h2><p class="micro">5점 응답을 만족(4~5점), 보통(3점), 불만(1~2점)으로 묶었어요. 판단 보류는 회색으로 구분해요.</p>${legend(['만족','보통','불만','판단 보류'])}</div><div class="balance-domains">${satisfactionCard('work','일하는 방식')}${satisfactionCard('life','팀 생활 방식')}</div></section>
      <section id="life-balance" class="panel" aria-labelledby="life-title"><div class="insight-heading"><h2 id="life-title">생활 룰별 유지·변경 균형</h2><p class="micro">각 룰에 한 명이 하나씩 선택한 결과예요. 조정·중단 의견이 많은 순서로 정렬했어요. 회색은 경험이 없어 판단을 보류한 응답이에요.</p>${legend(['유지','일부 조정','중단','판단 보류'])}</div><div class="balance-table"><table><caption class="sr-only">생활 룰 7개별 유지, 일부 조정, 중단, 판단 보류 응답 수</caption><thead><tr><th scope="col">생활 룰</th><th scope="col">의견의 균형</th><th scope="col">유지</th><th scope="col">조정</th><th scope="col">중단</th><th scope="col">보류</th></tr></thead><tbody>${priorities.map(x=>`<tr><th scope="row">${x.name}</th><td>${stack(x.counts,['유지','일부 조정','중단','판단 보류'])}</td>${x.counts.map(c=>`<td>${c}명</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="micro">조정을 원한다는 응답과 중단을 원한다는 응답은 구분해서 읽어주세요.</p></section>
      <section id="work-priorities" class="panel"><div class="insight-heading"><h2>업무에서 공통 기준이 필요한 부분</h2><p class="micro">최대 3개 복수 선택 · ${n}명 응답 · 비율의 합은 100%를 넘을 수 있어요.</p></div><div class="work-priority-bars">${work.map(([name,count])=>`<div class="insight-option"><div class="insight-option-label"><span>${name}</span><strong>${count}명 <small>(${percent(count)}%)</small></strong></div><div class="insight-track" aria-hidden="true"><span style="width:${count/n*100}%"></span></div></div>`).join('')}</div></section>
      ${details()}<p class="micro">업무·생활 결과는 메이트 매칭과 별도로 봐요. 두 영역을 합산한 점수나 개인별 순위는 만들지 않아요.</p><a class="btn ghost small" href="work-life-results.html">실제 결과 보기</a></section>`;
  }
  render();
})();
