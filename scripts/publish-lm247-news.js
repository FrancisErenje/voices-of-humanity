#!/usr/bin/env node
/*
 * LocalMedia247 RSS news publisher.
 * Collects only items published in the last 24 hours from the approved outlets.
 * RSS is a discovery/source feed, not independent fact-checking. Summaries are
 * limited to publisher-supplied feed descriptions; no claims are generated.
 * If fewer than eight eligible stories survive validation, the existing edition
 * is retained unchanged.
 */
const fs = require("node:fs");
const path = require("node:path");

const OUT = path.join("museum", "data", "lm247-news.js");
const MIN_STORIES = 8;
const MAX_STORIES = 10;
const WINDOW_MS = 24 * 60 * 60 * 1000;
const now = new Date();
const cutoff = now.getTime() - WINDOW_MS;

const FEEDS = [
  { name: "Vanguard", url: "https://www.vanguardngr.com/feed/", region: "NIGERIA" },
  { name: "The Nation", url: "https://thenationonlineng.net/feed/", region: "NIGERIA" },
  { name: "PUNCH Newspapers", url: "https://rss.punchng.com/v1/category/latest_news", region: "NIGERIA" },
  { name: "Channels Television", url: "https://www.channelstv.com/feed/", region: "NIGERIA" },
  { name: "BBC News", url: "https://feeds.bbci.co.uk/news/rss.xml", region: "WORLD" },
  { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml", region: "WORLD" },
  { name: "Reuters", url: "https://news.google.com/rss/search?q=when:24h+site:reuters.com&hl=en-US&gl=US&ceid=US:en", region: "WORLD", google: true, domain: "reuters.com" },
  { name: "CNN", url: "https://news.google.com/rss/search?q=when:24h+site:cnn.com+-intitle:sitemap+-site:cnn.com/business/calculators&hl=en-US&gl=US&ceid=US:en", region: "WORLD", google: true, domain: "cnn.com" }
];

function decode(s = "") {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}
function tag(block, name) {
  const re = new RegExp("<(?:[\\\\w.-]+:)?" + name + "(?:\\\\s[^>]*)?>([\\\\s\\\\S]*?)<\\\\/(?:[\\\\w.-]+:)?" + name + "\\\\s*>", "i");
  const m = block.match(re);
  return m ? decode(m[1].replace(/<[^>]+>/g, " ").replace(/\\s+/g, " ").trim()) : "";
}
function attr(block, name) {
  const re = new RegExp("\\\\b" + name + "=[\\"']([^\\"']+)[\\"']", "i");
  const m = block.match(re);
  return m ? decode(m[1]) : "";
}
function items(xml) {
  const chunks = xml.match(/<(?:item|entry)\\b[\\s\\S]*?<\\/(?:item|entry)\\s*>/gi) || [];
  return chunks.map(b => {
    const title = tag(b, "title");
    const description = tag(b, "description") || tag(b, "summary") || tag(b, "content");
    const dateText = tag(b, "pubDate") || tag(b, "published") || tag(b, "updated") || tag(b, "date");
    let link = tag(b, "link");
    if (!link) {
      const lm = b.match(/<link\\b[^>]*href=["']([^"']+)["'][^>]*\\/?\\s*>/i);
      if (lm) link = decode(lm[1]);
    }
    let image = "";
    const enclosure = b.match(/<enclosure\\b[^>]*url=["']([^"']+)["']/i);
    const media = b.match(/<(?:media:content|media:thumbnail)\\b[^>]*url=["']([^"']+)["']/i);
    const img = b.match(/<img\\b[^>]*src=["']([^"']+)["']/i);
    image = enclosure ? decode(enclosure[1]) : media ? decode(media[1]) : img ? decode(img[1]) : "";
    return { title, description, date: new Date(dateText), link, image };
  }).filter(x => x.title && x.link && Number.isFinite(x.date.getTime()));
}
function cleanText(s) {
  return decode(s).replace(/<[^>]*>/g, " ").replace(/\\s+/g, " ").trim();
}
function safeUrl(value) {
  try { const u = new URL(value); return u.protocol === "https:" ? u : null; } catch { return null; }
}
function category(text, region) {
  const t = text.toLowerCase();
  const groups = [
    ["POLITICS", /politic|election|president|governor|minister|senate|parliament|party|court|judge|lawmakers/],
    ["ECONOMY", /econom|business|market|inflation|currency|naira|trade|bank|investment|oil price|budget/],
    ["EDUCATION", /school|university|education|student|teacher|exam|academic/],
    ["HEALTH", /health|hospital|doctor|disease|medical|vaccine|outbreak/],
    ["SECURITY", /police|army|military|attack|killed|kidnap|terror|security|violence|crash/],
    ["SCIENCE & TECHNOLOGY", /science|technology|research|space|climate|environment|ai |artificial intelligence|cyber/],
    ["SPORTS", /football|soccer|fifa|sport|match|league|athlete|olympic/]
  ];
  const found = groups.find(([, re]) => re.test(t));
  return (region === "NIGERIA" ? "NIGERIA" : "WORLD") + " · " + (found ? found[0] : "GENERAL NEWS");
}
function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 58);
}
function stripGoogleRedirect(url, expectedDomain) {
  const u = safeUrl(url);
  if (!u) return null;
  if (u.hostname.endsWith(expectedDomain)) return u.href;
  // Google News RSS links are publisher-specific search results; retain the
  // Google News link rather than guessing an underlying article URL.
  if (u.hostname === "news.google.com") return u.href;
  return null;
}
async function fetchFeed(feed) {
  const response = await fetch(feed.url, {
    headers: { "user-agent": "LocalMedia247-NewsBot/1.0 (+https://voicesofhumanity.world/museum/)", "accept": "application/rss+xml, application/atom+xml, application/xml, text/xml" },
    signal: AbortSignal.timeout(20000)
  });
  if (!response.ok) throw new Error("HTTP " + response.status);
  return items(await response.text()).map(item => ({ ...item, feed }));
}
async function main() {
  const results = await Promise.all(FEEDS.map(async feed => {
    try { return await fetchFeed(feed); }
    catch (e) { console.warn("Feed unavailable:", feed.name, e.message); return []; }
  }));
  const seen = new Set();
  const stories = results.flat().filter(item => {
    const time = item.date.getTime();
    if (time < cutoff || time > now.getTime() + 5 * 60 * 1000) return false;
    const title = cleanText(item.title);
    const link = safeUrl(item.link);
    if (!title || title.length < 18 || !link) return false;
    if (item.feed.google) {
      const allowed = item.feed.domain;
      const text = (title + " " + item.link).toLowerCase();
      if (!text.includes(allowed) && !item.link.includes("news.google.com")) return false;
    } else if (!link.hostname.endsWith(item.feed.url.includes("channelstv") ? "channelstv.com" :
      item.feed.url.includes("vanguardngr") ? "vanguardngr.com" :
      item.feed.url.includes("thenation") ? "thenationonlineng.net" :
      item.feed.url.includes("punchng") ? "punchng.com" :
      item.feed.url.includes("bbci") ? "bbc.co.uk" : "aljazeera.com")) return false;
    const key = title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => b.date - a.date).slice(0, MAX_STORIES);

  if (stories.length < MIN_STORIES) {
    throw new Error("Only " + stories.length + " eligible stories found; need at least " + MIN_STORIES + ". Existing edition will be retained.");
  }

  const date = now.toISOString().slice(0, 10);
  const displayDate = now.toLocaleDateString("en-GB", { timeZone: "Africa/Lagos", weekday: "long", day: "numeric", month: "long", year: "numeric" }).toUpperCase();
  const output = stories.map((s, i) => {
    const headline = cleanText(s.title).replace(/\\s[-|–]\\s(?:Reuters|CNN|BBC News|Al Jazeera)$/i, "").trim();
    const description = cleanText(s.description);
    const summary = description.length >= 45
      ? description.slice(0, 520)
      : "The publisher has listed this report in its latest news feed. Open the original report for the full account; this automated listing does not independently verify the claims in the article.";
    const url = s.feed.google ? stripGoogleRedirect(s.link, s.feed.domain) : safeUrl(s.link)?.href;
    if (!url) return null;
    const image = safeUrl(s.image)?.href || "";
    return {
      id: slug(s.feed.name + "-" + headline + "-" + date),
      category: category(headline + " " + summary, s.feed.region),
      location: s.feed.region === "NIGERIA" ? "Nigeria" : "International",
      headline,
      summary,
      source: s.feed.name + " · publisher RSS feed · published " + s.date.toISOString(),
      url,
      ...(image ? { imageUrl: image, imageAlt: "Image supplied by " + s.feed.name + " RSS feed; see the original report for context.", imageCredit: s.feed.name + " · image supplied in publisher feed" } : {}),
      visual: "📰",
      featured: i < 3
    };
  }).filter(Boolean);

  if (output.length < MIN_STORIES) throw new Error("Only " + output.length + " valid stories remained after URL checks.");
  const edition = {
    date,
    updatedLabel: displayDate + " · " + output.length + " STORIES",
    updateMode: "DAILY RSS EDITION",
    cadenceLabel: "DAILY · 1:00 A.M. NIGERIA TIME",
    stories: output
  };
  const js = "/* LocalMedia247 automated RSS edition. Feed descriptions are publisher-supplied; stories are not independently fact-checked by this script. */\\nwindow.LocalMedia247News = " + JSON.stringify(edition, null, 2) + ";\\n";
  fs.writeFileSync(OUT, js, "utf8");
  console.log("Published " + output.length + " RSS stories for " + date);
}
main().catch(error => { console.error(error.message); process.exit(1); });
