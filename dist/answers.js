(function(root){
  function optionsFor(q){return q.optionsText.map((text,i)=>({id:i+1,text,point:[1.5,2.5,3.5,4.5][i]}));}
  function orderedOptions(q,seed){const options=optionsFor(q);let n=((seed>>>0)^Math.imul(q.id+1,2654435761))>>>0;for(let i=options.length-1;i>0;i--){n^=n<<13;n^=n>>>17;n^=n<<5;const j=(n>>>0)%(i+1);[options[i],options[j]]=[options[j],options[i]];}return options;}
  const api={optionsFor,orderedOptions};root.WorkmateAnswers=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
