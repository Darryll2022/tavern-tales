const Dialogue = (() => {
  let _resolve=null, _typeTimer=null;
  const overlay  = ()=>document.getElementById('dialogue-overlay');
  const portrait = ()=>document.getElementById('dialogue-portrait-img');
  const speaker  = ()=>document.getElementById('dialogue-speaker');
  const titleLbl = ()=>document.getElementById('dialogue-title-label');
  const textEl   = ()=>document.getElementById('dialogue-text');
  const choices  = ()=>document.getElementById('dialogue-choices');
  const btnGame  = ()=>document.getElementById('btn-play-game');
  const closeBtn = ()=>document.getElementById('dialogue-close');
  const panel    = ()=>document.getElementById('dialogue-panel');

  function open(npc){
    portrait().src = npc.portraitImg || '';
    portrait().alt = npc.name;
    speaker().textContent  = npc.name;
    speaker().style.color  = npc.colour || '#f5c842';
    titleLbl().textContent = npc.title || '';
    choices().innerHTML='';
    btnGame().classList.add('hidden');
    textEl().textContent='';
    overlay().classList.remove('hidden');
  }

  function close(){
    overlay().classList.add('hidden');
    clearTimeout(_typeTimer);
    choices().innerHTML='';
    btnGame().classList.add('hidden');
    if(_resolve){_resolve(null);_resolve=null;}
  }

  function type(text,speed=24){
    return new Promise(res=>{
      clearTimeout(_typeTimer);
      textEl().textContent='';
      let i=0;
      function tick(){
        if(i<text.length){textEl().textContent+=text[i++];_typeTimer=setTimeout(tick,speed);}
        else res();
      }
      tick();
    });
  }

  async function show(npc,lines,opts={}){
    open(npc);
    for(let i=0;i<lines.length;i++){
      await type(lines[i]);
      if(i<lines.length-1){
        await waitClick();
        textEl().textContent='';
      }
    }
    if(opts.choices&&opts.choices.length) return await showChoices(opts.choices);
    if(opts.gameLabel){
      btnGame().textContent=opts.gameLabel;
      btnGame().classList.remove('hidden');
      return await new Promise(res=>{
        _resolve=res;
        btnGame().onclick=()=>{_resolve=null;close();res('play');};
        closeBtn().onclick=()=>close();
      });
    }
    return await new Promise(res=>{
      _resolve=res;
      closeBtn().onclick=()=>{close();res(null);};
      overlay().onclick=(e)=>{if(e.target===overlay()){close();res(null);}};
    });
  }

  function showChoices(arr){
    choices().innerHTML='';
    return new Promise(res=>{
      _resolve=res;
      arr.forEach(c=>{
        const btn=document.createElement('button');
        btn.className='choice-btn';
        btn.textContent=c.label;
        btn.onclick=()=>{close();res(c.value);};
        choices().appendChild(btn);
      });
      closeBtn().onclick=()=>{close();res(null);};
    });
  }

  function waitClick(){
    return new Promise(res=>{
      const h=()=>{panel().removeEventListener('click',h);document.removeEventListener('keydown',h);res();};
      setTimeout(()=>{panel().addEventListener('click',h,{once:true});document.addEventListener('keydown',h,{once:true});},120);
    });
  }

  closeBtn().addEventListener('click',close);
  return {show,close};
})();
