/* Voices of Humanity — multilingual interface controller */
(function(){
  "use strict";
  const langs=window.VOH_LANGUAGES||{};
  const t=window.VOH_TRANSLATIONS||{};
  const supported=Object.keys(langs);
  const saved=localStorage.getItem("voh-language");
  const browser=(navigator.languages||[navigator.language||"en"])[0].toLowerCase().split("-")[0];
  let current=supported.includes(saved)?saved:(supported.includes(browser)?browser:"en");

  function addSelector(){
    if(document.getElementById("museumLanguageSelector")) return;
    const wrap=document.createElement("div");
    wrap.id="museumLanguageSelector";
    wrap.innerHTML='<span class="museum-language-globe" aria-hidden="true">🌐</span><label for="museumLanguageSelect" class="sr-only">Language</label><select id="museumLanguageSelect" aria-label="Language"></select>';
    document.body.appendChild(wrap);
    const select=wrap.querySelector("select");
    supported.forEach(code=>{
      const o=document.createElement("option");
      o.value=code;o.textContent=langs[code].native;select.appendChild(o);
    });
    select.value=current;
    select.addEventListener("change",()=>setLanguage(select.value));
  }

  function replaceText(el,value){
    if(el) el.textContent=value;
  }

  function translate(){
    const x=t[current]||t.en;
    document.documentElement.lang=current;
    document.documentElement.dir=langs[current].dir||"ltr";
    const select=document.getElementById("museumLanguageSelect");
    if(select) select.setAttribute("aria-label",x.language);

    const day=document.querySelector("#dayNightToggle");
    if(day){
      const labels=day.querySelectorAll(".timeLabel");
      if(labels[0]) labels[0].textContent=x.day;
      if(labels[1]) labels[1].textContent=x.night;
    }
    replaceText(document.getElementById("timeHint"),x.timeHint);
    replaceText(document.getElementById("enterMuseum"),x.enter);

    const launcher=document.getElementById("museumChatLauncher");
    if(launcher){
      const label=launcher.querySelector(".museum-chat-launcher-label");
      replaceText(label,x.ask);
      launcher.setAttribute("aria-label",x.ask);
    }
    const panel=document.getElementById("museumChat");
    if(panel) panel.setAttribute("aria-label",x.ask);
    replaceText(document.querySelector("#museumChat .museum-chat-kicker"),"VOICES OF HUMANITY");
    replaceText(document.querySelector("#museumChat .museum-chat-header h2"),x.ask);
    replaceText(document.querySelector("#museumChat .museum-chat-header p"),x.guide);
    const input=document.getElementById("museumChatInput");
    if(input){input.placeholder=x.input;input.setAttribute("aria-label",x.input);}
    const close=document.getElementById("museumChatClose");
    if(close) close.setAttribute("aria-label",x.close);
    const send=document.querySelector("#museumChatForm button[type=submit]");
    if(send) send.setAttribute("aria-label",x.send);
    replaceText(document.querySelector("#museumChat .museum-chat-note"),x.museumGuide);

    const buttons=document.querySelectorAll("#museumChatMessages [data-chat-question]");
    if(buttons.length>=4){
      buttons[0].textContent=x.what;buttons[0].setAttribute("data-chat-question",x.what);
      buttons[1].textContent=x.whatSee;buttons[1].setAttribute("data-chat-question",x.whatSee);
      buttons[2].textContent=x.reflection;buttons[2].setAttribute("data-chat-question",x.reflection);
      buttons[3].textContent=x.hall;buttons[3].setAttribute("data-chat-question",x.hall);
    }
    const hallTitle=document.querySelector(".hall-title");
    if(hallTitle && current!=="en") hallTitle.textContent=x.hall;
    const chatLauncher=document.getElementById("museumChatLauncher");
    if(chatLauncher) chatLauncher.title=x.ask;
  }

  function setLanguage(code){
    if(!supported.includes(code)) code="en";
    current=code;
    localStorage.setItem("voh-language",code);
    translate();
  }

  function init(){
    addSelector();
    translate();
    window.VOHCurrentLanguage=()=>current;
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
  else init();
})();
