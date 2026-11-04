/* Prominent Fam Documentary No. 31 sponsorship entrance below About shortcut. */
(function(){
  "use strict";
  function install(){
    if(document.querySelector(".fam-sponsorship-garden-link")) return true;
    var about=document.querySelector("body > a.museum-about-shortcut");
    if(!about) return false;
    var link=document.createElement("a");
    link.className="fam-sponsorship-garden-link";
    link.href="/museum/sponsorship.html";
    link.target="_blank";
    link.rel="noopener";
    link.setAttribute("aria-label","Support Our Next Documentary — Fam Documentary No. 31");
    link.innerHTML='<span class="fam-sponsor-kicker">OUR NEXT PROJECT</span><strong>SUPPORT OUR NEXT DOCUMENTARY</strong><span class="fam-sponsor-detail">Fam · Documentary No. 31 &nbsp; ↗</span>';
    link.addEventListener("click",function(event){event.stopPropagation();},true);
    about.insertAdjacentElement("afterend",link);
    return true;
  }
  function start(){
    if(install()) return;
    var observer=new MutationObserver(function(){if(install()) observer.disconnect();});
    observer.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();