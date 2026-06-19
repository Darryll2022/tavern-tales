const Dialogue = (() => {
  let _resolve=null, _typeTimer=null, _typeDone=false;
  const overlay   = ()=>document.getElementById('dialogue-overlay');
  const portrait  = ()=>document.getElementById('dialogue-portrait-img');
  const speakerTag= ()=>document.getElementById('dialogue-speaker-tag');
  const textEl    = ()=>document.getElementById('dialogue-text');
  const choices   = ()=>document.getElementById('dialogue-choices');
  const btnGame   = ()=>document.getElementById('btn-play-game');
  const closeBtn  = ()=>document.getElementById('dialogue-close');
  const hint      = ()=>document.getElementById('dialogue-continue-hint');

  function open(npc){
    portrait().src = npc.portraitImg || '';
    portrait().alt = npc.name;
    speakerTag().textContent = npc.name;
    choices().innerHTML = '';
    btnGame().classList.add('hidden');
    textEl().textContent = '';
    hint().classList.remove('show');
    overlay().classList.remove('hidden');
  }

  function close(){
    overlay().classList.add('hidden');
    clearTimeout(_typeTimer);
    choices().innerHTML = '';
    btnGame().classList.add('hidden');
    hint().classList.remove('show');
    if(_resolve){_resolve(null);_resolve=null;}
  }

  function type(text, speed=22){
    return new Promise(res=>{
      clearTimeout(_typeTimer);
      _typeDone = false;
      hint().classList.remove('show');
      textEl().textContent='';
      let i=0;
      function tick(){
        if(i<text.length){
          textEl().textContent+=text[i++];
          _typeTimer=setTimeout(tick,speed);
        } else {
          _typeDone=true;
          res();
        }
      }
      tick();
    });
  }

  // Skip typing on click
  function skipOrWait(){
    return new Promise(res=>{
      hint().classList.add('show');
      const handler=()=>{
        document.removeEventListener('keydown',handler);
        overlay().removeEventListener('click',handler);
        hint().classList.remove('show');
        res();
      };
      setTimeout(()=>{
        overlay().addEventListener('click',handler,{once:true});
        document.addEventListener('keydown',handler,{once:true});
      },80);
    });
  }

  async function show(npc, lines, opts={}){
    open(npc);
    for(let i=0;i<lines.length;i++){
      await type(lines[i]);
      if(i<lines.length-1){
        await skipOrWait();
        textEl().textContent='';
      }
    }
    if(opts.choices&&opts.choices.length) return await showChoices(opts.choices);
    if(opts.gameLabel){
      btnGame().textContent=opts.gameLabel;
      btnGame().classList.remove('hidden');
      hint().classList.remove('show');
      return await new Promise(res=>{
        _resolve=res;
        btnGame().onclick=()=>{_resolve=null;close();res('play');};
        closeBtn().onclick=()=>close();
      });
    }
    // final line — show continue hint
    hint().classList.add('show');
    return await new Promise(res=>{
      _resolve=res;
      const done=()=>{hint().classList.remove('show');close();res(null);};
      closeBtn().onclick=done;
      const clickHandler=(e)=>{if(e.target!==btnGame()){done();}};
      setTimeout(()=>overlay().addEventListener('click',clickHandler,{once:true}),100);
      document.addEventListener('keydown',done,{once:true});
    });
  }

  function showChoices(arr){
    choices().innerHTML='';
    hint().classList.remove('show');
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

  closeBtn().addEventListener('click',close);
  return {show,close};
})();
