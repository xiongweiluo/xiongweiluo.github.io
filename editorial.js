(()=>{
 const entries=[...document.querySelectorAll('.experience-entry')];
 entries.forEach(entry=>entry.addEventListener('toggle',()=>{
  if(entry.open)entries.forEach(other=>{if(other!==entry)other.open=false;});
  requestAnimationFrame(updateIndex);
 }));
 const sections=[...document.querySelectorAll('main>section[id]')];
 const links=[...document.querySelectorAll('.section-index a[href^="#"], .site-header nav a[href^="#"]')];
 let pending=false;
 function updateIndex(){
  pending=false;
  const guide=Math.min(innerHeight*.4,360);
  let current=sections[0];
  sections.forEach(section=>{if(section.getBoundingClientRect().top<=guide)current=section;});
  if(innerHeight+scrollY>=document.documentElement.scrollHeight-4)current=sections[sections.length-1];
  links.forEach(link=>{if(link.hash==='#'+current?.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
 }
 addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(updateIndex);}},{passive:true});
 addEventListener('resize',updateIndex);
 updateIndex();
})();
