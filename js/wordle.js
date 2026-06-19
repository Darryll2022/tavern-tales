const WordleGame=(()=>{
  const ROWS=6,COLS=6;
  let word,guessGrid,currentRow,currentCol,gameOver,_resolve;
  const overlay=()=>document.getElementById('wordle-overlay');
  const grid=()=>document.getElementById('wordle-grid');
  const keyboard=()=>document.getElementById('wordle-keyboard');
  const message=()=>document.getElementById('wordle-message');
  const hint=()=>document.getElementById('wordle-hint');
  const KEYS=[['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['ENTER','Z','X','C','V','B','N','M','⌫']];

  function buildGrid(){
    grid().innerHTML='';guessGrid=[];
    for(let r=0;r<ROWS;r++){
      const row=document.createElement('div');row.className='wordle-row';const cells=[];
      for(let c=0;c<COLS;c++){const cell=document.createElement('div');cell.className='wordle-cell';row.appendChild(cell);cells.push(cell);}
      grid().appendChild(row);guessGrid.push(cells);
    }
  }
  function buildKeyboard(){
    keyboard().innerHTML='';
    KEYS.forEach(row=>{const rowEl=document.createElement('div');rowEl.className='key-row';
      row.forEach(k=>{const btn=document.createElement('button');btn.className='key-btn';btn.textContent=k;btn.dataset.key=k;btn.onclick=()=>handleKey(k);rowEl.appendChild(btn);});
      keyboard().appendChild(rowEl);});
  }
  function handleKey(key){
    if(gameOver)return;
    if(key==='⌫'||key==='BACKSPACE'){if(currentCol>0){currentCol--;guessGrid[currentRow][currentCol].textContent='';guessGrid[currentRow][currentCol].classList.remove('active');}}
    else if(key==='ENTER')submitGuess();
    else if(/^[A-Z]$/.test(key)&&currentCol<COLS){
      guessGrid[currentRow][currentCol].textContent=key;
      guessGrid[currentRow][currentCol].classList.add('active','pop');
      setTimeout(()=>guessGrid[currentRow][currentCol].classList.remove('pop'),150);
      currentCol++;
    }
  }
  function submitGuess(){
    if(currentCol<COLS){guessGrid[currentRow].forEach(c=>{c.style.animation='shake .3s ease';setTimeout(()=>c.style.animation='',300);});return;}
    const guess=guessGrid[currentRow].map(c=>c.textContent).join('');
    const result=score(guess,word);
    result.forEach((r,i)=>{setTimeout(()=>{const cell=guessGrid[currentRow][i];cell.classList.add('flip');setTimeout(()=>{cell.classList.add(r);cell.classList.remove('active');updateKey(guess[i],r);},250);},i*100);});
    setTimeout(()=>{
      if(guess===word){message().textContent='✨ You got it!';gameOver=true;setTimeout(()=>finish(true),900);}
      else if(currentRow===ROWS-1){message().textContent=`The word was: ${word}`;gameOver=true;setTimeout(()=>finish(false),1200);}
      else{currentRow++;currentCol=0;}
    },COLS*100+400);
  }
  function score(guess,answer){
    const result=Array(COLS).fill('absent');const answerArr=answer.split('');const guessArr=guess.split('');const used=Array(COLS).fill(false);
    guessArr.forEach((l,i)=>{if(l===answerArr[i]){result[i]='correct';used[i]=true;}});
    guessArr.forEach((l,i)=>{if(result[i]==='correct')return;const j=answerArr.findIndex((a,idx)=>a===l&&!used[idx]);if(j!==-1){result[i]='present';used[j]=true;}});
    return result;
  }
  function updateKey(letter,state){
    const btn=keyboard().querySelector(`[data-key="${letter}"]`);if(!btn)return;
    const priority={correct:3,present:2,absent:1};const current=btn.classList.contains('correct')?3:btn.classList.contains('present')?2:0;
    if(priority[state]>current){btn.classList.remove('correct','present','absent');btn.classList.add(state);}
  }
  function finish(won){gameOver=true;overlay().classList.add('hidden');document.removeEventListener('keydown',onKey);if(_resolve){_resolve(won);_resolve=null;}}
  function onKey(e){const k=e.key.toUpperCase();if(k==='BACKSPACE')handleKey('⌫');else if(k==='ENTER')handleKey('ENTER');else if(/^[A-Z]$/.test(k))handleKey(k);}
  document.getElementById('wordle-close').onclick=()=>finish(false);
  function play(){
    return new Promise(res=>{
      _resolve=res;
      const entry=WORDLE_WORDS[Math.floor(Math.random()*WORDLE_WORDS.length)];
      word=entry.word;hint().textContent=entry.hint;
      currentRow=0;currentCol=0;gameOver=false;message().textContent='';
      buildGrid();buildKeyboard();overlay().classList.remove('hidden');
      document.addEventListener('keydown',onKey);
    });
  }
  return {play};
})();
