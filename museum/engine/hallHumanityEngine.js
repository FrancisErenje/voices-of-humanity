/*==================================================
  VOICES OF HUMANITY — HALL OF HUMANITY ENGINE
==================================================*/

(function(){
  "use strict";

  function stop(e){ if(e) e.stopPropagation(); }

  function render(){
    const hall=document.getElementById("hall-humanity");
    const collection=window.HallOfHumanityCollection;
    if(!hall || !collection || hall.querySelector(".hall-exhibition")) return;

    const wrap=document.createElement("div");
    wrap.className="hall-exhibition";
    wrap.addEventListener("click",stop);

    const header=document.createElement("div");
    header.className="hall-exhibition-header";
    header.innerHTML=
      '<div class="hall-exhibition-kicker">VOICES OF HUMANITY · GLOBAL ORIENTATION CENTRE</div>'+
      '<div class="hall-exhibition-title">'+collection.headline+'</div>'+
      '<p class="hall-exhibition-intro">'+collection.intro+'</p>'+
      '<div class="hall-exhibition-stats">'+
        '<div class="hall-stat"><strong>12</strong><span>Curated exhibits</span></div>'+
        '<div class="hall-stat"><strong>5</strong><span>World regions</span></div>'+
        '<div class="hall-stat"><strong>1</strong><span>Shared humanity</span></div>'+
        '<div class="hall-stat"><strong>∞</strong><span>Voices to discover</span></div>'+
      '</div>';
    wrap.appendChild(header);

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

      const action=document.createElement("a");
      action.className="hall-exhibit-action";
      action.textContent=ex.action;
      if(ex.url){
        action.href=ex.url;
        action.target="_blank";
        action.rel="noopener noreferrer";
      }else{
        action.href="#";
        action.addEventListener("click",e=>{
          e.preventDefault();
          document.querySelector(".hall-promise-modal")?.classList.add("open");
        });
      }
      action.addEventListener("click",stop);
      card.appendChild(action);
      grid.appendChild(card);
    });

    wrap.appendChild(grid);

    const documentaries=Array.isArray(window.DocumentaryCollection) ? window.DocumentaryCollection : [];
    const publishedDocs=documentaries.filter(item=>item.status==="published" && item.episode!==null);

    const living=document.createElement("section");
    living.className="hall-living-collection";
    living.innerHTML='<div class="hall-living-heading"><div><div class="hall-living-kicker">VOICES OF OUR MUSEUM · LIVING COLLECTION</div><div class="hall-living-title">Our Field Archive</div></div><div class="hall-living-count">'+publishedDocs.length+' PUBLISHED EPISODES</div></div><p class="hall-living-copy">The museum's own growing record of language documentaries researched, produced and published through Voices of Humanity. The archive begins with Nigerian languages and is designed to expand across regions and generations.</p>';

    const docRow=document.createElement("div");
    docRow.className="hall-doc-row";

    publishedDocs.slice(0,6).forEach(doc=>{
      const card=document.createElement("article");
      card.className="hall-doc-card";
      card.innerHTML='<div class="hall-doc-episode">EPISODE '+doc.episode+'</div><div class="hall-doc-title">'+doc.title+'</div><div class="hall-doc-meta">'+(doc.region||"Nigeria")+' · '+(doc.languageFamily||"Language documentation")+'</div>';
      if(doc.videoUrl){
        const a=document.createElement("a");
        a.className="hall-doc-watch";
        a.href=doc.videoUrl;
        a.target="_blank";
        a.rel="noopener noreferrer";
        a.textContent="WATCH DOCUMENTARY ↗";
        card.appendChild(a);
      }
      docRow.appendChild(card);
    });
    living.appendChild(docRow);

    const actions=document.createElement("div");
    actions.className="hall-archive-actions";
    const archiveButton=document.createElement("button");
    archiveButton.className="hall-archive-button";
    archiveButton.type="button";
    archiveButton.textContent="OPEN FULL DOCUMENTARY ARCHIVE";
    actions.appendChild(archiveButton);

    const igede=document.createElement("a");
    igede.className="hall-archive-button";
    igede.href="academy/igede.html";
    igede.target="_blank";
    igede.rel="noopener noreferrer";
    igede.textContent="ENTER IGEDE LEARNING CENTRE ↗";
    actions.appendChild(igede);
    living.appendChild(actions);
    wrap.appendChild(living);

    const promise=document.createElement("div");
    promise.className="hall-promise";
    promise.innerHTML=
      '<div class="hall-promise-quote">“A language is more than words.<br>It is memory. It is identity. It is knowledge. It is home.”</div>'+
      '<div class="hall-promise-sub">The museum's living promise</div>';
    wrap.appendChild(promise);

    const source=document.createElement("div");
    source.className="hall-source-strip";
    source.innerHTML=
      '<span>Curated from UNESCO, ELP, ELDP & DOBES · External material remains with its respective owners.</span>'+
      '<a href="https://www.unesco.org/en/multilingualism-linguistic-diversity" target="_blank" rel="noopener noreferrer">Research framework ↗</a>';
    wrap.appendChild(source);

    hall.appendChild(wrap);

    const archiveModal=document.createElement("div");
    archiveModal.className="hall-living-modal";
    archiveModal.innerHTML='<div class="hall-living-dialog" role="dialog" aria-modal="true" aria-label="Full documentary archive"><div class="hall-living-dialog-head"><div><div class="hall-living-kicker">VOICES OF HUMANITY · DOCUMENTARY ARCHIVE</div><h3>Our Published Language Documentaries</h3><p>'+publishedDocs.length+' numbered documentary entries are currently connected to the museum archive.</p></div><button class="hall-living-close" aria-label="Close archive">×</button></div><div class="hall-full-archive"></div></div>';
    document.body.appendChild(archiveModal);

    const archiveGrid=archiveModal.querySelector(".hall-full-archive");
    publishedDocs.forEach(doc=>{
      const item=document.createElement("article");
      item.innerHTML='<strong>EPISODE '+doc.episode+'</strong><b>'+doc.title+'</b><span>'+(doc.region||"Nigeria")+' · '+(doc.language||"Language")+'</span>';
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
    archiveModal.querySelector(".hall-living-close").addEventListener("click",()=>archiveModal.classList.remove("open"));
    archiveModal.addEventListener("click",e=>{if(e.target===archiveModal) archiveModal.classList.remove("open")});
    archiveButton.addEventListener("click",()=>archiveModal.classList.add("open"));

    const modal=document.createElement("div");
    modal.className="hall-promise-modal";
    modal.innerHTML=
      '<div class="hall-promise-dialog" role="dialog" aria-modal="true" aria-label="Make a promise">'+
        '<button class="hall-promise-close" aria-label="Close">×</button>'+
        '<h3>Make a Promise</h3>'+
        '<p>What voice will you help preserve? Start with one language, one story, one recording, one lesson, or one person whose voice deserves to be heard.</p>'+
        '<div class="hall-promise-actions">'+
          '<button data-promise="learn">I WILL LEARN</button>'+
          '<button data-promise="share">I WILL SHARE</button>'+
          '<button data-promise="document">I WILL DOCUMENT</button>'+
        '</div>'+
      '</div>';
    document.body.appendChild(modal);

    modal.querySelector(".hall-promise-close").addEventListener("click",()=>{
      modal.classList.remove("open");
    });
    modal.addEventListener("click",e=>{
      if(e.target===modal) modal.classList.remove("open");
    });
    modal.querySelectorAll("[data-promise]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        btn.textContent="PROMISE RECORDED ✓";
        btn.disabled=true;
      });
    });
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",render);
  else render();
})();
