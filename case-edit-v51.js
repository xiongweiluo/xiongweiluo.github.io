(() => {
  // Image galleries are native buttons, with persistent state and keyboard focus.
  document.querySelectorAll('.v51-gallery').forEach(g => {
    const buttons=[...g.querySelectorAll(':scope > .v51-tabs [data-view]')];
    const panels=[...g.querySelectorAll(':scope > .v51-panel')];
    buttons.forEach((b,i)=>b.addEventListener('click',()=>{
      buttons.forEach((x,j)=>x.setAttribute('aria-pressed',String(j===i)));
      panels.forEach((p,j)=>p.hidden=j!==i);
      window.dispatchEvent(new Event('resize'));
    }));
  });
  document.querySelectorAll('.original-capture').forEach(box=>{
    const frame=box.querySelector('iframe'), win=box.querySelector('.capture-window');
    const size=()=>{const scale=box.clientWidth/1440;win.style.height=Number(box.dataset.height)*scale+'px';frame.style.transform=`scale(${scale})`;};
    new ResizeObserver(size).observe(box);size();
    frame.addEventListener('load',()=>{
      // A capture viewport focuses the designer on the original canvas, without removing any original UI.
      const doc=frame.contentDocument;
      let target;
      if(box.dataset.offset==='ai')target=doc.querySelector('.ai-quality-panel__header');
      else if(box.dataset.offset==='revision')target=doc.querySelector('.review-human-decision-card');
      else if(frame.src.includes('designer'))target=[...doc.querySelectorAll('h3')].find(x=>x.textContent==='News quality template');
      if(target)frame.contentWindow.scrollTo(0,Math.max(0,target.getBoundingClientRect().top+frame.contentWindow.scrollY-(box.dataset.offset==='ai'?250:100)));
      box.dataset.sourceHeight=doc.body.scrollHeight;
      const grid=doc.querySelector('.review-human-page');
      if(grid)box.dataset.layoutCheck=JSON.stringify({width:frame.contentWindow.innerWidth,columns:frame.contentWindow.getComputedStyle(grid).gridTemplateColumns,main:doc.querySelector('.review-human-main').getBoundingClientRect().width});
      box.dataset.sourceScroll=frame.contentWindow.scrollY;

    });
    box.querySelector('[data-expand-capture]').addEventListener('click',()=>{
      const dlg=document.createElement('dialog');dlg.className='capture-dialog';
      const title=box.querySelector('.capture-caption span').textContent;
      dlg.innerHTML='<div class="capture-dialog-bar"><span></span><button type="button">Close ×</button></div><div class="capture-dialog-body"><iframe title="Full original interface in English"></iframe></div>';
      dlg.querySelector('span').textContent=title+' · scroll to explore';
      dlg.querySelector('iframe').src=frame.src;
      dlg.querySelector('iframe').addEventListener('load',()=>{const inner=dlg.querySelector('iframe');inner.style.height=Math.max(1500,inner.contentDocument.body.scrollHeight)+'px';});
      dlg.querySelector('button').addEventListener('click',()=>dlg.close());
      dlg.addEventListener('close',()=>dlg.remove());document.body.append(dlg);dlg.showModal();
    });
  });
  const lab=document.querySelector('.timber-lab');if(!lab)return;
  const svg=lab.querySelector('svg'), play=lab.querySelector('.timber-play'), scrub=lab.querySelector('.timber-scrub');
  const buttons=[...lab.querySelectorAll('[data-mode]')], cols=[...svg.querySelectorAll('.light-column')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let mode=0, phase=.14, running=!reduced.matches, visible=false, last=0;
  const labels=[['Quiet → louder → quiet','Light follows amplitude','Continuous sound → light height'],['Low → mixed → high','Bands respond independently','Audio spectrum → varied light heights'],['Approach → trigger → return','Each event adds light','Repeated proximity → cumulative growth'],['Approach → burst → fade','One short light event','Proximity trigger → transient fireworks']];
  function syncPlay(){play.textContent=running?'Pause animation':'Play animation';play.setAttribute('aria-pressed',String(running));}
  function draw(){
    const p=phase, proximity=mode>=2, a=.08+.90*Math.pow(Math.sin(Math.PI*p),2);
    svg.querySelector('.sound-input').style.display=proximity?'none':'';
    svg.querySelector('.distance-input').style.display=proximity?'':'none';
    svg.querySelector('.sound-wave').style.display=mode===0?'':'none';
    svg.querySelector('.freq-bars').style.display=mode===1?'':'none';
    svg.querySelector('.input-caption').textContent=labels[mode][0];svg.querySelector('.output-caption').textContent=labels[mode][1];
    lab.querySelector('.timber-mode-note').textContent=labels[mode][2];
    const points=Array.from({length:81},(_,j)=>{const x=65+j*3.6,y=230+Math.sin(j*.48-p*18)*a*57*Math.sin(Math.PI*j/80);return `${j?'L':'M'}${x.toFixed(1)} ${y.toFixed(1)}`;}).join(' ');svg.querySelector('.sound-wave').setAttribute('d',points);
    [...svg.querySelectorAll('.freq-bars rect')].forEach((r,i)=>{let v=.12+.88*Math.exp(-Math.pow(i/11-p,2)*17);let h=v*120;r.setAttribute('height',h);r.setAttribute('y',280-h);});
    const near=mode===2?Math.pow(Math.sin(p*Math.PI*3),8):Math.pow(Math.sin(p*Math.PI),6);
    svg.querySelector('.visitor').setAttribute('transform',`translate(${80+near*260} 0)`);
    svg.querySelector('.distance-line').setAttribute('d',`M${115+near*260} 350H500`);
    cols.forEach((c,i)=>{
      let v=a,color='#ffd18a';
      if(mode===1){v=.12+.85*Math.exp(-Math.pow(i/2-p,2)*8);color=['#ffd18a','#a5d9ae','#8dcbd8'][i];}
      if(mode===2){v=i===0?.06+.28*Math.min(3,Math.floor(p*3+.5)):.07;color='#9ce2bd';}
      if(mode===3){v=i===0?(p<.47?.03:Math.max(.03,1-(p-.47)*2.5)):.06;color='#9ae4d6';}
      c.querySelectorAll('.led,.led-halo').forEach(l=>{l.setAttribute('stroke',color);const x=l.getAttribute('d').match(/^M(-?\d+)/)[1];l.setAttribute('d',`M${x} 400V${400-276*v}`);});
      c.querySelector('.burst').style.opacity=mode===3&&i===0&&p>.47&&p<.74?String(Math.max(0,1-(p-.47)/.27)):0;
    });scrub.value=Math.round(p*1000);
  }
  buttons.forEach((b,i)=>b.addEventListener('click',()=>{mode=i;phase=.12;buttons.forEach((x,j)=>x.setAttribute('aria-pressed',String(j===i)));draw();}));
  play.addEventListener('click',()=>{running=!running;last=0;syncPlay();});
  scrub.addEventListener('input',()=>{running=false;phase=Number(scrub.value)/1000;syncPlay();draw();});
  reduced.addEventListener('change',e=>{if(e.matches){running=false;syncPlay();}});
  new IntersectionObserver(es=>{visible=es[0].isIntersecting;last=0;},{threshold:.05}).observe(lab);
  function tick(t){if(running&&visible&&!document.hidden){if(last)phase=(phase+Math.min(t-last,60)/7000)%1;draw();}last=t;requestAnimationFrame(tick);}
  new ResizeObserver(()=>{
    const mobile=lab.clientWidth<520;
    svg.setAttribute('viewBox',mobile?'0 0 640 800':'0 0 1100 510');
    const set=(sel,a,v)=>svg.querySelector(sel).setAttribute(a,v);
    set('.sound-input','transform',mobile?'translate(100 -65)':'translate(0 0)');
    set('.distance-input','transform',mobile?'translate(60 -95)':'translate(0 0)');
    set('.stage-floor','d',mobile?'M40 722H600':'M60 422H1050');
    set('.stage-ambient','cx',mobile?320:750);set('.stage-ambient','cy',mobile?620:360);
    set('.stage-input-label','x',mobile?35:58);set('.stage-output-label','x',mobile?35:555);set('.stage-output-label','y',mobile?365:55);
    set('.input-caption','x',mobile?35:60);set('.input-caption','y',mobile?310:470);
    set('.output-caption','x',mobile?35:555);set('.output-caption','y',mobile?775:470);
    svg.querySelector('.stage-arrow').style.display=mobile?'none':'';
    cols.forEach((c,i)=>c.setAttribute('transform',`translate(${mobile?[150,320,490][i]:[580,740,900][i]} ${mobile?300:0})`));
  }).observe(lab);
  syncPlay();draw();requestAnimationFrame(tick);
})();
