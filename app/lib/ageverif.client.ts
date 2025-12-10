export const CALLBACK_ONLOAD = 'ageverifLoaded';
export const CALLBACK_ONREADY = 'ageverifReady';
export const CALLBACK_ONSUCCESS = 'ageverifSuccess';
export const CALLBACK_ONERROR = 'ageverifError';

export function getClientKey() {
  // Prefer server-side env when available, otherwise fall back to window/global ENV
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serverKey = (typeof process !== 'undefined' && (process as any).env) ? ((process as any).env.PUBLIC_AGEVERIF_KEY || (process as any).env.AGEVERIF_PUBLIC_KEY) : undefined;
    if (serverKey && String(serverKey).trim()) return String(serverKey).trim();
  } catch (e) {
    // ignore
  }

  // client-side: `window.ENV` or globalThis.AGEVERIF_PUBLIC_KEY
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = (globalThis as any) || {};
  const clientKey = g?.ENV?.PUBLIC_AGEVERIF_KEY || g?.ENV?.AGEVERIF_PUBLIC_KEY || g?.AGEVERIF_PUBLIC_KEY || '';
  return String(clientKey || '').trim();
}

export function getClientUrl() {
  const key = getClientKey();
  // Use the checker.js query-parameter style to ensure callback names are respected
  const base = 'https://www.ageverif.com/checker.js';
  const params = new URLSearchParams();
  if (key) params.set('key', key);
  // Some integrations expect a bare `nostart` flag (no '=') — we'll post-process below
  params.set('nostart', '');
  params.set('onload', CALLBACK_ONLOAD);
  params.set('onready', CALLBACK_ONREADY);
  params.set('onsuccess', CALLBACK_ONSUCCESS);
  params.set('onerror', CALLBACK_ONERROR);
  // Ensure `nostart` appears as a bare flag `&nostart` instead of `&nostart=`
  let query = params.toString();
  query = query.replace(/(^|&)nostart=$/, '$1nostart');
  query = query.replace(/(&)nostart=&/, '$1nostart&');
  return `${base}?${query}`;
}

export function getClientScriptSrc() {
  return getClientUrl();
}

export default {
  getClientUrl,
  getClientKey,
  getClientScriptSrc,
};
