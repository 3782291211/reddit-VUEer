// Captures the URL fragmnet between https://www. and the second path
export const formatURL = (url: string): string | null => {
  if (url.includes('redd.it') || url.includes('reddit.com')) return null;
  return url.match(/htt(?:p|ps):\/\/(?:www.)?([^/]*\/[^/]*\/..)/)?.[1] || null;
}