const Scene=(()=>{
  function updateBadge(npcId){
    const badge=document.getElementById(`badge-${npcId}`);const dot=document.getElementById(`dot-${npcId}`);if(!badge||!dot)return;
    if(Session.hasWon(npcId)){badge.textContent='✓ WON';badge.className='npc-badge won';dot.className='dot won';}
    else if(Session.hasTalked(npcId)){badge.textContent='✓ MET';badge.className='npc-badge done';dot.className='dot done';}
  }
  function checkDoor(){
    if(Session.allTalked()){const door=document.getElementById('hidden-door');door.classList.remove('locked');door.classList.add('unlocked');door.querySelector('.door-label').textContent='ENTER';}
  }
  async function handleNpc(npcId){
    const npc=NPCS[npcId];
    if(Session.hasTalked(npcId)){await Dialogue.show(npc,[npc.alreadyTalked]);return;}
    Session.markTalked(npcId);updateBadge(npcId);checkDoor();
    const choice=await Dialogue.show(npc,npc.intro,{gameLabel:npc.gameLabel});
    if(choice!=='play')return;
    let won=false;
    if(npc.game==='wordle')won=await WordleGame.play();
    if(npc.game==='chess')won=await ChessGame.play();
    if(npc.game==='dice')won=await DiceGame.play();
    if(npc.game==='riddle')won=await RiddleGame.play();
    if(npc.game==='memory'){const r=await MemoryGame.play();won=r.won||r.flips<=22;}
    if(won){Session.markWon(npcId);updateBadge(npcId);}
    await Dialogue.show(npc,[won?npc.winDialogue:npc.loseDialogue]);
  }
  async function handleDoor(){
    if(!Session.allTalked())return;
    const doorNpc={name:'The Hidden Door',title:'Back of The Wandering Crow',portrait:'🚪',portraitImg:'',colour:'#f5c842'};
    await Dialogue.show(doorNpc,["The door is old. The wood is warped by years of tavern smoke.\n\nBut the handle turns.\n\nIt was never locked.\n\nIt was waiting."]);
    const won=Session.getGamesWon()>=3;
    const e=ENDINGS[won?'A':'B'];
    document.getElementById('ending-icon').textContent=e.icon;
    document.getElementById('ending-title').textContent=e.title;
    document.getElementById('ending-subtitle').textContent=e.subtitle;
    document.getElementById('ending-text').textContent=e.text;
    document.getElementById('game-screen').classList.remove('active');document.getElementById('game-screen').classList.add('hidden');
    const endScreen=document.getElementById('ending-screen');endScreen.classList.remove('hidden');endScreen.classList.add('active');
  }
  function init(){
    document.querySelectorAll('.npc').forEach(el=>el.addEventListener('click',()=>handleNpc(el.dataset.npc)));
    document.getElementById('hidden-door').addEventListener('click',handleDoor);
  }
  return {init,updateBadge,checkDoor};
})();
