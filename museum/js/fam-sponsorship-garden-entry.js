/* Fam Documentary No. 31 sponsorship entrance — anchored above the Reflection Garden. */
(function(){
  "use strict";
  var selector='.museum-garden[data-garden-id="reflection-garden"]';
  function install(){
    var garden=document.querySelector(selector);
    if(!garden || garden.querySelector(".fam-sponsorship-garden-link")) return !!garden;
    var link=document.createElement("a");
    link.className="fam-sponsorship-garden-link";
    link.href="/museum/sponsorship.html";
    link.target="_blank";
    link.rel="noopener";
    link.setAttribute("aria-label","Support Our Next Documentary — Fam Documentary No. 31");
    link.innerHTML='<span class="fam-sponsor-kicker">VOICES OF HUMANITY</span><strong>SUPPORT OUR NEXT DOCUMENTARY</strong><span class="fam-sponsor-detail">Fam · Documentary No. 31 ↗</span>';
    link.addEventListener("click",function(event){event.stopPropagation();},true);
    garden.appendChild(link);
    return true;
  }
  function start(){
    if(install()) return;
    var observer=new MutationObserver(function(){
      if(install()) observer.disconnect();
    });
    observer.observe(document.body,{childList:true,subtree:true});
    window.addEventListener("load",install,{once:true});
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();