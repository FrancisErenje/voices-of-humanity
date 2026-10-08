/* Voices of Humanity — Museum Guide
   Local, dependency-free visitor assistant.
   This first edition answers from the museum's own documented content.
*/
(function(){
  "use strict";

  const launcher=document.getElementById("museumChatLauncher");
  const panel=document.getElementById("museumChat");
  const closeBtn=document.getElementById("museumChatClose");
  const form=document.getElementById("museumChatForm");
  const input=document.getElementById("museumChatInput");
  const messages=document.getElementById("museumChatMessages");

  if(!launcher||!panel||!closeBtn||!form||!input||!messages) return;

  function translateChatInterface(){
    const l=window.VOHCurrentLanguage?window.VOHCurrentLanguage():"en";
    const tr=(window.VOH_TRANSLATIONS&&window.VOH_TRANSLATIONS[l])||window.VOH_TRANSLATIONS&&window.VOH_TRANSLATIONS.en||{};
    const dir=(window.VOH_LANGUAGES&&window.VOH_LANGUAGES[l]&&window.VOH_LANGUAGES[l].dir)||"ltr";
    panel.setAttribute("dir",dir);
    launcher.setAttribute("aria-label",tr.ask||"Ask the Museum");
    const launcherLabel=launcher.querySelector(".museum-chat-launcher-label");
    if(launcherLabel) launcherLabel.textContent=tr.ask||"Ask the Museum";
    const title=panel.querySelector(".museum-chat-header h2");
    const guide=panel.querySelector(".museum-chat-header p");
    const close=panel.querySelector("#museumChatClose");
    const note=panel.querySelector(".museum-chat-note");
    const formEl=panel.querySelector("#museumChatForm");
    if(title) title.textContent=tr.ask||"Ask the Museum";
    if(guide) guide.textContent=tr.guide||"Your digital museum guide";
    if(close) close.setAttribute("aria-label",tr.close||"Close chat");
    if(note) note.textContent=tr.museumGuide||"Museum Guide · Built into Voices of Humanity";
    if(formEl) formEl.setAttribute("aria-label",tr.ask||"Ask the Museum question");
    input.placeholder=tr.input||"Ask about the museum…";
    input.setAttribute("aria-label",tr.input||"Your question");
    const sendBtn=panel.querySelector("#museumChatSend");
    if(sendBtn) sendBtn.setAttribute("aria-label",tr.send||"Send message");
    const suggestionMap=[
      ["voices","what"],["whatSee","whatSee"],["reflection","reflection"],
      ["hall","hall"],["services","services"],["human","human"]
    ];
    suggestionMap.forEach(([intent,key])=>{
      const btn=messages.querySelector('[data-chat-intent="'+intent+'"]');
      if(btn && tr[key]) btn.textContent=tr[key];
    });
    const first=messages.querySelector(".museum-chat-bot");
    if(first && !messages.querySelector(".museum-chat-user")){
      const suggestions=first.querySelector(".museum-chat-suggestions");
      if(suggestions){
        first.innerHTML="<strong>"+(tr.welcome||"Welcome.")+"</strong><br>"+((localized[l]&&localized[l].fallback)||localized.en.fallback||"I am the museum's built-in guide.") ;
        first.appendChild(suggestions);
      }
    }
  }

  const knowledge=[
    {
      keys:["what is voices of humanity","what is this museum","voices of humanity"],
      answer:"Voices of Humanity is a digital museum dedicated to documenting, preserving and celebrating the world's languages and cultures through documentary filmmaking, research, education and digital archiving. Its guiding principle is: <em>Every Voice Matters.</em>"
    },
    {
      keys:["hall of humanity","hall"],
      answer:"The Hall of Humanity is the symbolic heart of the museum. It represents a shared home for humanity's many voices and carries the message <em>Every Voice Matters.</em> Select the Hall on the campus to explore its exhibition experience."
    },
    {
      keys:["reflection garden","reflection","garden"],
      answer:"The Reflection Garden is the museum's quiet space for daily reflections. It preserves the numbered Voices of Humanity reflection cards as a living archive where visitors can pause, read and reflect."
    },
    {
      keys:["documentary cinema","cinema","documentaries","films"],
      answer:"Documentary Cinema is where Voices of Humanity's language documentaries are presented. It is designed as the museum's moving-image archive, connecting real stories and language research with film."
    },
    {
      keys:["african languages","africa","african museum"],
      answer:"The African Languages Museum introduces visitors to Africa's extraordinary linguistic diversity. The museum presents Africa as home to more than 2,000 living languages."
    },
    {
      keys:["asian languages","asia","asian museum"],
      answer:"The Asian Languages Museum explores the rich linguistic heritage of Asia and its many languages and cultures."
    },
    {
      keys:["european languages","europe","european museum"],
      answer:"The European Languages Museum explores Europe's tapestry of languages, cultures and linguistic histories."
    },
    {
      keys:["americas","american languages","americas museum"],
      answer:"The Americas Languages Museum explores the languages and cultural voices of North, Central and South America."
    },
    {
      keys:["oceania","oceanic","oceania museum","pacific"],
      answer:"The Oceania Languages Museum explores the extraordinary linguistic diversity of Australia's Pacific region and the wider voices of Oceania."
    },
    {
      keys:["localmedia247","local media 247","localmedia","daily brief"],
      answer:"LocalMedia247 is the media and documentary production home associated with Voices of Humanity. Its motto is <em>Documenting Today. Preserving Tomorrow.</em><br><br>We can help with <strong>verified news reporting and publishing, fact-checking, documentary research and production, video editing, content creation, research-based media content, website creation and digital media projects</strong>. If you have a story, project, organisation or business that needs professional media support, ask about a service or connect with the team on WhatsApp: <a href="https://wa.me/2348064137756" target="_blank" rel="noopener noreferrer">+234 806 413 7756</a>."
    },
    {
      keys:["services","what services","localmedia services","what can localmedia247 do","what can localmedia do","hire localmedia247","hire localmedia","media services","services you offer","jobs you can do","work you can do","can you help my business"],
      answer:"<strong>LocalMedia247 services</strong><br><br>• <strong>News &amp; media publishing:</strong> verified news reporting, editorial publishing and fact-checking support.<br>• <strong>Documentary work:</strong> documentary research, scripting, production and story development.<br>• <strong>Video services:</strong> video editing and preparation of content for digital platforms.<br>• <strong>Content creation:</strong> research-based articles, social media content and other media materials.<br>• <strong>Website services:</strong> website creation and digital presentation projects.<br>• <strong>Research &amp; information:</strong> careful research, fact-checking and turning information into clear public-facing content.<br><br>These services can support individuals, creators, businesses, organisations, schools, media projects and other clients who need reliable media or digital-content support.<br><br><strong>Ready to discuss a project?</strong> <a href="https://wa.me/2348064137756" target="_blank" rel="noopener noreferrer">Chat with LocalMedia247 on WhatsApp →</a>"
    },
    {
      keys:["hire","quotation","quote","price","pricing","how much","book a service","need a service","i need help with a project","work with localmedia247"],
      answer:"Absolutely. Tell us what you need—news/media work, fact-checking, documentary research or production, video editing, content creation, website creation or another digital-media project—and the LocalMedia247 team can discuss the project with you. <a href="https://wa.me/2348064137756" target="_blank" rel="noopener noreferrer">Contact LocalMedia247 on WhatsApp →</a>"
    },
    {
      keys:["human","human being","real person","talk to someone","speak to someone","speak with someone","contact a person","customer service","staff","team","operator","representative"],
      answer:"Of course. I can hand you over to the human team. <a href="https://wa.me/2348064137756" target="_blank" rel="noopener noreferrer">Continue with a human on LocalMedia247 WhatsApp →</a><br><br><strong>WhatsApp:</strong> +234 806 413 7756"
    },
    {
      keys:["every voice matters","motto"],
      answer:"<em>Every Voice Matters</em> is the guiding motto of Voices of Humanity."
    },
    {
      keys:["why languages matter","why preserve languages","language preservation"],
      answer:"Languages carry histories, knowledge, identity and distinctive ways of seeing the world. Voices of Humanity exists to document and preserve these voices so they can continue to inform future generations."
    },
    {
      keys:["how many documentaries","episodes","documentary collection"],
      answer:"The Documentary Cinema is the museum's dedicated collection space for the Voices of Humanity documentary series. The collection is continually growing as new language documentaries are completed."
    },
    {
      keys:["how do i explore","how to explore","navigate","navigation"],
      answer:"Click or tap a museum building to focus on it. You can use the day/night control to change the atmosphere, and use <em>Ask the Museum</em> whenever you want a guide."
    }
  ];

  function normalise(s){
    return s.toLowerCase().replace(/[’']/g,"").replace(/[^a-z0-9\s]/g," ").replace(/\s+/g," ").trim();
  }

  const localized={
    en:{
      voices:"Voices of Humanity is a digital museum dedicated to documenting, preserving and celebrating the world's languages and cultures through documentary filmmaking, research, education and digital archiving. Its guiding principle is: <em>Every Voice Matters.</em>",
      whatSee:"You can explore the Hall of Humanity, Reflection Garden, Documentary Cinema, continental language museums and the LocalMedia247 media space.",
      hall:"The Hall of Humanity is the symbolic heart of the museum. It represents a shared home for humanity's many voices and carries the message <em>Every Voice Matters.</em>",
      reflection:"The Reflection Garden is the museum's quiet space for daily reflections. It preserves the numbered Voices of Humanity reflection cards as a living archive.",
      cinema:"Documentary Cinema is where Voices of Humanity's language documentaries are presented. It is the museum's moving-image archive.",
      services:"<strong>LocalMedia247 services</strong><br><br>Verified news reporting, fact-checking, documentary research and production, video editing, content creation, website creation and digital media projects.<br><br><a href="https://wa.me/2348064137756" target="_blank" rel="noopener noreferrer">Chat on WhatsApp →</a>",
      human:"<a href="https://wa.me/2348064137756" target="_blank" rel="noopener noreferrer">Continue with a human on LocalMedia247 WhatsApp →</a>",
      fallback:"I am the museum's built-in guide. Try asking about the Hall of Humanity, Reflection Garden, Documentary Cinema, our language museums, or LocalMedia247 services."
    },
    fr:{
      voices:"Voices of Humanity est un musée numérique consacré à la documentation, à la préservation et à la célébration des langues et cultures du monde. Son principe est : <em>Chaque voix compte.</em>",
      whatSee:"Vous pouvez explorer le Hall de l’Humanité, le Jardin de la réflexion, le Cinéma documentaire, les musées des langues des continents et l’espace LocalMedia247.",
      hall:"Le Hall de l’Humanité est le cœur symbolique du musée. Il représente une maison commune pour les nombreuses voix de l’humanité et porte le message <em>Chaque voix compte.</em>",
      reflection:"Le Jardin de la réflexion est l’espace calme consacré aux réflexions quotidiennes. Il conserve les cartes numérotées comme une archive vivante.",
      cinema:"Le Cinéma documentaire présente les documentaires linguistiques de Voices of Humanity et constitue l’archive audiovisuelle du musée.",
      services:"<strong>Services LocalMedia247</strong><br><br>Actualités vérifiées, fact-checking, recherche et production documentaires, montage vidéo, création de contenu et de sites web.<br><br><a href="https://wa.me/2348064137756" target="_blank">Contacter sur WhatsApp →</a>",
      human:"<a href="https://wa.me/2348064137756" target="_blank">Parler à l’équipe humaine sur WhatsApp →</a>",
      fallback:"Je suis le guide intégré du musée. Posez une question sur le Hall de l’Humanité, le Jardin de la réflexion, le Cinéma documentaire ou les musées des langues."
    },
    es:{
      voices:"Voices of Humanity es un museo digital dedicado a documentar, preservar y celebrar las lenguas y culturas del mundo. Su principio es: <em>Cada voz importa.</em>",
      whatSee:"Puedes explorar el Salón de la Humanidad, el Jardín de Reflexión, el Cine documental, los museos de lenguas de los continentes y el espacio de LocalMedia247.",
      hall:"El Salón de la Humanidad es el corazón simbólico del museo y representa un hogar compartido para las voces de la humanidad.",
      reflection:"El Jardín de Reflexión conserva las tarjetas de reflexión diarias como un archivo vivo.",
      cinema:"El Cine documental presenta los documentales lingüísticos de Voices of Humanity.",
      services:"<strong>Servicios de LocalMedia247</strong><br><br>Noticias verificadas, fact-checking, investigación y producción documental, edición de vídeo, creación de contenido y sitios web.<br><br><a href="https://wa.me/2348064137756">Contactar por WhatsApp →</a>",
      human:"<a href="https://wa.me/2348064137756">Hablar con el equipo humano por WhatsApp →</a>",
      fallback:"Soy el guía integrado del museo. Pregunta por el Salón de la Humanidad, el Jardín de Reflexión, el Cine documental o los museos de lenguas."
    },
    pt:{
      voices:"Voices of Humanity é um museu digital dedicado a documentar, preservar e celebrar as línguas e culturas do mundo. Seu princípio é: <em>Cada voz importa.</em>",
      whatSee:"Você pode explorar o Salão da Humanidade, o Jardim da Reflexão, o Cinema Documental, os museus de línguas dos continentes e o espaço da LocalMedia247.",
      hall:"O Salão da Humanidade é o coração simbólico do museu e representa um lar comum para as vozes da humanidade.",
      reflection:"O Jardim da Reflexão preserva os cartões de reflexão diários como um arquivo vivo.",
      cinema:"O Cinema Documental apresenta os documentários linguísticos do Voices of Humanity.",
      services:"<strong>Serviços da LocalMedia247</strong><br><br>Notícias verificadas, fact-checking, pesquisa e produção documental, edição de vídeo, criação de conteúdo e websites.<br><br><a href="https://wa.me/2348064137756">Falar pelo WhatsApp →</a>",
      human:"<a href="https://wa.me/2348064137756">Falar com a equipe humana pelo WhatsApp →</a>",
      fallback:"Sou o guia integrado do museu. Pergunte sobre o Salão da Humanidade, o Jardim da Reflexão, o Cinema Documental ou os museus de línguas."
    },
    de:{
      voices:"Voices of Humanity ist ein digitales Museum zur Dokumentation, Bewahrung und Feier der Sprachen und Kulturen der Welt. Sein Leitgedanke: <em>Jede Stimme zählt.</em>",
      whatSee:"Sie können die Halle der Menschheit, den Garten der Reflexion, das Dokumentarkino, die Sprachmuseen der Kontinente und den LocalMedia247-Bereich erkunden.",
      hall:"Die Halle der Menschheit ist das symbolische Herz des Museums und ein gemeinsames Zuhause für die Stimmen der Menschheit.",
      reflection:"Der Garten der Reflexion bewahrt die täglichen Reflexionskarten als lebendiges Archiv.",
      cinema:"Das Dokumentarkino präsentiert die Sprachdokumentationen von Voices of Humanity.",
      services:"<strong>LocalMedia247-Dienste</strong><br><br>Verifizierte Nachrichten, Faktenprüfung, Dokumentarrecherche und -produktion, Videobearbeitung, Content- und Website-Erstellung.<br><br><a href="https://wa.me/2348064137756">Über WhatsApp kontaktieren →</a>",
      human:"<a href="https://wa.me/2348064137756">Mit dem Team über WhatsApp sprechen →</a>",
      fallback:"Ich bin der integrierte Museumsführer. Fragen Sie nach der Halle der Menschheit, dem Garten der Reflexion, dem Dokumentarkino oder den Sprachmuseen."
    },
    ar:{
      voices:"Voices of Humanity متحف رقمي يوثق لغات وثقافات العالم ويحافظ عليها ويحتفي بها. ومبدؤه: <em>كل صوت مهم.</em>",
      whatSee:"يمكنك استكشاف قاعة الإنسانية وحديقة التأمل والسينما الوثائقية ومتاحف اللغات ومساحة LocalMedia247.",
      hall:"قاعة الإنسانية هي القلب الرمزي للمتحف وتمثل بيتاً مشتركاً لأصوات الإنسانية.",
      reflection:"حديقة التأمل تحفظ بطاقات التأمل اليومية كأرشيف حي.",
      cinema:"السينما الوثائقية تعرض أفلام Voices of Humanity عن اللغات.",
      services:"<strong>خدمات LocalMedia247</strong><br><br>أخبار موثقة، تدقيق الحقائق، البحث والإنتاج الوثائقي، تحرير الفيديو، إنشاء المحتوى والمواقع.<br><br><a href="https://wa.me/2348064137756">تواصل عبر واتساب →</a>",
      human:"<a href="https://wa.me/2348064137756">تحدث مع الفريق عبر واتساب →</a>",
      fallback:"أنا الدليل المدمج في المتحف. اسأل عن قاعة الإنسانية أو حديقة التأمل أو السينما الوثائقية أو متاحف اللغات."
    },
    zh:{
      voices:"Voices of Humanity 是一座记录、保护和庆祝世界语言与文化的数字博物馆。我们的理念是：<em>每一种声音都重要。</em>",
      whatSee:"您可以探索人类大厅、思考花园、纪录片影院、各洲语言博物馆以及 LocalMedia247 空间。",
      hall:"人类大厅是博物馆的象征性核心，代表人类众多声音共同的家园。",
      reflection:"思考花园保存每日思考卡片，形成一个不断成长的活档案。",
      cinema:"纪录片影院展示 Voices of Humanity 的语言纪录片。",
      services:"<strong>LocalMedia247 服务</strong><br><br>新闻发布、事实核查、纪录片研究与制作、视频编辑、内容创作和网站建设。<br><br><a href="https://wa.me/2348064137756">通过 WhatsApp 联系 →</a>",
      human:"<a href="https://wa.me/2348064137756">通过 WhatsApp 联系人工团队 →</a>",
      fallback:"我是博物馆内置导览。您可以询问人类大厅、思考花园、纪录片影院或语言博物馆。"
    },
    hi:{
      voices:"Voices of Humanity दुनिया की भाषाओं और संस्कृतियों के दस्तावेजीकरण, संरक्षण और उत्सव के लिए एक डिजिटल संग्रहालय है। इसका सिद्धांत है: <em>हर आवाज़ मायने रखती है।</em>",
      whatSee:"आप मानवता सभागार, चिंतन उद्यान, डॉक्यूमेंट्री सिनेमा, महाद्वीपीय भाषा संग्रहालयों और LocalMedia247 स्थान को देख सकते हैं।",
      hall:"मानवता सभागार संग्रहालय का प्रतीकात्मक केंद्र है और मानवता की अनेक आवाज़ों के साझा घर का प्रतिनिधित्व करता है।",
      reflection:"चिंतन उद्यान दैनिक चिंतन कार्डों को एक जीवित संग्रह के रूप में सुरक्षित रखता है।",
      cinema:"डॉक्यूमेंट्री सिनेमा Voices of Humanity की भाषा वृत्तचित्र प्रस्तुत करता है।",
      services:"<strong>LocalMedia247 सेवाएँ</strong><br><br>सत्यापित समाचार, तथ्य-जांच, वृत्तचित्र शोध और निर्माण, वीडियो संपादन, सामग्री और वेबसाइट निर्माण।<br><br><a href="https://wa.me/2348064137756">WhatsApp पर संपर्क करें →</a>",
      human:"<a href="https://wa.me/2348064137756">WhatsApp पर मानव टीम से बात करें →</a>",
      fallback:"मैं संग्रहालय का अंतर्निहित गाइड हूँ। मानवता सभागार, चिंतन उद्यान, डॉक्यूमेंट्री सिनेमा या भाषा संग्रहालयों के बारे में पूछें।"
    },
    ja:{
      voices:"Voices of Humanityは、世界の言語と文化を記録・保存・紹介するデジタル博物館です。理念は<em>すべての声が大切</em>です。",
      whatSee:"人類ホール、リフレクション・ガーデン、ドキュメンタリー・シネマ、各大陸の言語博物館、LocalMedia247を探索できます。",
      hall:"人類ホールは博物館の象徴的な中心であり、人類の多様な声の共有の家を表しています。",
      reflection:"リフレクション・ガーデンでは毎日のカードを生きたアーカイブとして保存しています。",
      cinema:"ドキュメンタリー・シネマではVoices of Humanityの言語ドキュメンタリーを紹介します。",
      services:"<strong>LocalMedia247のサービス</strong><br><br>検証済みニュース、ファクトチェック、ドキュメンタリー研究・制作、動画編集、コンテンツ制作、ウェブサイト制作。<br><br><a href="https://wa.me/2348064137756">WhatsAppで連絡 →</a>",
      human:"<a href="https://wa.me/2348064137756">WhatsAppでスタッフに連絡 →</a>",
      fallback:"博物館のガイドです。人類ホール、リフレクション・ガーデン、ドキュメンタリー・シネマ、言語博物館について質問できます。"
    },
    ru:{
      voices:"Voices of Humanity — цифровой музей, посвящённый документированию, сохранению и прославлению языков и культур мира. Принцип музея: <em>важен каждый голос.</em>",
      whatSee:"Вы можете исследовать Зал человечества, Сад размышлений, Документальное кино, музеи языков континентов и пространство LocalMedia247.",
      hall:"Зал человечества — символическое сердце музея и общий дом для множества голосов человечества.",
      reflection:"Сад размышлений сохраняет ежедневные карточки размышлений как живой архив.",
      cinema:"Документальное кино представляет языковые документальные фильмы Voices of Humanity.",
      services:"<strong>Услуги LocalMedia247</strong><br><br>Проверенные новости, фактчекинг, исследование и производство документальных фильмов, монтаж видео, создание контента и сайтов.<br><br><a href="https://wa.me/2348064137756">Связаться через WhatsApp →</a>",
      human:"<a href="https://wa.me/2348064137756">Поговорить с командой через WhatsApp →</a>",
      fallback:"Я встроенный гид музея. Спросите о Зале человечества, Саде размышлений, Документальном кино или музеях языков."
    },
    pl:{
      voices:"Voices of Humanity to cyfrowe muzeum poświęcone dokumentowaniu, ochronie i celebrowaniu języków i kultur świata. Jego zasada brzmi: <em>Każdy głos ma znaczenie.</em>",
      whatSee:"Możesz zwiedzić Salę Ludzkości, Ogród refleksji, Kino Dokumentalne, muzea języków kontynentów oraz przestrzeń LocalMedia247.",
      hall:"Sala Ludzkości jest symbolicznym sercem muzeum i wspólnym domem dla wielu głosów ludzkości.",
      reflection:"Ogród refleksji zachowuje codzienne karty refleksji jako żywe archiwum.",
      cinema:"Kino Dokumentalne prezentuje dokumenty językowe Voices of Humanity.",
      services:"<strong>Usługi LocalMedia247</strong><br><br>Zweryfikowane wiadomości, fact-checking, badania i produkcja dokumentalna, montaż wideo, tworzenie treści i stron internetowych.<br><br><a href="https://wa.me/2348064137756">Skontaktuj się przez WhatsApp →</a>",
      human:"<a href="https://wa.me/2348064137756">Porozmawiaj z zespołem przez WhatsApp →</a>",
      fallback:"Jestem wbudowanym przewodnikiem muzeum. Zapytaj o Salę Ludzkości, Ogród refleksji, Kino Dokumentalne lub muzea języków."
    },
    ko:{
      voices:"Voices of Humanity는 세계의 언어와 문화를 기록하고 보존하며 소개하는 디지털 박물관입니다. 원칙은 <em>모든 목소리는 소중합니다.</em>입니다.",
      whatSee:"인류의 전당, 성찰의 정원, 다큐멘터리 시네마, 대륙별 언어 박물관과 LocalMedia247 공간을 탐험할 수 있습니다.",
      hall:"인류의 전당은 박물관의 상징적인 중심이며 인류의 다양한 목소리를 위한 공동의 집을 의미합니다.",
      reflection:"성찰의 정원은 매일의 성찰 카드를 살아 있는 기록으로 보존합니다.",
      cinema:"다큐멘터리 시네마에서는 Voices of Humanity의 언어 다큐멘터리를 소개합니다.",
      services:"<strong>LocalMedia247 서비스</strong><br><br>검증된 뉴스, 팩트체킹, 다큐멘터리 연구·제작, 영상 편집, 콘텐츠 및 웹사이트 제작.<br><br><a href="https://wa.me/2348064137756">WhatsApp으로 문의 →</a>",
      human:"<a href="https://wa.me/2348064137756">WhatsApp으로 담당자에게 문의 →</a>",
      fallback:"박물관 안내자입니다. 인류의 전당, 성찰의 정원, 다큐멘터리 시네마 또는 언어 박물관에 대해 질문하세요."
    },
    nl:{
      voices:"Voices of Humanity is een digitaal museum dat de talen en culturen van de wereld documenteert, bewaart en viert. Het uitgangspunt is: <em>Elke stem telt.</em>",
      whatSee:"Je kunt de Hal van de Mensheid, Reflectietuin, Documentairebioscoop, taal­musea van de continenten en de LocalMedia247-ruimte verkennen.",
      hall:"De Hal van de Mensheid is het symbolische hart van het museum en een gedeeld thuis voor de vele stemmen van de mensheid.",
      reflection:"De Reflectietuin bewaart de dagelijkse reflectiekaarten als een levend archief.",
      cinema:"De Documentairebioscoop presenteert de taaldocumentaires van Voices of Humanity.",
      services:"<strong>LocalMedia247-diensten</strong><br><br>Geverifieerd nieuws, factchecking, documentair onderzoek en productie, videobewerking, content- en websitecreatie.<br><br><a href="https://wa.me/2348064137756">Neem contact op via WhatsApp →</a>",
      human:"<a href="https://wa.me/2348064137756">Praat met het team via WhatsApp →</a>",
      fallback:"Ik ben de ingebouwde museumgids. Vraag naar de Hal van de Mensheid, Reflectietuin, Documentairebioscoop of de taal­musea."
    }
  };

  const keywords={
    en:["voices","what is","what can i see","hall","reflection","cinema","documentary","services","human","languages","navigate"],
    fr:["voices","musée","hall","réflexion","cinéma","documentaire","services","humain","langues","explorer"],
    es:["voices","museo","salón","reflexión","cine","documental","servicios","humano","lenguas","explorar"],
    pt:["voices","museu","salão","reflexão","cinema","documentário","serviços","humano","línguas","explorar"],
    de:["voices","museum","halle","reflexion","dokumentar","dienste","mensch","sprachen","erkunden"],
    ar:["voices","متحف","قاعة","تأمل","وثائق","خدمات","إنسان","لغات","استكشاف"],
    zh:["voices","博物馆","大厅","思考","纪录片","服务","人工","语言","探索"],
    hi:["voices","संग्रहालय","सभागार","चिंतन","वृत्तचित्र","सेवाएँ","इंसान","भाषाएँ","अन्वेषण"],
    ja:["voices","博物館","ホール","リフレクション","ドキュメンタリー","サービス","人","言語","探索"],
    ru:["voices","музей","зал","размышлений","документ","услуги","человек","языки","исследовать"],
    pl:["voices","muzeum","sala","refleksji","dokument","usługi","człowiek","języki","zwiedzaj"],
    ko:["voices","박물관","전당","성찰","다큐멘터리","서비스","사람","언어","탐험"],
    nl:["voices","museum","hal","reflectie","documentaire","diensten","medewerker","talen","verkennen"]
  };

  function answerFor(question){
    const q=String(question||"").toLowerCase();
    const l=window.VOHCurrentLanguage?window.VOHCurrentLanguage():"en";
    const r=localized[l]||localized.en;
    if(/^intent:/.test(q)){
      const intent=q.replace(/^intent:/,"");
      if(intent==="whatSee") return r.whatSee;
      return r[intent]||r.fallback;
    }
    if(q.includes("igede")) return l==="fr"?"L’igede fait partie du parcours documentaire de Voices of Humanity.":r.fallback;
    if((keywords[l]||[]).some(k=>q.includes(k))){
      if(q.includes("service")||q.includes("dienste")||q.includes("خدمات")||q.includes("服务")||q.includes("सेवाएँ")||q.includes("서비스")||q.includes("usługi")) return r.services;
      if(q.includes("human")||q.includes("humain")||q.includes("humano")||q.includes("mensch")||q.includes("إنسان")||q.includes("人工")||q.includes("इंसान")||q.includes("人")||q.includes("человек")||q.includes("człowiek")||q.includes("사람")||q.includes("medewerker")) return r.human;
      if(q.includes("hall")||q.includes("salón")||q.includes("salão")||q.includes("halle")||q.includes("قاعة")||q.includes("大厅")||q.includes("सभागार")||q.includes("ホール")||q.includes("зал")||q.includes("sala")||q.includes("전당")||q.includes("hal")) return r.hall;
      if(q.includes("reflection")||q.includes("réflexion")||q.includes("reflexión")||q.includes("reflexão")||q.includes("reflexion")||q.includes("تأمل")||q.includes("思考")||q.includes("चिंतन")||q.includes("リフレクション")||q.includes("размыш")||q.includes("refleks")||q.includes("성찰")) return r.reflection;
      if(q.includes("cinema")||q.includes("document")||q.includes("وثائق")||q.includes("纪录片")||q.includes("वृत्तचित्र")||q.includes("ドキュメンタリー")||q.includes("документ")||q.includes("다큐멘터리")) return r.cinema;
      if(q.includes("what can")||q.includes("que puis")||q.includes("qué puedo")||q.includes("o que posso")||q.includes("was kann")||q.includes("ماذا")||q.includes("可以")||q.includes("क्या")||q.includes("何")||q.includes("что я")||q.includes("co mogę")||q.includes("무엇")) return r.whatSee;
      return r.voices;
    }
    return r.fallback;
  }
  function addMessage(textValue,who){
    const el=document.createElement("div");
    el.className="museum-chat-message "+(who==="user"?"museum-chat-user":"museum-chat-bot");
    el.innerHTML=textValue;
    messages.appendChild(el);
    messages.scrollTop=messages.scrollHeight;
  }

  function openChat(){
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden","false");
    launcher.setAttribute("aria-expanded","true");
    setTimeout(()=>input.focus(),120);
  }

  function closeChat(){
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden","true");
    launcher.setAttribute("aria-expanded","false");
  }

  function submitQuestion(question){
    const q=String(question||"").trim();
    if(!q) return;
    if(/^intent:/i.test(q)){
      setTimeout(()=>addMessage(answerFor(q),"bot"),80);
      return;
    }
    addMessage(q.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),"user");
    input.value="";
    setTimeout(()=>addMessage(answerFor(q),"bot"),220);
  }

  /*
   * The museum chat form is intentionally a <div> in index.html rather
   * than a native <form>.  The previous version only listened for the
   * "submit" event, so the Send button and Enter key could appear to do
   * nothing.  Keep a single explicit send function and bind it to both
   * controls.
   */
  function sendCurrentQuestion(event){
    if(event){
      event.preventDefault();
      event.stopPropagation();
      if(typeof event.stopImmediatePropagation==="function"){
        event.stopImmediatePropagation();
      }
    }
    submitQuestion(input.value);
    return false;
  }

  window.__vohSendMuseumQuestion=sendCurrentQuestion;

  launcher.addEventListener("click",()=>panel.classList.contains("is-open")?closeChat():openChat());
  closeBtn.addEventListener("click",closeChat);

  const sendBtn=panel.querySelector("#museumChatSend");
  if(sendBtn){
    sendBtn.addEventListener("click",sendCurrentQuestion,true);
  }

  input.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
      sendCurrentQuestion(e);
    }
  });

  /* Keep the native submit listener as a compatibility path in case the
     markup is later changed back to a real <form>. */
  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    submitQuestion(input.value);
  });

  /* Suggestion buttons are handled directly by the isolated
     Museum Guide controls in index.html.  No global capture handler
     is used here, so the museum/world interaction system cannot
     compete with those controls. */

  window.VOHMuseumAnswerFor=answerFor;
  window.VOHMuseumLocalized=localized;
  translateChatInterface();

  document.addEventListener("voh:languageChanged",()=>{
    const l=window.VOHCurrentLanguage?window.VOHCurrentLanguage():"en";
    const r=localized[l]||localized.en;
    const tr=(window.VOH_TRANSLATIONS||{})[l]||{};
    translateChatInterface();
    const first=messages.querySelector(".museum-chat-bot");
    const suggestions=messages.querySelector(".museum-chat-suggestions");
    if(first && suggestions && !messages.querySelector(".museum-chat-user")){\n      /* Preserve the existing suggestion buttons. Rebuilding with outerHTML creates new nodes and can discard their direct handlers. */\n      first.innerHTML="<strong>"+(tr.welcome||"Welcome.")+"</strong><br>"+(r.fallback||localized.en.fallback);\n      first.appendChild(suggestions);\n    }
  });

  document.addEventListener("keydown",(e)=>{
    if(e.key==="Escape" && panel.classList.contains("is-open")) closeChat();
  });
})();
