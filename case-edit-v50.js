(()=>{
 const score=document.querySelector('.ed-rule-demo');
 if(score) score.addEventListener('change',event=>{
  if(event.target.name!=='quality-score')return;
  const low=Number(event.target.value)<=2;
  score.querySelector('[data-conditional-note]').hidden=!low;
  score.querySelector('.ed-rule-status').textContent=low?'Score ≤ 2 · the explanation is required.':'Score > 2 · the conditional field is hidden.';
 });
})();
