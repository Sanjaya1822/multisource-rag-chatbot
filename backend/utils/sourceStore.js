const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, '../data/sources.json');

/** Load all sources from disk */
function loadSources() {
  if (!fs.existsSync(STORE_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

/** Persist sources array to disk */
function saveSources(sources) {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(sources, null, 2), 'utf-8');
}

/** Add a source entry */
function addSource(source) {
  const sources = loadSources();
  sources.push(source);
  saveSources(sources);
  return source;
}

/** Get all sources */
function getSources() {
  return loadSources();
}

/** Delete a source by ID */
function deleteSource(id) {
  const sources = loadSources();
  const filtered = sources.filter((s) => s.id !== id);
  saveSources(filtered);
  return filtered;
}

/** Get a source by ID */
function getSourceById(id) {
  return loadSources().find((s) => s.id === id) || null;
}

module.exports = { addSource, getSources, deleteSource, getSourceById };
