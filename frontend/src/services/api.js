import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

/**
 * Upload a PDF file for ingestion.
 * @param {File} file
 * @param {Function} onProgress - Upload progress callback (0-100)
 */
export async function uploadPdf(file, onProgress) {
  const formData = new FormData();
  formData.append('pdf', file);
  const { data } = await api.post('/upload/pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total)),
    timeout: 120000, // 2 min for large PDFs + embedding
  });
  return data;
}

/**
 * Ingest a website URL.
 * @param {string} url
 */
export async function uploadWebsite(url) {
  const { data } = await api.post('/upload/website', { url }, { timeout: 60000 });
  return data;
}

/**
 * Ingest a YouTube video URL.
 * @param {string} url
 */
export async function uploadYoutube(url) {
  const { data } = await api.post('/upload/youtube', { url }, { timeout: 60000 });
  return data;
}

/**
 * Fetch all ingested sources from the backend.
 */
export async function getSources() {
  const { data } = await api.get('/sources');
  return data.sources;
}

/**
 * Delete a source by ID (removes from ChromaDB + metadata store).
 * @param {string} id
 */
export async function deleteSource(id) {
  const { data } = await api.delete(`/source/${id}`);
  return data;
}

/**
 * Send a chat message and receive SSE streaming response.
 * Returns a native fetch Response with readable body stream.
 * @param {string} message
 */
export function chatStream(message) {
  return fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
}

export default api;
