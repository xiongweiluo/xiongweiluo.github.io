(()=>{
 const cards=[...document.querySelectorAll('#work article[data-categories]')];
 const filters=[...document.querySelectorAll('[data-filter]')];
 function applyFilter(button){
  if(!button)return;
  const filter=button.dataset.filter;let count=0;
  filters.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  cards.forEach(card=>{card.hidden=filter!=='all'&&!card.dataset.categories.split(' ').includes(filter);if(!card.hidden)count++;});
  document.querySelector('#project-count').textContent=`${count} projects`;
  document.querySelector('#filter-status').textContent=`Showing ${count} projects: ${button.childNodes[0].textContent.trim()}.`;
 }
 function restoreFilter(){
  const category=new URL(location.href).searchParams.get('category')||'all';
  applyFilter(filters.find(button=>button.dataset.filter===category)||filters[0]);
 }
 filters.forEach(button=>button.addEventListener('click',()=>{
  applyFilter(button);
  const url=new URL(location.href);
  if(button.dataset.filter==='all')url.searchParams.delete('category');
  else url.searchParams.set('category',button.dataset.filter);
  history.replaceState(history.state,'',url);
 }));
 if(filters.length){restoreFilter();addEventListener('pageshow',restoreFilter);}
 document.querySelectorAll('[data-cap]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-cap]').forEach(x=>x.setAttribute('aria-pressed',String(x===button)));
  document.querySelectorAll('[data-cap-panel]').forEach(x=>x.hidden=x.dataset.capPanel!==button.dataset.cap);
 }));
 const summaries={mosaic:'用大小与留白突出近期经历，四个机构各有一个简洁的视觉符号。',network:'围绕 Design / Systems / AI 展示经历之间的联系，不表达时间先后。',dossier:'左侧选择机构，右侧展开一份经历；阅读聚焦，页面文字最少。',gallery:'四幅等权重的视觉海报，让机构与专业方向形成一组作品。',matrix:'展示每段经历与空间、系统、AI、产品的联系，不使用能力评分。'};
 document.querySelectorAll('[data-study]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-study]').forEach(x=>x.setAttribute('aria-pressed',String(x===button)));
  document.querySelectorAll('[data-study-panel]').forEach(x=>x.hidden=x.dataset.studyPanel!==button.dataset.study);
  document.querySelector('#study-description').textContent=summaries[button.dataset.study];
 }));
 document.querySelectorAll('.exp-dossier').forEach(root=>{
  root.querySelectorAll('[data-record]').forEach(button=>button.addEventListener('click',()=>{
   root.querySelectorAll('[data-record]').forEach(x=>x.setAttribute('aria-pressed',String(x===button)));
   root.querySelectorAll('[data-record-panel]').forEach(x=>x.hidden=x.dataset.recordPanel!==button.dataset.record);
  }));
 });
})();
