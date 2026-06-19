const Session = (() => {
  let state = {talked:{},won:{},memory:[],gamesWon:0};
  function markTalked(id){state.talked[id]=true;}
  function markWon(id){state.won[id]=true;state.gamesWon++;}
  function hasTalked(id){return !!state.talked[id];}
  function hasWon(id){return !!state.won[id];}
  function addMemory(l){state.memory.push(l);}
  function getGamesWon(){return state.gamesWon;}
  function allTalked(){return Object.keys(NPCS).every(id=>state.talked[id]);}
  function reset(){state={talked:{},won:{},memory:[],gamesWon:0};}
  return {markTalked,markWon,hasTalked,hasWon,addMemory,getGamesWon,allTalked,reset};
})();
