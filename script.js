
const initialCaptains = [

  "AbdulAziz",
  "Abdullah Arain",
  "Abdullah Haroon",
  "Zohaib ",
  "Muhammad Sami",
  "Subhan",
  "Anas Nafees",
  "Sujal Kumar"
];
const initialTeams = [
  "MM Fighters","Khatri KnightRiders","ST Squad","Zain Strikers","Samad Shaheen",
  "GM Bravos","Talal Titans","Saqib Stallions"
];

const captainCanvas = document.getElementById('captainCanvas');
const teamCanvas = document.getElementById('teamCanvas');
const ctxC = captainCanvas.getContext('2d');
const ctxT = teamCanvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const spinSound = document.getElementById('spinSound');

const recordsBox = document.getElementById('recordsBox');
const finalModal = document.getElementById('finalModal');
const finalList = document.getElementById('finalList');
const closeFinal = document.getElementById('closeFinal');
const downloadCsv = document.getElementById('downloadCsv');

let captains = initialCaptains.slice();
let teams = initialTeams.slice();
let assignments = []; // {captain, team}

const W = captainCanvas.width;
const H = captainCanvas.height;
const CX = W/2, CY = H/2;
const RADIUS = Math.min(W,H)/2 - 6;

// rotation state in radians
let rotC = 0;
let rotT = 0;

// load background images
const captainImg = new Image();
captainImg.src = "images/tsa.jpeg";

const teamImg = new Image();
teamImg.src = "images/teams.jpg";

captainImg.onload = teamImg.onload = () => {
  drawWheel(ctxC, captains, rotC, true, -1);
  drawWheel(ctxT, teams, rotT, false, -1);
};

// ========================
// Drawing function
// ========================
function drawWheel(ctx, items, rotation, isCaptain=false, highlightIndex=-1){
  ctx.clearRect(0,0,W,H);
  ctx.save();
  ctx.translate(CX,CY);
  ctx.rotate(rotation);

  // 1. Draw rotating background image
  if(isCaptain && captainImg.complete){
    ctx.save();
    ctx.globalAlpha = 0.5;  
    ctx.beginPath();
    ctx.arc(0,0,RADIUS+2,0,Math.PI*2);
    ctx.clip();
    ctx.drawImage(captainImg, -RADIUS-2, -RADIUS-2, (RADIUS+2)*2, (RADIUS+2)*2);
    ctx.restore();
  }
  if(!isCaptain && teamImg.complete){
    ctx.save();
    ctx.globalAlpha = 0.5;  
    ctx.beginPath();
    ctx.arc(0,0,RADIUS+2,0,Math.PI*2);
    ctx.clip();
    ctx.drawImage(teamImg, -RADIUS-2, -RADIUS-2, (RADIUS+2)*2, (RADIUS+2)*2);
    ctx.restore();
  }

  if(items.length === 0){
    ctx.restore();
    return;
  }

  // 2. Draw slices with borders only
  const sliceAngle = (2*Math.PI) / items.length;
  for(let i=0;i<items.length;i++){
    const angle = i*sliceAngle;

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.arc(0,0,RADIUS, angle, angle+sliceAngle);
    ctx.closePath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    if(i === highlightIndex){
      ctx.fillStyle = "rgba(226, 45, 45, 0.62)";
      ctx.fill();
    }

    ctx.save();
    ctx.rotate(angle + sliceAngle/2);
    ctx.textAlign = "right";
    ctx.fillStyle = "black";
    ctx.font = "600 16px Arial";
    ctx.fillText(items[i], RADIUS-10, 5);
    ctx.restore();
  }

  ctx.restore();
}

// ========================
// Selection math
// ========================
const ARROW_ANGLE = -Math.PI/2;
function getIndexAtArrow(items, rotation){
  const n = items.length;
  const sliceAngle = (2*Math.PI)/n;
  const relative = ( (ARROW_ANGLE - rotation) % (2*Math.PI) + 2*Math.PI ) % (2*Math.PI);
  let index = Math.floor(relative / sliceAngle);
  index = (index % n + n) % n;
  return index;
}

