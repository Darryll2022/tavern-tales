const ChessGame=(()=>{
  const INIT=[['r','n','b','q','k','b','n','r'],['p','p','p','p','p','p','p','p'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],['P','P','P','P','P','P','P','P'],['R','N','B','Q','K','B','N','R']];
  const GLYPHS={K:'♔',Q:'♕',R:'♖',B:'♗',N:'♘',P:'♙',k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'};
  let board,selected,turn,_resolve,gameOver,lastMove;
  const overlay=()=>document.getElementById('chess-overlay');
  const boardEl=()=>document.getElementById('chess-board');
  const statusEl=()=>document.getElementById('chess-status');
  const msgEl=()=>document.getElementById('chess-message');
  document.getElementById('chess-close').onclick=()=>finish(false);
  const copyBoard=b=>b.map(r=>[...r]);
  const isWhite=p=>p&&p===p.toUpperCase();
  const isBlack=p=>p&&p===p.toLowerCase();
  const isEnemy=(p,w)=>w?isBlack(p):isWhite(p);
  const isFriend=(p,w)=>w?isWhite(p):isBlack(p);
  const inBounds=(r,c)=>r>=0&&r<8&&c>=0&&c<8;
  function pieceMoves(b,r,c){
    const p=b[r][c];if(!p)return[];const white=isWhite(p);const moves=[];const type=p.toLowerCase();
    const add=(tr,tc)=>{if(inBounds(tr,tc)&&!isFriend(b[tr][tc],white))moves.push([tr,tc]);};
    const slide=(dr,dc)=>{let tr=r+dr,tc=c+dc;while(inBounds(tr,tc)){if(b[tr][tc]){if(isEnemy(b[tr][tc],white))moves.push([tr,tc]);break;}moves.push([tr,tc]);tr+=dr;tc+=dc;}};
    if(type==='p'){const dir=white?-1:1;const start=white?6:1;if(inBounds(r+dir,c)&&!b[r+dir][c]){moves.push([r+dir,c]);if(r===start&&!b[r+dir*2][c])moves.push([r+dir*2,c]);}[[r+dir,c-1],[r+dir,c+1]].forEach(([tr,tc])=>{if(inBounds(tr,tc)&&isEnemy(b[tr][tc],white))moves.push([tr,tc]);});}
    if(type==='r')[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr,dc])=>slide(dr,dc));
    if(type==='b')[[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dr,dc])=>slide(dr,dc));
    if(type==='q')[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dr,dc])=>slide(dr,dc));
    if(type==='n')[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]].forEach(([dr,dc])=>add(r+dr,c+dc));
    if(type==='k')[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dr,dc])=>add(r+dr,c+dc));
    return moves;
  }
  function findKing(b,white){const k=white?'K':'k';for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(b[r][c]===k)return[r,c];return null;}
  function isInCheck(b,white){const kpos=findKing(b,white);if(!kpos)return false;for(let r=0;r<8;r++)for(let c=0;c<8;c++){if(isEnemy(b[r][c],white)&&pieceMoves(b,r,c).some(([tr,tc])=>tr===kpos[0]&&tc===kpos[1]))return true;}return false;}
  function legalMoves(b,r,c){const p=b[r][c];if(!p)return[];const white=isWhite(p);return pieceMoves(b,r,c).filter(([tr,tc])=>{const nb=copyBoard(b);nb[tr][tc]=p;nb[r][c]=null;return!isInCheck(nb,white);});}
  function allLegalMoves(b,white){const moves=[];for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=b[r][c];if(p&&(white?isWhite(p):isBlack(p)))legalMoves(b,r,c).forEach(m=>moves.push({from:[r,c],to:m}));}return moves;}
  function applyMove(b,from,to){const nb=copyBoard(b);const p=nb[from[0]][from[1]];nb[to[0]][to[1]]=p;nb[from[0]][from[1]]=null;if(p==='P'&&to[0]===0)nb[to[0]][to[1]]='Q';if(p==='p'&&to[0]===7)nb[to[0]][to[1]]='q';return nb;}
  function aiMove(){const moves=allLegalMoves(board,false);if(!moves.length)return null;const captures=moves.filter(m=>board[m.to[0]][m.to[1]]!==null);const pool=captures.length?captures:moves;return pool[Math.floor(Math.random()*pool.length)];}
  function renderBoard(){
    boardEl().innerHTML='';const possible=selected?legalMoves(board,selected[0],selected[1]).map(m=>m.join(',')):[]; 
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){
      const sq=document.createElement('div');sq.className='chess-sq '+((r+c)%2===0?'light':'dark');
      const p=board[r][c];if(p)sq.textContent=GLYPHS[p];
      if(selected&&selected[0]===r&&selected[1]===c)sq.classList.add('selected');
      if(possible.includes(`${r},${c}`))sq.classList.add('possible');
      if(lastMove&&((lastMove.from[0]===r&&lastMove.from[1]===c)||(lastMove.to[0]===r&&lastMove.to[1]===c)))sq.classList.add('last-move');
      sq.onclick=()=>handleSquare(r,c);boardEl().appendChild(sq);
    }
    statusEl().textContent=turn==='white'?"Your turn (White ♙)":"Aldric is thinking...";
  }
  async function handleSquare(r,c){
    if(gameOver||turn!=='white')return;const p=board[r][c];
    if(selected){
      const moves=legalMoves(board,selected[0],selected[1]);const valid=moves.find(([tr,tc])=>tr===r&&tc===c);
      if(valid){board=applyMove(board,selected,[r,c]);lastMove={from:selected,to:[r,c]};selected=null;turn='black';renderBoard();
        if(allLegalMoves(board,false).length===0&&isInCheck(board,false))return endGame('white');
        if(allLegalMoves(board,false).length===0&&!isInCheck(board,false))return endGame('draw');
        await delay(600);const mv=aiMove();
        if(mv){board=applyMove(board,mv.from,mv.to);lastMove=mv;turn='white';renderBoard();
          if(allLegalMoves(board,true).length===0&&isInCheck(board,true))return endGame('black');
          if(allLegalMoves(board,true).length===0&&!isInCheck(board,true))return endGame('draw');
        }else endGame('white');
      }else{if(p&&isWhite(p)){selected=[r,c];renderBoard();}else{selected=null;renderBoard();}}
    }else{if(p&&isWhite(p)){selected=[r,c];renderBoard();}}
  }
  function endGame(winner){gameOver=true;if(winner==='white')msgEl().textContent='You won! Aldric nods slowly.';else if(winner==='black')msgEl().textContent="Aldric's experience shows.";else msgEl().textContent='A draw — honour on both sides.';setTimeout(()=>finish(winner==='white'||winner==='draw'),1200);}
  function finish(won){overlay().classList.add('hidden');if(_resolve){_resolve(won);_resolve=null;}}
  function delay(ms){return new Promise(r=>setTimeout(r,ms));}
  function play(){return new Promise(res=>{_resolve=res;board=INIT.map(r=>[...r]);selected=null;turn='white';gameOver=false;lastMove=null;msgEl().textContent='';overlay().classList.remove('hidden');renderBoard();});}
  return {play};
})();
