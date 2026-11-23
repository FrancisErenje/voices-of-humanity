#!/usr/bin/env node
/*
 * LocalMedia247 RSS publisher. Feed descriptions remain publisher-supplied:
 * this workflow does not independently fact-check articles or generate claims.
 * If fewer than eight eligible items pass the checks, the existing edition stays.
 */
const fs = require("node:fs");
const path = require("node:path");
const OUT = path.join("museum", "data", "lm247-news.js");
const MIN_STORIES = 8, MAX_STORIES = 10, WINDOW_MS = 24 * 60 * 60 * 1000;
const now = new Date(), cutoff = now.getTime() - WINDOW_MS;

const FEEDS = [
  { name: "Vanguard", url: "https://www.vanguardngr.com/feed/", region: "NIGERIA", host: "vanguardngr.com" },
  { name: "The Nation", url: "https://thenationonlineng.net/feed/", region: "NIGERIA", host: "thenationonlineng.net" },
  { name: "PUNCH Newspapers", url: "https://rss.punchng.com/v1/category/latest_news", region: "NIGERIA", host: "punchng.com" },
  { name: "Channels Television", url: "https://www.channelstv.com/feed/", region: "NIGERIA", host: "channelstv.com" },
  { name: "BBC News", url: "https://feeds.bbci.co.uk/news/rss.xml", region: "WORLD", host: "bbc.co.uk" },
  { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml", region: "WORLD", host: "aljazeera.com" },
  { name: "Reuters", url: "https://news.google.com/rss/search?q=when:24h+site:reuters.com&hl=en-US&gl=US&ceid=US:en", region: "WORLD", google: true, host: "reuters.com" },
  { name: "CNN", url: "https://news.google.com/rss/search?q=when:24h+site:cnn.com+-intitle:sitemap+-site:cnn.com/business/calculators&hl=en-US&gl=US&ceid=US:en", region: "WORLD", google: true, host: "cnn.com" }
];

function decode(s = "") {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}
function getTag(block, name) {
  const re = new RegExp("<(?:[\\w.-]+:)?" + name + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/(?:[\\w.-]+:)?" + name + "\\s*>", "i");
  const m = block.match(re);
  return m ? decode(m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()) : "";
}
function getLink(block) {
  const textLink = getTag(block, "link");
  if (textLink) return textLink;
  const m = block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*\/?\s*>/i);
  return m ? decode(m[1]) : "";
}
function parseItems(xml) {
  const chunks = xml.match(/<(?:item|entry)\b[\s\S]*?<\/(?:item|entry)\s*>/gi) || [];
  return chunks.map(block => {
    const dateText = getTag(block, "pubDate") || getTag(block, "published") || getTag(block, "updated");
    const enclosure = block.match(/<enclosure\b[^>]*url=["']([^"']+)["']/i);
    const media = block.match(/<(?:media:content|media:thumbnail)\b[^>]*url=["']([^"']+)["']/i);
    const img = block.match(/<img\b[^>]*src=["']([^"']+)["']/i);
    return {
      title: getTag(block, "title"),
      description: getTag(block, "description") || getTag(block, "summary") || getTag(block, "content"),
      date: new Date(dateText),
      link: getLink(block),
      image: enclosure ? decode(enclosure[1]) : media ? decode(media[1]) : img ? decode(img[1]) : ""
    };
  }).filter(x => x.title && x.link && Number.isFinite(x.date.getTime()));
}
function clean(s = "") { return decode(s).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(); }
function httpsUrl(value) {
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
    ["SCIENCE & TECHNOLOGY", /science|technology|research|space|climate|environment|artificial intelligence|cyber/],
    ["SPORTS", /football|soccer|fifa|sport|match|league|athlete|olympic/]
  ];
  const found = groups.find(([, re]) => re.test(t));
  return (region === "NIGERIA" ? "NIGERIA" : "WORLD") + " · " + (found ? found[0] : "GENERAL NEWS");
}
function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 58); }

async function fetchFeed(feed) {
  const response = await fetch(feed.url, {
    headers: { "user-agent": "LocalMedia247-NewsBot/1.0 (+https://voicesofhumanity.world/museum/)", "accept": "application/rss+xml, application/atom+xml, application/xml, text/xml" },
    signal: AbortSignal.timeout(20000)
  });
  if (!response.ok) throw new Error("HTTP " + response.status);
  return parseItems(await response.text()).map(item => ({ ...item, feed }));
}
async function main() {
  const batches = await Promise.all(FEEDS.map(async feed => {
    try { return await fetchFeed(feed); }
    catch (e) { console.warn("Feed unavailable:", feed.name, e.message); return []; }
  }));
  const seen = new Set();
  const eligible = batches.flat().filter(item => {
    const time = item.date.getTime(), title = clean(item.title), link = httpsUrl(item.link);
    if (time < cutoff || time > now.getTime() + 5 * 60 * 1000 || !title || title.length < 18 || !link) return false;
    if (item.feed.google) {
      // Google News query is constrained to the publisher's domain.
      if (link.hostname !== "news.google.com") return false;
    } else if (!link.hostname.endsWith(item.feed.host)) return false;
    const key = title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => b.date - a.date).slice(0, MAX_STORIES);

  if (eligible.length < MIN_STORIES) {
    throw new Error("Only " + eligible.length + " eligible stories found; need at least " + MIN_STORIES + ". Existing edition retained.");
  }
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const displayDate = now.toLocaleDateString("en-GB", { timeZone: "Africa/Lagos", weekday: "long", day: "numeric", month: "long", year: "numeric" }).toUpperCase();
  const stories = eligible.map((item, index) => {
    const headline = clean(item.title).replace(/\s[-|–]\s(?:Reuters|CNN|BBC News|Al Jazeera)$/i, "").trim();
    const description = clean(item.description);
    const summary = description.length >= 45 ? description.slice(0, 520)
      : "The publisher has listed this report in its latest news feed. Open the original report for the full account. This automated listing does not independently verify the article's claims.";
    const image = httpsUrl(item.image);
    return {
      id: slug(item.feed.name + "-" + headline + "-" + date),
      category: category(headline + " " + summary, item.feed.region),
      location: item.feed.region === "NIGERIA" ? "Nigeria" : "International",
      headline, summary,
      source: item.feed.name + " · publisher RSS feed · published " + item.date.toISOString(),
      url: httpsUrl(item.link).href,
      ...(image ? { imageUrl: image.href, imageAlt: "Image supplied by " + item.feed.name + " RSS feed; see the original report for context.", imageCredit: item.feed.name + " · image supplied in publisher feed" } : {}),
      visual: "📰", featured: index < 3
    };
  });
  const edition = {
    date,
    updatedLabel: displayDate + " · " + stories.length + " STORIES",
    updateMode: "DAILY RSS EDITION",
    cadenceLabel: "DAILY · 1:00 A.M. NIGERIA TIME",
    stories
  };
  const js = "/* LocalMedia247 automated RSS edition. Publisher feed descriptions are not independent fact-checks. */\nwindow.LocalMedia247News = " + JSON.stringify(edition, null, 2) + ";\n";
  fs.writeFileSync(OUT, js, "utf8");
  console.log("Published " + stories.length + " RSS stories for " + date);
}
main().catch(error => { console.error(error.message); process.exit(1); });
