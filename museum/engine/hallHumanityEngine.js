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
