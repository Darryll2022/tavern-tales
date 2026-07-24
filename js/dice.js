const DiceGame=(()=>{
  const FACES=['⚀','⚁','⚂','⚃','⚄','⚅'];
  let dice,locked,rerolls,round,scores,_resolve;
  const overlay=()=>document.getElementById('dice-overlay');
  const diceRow=()=>document.getElementById('dice-row');
  const handLabel=()=>document.getElementById('dice-hand-label');
  const rerollsEl=()=>document.getElementById('rerolls-left');
  const roundEl=()=>document.getElementById('dice-round');
  const spPlayer=()=>document.getElementById('score-player');
  const spMira=()=>document.getElementById('score-mira');
  const btnRoll=()=>document.getElementById('btn-reroll');
  const btnStand=()=>document.getElementById('btn-stand');
  const msg=()=>document.getElementById('dice-message');
  document.getElementById('dice-close').onclick=()=>finish(false);
  function randDice(){return Array.from({length:5},()=>Math.floor(Math.random()*6)+1);}
  function evalHand(d){
    const counts={};d.forEach(v=>counts[v]=(counts[v]||0)+1);
    const vals=Object.values(counts).sort((a,b)=>b-a);
    if(vals[0]===5)return{name:'Five of a Kind',score:7};
    if(vals[0]===4)return{name:'Four of a Kind',score:6};
    if(vals[0]===3&&vals[1]===2)return{name:'Full House',score:5};
    if(vals[0]===3)return{name:'Three of a Kind',score:4};
    if(vals[0]===2&&vals[1]===2)return{name:'Two Pair',score:3};
    if(vals[0]===2)return{name:'One Pair',score:2};
    return{name:'High Card',score:1};
  }
  function renderDice(){
    diceRow().innerHTML='';
    dice.forEach((v,i)=>{
      const d=document.createElement('div');d.className='die'+(locked[i]?' locked':'');
      d.textContent=FACES[v-1];d.title=locked[i]?'Locked':'Click to lock';
      d.onclick=()=>{if(rerolls===3)return;locked[i]=!locked[i];renderDice();};
      diceRow().appendChild(d);
    });
    handLabel().textContent=rerolls<3?evalHand(dice).name:'';
  }
  function waitForStand(){
    return new Promise(res=>{
      btnRoll().onclick=()=>{
        if(rerolls<=0)return;
        dice=dice.map((v,i)=>locked[i]?v:Math.floor(Math.random()*6)+1);
        rerolls--;rerollsEl().textContent=`Re-rolls: ${rerolls}`;
        diceRow().querySelectorAll('.die:not(.locked)').forEach(d=>{d.classList.add('rolling');setTimeout(()=>d.classList.remove('rolling'),300);});
        setTimeout(()=>renderDice(),310);
        if(rerolls===0){btnRoll().disabled=true;btnStand().classList.remove('hidden');}
      };
      btnStand().onclick=()=>{btnStand().classList.add('hidden');res();};
    });
  }
  function delay(ms){return new Promise(r=>setTimeout(r,ms));}
  function finish(won){overlay().classList.add('hidden');if(_resolve){_resolve(won);_resolve=null;}}
  function play(){
    return new Promise(async res=>{
      _resolve=res;scores={player:0,mira:0};round=1;msg().textContent='';
      overlay().classList.remove('hidden');
      while(round<=2){
        spPlayer().textContent=scores.player;spMira().textContent=scores.mira;roundEl().textContent=round;
        rerolls=3;locked=[false,false,false,false,false];dice=randDice();
        btnStand().classList.add('hidden');btnRoll().disabled=false;btnRoll().textContent='ROLL';
        renderDice();rerollsEl().textContent='Re-rolls: 3';
        await waitForStand();
        const playerHand=evalHand(dice);
        const mDice=randDice();const miraHand=evalHand(mDice);
        msg().textContent=`Your ${playerHand.name} vs Mira's ${miraHand.name} (${mDice.map(v=>FACES[v-1]).join(' ')})`;
        if(playerHand.score>miraHand.score)scores.player++;else if(miraHand.score>playerHand.score)scores.mira++;
        await delay(1600);round++;
      }
      await delay(300);await finish(scores.player>scores.mira);
    });
  }
  return {play};
})();
