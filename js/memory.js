const MemoryGame=(()=>{
  let cards,flipped,matched,flips,canFlip,_resolve;
  const overlay=()=>document.getElementById('memory-overlay');
  const gridEl=()=>document.getElementById('memory-grid');
  const flipEl=()=>document.getElementById('flip-count');
  const msgEl=()=>document.getElementById('memory-message');
  document.getElementById('memory-close').onclick=()=>finish({won:false,flips:0});
  function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function buildGrid(){
    const pairs=shuffle([...MEMORY_SYMBOLS,...MEMORY_SYMBOLS]);
    gridEl().innerHTML='';cards=[];flipped=[];matched=0;flips=0;canFlip=true;flipEl().textContent=0;msgEl().textContent='';
    pairs.forEach((sym,i)=>{
      const card=document.createElement('div');card.className='mem-card';
      card.innerHTML=`<span class="card-back">🎴</span><span class="card-face">${sym}</span>`;
      card.dataset.sym=sym;card.onclick=()=>flipCard(card);gridEl().appendChild(card);cards.push(card);
    });
  }
  function flipCard(card){
    if(!canFlip||card.classList.contains('flipped')||card.classList.contains('matched'))return;
    card.classList.add('flipped');flipped.push(card);flips++;flipEl().textContent=flips;
    if(flipped.length===2){
      canFlip=false;const[a,b]=flipped;
      if(a.dataset.sym===b.dataset.sym){a.classList.add('matched');b.classList.add('matched');matched++;flipped=[];canFlip=true;
        if(matched===MEMORY_SYMBOLS.length){msgEl().textContent='✨ All pairs found!';setTimeout(()=>finish({won:true,flips}),800);}
      } else{setTimeout(()=>{a.classList.remove('flipped');b.classList.remove('flipped');flipped=[];canFlip=true;},900);}
    }
  }
  function finish(result){overlay().classList.add('hidden');if(_resolve){_resolve(result);_resolve=null;}}
  function play(){return new Promise(res=>{_resolve=res;overlay().classList.remove('hidden');buildGrid();});}
  return {play};
})();
