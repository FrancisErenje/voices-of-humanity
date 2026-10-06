/*==================================================
  VOICES OF HUMANITY — HALL OF HUMANITY ENGINE
  Stable exhibition interaction
==================================================*/
(function(){
  "use strict";

  function build(){
    const hall=document.getElementById("hall-humanity");
    const collection=window.HallOfHumanityCollection;
    if(!hall || !collection || !Array.isArray(collection.exhibits)) return;

    let overlay=document.querySelector(".hall-exhibition-overlay");
    if(overlay) overlay.remove();

    overlay=document.createElement("div");
    overlay.className="hall-exhibition hall-exhibition-overlay";
    overlay.setAttribute("role","dialog");
    overlay.setAttribute("aria-modal","true");
    overlay.setAttribute("aria-label","Hall of Humanity exhibition");

    const header=document.createElement("div");
    header.className="hall-exhibition-header";
    header.innerHTML=
      '<div class="hall-exhibition-kicker">VOICES OF HUMANITY · GLOBAL ORIENTATION CENTRE</div>'+
      '<div class="hall-exhibition-title">'+collection.headline+'</div>'+
      '<p class="hall-exhibition-intro">'+collection.intro+'</p>'+
      '<div class="hall-exhibition-stats">'+
        '<div class="hall-stat"><strong>'+collection.exhibits.length+'</strong><span>Curated exhibits</span></div>'+
        '<div class="hall-stat"><strong>5</strong><span>World regions</span></div>'+
        '<div class="hall-stat"><strong>1</strong><span>Shared humanity</span></div>'+
        '<div class="hall-stat"><strong>∞</strong><span>Voices to discover</span></div>'+
      '</div>';
    overlay.appendChild(header);

    const close=document.createElement("button");
    close.className="hall-exhibition-close";
    close.type="button";
    close.setAttribute("aria-label","Close Hall of Humanity exhibition");
    close.textContent="×";
    overlay.appendChild(close);

    const grid=document.createElement("div");
    grid.className="hall-exhibition-grid";

    collection.exhibits.forEach(ex=>{
      const card=document.createElement("article");
      card.className="hall-exhibit-card";
      card.innerHTML=
        '<div class="hall-exhibit-number">'+ex.number+'</div>'+
        '<div class="hall-exhibit-kicker">'+ex.kicker+'</div>'+
        '<div class="hall-exhibit-title">'+ex.title+'</div>'+
        '<div class="hall-exhibit-text">'+ex.text+'</div>';

      if(ex.url){
        const a=document.createElement("a");
        a.className="hall-exhibit-action";
        a.href=ex.url;
        a.target="_blank";
        a.rel="noopener noreferrer";
        a.textContent=ex.action;
        card.appendChild(a);
      }else{
        const b=document.createElement("button");
        b.type="button";
        b.className="hall-exhibit-action";
        b.textContent=ex.action;
        b.addEventListener("click",()=>promise.classList.add("open"));
        card.appendChild(b);
      }
      grid.appendChild(card);
    });
    overlay.appendChild(grid);

    const documentaries=Array.isArray(window.DocumentaryCollection)
      ? window.DocumentaryCollection.filter(x=>x.status==="published" && x.episode!==null)
      : [];

    const living=document.createElement("section");
    living.className="hall-living-collection";
    living.innerHTML=
      '<div class="hall-living-heading"><div>'+
      '<div class="hall-living-kicker">VOICES OF OUR MUSEUM · LIVING COLLECTION</div>'+
      '<div class="hall-living-title">Our Field Archive</div></div>'+
      '<div class="hall-living-count">'+documentaries.length+' PUBLISHED EPISODES</div></div>'+
      '<p class="hall-living-copy">The museum’s growing record of language documentaries researched, produced and published through Voices of Humanity.</p>';

    const row=document.createElement("div");
    row.className="hall-doc-row";
    documentaries.slice(0,6).forEach(doc=>{
      const card=document.createElement("article");
      card.className="hall-doc-card";
      card.innerHTML='<div class="hall-doc-episode">EPISODE '+doc.episode+'</div>'+
        '<div class="hall-doc-title">'+doc.title+'</div>'+
        '<div class="hall-doc-meta">'+(doc.region||"Nigeria")+' · '+(doc.languageFamily||"Language documentation")+'</div>';
      if(doc.videoUrl){
        const a=document.createElement("a");
        a.className="hall-doc-watch";
        a.href=doc.videoUrl;
        a.target="_blank";
        a.rel="noopener noreferrer";
        a.textContent="WATCH DOCUMENTARY ↗";
        card.appendChild(a);
      }
      row.appendChild(card);
    });
    living.appendChild(row);

    const actions=document.createElement("div");
    actions.className="hall-archive-actions";
    const archiveButton=document.createElement("button");
    archiveButton.type="button";
    archiveButton.className="hall-archive-button";
    archiveButton.textContent="OPEN FULL DOCUMENTARY ARCHIVE";
    actions.appendChild(archiveButton);
    living.appendChild(actions);
    overlay.appendChild(living);

    const promiseSection=document.createElement("div");
    promiseSection.className="hall-promise";
    promiseSection.innerHTML='<div class="hall-promise-quote">“A language is more than words.<br>It is memory. It is identity. It is knowledge. It is home.”</div>'+
      '<div class="hall-promise-sub">The museum’s living promise</div>';
    overlay.appendChild(promiseSection);

    const source=document.createElement("div");
    source.className="hall-source-strip";
    source.innerHTML='<span>Curated from UNESCO, ELP, ELDP & DOBES · External material remains with its respective owners.</span>';
    overlay.appendChild(source);

    document.body.appendChild(overlay);

    const archive=document.createElement("div");
    archive.className="hall-living-modal";
    archive.innerHTML='<div class="hall-living-dialog"><div class="hall-living-dialog-head"><div>'+
      '<div class="hall-living-kicker">VOICES OF HUMANITY · DOCUMENTARY ARCHIVE</div>'+
      '<h3>Our Published Language Documentaries</h3></div>'+
      '<button class="hall-living-close" type="button" aria-label="Close archive">×</button></div>'+
      '<div class="hall-full-archive"></div></div>';
    document.body.appendChild(archive);

    const archiveGrid=archive.querySelector(".hall-full-archive");
    documentaries.forEach(doc=>{
      const item=document.createElement("article");
      item.innerHTML='<strong>EPISODE '+doc.episode+'</strong><b>'+doc.title+'</b><span>'+(doc.region||"Nigeria")+'</span>';
      if(doc.videoUrl){
        const a=document.createElement("a");
        a.className="hall-doc-watch";
        a.href=doc.videoUrl;
        a.target="_blank";
        a.rel="noopener noreferrer";
        a.textContent="WATCH ↗";
        item.appendChild(a);
      }
      archiveGrid.appendChild(item);
    });

    const open=()=>{
      overlay.classList.add("open");
      document.body.classList.add("hall-overlay-open");
      const panel=document.getElementById("museumPanel");
      if(panel) panel.style.display="none";
      setTimeout(()=>close.focus(),50);
    };
    const shut=(event)=>{
      if(event){
        event.preventDefault();
        event.stopPropagation();
        if(typeof event.stopImmediatePropagation==="function") event.stopImmediatePropagation();
      }
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden","true");
      overlay.style.display="none";
      overlay.style.visibility="hidden";
      overlay.style.opacity="0";
      overlay.style.pointerEvents="none";
      overlay.style.zIndex="-1";
      document.body.classList.remove("hall-overlay-open");
      if(typeof returnToMuseumHomepage === "function") returnToMuseumHomepage();
    };

    window.openHallHumanityExperience=open;

    /* The close control is deliberately owned by the Hall itself.
       Handle the initial pointer/touch activation as well as click so
       no camera/building gesture can consume the interaction first. */
    const closeHallFromControl=(e)=>shut(e);
    close.addEventListener("pointerdown",closeHallFromControl,true);
    close.addEventListener("pointerup",closeHallFromControl,true);
    close.addEventListener("touchend",closeHallFromControl,true);
    close.addEventListener("click",closeHallFromControl,true);
    overlay.addEventListener("click",e=>{if(e.target===overlay) shut();});
    archiveButton.addEventListener("click",()=>archive.classList.add("open"));
    archive.querySelector(".hall-living-close").addEventListener("click",()=>archive.classList.remove("open"));
    archive.addEventListener("click",e=>{if(e.target===archive) archive.classList.remove("open");});

    let promise=document.querySelector(".hall-promise-modal");
    if(!promise){
      promise=document.createElement("div");
      promise.className="hall-promise-modal";
      promise.innerHTML='<div class="hall-promise-dialog"><button class="hall-promise-close" type="button">×</button><h3>Make a Promise</h3><p>What voice will you help preserve? Start with one language, one story, one recording, one lesson, or one person whose voice deserves to be heard.</p></div>';
      document.body.appendChild(promise);
    }
    promise.querySelector(".hall-promise-close")?.addEventListener("click",()=>promise.classList.remove("open"));

    let surface=hall.querySelector(".hall-click-surface");
    if(!surface){
      surface=document.createElement("button");
      surface.type="button";
      surface.className="hall-click-surface";
      surface.setAttribute("aria-label","Open Hall of Humanity exhibition");
      surface.title="Open Hall of Humanity";
      hall.appendChild(surface);
    }
    surface.onclick=e=>{e.preventDefault();e.stopPropagation();open();};

    /* Use pointerup as the primary activation event. The museum viewport
       owns drag/touch gestures, so pointerup is more reliable than click
       when a visitor simply taps/clicks the Hall without moving the camera. */
    if(!document.documentElement.dataset.hallPointerActivation){
      document.documentElement.dataset.hallPointerActivation="true";
      let hallPointerStartX=null;
      let hallPointerStartY=null;

      document.addEventListener("pointerdown",e=>{
        const r=hall.getBoundingClientRect();
        const inside=e.clientX>=r.left && e.clientX<=r.right &&
                     e.clientY>=r.top && e.clientY<=r.bottom;
        if(inside){
          hallPointerStartX=e.clientX;
          hallPointerStartY=e.clientY;
        }else{
          hallPointerStartX=null;
          hallPointerStartY=null;
        }
      },true);

      document.addEventListener("pointerup",e=>{
        if(hallPointerStartX===null || hallPointerStartY===null) return;
        const moved=Math.hypot(
          e.clientX-hallPointerStartX,
          e.clientY-hallPointerStartY
        );
        hallPointerStartX=null;
        hallPointerStartY=null;
        if(moved>12) return;

        const r=hall.getBoundingClientRect();
        const inside=e.clientX>=r.left && e.clientX<=r.right &&
                     e.clientY>=r.top && e.clientY<=r.bottom;
        if(inside){
          e.preventDefault();
          e.stopImmediatePropagation();
          open();
        }
      },true);

      document.addEventListener("click",e=>{
        if(e.target.closest?.("#hall-humanity")){
          e.preventDefault();
          e.stopImmediatePropagation();
          open();
        }
      },true);
    }
  }

  function start(){
    try{ build(); }catch(error){ console.error("Hall of Humanity failed to initialise:",error); }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start);
  else start();
  window.addEventListener("load",start,{once:true});
})();