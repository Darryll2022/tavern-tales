document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('btn-start').addEventListener('click',()=>{
    document.getElementById('title-screen').classList.remove('active');document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');document.getElementById('game-screen').classList.add('active');
  });
  document.getElementById('btn-restart').addEventListener('click',()=>{
    Session.reset();
    ['edda','aldric','mira','fenwick','lyra'].forEach(id=>{
      const b=document.getElementById(`badge-${id}`);const d=document.getElementById(`dot-${id}`);
      if(b){b.textContent='TALK';b.className='npc-badge';}if(d)d.className='dot inactive';
    });
    const door=document.getElementById('hidden-door');door.classList.remove('unlocked');door.classList.add('locked');door.querySelector('.door-label').textContent='???';
    document.getElementById('ending-screen').classList.remove('active');document.getElementById('ending-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');document.getElementById('game-screen').classList.add('active');
  });
  document.getElementById('btn-home').addEventListener('click',()=>{
    Session.reset();
    document.getElementById('ending-screen').classList.remove('active');document.getElementById('ending-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.add('hidden');document.getElementById('game-screen').classList.remove('active');
    document.getElementById('title-screen').classList.remove('hidden');document.getElementById('title-screen').classList.add('active');
  });
  Scene.init();
});
