/* Voices of Humanity — Local Museum Knowledge Base
   Builds its searchable knowledge from the museum's own data objects.
*/
(function(){
  "use strict";

  function text(v){ return v == null ? "" : String(v); }
  function clean(v){
    return text(v).toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .replace(/[’']/g,"")
      .replace(/[^a-z0-9\s]/g," ")
      .replace(/\s+/g," ").trim();
  }
  function esc(v){
    return text(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  function build(){
    var docs=Array.isArray(window.DocumentaryCollection) ? window.DocumentaryCollection : [];
    var refs=window.ReflectionGardenCollection || {};
    var hall=window.HallOfHumanityCollection || {};
    var languages=Array.isArray(window.Languages) ? window.Languages : [];
    var collections=Array.isArray(window.Collections) ? window.Collections : [];
    var entries=[];

    entries.push({
      id:"about",
      type:"museum",
      keys:["voices of humanity","what is this museum","about voices","museum purpose","museum project","what is voh"],
      title:"Voices of Humanity",
      answer:"<strong>Voices of Humanity</strong> is an independent documentary and digital museum project dedicated to documenting, preserving and celebrating the world's languages, cultures and human stories. It brings language documentaries, cultural knowledge, reflections and living archives together in one place. Its guiding principle is: <em>Every Voice Matters.</em>"
    });

    entries.push({
      id:"preservation",
      type:"topic",
      keys:["preserve language","preserving language","language preservation","save a language","protect a language","language disappear","endangered language","revitalize language"],
      title:"Language preservation",
      answer:"<strong>Language preservation</strong> means helping a language continue across generations. Practical steps include speaking and teaching it, recording elders and everyday speech, documenting words and stories, creating learning materials, supporting community use, and preserving recordings and written materials carefully. Voices of Humanity contributes through documentaries, language lessons, research and digital archiving."
    });

    entries.push({
      id:"hall",
      type:"building",
      keys:["hall of humanity","hall","world of voices","voice archive","memory gallery","writing wall","language through generations","living heritage","documentation lab","archive room","community first","promise wall","future voices"],
      title:"Hall of Humanity",
      answer:function(){
        var intro=text(hall.intro) || "The Hall of Humanity is the symbolic heart of the museum.";
        var exhibits=Array.isArray(hall.exhibits) ? hall.exhibits : [];
        var names=exhibits.slice(0,12).map(function(e){return "<strong>"+esc(e.title)+"</strong>";}).join(" · ");
        return esc(intro)+(names ? "<br><br><strong>Exhibits include:</strong> "+names+"." : "");
      }
    });

    entries.push({
      id:"reflection",
      type:"garden",
      keys:["reflection garden","daily reflection","reflection card","reflection"],
      title:"Reflection Garden",
      answer:function(){
        var c=refs.current;
        if(c && c.number){
          return "<strong>Reflection "+esc(c.number)+"</strong> · "+esc(c.heading||"")+
            "<br><br><em>“"+esc(c.quote||"")+"”</em><br><br>"+esc(c.note||"");
        }
        return "The Reflection Garden is the museum's quiet space for daily reflections and preserves the numbered reflection cards as a living archive.";
      }
    });

    entries.push({
      id:"cinema",
      type:"cinema",
      keys:["documentary cinema","cinema","documentaries","films","documentary collection","language documentaries","episodes"],
      title:"Documentary Cinema",
      answer:function(){
        var published=docs.filter(function(d){return !d.status || d.status==="published";});
        var names=published.slice(0,10).map(function(d){
          return "<strong>"+esc(d.language||d.title||"Documentary")+"</strong>";
        }).join(", ");
        return "<strong>Documentary Cinema</strong> presents the Voices of Humanity language documentaries and serves as the museum's moving-image archive."+
          (published.length ? "<br><br>The current collection contains <strong>"+published.length+"</strong> documented entries in its local data. Recent entries include: "+names+"." : "");
      }
    });

    entries.push({
      id:"africa",
      type:"museum",
      keys:["african languages","africa","african language museum","african museum","igede language series"],
      title:"African Languages Museum",
      answer:"The <strong>African Languages Museum</strong> explores Africa's linguistic diversity through language learning, documentary records, cultural knowledge and living community voices. Its first featured language series is <strong>Igede</strong>, with the Igede Language Learning Centre presented as the first exhibit."
    });

    entries.push({id:"asia",type:"museum",keys:["asian languages","asia","asian museum"],title:"Asian Languages Museum",answer:"The <strong>Asian Languages Museum</strong> explores the rich linguistic heritage of Asia and its many languages and cultures."});
    entries.push({id:"europe",type:"museum",keys:["european languages","europe","european museum"],title:"European Languages Museum",answer:"The <strong>European Languages Museum</strong> explores Europe's languages, cultures and linguistic histories."});
    entries.push({id:"americas",type:"museum",keys:["americas languages","americas","american languages","americas museum"],title:"Americas Languages Museum",answer:"The <strong>Americas Languages Museum</strong> explores the languages and cultural voices of North, Central and South America."});
    entries.push({id:"oceania",type:"museum",keys:["oceania languages","oceania","oceanic","pacific","oceania museum"],title:"Oceania Languages Museum",answer:"The <strong>Oceania Languages Museum</strong> explores the extraordinary linguistic diversity of Australia's Pacific region and the wider voices of Oceania."});

    entries.push({
      id:"localmedia247",
      type:"organization",
      keys:["localmedia247","local media 247","localmedia","media services","services"],
      title:"LocalMedia247",
      answer:"<strong>LocalMedia247</strong> is the media and digital storytelling centre associated with Voices of Humanity. Its motto is <em>Documenting Today. Preserving Tomorrow.</em><br><br>Services include verified news reporting and publishing, fact-checking, documentary research and production, video editing, content creation, website creation and digital media projects."
    });

    if(docs.length){
      docs.forEach(function(d){
        var keys=[d.language,d.title,d.id,"episode "+d.episode,d.region,d.country,d.category].filter(Boolean);
        entries.push({
          id:"doc-"+(d.id||d.episode),
          type:"documentary",
          keys:keys,
          title:d.title||d.language||("Episode "+d.episode),
          answer:function(){
            return "<strong>"+esc(d.title||d.language||"Documentary")+"</strong>"+
              (d.episode ? " · Episode "+esc(d.episode) : "")+
              (d.language ? "<br><br><strong>Language:</strong> "+esc(d.language) : "")+
              (d.region ? "<br><strong>Region:</strong> "+esc(d.region) : "")+
              (d.languageFamily ? "<br><strong>Language family:</strong> "+esc(d.languageFamily) : "")+
              (d.description ? "<br><br>"+esc(d.description) : "")+
              (d.videoUrl ? "<br><br><a href=""+esc(d.videoUrl)+"" target="_blank" rel="noopener noreferrer">Watch documentary →</a>" : "");
          }
        });
      });
    }

    languages.forEach(function(l){
      entries.push({
        id:"language-"+l.id,
        type:"language",
        keys:[l.name,l.id,l.continent,l.country],
        title:l.name,
        answer:"<strong>"+esc(l.name)+"</strong> is represented in the museum's language archive."+
          (l.country ? " Country: "+esc(l.country)+"." : "")+
          (l.continent ? " Continent: "+esc(l.continent)+"." : "")+
          (l.documentary ? " It is linked to documentary entry "+esc(l.documentary)+"." : "")
      });
    });

    collections.forEach(function(c){
      entries.push({
        id:"collection-"+c.id,
        type:"collection",
        keys:[c.name,c.id],
        title:c.name,
        answer:"<strong>"+esc(c.name)+"</strong> is one of the museum's recorded collections."
      });
    });

    return entries;
  }

  function score(q, entry){
    var s=clean(q), score=0;
    entry.keys.forEach(function(k){
      var key=clean(k);
      if(!key) return;
      if(s===key) score+=100;
      else if(s.indexOf(key)>=0) score+=35 + Math.min(key.length,30);
      else {
        var words=key.split(" ");
        var hits=words.filter(function(w){return w.length>2 && s.indexOf(w)>=0;}).length;
        if(hits) score+=hits*6;
      }
    });
    return score;
  }

  window.VOHMuseumKnowledge={
    build:build,
    search:function(q){
      var entries=build();
      var ranked=entries.map(function(e){return {entry:e,score:score(q,e)};})
        .filter(function(x){return x.score>0;})
        .sort(function(a,b){return b.score-a.score;});
      if(!ranked.length) return null;
      var best=ranked[0];
      return {title:best.entry.title,type:best.entry.type,score:best.score,answer:typeof best.entry.answer==="function" ? best.entry.answer() : best.entry.answer};
    }
  };
})();