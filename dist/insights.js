(function(root){
  function summarize(people,model,answers){
    const included=people.filter(p=>p.scale===7&&model.validProfile(p));
    const questions=model.questions.map(q=>{
      const options=answers.optionsFor(q).map(o=>({...o,count:0}));
      for(const p of included)options.find(o=>o.id===p.answers[q.id]).count++;
      const ranked=[...options].sort((a,b)=>b.count-a.count||a.id-b.id);
      const n=included.length,share=n?ranked[0].count/n:0;
      // A divided item has two substantial, similarly sized groups; choices are nominal.
      const divided=n>=4&&ranked[1].count/n>=.3&&
        (ranked[0].count+ranked[1].count)/n>=.8&&
        (ranked[0].count-ranked[1].count)/n<=.2;
      return {...q,options,ranked,n,share,divided};
    });
    return {n:included.length,excluded:people.length-included.length,questions,
      consensus:questions.filter(q=>q.n>=4&&q.share>=2/3)
        .sort((a,b)=>b.share-a.share||a.id-b.id),
      divided:questions.filter(q=>q.divided)
        .sort((a,b)=>(a.ranked[0].count-a.ranked[1].count)-(b.ranked[0].count-b.ranked[1].count)||
          (b.ranked[0].count+b.ranked[1].count)-(a.ranked[0].count+a.ranked[1].count)||a.id-b.id)};
  }
  root.WorkmateInsights={summarize};
  if(typeof module!=='undefined')module.exports=root.WorkmateInsights;
})(typeof window==='undefined'?globalThis:window);
