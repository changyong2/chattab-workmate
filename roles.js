(function(root){
  const roles=[{id:'dev',name:'개발'},{id:'design',name:'디자인'},{id:'pm',name:'PO/PM'}];
  const scenarios={"dev": {"user": "예: 자꾸 생기는 오류를 고칠 때", "beyond": "예: 안 써본 도구를 써볼 때", "ownership": "예: 내 담당 밖의 코드를 도울 때", "cross": "예: 기획·디자인과 기능을 맞출 때", "goal": "예: 더 빠르고 안정적으로 만들 때", "honest": "예: 구현 방법에 다른 의견이 있을 때", "commit": "예: 정해진 기능을 만들고 내보낼 때", "company": "예: 다른 팀에도 영향이 있는 코드를 바꿀 때"}, "design": {"user": "예: 헷갈리는 화면을 고칠 때", "beyond": "예: 새로운 화면 구성을 시도할 때", "ownership": "예: 요청받지 않은 불편도 발견했을 때", "cross": "예: 기획·개발과 화면을 맞출 때", "goal": "예: 더 읽기 편한 화면을 만들 때", "honest": "예: 시안에 다른 의견이 있을 때", "commit": "예: 정해진 안을 최종 화면으로 옮길 때", "company": "예: 다른 화면과 통일할지 고민할 때"}, "pm": {"user": "예: 사용자가 어려워하는 기능을 고칠 때", "beyond": "예: 기존과 다른 흐름을 제안할 때", "ownership": "예: 담당이 없는 일을 챙길 때", "cross": "예: 디자인·개발과 기능을 정할 때", "goal": "예: 더 많은 사람이 쓰게 만들 때", "honest": "예: 일정이나 방향에 다른 의견이 있을 때", "commit": "예: 정해진 방향을 실제 할 일로 옮길 때", "company": "예: 우리 팀 일보다 다른 일이 급할 때"}};
  function questionFor(question,role,seed=0){
    const id=scenarios[role]?role:'pm';
    const options=root.WorkmateAnswers.orderedOptions(question,seed);
    if(question.id===0){
      const texts={
        dev:['비슷한 코드와 이전 기록을 읽는다','관련 개발자에게 설명을 듣는다','처리할 흐름을 간단히 그린다','작은 코드를 돌려보며 감을 잡는다'],
        design:['기존 화면과 사용자 의견을 본다','관련 동료에게 배경을 듣는다','생각나는 화면을 간단히 그린다','일부 화면을 연결해 눌러본다'],
        pm:['지난 기록에서 비슷한 일을 찾아본다','관련 동료에게 설명을 듣는다','생각나는 흐름을 간단히 그려본다','작은 부분을 만들어보며 감을 잡는다']
      };
      options.forEach(o=>o.text=texts[id][o.id-1]);
    }
    return {...question,options,context:scenarios[id][question.value]};
  }
  const api={roles,questionFor};root.WorkmateRoles=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
