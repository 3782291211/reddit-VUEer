// Captures the URL fragmnet between https://www. and the second path
export const formatURL = (url: string): string | null => {
  if (url.includes('redd.it') || url.includes('reddit.com')) return null;
  return url.match(/^htt(?:p|ps):\/\/www\.([^/]+\/[^/]+\/.{5})/)?.[1] || null;
  //return url.match(/htt(?:p|ps):\/\/(?:www.)?([^/]*\/[^/]{8})/)?.[1] || null;
}

// (?:) creates a non-capturing group
// add ? to specify that a given character is optional