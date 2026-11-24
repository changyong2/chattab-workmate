(function(root){
  const roles=[{id:'dev',name:'개발'},{id:'design',name:'디자인'},{id:'pm',name:'PO/PM'}];
  function questionFor(question,role,seed=0){return {...question,options:root.WorkmateAnswers.orderedOptions(question,seed),context:''};}
  const api={roles,questionFor};root.WorkmateRoles=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
