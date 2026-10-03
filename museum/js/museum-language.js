/* Voices of Humanity — multilingual interface controller, Phase 2 */
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

  function text(el,value){ if(el) el.textContent=value; }

  function translate(){
    const x=t[current]||t.en;
    document.documentElement.lang=current;
    document.documentElement.dir=langs[current].dir||"ltr";
    document.documentElement.dataset.vohLanguage=current;

    const select=document.getElementById("museumLanguageSelect");
    if(select) select.setAttribute("aria-label",x.language);

    const day=document.querySelector("#dayNightToggle");
    if(day){
      const labels=day.querySelectorAll(".timeLabel");
      if(labels[0]) labels[0].textContent=x.day;
      if(labels[1]) labels[1].textContent=x.night;
    }
    text(document.getElementById("timeHint"),x.timeHint);
    text(document.getElementById("enterMuseum"),x.enter);

    const launcher=document.getElementById("museumChatLauncher");
    if(launcher){
      const label=launcher.querySelector(".museum-chat-launcher-label");
      text(label,x.ask);
      launcher.setAttribute("aria-label",x.ask);
      launcher.title=x.ask;
    }
    const panel=document.getElementById("museumChat");
    if(panel) panel.setAttribute("aria-label",x.ask);
    text(document.querySelector("#museumChat .museum-chat-header h2"),x.ask);
    text(document.querySelector("#museumChat .museum-chat-header p"),x.guide);
    const input=document.getElementById("museumChatInput");
    if(input){input.placeholder=x.input;input.setAttribute("aria-label",x.input);}
    const close=document.getElementById("museumChatClose");
    if(close) close.setAttribute("aria-label",x.close);
    const send=document.querySelector("#museumChatForm button[type=submit]");
    if(send) send.setAttribute("aria-label",x.send);
    text(document.querySelector("#museumChat .museum-chat-note"),x.museumGuide);

    const buttons=document.querySelectorAll("#museumChatMessages [data-chat-intent]");
    const labels={what:x.what,whatSee:x.whatSee,reflection:x.reflection,hall:x.hall,services:x.services,human:x.human};
    buttons.forEach(btn=>{const key=btn.getAttribute("data-chat-intent");if(labels[key]) text(btn,labels[key]);});

    /* Main visitor-facing museum labels */
    const labelsMap={
      ".museum-sign h2":"VOICES OF HUMANITY",
      ".museum-sign p":"The Digital Museum of the World's Languages",
      ".visitor-centre":"Visitor Centre",
      "#cinema h2":"Documentary Cinema",
      "#africaMuseum .museum-title":"African Languages Museum",
      "#asiaMuseum .asia-name":"Asian Languages Museum",
      "#europeMuseum .continental-title":"European Languages Museum",
      "#americasMuseum .continental-title":"Americas Languages Museum",
      "#oceaniaMuseum .continental-title":"Oceania Languages Museum",
      ".hall-plaque":"HALL OF HUMANITY",
      ".hallGoldSign":"HALL OF HUMANITY",
      ".forecourt-label":"A HOME FOR HUMANITY'S VOICES",
      "#heritageMonument h2":"EVERY VOICE MATTERS",
      "#heritageMonument p":"Languages are humanity's living heritage.",
      "#heritageMonument span":"Voices of Humanity Interactive Museum",
      ".lm247Title":"LOCALMEDIA247"
    };
    Object.entries(labelsMap).forEach(([sel,key])=>{
      const nodes=document.querySelectorAll(sel);
      nodes.forEach(el=>{
        const value=x[key]||x[translateKey(key)]||key;
        if(value) {
          if(el.querySelector(".title-main")){
            const main=el.querySelector(".title-main"), sub=el.querySelector(".title-sub");
            const parts=value.split(" Museum");
            text(main,parts[0]);
            if(sub) text(sub,"Museum");
          } else if(el.querySelector("span") && key==="LOCALMEDIA247") {
            el.childNodes.forEach(n=>{if(n.nodeType===3)n.textContent="LOCALMEDIA247";});
          } else text(el,value);
        }
      });
    });

    /* Informational boards */
    const boards=[
      ["#africaComplex .info-board","Africa is home to over 2,000 living languages."],
      ["#asiaComplex .info-board","Discover Asia's rich linguistic heritage."],
      ["#europeComplex .info-board","Explore Europe's rich tapestry of languages, cultures and linguistic histories."],
      ["#americasComplex .info-board","Discover the languages and cultural voices of North, Central and South America."],
      ["#oceaniaComplex .info-board","Discover the extraordinary linguistic diversity of Australia's Pacific region."]
    ];
    const boardText={
      en:["Africa is home to over 2,000 living languages.","Discover Asia's rich linguistic heritage.","Explore Europe's rich tapestry of languages, cultures and linguistic histories.","Discover the languages and cultural voices of North, Central and South America.","Discover the extraordinary linguistic diversity of Australia's Pacific region."],
      fr:["L'Afrique abrite plus de 2 000 langues vivantes.","Découvrez le riche patrimoine linguistique de l'Asie.","Explorez la riche mosaïque des langues, cultures et histoires linguistiques de l'Europe.","Découvrez les langues et les voix culturelles d'Amérique du Nord, centrale et du Sud.","Découvrez l'extraordinaire diversité linguistique de la région Pacifique de l'Australie."],
      es:["África alberga más de 2.000 lenguas vivas.","Descubre el rico patrimonio lingüístico de Asia.","Explora el rico mosaico de lenguas, culturas e historias lingüísticas de Europa.","Descubre las lenguas y voces culturales de América del Norte, Central y del Sur.","Descubre la extraordinaria diversidad lingüística de la región del Pacífico australiano."],
      pt:["África abriga mais de 2.000 línguas vivas.","Descubra o rico patrimônio linguístico da Ásia.","Explore a rica diversidade de línguas, culturas e histórias linguísticas da Europa.","Descubra as línguas e vozes culturais da América do Norte, Central e do Sul.","Descubra a extraordinária diversidade linguística da região do Pacífico australiano."],
      de:["Afrika beheimatet mehr als 2.000 lebende Sprachen.","Entdecken Sie Asiens reiches sprachliches Erbe.","Entdecken Sie Europas vielfältiges Geflecht aus Sprachen, Kulturen und Sprachgeschichten.","Entdecken Sie die Sprachen und kulturellen Stimmen Nord-, Mittel- und Südamerikas.","Entdecken Sie die außergewöhnliche sprachliche Vielfalt der australischen Pazifikregion."],
      ar:["تضم أفريقيا أكثر من 2000 لغة حية.","اكتشف التراث اللغوي الغني لآسيا.","استكشف نسيج أوروبا الغني من اللغات والثقافات والتاريخ اللغوي.","اكتشف لغات وأصوات وثقافات أمريكا الشمالية والوسطى والجنوبية.","اكتشف التنوع اللغوي الاستثنائي في منطقة المحيط الهادئ الأسترالية."],
      zh:["非洲拥有超过2,000种现存语言。","探索亚洲丰富的语言遗产。","探索欧洲丰富多彩的语言、文化与语言历史。","探索北美洲、中美洲和南美洲的语言与文化声音。","探索澳大利亚太平洋地区非凡的语言多样性。"],
      hi:["अफ्रीका में 2,000 से अधिक जीवित भाषाएँ हैं।","एशिया की समृद्ध भाषाई विरासत की खोज करें।","यूरोप की भाषाओं, संस्कृतियों और भाषाई इतिहास की समृद्ध विविधता देखें।","उत्तर, मध्य और दक्षिण अमेरिका की भाषाओं और सांस्कृतिक आवाज़ों की खोज करें।","ऑस्ट्रेलिया के प्रशांत क्षेत्र की असाधारण भाषाई विविधता की खोज करें।"],
      ja:["アフリカには2,000以上の現存する言語があります。","アジアの豊かな言語遺産を探訪しましょう。","ヨーロッパの豊かな言語、文化、言語史を探訪しましょう。","北米・中米・南米の言語と文化の声を探訪しましょう。","オーストラリア太平洋地域の驚くべき言語多様性を探訪しましょう。"],
      ru:["В Африке существует более 2 000 живых языков.","Познакомьтесь с богатым языковым наследием Азии.","Исследуйте богатое многообразие языков, культур и языковой истории Европы.","Откройте для себя языки и культурные голоса Северной, Центральной и Южной Америки.","Познакомьтесь с удивительным языковым разнообразием австралийского Тихоокеанского региона."],
      pl:["W Afryce istnieje ponad 2000 żywych języków.","Poznaj bogate dziedzictwo językowe Azji.","Poznaj bogatą mozaikę języków, kultur i historii językowej Europy.","Odkryj języki i głosy kulturowe Ameryki Północnej, Środkowej i Południowej.","Poznaj niezwykłą różnorodność językową australijskiego regionu Pacyfiku."],
      ko:["아프리카에는 2,000개가 넘는 살아 있는 언어가 있습니다.","아시아의 풍부한 언어 유산을 탐험하세요.","유럽의 다양한 언어와 문화, 언어의 역사를 탐험하세요.","북·중·남아메리카의 언어와 문화적 목소리를 만나보세요.","호주 태평양 지역의 놀라운 언어 다양성을 탐험하세요."],
      nl:["Afrika heeft meer dan 2.000 levende talen.","Ontdek het rijke taalkundige erfgoed van Azië.","Ontdek de rijke verscheidenheid aan talen, culturen en taalgeschiedenissen van Europa.","Ontdek de talen en culturele stemmen van Noord-, Midden- en Zuid-Amerika.","Ontdek de buitengewone taalkundige diversiteit van de Australische Stille Oceaan-regio."]
    };
    const bt=boardText[current]||boardText.en;
    boards.forEach((item,i)=>document.querySelectorAll(item[0]).forEach(el=>text(el,bt[i])));

    /* Simple localized directional labels */
    const directions={
      en:["↑ Hall of Humanity","↓ Documentary Cinema"],
      fr:["↑ Hall de l’Humanité","↓ Cinéma documentaire"],es:["↑ Salón de la Humanidad","↓ Cine documental"],
      pt:["↑ Salão da Humanidade","↓ Cinema Documental"],de:["↑ Halle der Menschheit","↓ Dokumentarkino"],
      ar:["↑ قاعة الإنسانية","↓ السينما الوثائقية"],zh:["↑ 人类大厅","↓ 纪录片影院"],hi:["↑ मानवता सभागार","↓ डॉक्यूमेंट्री सिनेमा"],
      ja:["↑ 人類ホール","↓ ドキュメンタリー・シネマ"],ru:["↑ Зал человечества","↓ Документальное кино"],
      pl:["↑ Sala Ludzkości","↓ Kino Dokumentalne"],ko:["↑ 인류의 전당","↓ 다큐멘터리 시네마"],nl:["↑ Hal van de Mensheid","↓ Documentairebioscoop"]
    };
    const d=directions[current]||directions.en;
    const signs=document.querySelectorAll(".directionSign");
    if(signs[0]) text(signs[0],d[0]); if(signs[1]) text(signs[1],d[1]);

    document.dispatchEvent(new CustomEvent("voh:languageChanged",{detail:{code:current,translations:x}}));
  }

  function translateKey(key){return key;}

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
    window.VOHSetLanguage=setLanguage;
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
  else init();
})();