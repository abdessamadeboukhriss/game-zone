const params = new URLSearchParams(location.search);
const game = params.get('game') || 'snake';
const root = document.getElementById('game-root');
const title = document.getElementById('game-title');
const desc = document.getElementById('game-description');
const help = document.getElementById('help-text');
const restart = document.getElementById('restart');
let startGame = () => {};

function setupSnake(){
  title.textContent='Snake'; desc.textContent='Score : mange les pommes rouges.';
  help.textContent='Utilise les flèches du clavier pour diriger le serpent. Sur téléphone, touche les boutons.';
  root.innerHTML='<div class="game-status" id="score">Score : 0</div><canvas id="board" width="480" height="360"></canvas><div class="touch-controls"><button data-dir="up">▲</button><div><button data-dir="left">◀</button><button data-dir="down">▼</button><button data-dir="right">▶</button></div></div>';
  const canvas=document.getElementById('board'),ctx=canvas.getContext('2d');
  let timer, snake, food, dir, next, score, over;
  function reset(){clearInterval(timer);snake=[{x:10,y:9},{x:9,y:9},{x:8,y:9}];food={x:15,y:9};dir={x:1,y:0};next=dir;score=0;over=false;document.getElementById('score').textContent='Score : 0';draw();timer=setInterval(tick,115)}
  function draw(){ctx.fillStyle='#0c1730';ctx.fillRect(0,0,480,360);for(let x=0;x<24;x++)for(let y=0;y<18;y++){ctx.fillStyle=(x+y)%2?'#10203b':'#0e1b34';ctx.fillRect(x*20,y*20,20,20)}ctx.fillStyle='#fb7185';ctx.beginPath();ctx.arc(food.x*20+10,food.y*20+10,8,0,Math.PI*2);ctx.fill();snake.forEach((p,i)=>{ctx.fillStyle=i?'#34bfa8':'#a7f3d0';ctx.fillRect(p.x*20+2,p.y*20+2,16,16)})}
  function tick(){dir=next;const h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(h.x<0||h.x>=24||h.y<0||h.y>=18||snake.some(p=>p.x===h.x&&p.y===h.y)){over=true;clearInterval(timer);ctx.fillStyle='#fff';ctx.font='bold 26px sans-serif';ctx.textAlign='center';ctx.fillText('Game Over',240,180);return}snake.unshift(h);if(h.x===food.x&&h.y===food.y){score++;document.getElementById('score').textContent='Score : '+score;food={x:Math.floor(Math.random()*24),y:Math.floor(Math.random()*18)}}else snake.pop();draw()}
  function change(d){if(d.x!==-dir.x||d.y!==-dir.y)next=d}
  document.onkeydown=e=>{const m={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};if(m[e.key]){e.preventDefault();change(m[e.key])}};
  root.querySelectorAll('[data-dir]').forEach(b=>b.onclick=()=>{const m={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};change(m[b.dataset.dir])});
  startGame=reset;reset();
}
function setupMemory(){
 title.textContent='Memory';desc.textContent='Trouve les 8 paires.';help.textContent='Clique sur deux cartes pour trouver les symboles identiques.';root.innerHTML='<div class="game-status" id="memory-score">Paires trouvées : 0 / 8</div><div class="memory-board" id="memory-board"></div>';
 let first=null,lock=false,matches=0,deck=[];
 function reset(){first=null;lock=false;matches=0;deck=['🍎','🚀','🐱','⚽','🌟','🎧','🍕','🐼', '🍎','🚀','🐱','⚽','🌟','🎧','🍕','🐼'].sort(()=>Math.random()-.5);document.getElementById('memory-score').textContent='Paires trouvées : 0 / 8';const board=document.getElementById('memory-board');board.innerHTML='';deck.forEach((v,i)=>{const b=document.createElement('button');b.className='memory-card';b.textContent='?';b.onclick=()=>flip(b,v);board.appendChild(b)})}
 function flip(btn,val){if(lock||btn.classList.contains('flipped')||btn.disabled)return;btn.textContent=val;btn.classList.add('flipped');if(!first){first={btn,val};return}if(first.val===val){first.btn.disabled=true;btn.disabled=true;matches++;document.getElementById('memory-score').textContent=`Paires trouvées : ${matches} / 8`;first=null;if(matches===8)document.getElementById('memory-score').textContent='Bravo ! Tu as trouvé toutes les paires 🎉'}else{lock=true;const old=first;first=null;setTimeout(()=>{old.btn.textContent='?';btn.textContent='?';old.btn.classList.remove('flipped');btn.classList.remove('flipped');lock=false},700)}}
 startGame=reset;reset();
}
function setupBreakout(){
 title.textContent='Breakout';desc.textContent='Casse toutes les briques.';help.textContent='Déplace la souris ou ton doigt pour bouger la raquette. Clique sur le jeu pour lancer la balle.';root.innerHTML='<div class="game-status" id="break-score">Score : 0</div><canvas id="board" width="480" height="360"></canvas>';
 const c=document.getElementById('board'),ctx=c.getContext('2d');let x=240,y=300,dx=3,dy=-3,paddle=200,score=0,bricks=[],running=false,raf;
 function reset(){cancelAnimationFrame(raf);x=240;y=300;dx=3;dy=-3;paddle=190;score=0;running=false;bricks=[];for(let r=0;r<4;r++)for(let col=0;col<8;col++)bricks.push({x:15+col*57,y:35+r*25,alive:true});document.getElementById('break-score').textContent='Score : 0';draw()}
 function draw(){ctx.fillStyle='#0c1730';ctx.fillRect(0,0,480,360);bricks.forEach((b,i)=>{if(b.alive){ctx.fillStyle=['#5eead4','#9b8cff','#fb7185','#fbbf24'][Math.floor(i/8)];ctx.fillRect(b.x,b.y,50,15)}});ctx.fillStyle='#e6efff';ctx.fillRect(paddle,330,100,10);ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();if(!running){ctx.fillStyle='#b9c5dd';ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText('Clique pour commencer',240,205)}}
 function loop(){if(!running)return;x+=dx;y+=dy;if(x<7||x>473)dx=-dx;if(y<7)dy=-dy;if(y>322&&y<342&&x>paddle&&x<paddle+100)dy=-Math.abs(dy);if(y>360){running=false;ctx.fillStyle='#fff';ctx.font='bold 24px sans-serif';ctx.textAlign='center';ctx.fillText('Partie terminée',240,200);return}bricks.forEach(b=>{if(b.alive&&x>b.x&&x<b.x+50&&y>b.y&&y<b.y+15){b.alive=false;dy=-dy;score++;document.getElementById('break-score').textContent='Score : '+score}});if(bricks.every(b=>!b.alive)){running=false;ctx.fillStyle='#5eead4';ctx.font='bold 25px sans-serif';ctx.textAlign='center';ctx.fillText('Bravo ! Tu as gagné',240,200);return}draw();raf=requestAnimationFrame(loop)}
 function move(e){const rect=c.getBoundingClientRect();let px=(e.clientX-rect.left)*c.width/rect.width;paddle=Math.max(0,Math.min(380,px-50));if(!running)draw()}
 c.addEventListener('mousemove',move);c.addEventListener('touchmove',e=>{e.preventDefault();const t=e.touches[0];move(t)},{passive:false});c.addEventListener('click',()=>{if(!running){running=true;loop()}});startGame=reset;reset();
}
if(game==='memory')setupMemory();else if(game==='breakout')setupBreakout();else setupSnake();
restart.addEventListener('click',()=>startGame());
