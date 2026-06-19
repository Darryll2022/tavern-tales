const RiddleGame=(()=>{
  let _resolve,correct,timerInterval;
  const overlay=()=>document.getElementById('riddle-overlay');
  const numEl=()=>document.getElementById('riddle-num');
  const qEl=()=>document.getElementById('riddle-question');
  const cEl=()=>document.getElementById('riddle-choices');
  const msgEl=()=>document.getElementById('riddle-message');
  const fillEl=()=>document.getElementById('riddle-timer-fill');
  document.getElementById('riddle-close').onclick=()=>finish(false);
  function stopTimer(){clearInterval(timerInterval);fillEl().style.transition='none';}
  function startTimer(seconds,onExpire){
    fillEl().style.transition='none';fillEl().style.width='100%';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{fillEl().style.transition=`width ${seconds}s linear`;fillEl().style.width='0%';}));
    timerInterval=setInterval(()=>{seconds--;if(seconds<=0){clearInterval(timerInterval);onExpire();}},1000);
  }
  function askRiddle(riddle,num){
    return new Promise(res=>{
      numEl().textContent=num;qEl().textContent=riddle.q;msgEl().textContent='';cEl().innerHTML='';
      riddle.opts.forEach((opt,i)=>{
        const btn=document.createElement('button');btn.className='riddle-opt';btn.textContent=opt;
        btn.onclick=()=>{stopTimer();cEl().querySelectorAll('.riddle-opt').forEach(b=>b.disabled=true);
          if(i===riddle.ans){btn.classList.add('correct');msgEl().textContent='✓ '+riddle.flavour;res(true);}
          else{btn.classList.add('wrong');cEl().querySelectorAll('.riddle-opt')[riddle.ans].classList.add('correct');msgEl().textContent='Fenwick shakes his head slowly.';res(false);}};
        cEl().appendChild(btn);
      });
      startTimer(30,()=>{cEl().querySelectorAll('.riddle-opt').forEach(b=>b.disabled=true);cEl().querySelectorAll('.riddle-opt')[riddle.ans].classList.add('correct');msgEl().textContent='Time... flows for no one.';res(false);});
    });
  }
  function delay(ms){return new Promise(r=>setTimeout(r,ms));}
  function finish(won){overlay().classList.add('hidden');if(_resolve){_resolve(won);_resolve=null;}}
  function play(){
    return new Promise(async res=>{
      _resolve=res;correct=0;overlay().classList.remove('hidden');msgEl().textContent='';
      const riddles=[...RIDDLES].sort(()=>Math.random()-.5).slice(0,3);
      for(let i=0;i<riddles.length;i++){const ok=await askRiddle(riddles[i],i+1);if(ok)correct++;await delay(1600);}
      await finish(correct>=2);
    });
  }
  return {play};
})();
