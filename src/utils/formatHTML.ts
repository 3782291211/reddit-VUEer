// This function unescapes the HTML entities within an HTML string

export const formatHTML = (htmlString: string) => {
  const element = document.createElement("div");
  element.innerHTML = htmlString;
  return element.childNodes.length === 0 ? "" : element.childNodes[0].nodeValue;
}