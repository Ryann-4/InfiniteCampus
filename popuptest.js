(() => {
  const FALLBACK_ART = "https://codehs.com/uploads/f111a37947de2cea81db858094c04f2d";
  const DB_NAME = "dryPlayerDB";
  const DB_VERSION = 1;
  let db;
  let tracks = [], currentIndex = 0, isLooping = false;

  // ------------------- IndexedDB -------------------
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = e => {
        db = e.target.result;
        if (!db.objectStoreNames.contains('songs')) db.createObjectStore('songs', { keyPath: 'id', autoIncrement: true });
        if (!db.objectStoreNames.contains('state')) db.createObjectStore('state', { keyPath: 'key' });
      };
      req.onsuccess = e => { db = e.target.result; resolve(db); };
      req.onerror = e => reject(e);
    });
  }

  function loadAllTracks() {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('songs', 'readonly');
      const store = tx.objectStore('songs');
      const req = store.getAll();
      req.onsuccess = () => {
        const allTracks = req.result || [];
        // Sort by 'position' field to maintain playlist order
        allTracks.sort((a,b) => (a.position || 0) - (b.position || 0));
        resolve(allTracks);
      };
      req.onerror = e => reject(e);
    });
  }

  // ------------------- DOM: Floating Player -------------------
  const floating = document.createElement('div');
  floating.style.position='fixed';
  floating.style.right='24px';
  floating.style.bottom='24px';
  floating.style.width='320px';
  floating.style.borderRadius='16px';
  floating.style.overflow='hidden';
  floating.style.border='1px solid rgba(255,255,255,.15)';
  floating.style.boxShadow='0 10px 30px rgba(0,0,0,.35)';
  floating.style.backdropFilter='blur(6px)';
  floating.style.background='#1116';
  floating.style.zIndex='9999';
  document.body.appendChild(floating);

  const bg = document.createElement('div');
  bg.style.position='absolute';
  bg.style.inset='0';
  bg.style.backgroundSize='cover';
  bg.style.backgroundPosition='center';
  bg.style.filter='blur(2px)';
  bg.style.transform='scale(1.05)';
  floating.appendChild(bg);

  const content = document.createElement('div');
  content.style.position='relative';
  content.style.padding='12px';
  content.style.color='#fff';
  floating.appendChild(content);

  const top = document.createElement('div');
  top.style.display='flex';
  top.style.justifyContent='space-between';
  top.style.alignItems='center';
  top.style.gap='8px';
  top.style.cursor='move';
  top.style.userSelect='none';
  content.appendChild(top);

  const title = document.createElement('div');
  title.style.fontSize='14px';
  title.style.fontWeight='600';
  title.style.whiteSpace='nowrap';
  title.style.overflow='hidden';
  title.style.textOverflow='ellipsis';
  title.textContent='Now Playing';
  top.appendChild(title);

  const closeBtn = document.createElement('button');
  closeBtn.textContent='✕';
  closeBtn.style.appearance='none';
  closeBtn.style.border='none';
  closeBtn.style.background='#0008';
  closeBtn.style.color='#fff';
  closeBtn.style.width='28px';
  closeBtn.style.height='28px';
  closeBtn.style.borderRadius='10px';
  closeBtn.style.cursor='pointer';
  top.appendChild(closeBtn);

  const audio = document.createElement('audio');
  audio.preload='metadata';
  audio.crossOrigin='anonymous';
  document.body.appendChild(audio);

  const seek = document.createElement('input');
  seek.type='range';
  seek.min='0';
  seek.max='1000';
  seek.value='0';
  seek.step='1';

  const miniTimes = document.createElement('div');
  miniTimes.style.color='white';
  miniTimes.style.marginLeft='8px';
  miniTimes.textContent='0:00 / 0:00';

  const seekContainer = document.createElement('div');
  seekContainer.style.display='flex';
  seekContainer.style.alignItems='center';
  seekContainer.style.gap='8px';
  seekContainer.style.marginTop='10px';
  seekContainer.appendChild(seek);
  seekContainer.appendChild(miniTimes);
  content.appendChild(seekContainer);

  const controls = document.createElement('div');
  controls.style.display='flex';
  controls.style.gap='8px';
  controls.style.marginTop='10px';
  const btnPrev = document.createElement('button'); btnPrev.textContent='⏮'; controls.appendChild(btnPrev);
  const btnPlay = document.createElement('button'); btnPlay.textContent='Play'; controls.appendChild(btnPlay);
  const btnNext = document.createElement('button'); btnNext.textContent='⏭'; controls.appendChild(btnNext);
  const btnLoop = document.createElement('button'); btnLoop.textContent='Loop'; controls.appendChild(btnLoop);
  [btnPrev,btnPlay,btnNext,btnLoop].forEach(b=>{
    b.style.background='#0007';
    b.style.border='1px solid #ffffff33';
    b.style.color='white';
    b.style.padding='6px 12px';
    b.style.borderRadius='8px';
  });
  content.appendChild(controls);

  // ------------------- Functions -------------------
  function fmtTime(s){s=Math.floor(s||0);return Math.floor(s/60)+":"+String(s%60).padStart(2,'0');}
  function setTrackUI(){
    const t = tracks[currentIndex];
    if(!t) return;
    title.textContent=t.title||'Untitled';
    bg.style.backgroundImage=`url("${(t.artworkDataUrl||FALLBACK_ART).replace(/"/g,'\\"')}")`;
  }
  function setPlayButtons(playing){btnPlay.textContent=playing?'Pause':'Play';}
  function nextTrack(){currentIndex=(currentIndex+1)%tracks.length;loadTrack(true);}
  function prevTrack(){audio.currentTime>10?audio.currentTime=0:(currentIndex=(currentIndex-1+tracks.length)%tracks.length,loadTrack(true));}
  function loadTrack(autoplay=false){
    if(tracks.length===0) return;
    const t = tracks[currentIndex];
    audio.src=URL.createObjectURL(t.blob);
    setTrackUI();
    if(autoplay) audio.play().catch(()=>{}),setPlayButtons(true); else setPlayButtons(false);
  }

  // ------------------- Events -------------------
  audio.addEventListener('timeupdate',()=>{
    const cur=audio.currentTime||0;
    const dur=audio.duration||0;
    seek.value=Math.round(cur/dur*1000)||0;
    miniTimes.textContent=fmtTime(cur)+' / '+fmtTime(dur);
  });
  seek.addEventListener('input',()=>{audio.currentTime=seek.value/1000*(audio.duration||0);});

  btnPlay.addEventListener('click',()=>audio.paused?audio.play().then(()=>setPlayButtons(true)):audio.pause()&&setPlayButtons(false));
  btnNext.addEventListener('click',()=>nextTrack());
  btnPrev.addEventListener('click',()=>prevTrack());
  btnLoop.addEventListener('click',()=>isLooping=!isLooping,btnLoop.style.outline=isLooping?'2px solid #4c9aff':'none');

  closeBtn.addEventListener('click',()=>{audio.pause();floating.style.display='none';});

  audio.addEventListener('ended',()=>{
    if(currentIndex<tracks.length-1) nextTrack();
    else if(isLooping) currentIndex=0,loadTrack(true);
  });

  // Drag floating
  (()=>{
    let dragging=false,startX=0,startY=0,originX=0,originY=0;
    top.addEventListener('mousedown',(e)=>{
      dragging=true; const rect=floating.getBoundingClientRect(); originX=rect.left;originY=rect.top;
      startX=e.clientX; startY=e.clientY;
      document.addEventListener('mousemove',onMove);
      document.addEventListener('mouseup',onUp);
    });
    function onMove(e){if(!dragging) return; const dx=e.clientX-startX; const dy=e.clientY-startY;
      floating.style.left=(originX+dx)+'px';floating.style.top=(originY+dy)+'px';floating.style.right='auto';floating.style.bottom='auto';
    }
    function onUp(){dragging=false;document.removeEventListener('mousemove',onMove);document.removeEventListener('mouseup',onUp);}
  })();
  // ------------------- Events -------------------

// Play/Pause toggle
btnPlay.addEventListener('click', () => {
    if (audio.paused) {
        audio.play().then(() => setPlayButtons(true));
    } else {
        audio.pause();
        setPlayButtons(false);
    }
});

// Loop toggle
btnLoop.addEventListener('click', () => {
    isLooping = !isLooping;
    btnLoop.textContent = isLooping ? 'Loop On' : 'Loop Off';
    btnLoop.style.outline = isLooping ? '2px solid #4c9aff' : 'none';
});

// Update play/pause button automatically when audio state changes
audio.addEventListener('play', () => setPlayButtons(true));
audio.addEventListener('pause', () => setPlayButtons(false));

function setPlayButtons(playing) {
    btnPlay.textContent = playing ? 'Pause' : 'Play';
}
  // ------------------- Init -------------------
  (async()=>{
    await openDB();
    tracks = await loadAllTracks();
    if(tracks.length>0){floating.style.display='block';loadTrack(false);}
  })();

})();