// ========================
// Animation
// ========================
function animateSpin(ctx, items, startRotation, totalRotation, duration, isCaptain){
  return new Promise(resolve => {
    const start = performance.now();
    const from = startRotation;
    const to = startRotation + totalRotation; 

    function step(now){
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const curRot = from + (to - from) * eased;
      drawWheel(ctx, items, curRot, isCaptain, -1);

      if(t < 1){
        requestAnimationFrame(step);
      } else {
        const finalRot = to % (2*Math.PI);
        const idx = getIndexAtArrow(items, finalRot);

        // keep highlight for a few seconds
        let highlightDuration = 2000; // 2 seconds
        let highlightStart = performance.now();

        function highlightAnim(now2){
          let elapsed = now2 - highlightStart;
          drawWheel(ctx, items, finalRot, isCaptain, idx);

          if(elapsed < highlightDuration){
            requestAnimationFrame(highlightAnim);
          } else {
            resolve({index: idx, rotation: finalRot});
          }
        }
        requestAnimationFrame(highlightAnim);
      }
    }
    requestAnimationFrame(step);
  });
}

// ========================
// Spin both wheels
// ========================
// ========================
// Spin sequentially
// ========================
async function spinBoth(){
  if(spinBtn.disabled) return;
  if(captains.length === 0 || teams.length === 0) {
    showFinal();
    return;
  }

  spinBtn.disabled = true;
  spinBtn.textContent = 'Spinning...';

  // random total rotations
  const fullTurns = 4 + Math.floor(Math.random()*3);
  const extraC = Math.random() * 2*Math.PI;
  const extraT = Math.random() * 2*Math.PI;

  const totalC = fullTurns * 2*Math.PI + extraC;
  const totalT = fullTurns * 2*Math.PI + extraT;

  const durationC = 9000 + Math.random()*1000; // 5–6 sec
  const durationT = 9000; // same as before

  // 1) spin captain first
  spinSound.currentTime = 0;
  spinSound.play();
  const resC = await animateSpin(ctxC, captains, rotC, totalC, durationC, true);

  // 2) after captain stops, spin team
  spinSound.currentTime = 0; // restart sound
  spinSound.play();
  const resT = await animateSpin(ctxT, teams, rotT, totalT, durationT, false);

  // assignment logic stays the same
  const capIndex = resC.index;
  const teamIndex = resT.index;
  const chosenCaptain = captains[capIndex];
  const chosenTeam = teams[teamIndex];

  assignments.push({captain: chosenCaptain, team: chosenTeam});
  addRecord(chosenCaptain, chosenTeam);

  captains.splice(capIndex,1);
  teams.splice(teamIndex,1);

  rotC = resC.rotation % (2*Math.PI);
  rotT = resT.rotation % (2*Math.PI);

  setTimeout(() => {
    rotC = 0;
    rotT = 0;
    drawWheel(ctxC, captains, rotC, true, -1);
    drawWheel(ctxT, teams, rotT, false, -1);

    spinBtn.disabled = false;
    spinBtn.textContent = 'Spin ';

    if(captains.length === 0 || teams.length === 0){
      setTimeout(showFinal, 600);
    }
  }, 600);
}


// ========================
// UI helpers
// ========================
function addRecord(captain, team){
  const el = document.createElement('div');
  el.className = 'record-item';
  el.innerHTML = `<div class="record-left"><strong>${captain}</strong></div><div class="record-right">${team}</div>`;
  recordsBox.insertBefore(el, recordsBox.firstChild);
}
function showFinal(){
  finalList.innerHTML = '';
  if(assignments.length === 0){
    finalList.innerHTML = '<div class="final-card">No assignments</div>';
  } else {
    assignments.forEach(a=>{
      const c = document.createElement('div');
      c.className = 'final-card';
      c.textContent = `${a.captain} → ${a.team}`;
      finalList.appendChild(c);
    });
  }
  finalModal.style.display = 'flex';
}
function closeFinalModal(){
  finalModal.style.display = 'none';
}
function download(){
  if(assignments.length === 0) return;
  const header = 'Captain,Team\n';
  const rows = assignments.map(a => `"${a.captain}","${a.team}"`).join('\n');
  const csv = header + rows;
  const blob = new Blob([csv], {type: 'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'assignments.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ========================
// events
// ========================
spinBtn.addEventListener('click', spinBoth);
closeFinal && closeFinal.addEventListener('click', closeFinalModal);
downloadCsv && downloadCsv.addEventListener('click', downloadCSV);

drawWheel(ctxC, captains, rotC, true, -1);
drawWheel(ctxT, teams, rotT, false, -1);
