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
      answer:"LocalMedia247 is the media and documentary production home associated with Voices of Humanity. Its motto is <em>Documenting Today. Preserving Tomorrow.</em><br><br>We can help with <strong>verified news reporting and publishing, fact-checking, documentary research and production, video editing, content creation, research-based media content, website creation and digital media projects</strong>. If you have a story, project, organisation or business that needs professional media support, ask about a service or connect with the team on WhatsApp: <a href="https://wa.me/2348064137756" target="_blank" rel="noopener noreferrer">+234 806 413 7756</a>.
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

  function answerFor(question){
    const q=normalise(question);
    if(!q) return "Please type a question and I will guide you around the museum.";

    let best=null, score=0;
    for(const item of knowledge){
      let current=0;
      for(const key of item.keys){
        const k=normalise(key);
        if(q===k) current+=5;
        else if(q.includes(k)) current+=3;
        else {
          const words=k.split(" ").filter(w=>w.length>3);
          current+=words.filter(w=>q.includes(w)).length;
        }
      }
      if(current>score){score=current;best=item.answer;}
    }

    if(best && score>=2) return best;

    if(q.includes("igede")){
      return "Igede is one of the languages represented in the Voices of Humanity documentary journey. The museum's language archive and documentary work are designed to give languages such as Igede a visible, respectful place in the global story of humanity.";
    }
    if(q.includes("hello")||q.includes("hi")||q.includes("greetings")){
      return "Welcome to Voices of Humanity. Ask me about a museum building, the Reflection Garden, Documentary Cinema, languages, or how to explore the campus.";
    }
    return "I am the museum's built-in guide. Try asking about the Hall of Humanity, Reflection Garden, Documentary Cinema, our languages museums, Voices of Humanity, or <strong>LocalMedia247 services</strong>. If you would rather speak with a person, <a href="https://wa.me/2348064137756" target="_blank" rel="noopener noreferrer">contact LocalMedia247 on WhatsApp →</a>";
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
    addMessage(q.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),"user");
    input.value="";
    setTimeout(()=>addMessage(answerFor(q),"bot"),220);
  }

  launcher.addEventListener("click",()=>panel.classList.contains("is-open")?closeChat():openChat());
  closeBtn.addEventListener("click",closeChat);
  form.addEventListener("submit",(e)=>{e.preventDefault();submitQuestion(input.value);});
  messages.addEventListener("click",(e)=>{
    const btn=e.target.closest("[data-chat-question]");
    if(btn) submitQuestion(btn.getAttribute("data-chat-question"));
  });

  document.addEventListener("keydown",(e)=>{
    if(e.key==="Escape" && panel.classList.contains("is-open")) closeChat();
  });
})();
