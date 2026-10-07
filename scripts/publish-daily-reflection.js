#!/usr/bin/env node

/**
 * Voices of Humanity — Daily Reflection Publisher
 *
 * Selects the prepared reflection for today's date in Africa/Lagos,
 * moves the previous current reflection into the archive, and publishes
 * the selected reflection as the new current entry.
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const reflectionsPath = path.join(ROOT, "museum", "data", "reflections.js");
const bankPath = path.join(ROOT, "museum", "data", "reflection-bank.json");

function lagosDateParts() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const out = {};
  for (const part of parts) {
    if (part.type !== "literal") out[part.type] = part.value;
  }
  return {
    iso: `${out.year}-${out.month}-${out.day}`,
    label: new Intl.DateTimeFormat("en-US", {
      timeZone: "Africa/Lagos",
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date()).toUpperCase()
  };
}

function jsString(value) {
  return JSON.stringify(value);
}

function reflectionObject(entry, indent = "    ") {
  return [
    `${indent}{`,
    `${indent}  number: ${jsString(entry.number)},`,
    `${indent}  date: ${jsString(entry.date)},`,
    `${indent}  heading: ${jsString(entry.heading)},`,
    `${indent}  quote: ${jsString(entry.quote)},`,
    `${indent}  note: ${jsString(entry.note)},`,
    `${indent}  image: ${jsString(entry.image || "")},`,
    `${indent}  format: ${jsString(entry.format || "text")}`,
    `${indent}}`
  ].join("\n");
}

const today = lagosDateParts();
const reflections = JSON.parse(fs.readFileSync(reflectionsPath, "utf8"));
const bank = JSON.parse(fs.readFileSync(bankPath, "utf8"));

const selected = bank.find(entry => {
  const parsed = new Date(entry.date);
  if (Number.isNaN(parsed.getTime())) return false;
  const iso = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(parsed);
  return iso === today.iso;
});

if (!selected) {
  console.log(`No Reflection Bank entry is scheduled for ${today.iso}. Nothing to publish.`);
  process.exit(0);
}

const currentMatch = reflections.match(/current:\s*\{[\s\S]*?\n  \},\n  archive:/);
if (!currentMatch) {
  throw new Error("Could not safely locate the current reflection block.");
}

const currentBlock = currentMatch[0];
const currentJson = currentBlock
  .replace(/^current:\s*/, "")
  .replace(/,\n  archive:\s*$/, "");

let previousCurrent;
try {
  previousCurrent = Function(`return (${currentJson});`)();
} catch (error) {
  throw new Error("Could not safely parse the current reflection: " + error.message);
}

if (previousCurrent.number === selected.number && previousCurrent.date === selected.date) {
  console.log(`Reflection ${selected.number} is already current. Nothing to publish.`);
  process.exit(0);
}

const selectedObject = {
  number: selected.number,
  date: selected.date || today.label,
  heading: selected.heading,
  quote: selected.quote,
  note: selected.note,
  image: selected.image || "",
  format: selected.format || "text"
};

const archiveEntry = reflectionObject(previousCurrent, "  ");
const newCurrent = reflectionObject(selectedObject, "  ");

let updated = fs.readFileSync(reflectionsPath, "utf8");
updated = updated.replace(
  currentMatch[0],
  `current: {\n${newCurrent.split("\n").slice(1, -1).map(line => "  " + line.trimStart()).join("\n")}\n  },\n  archive:`
);

const archiveOpen = "  archive: [";
if (!updated.includes(archiveOpen)) {
  throw new Error("Could not safely locate the archive array.");
}

updated = updated.replace(
  archiveOpen,
  `${archiveOpen}\n${archiveEntry},`
);

fs.writeFileSync(reflectionsPath, updated, "utf8");

console.log(`Published Reflection ${selected.number} for ${selected.date}.`);
