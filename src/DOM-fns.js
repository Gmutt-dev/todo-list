export function createHTMLElement(elementName, propertiesObj) {
  const newElement = document.createElement(elementName);
  Object.assign(newElement, propertiesObj);
  return newElement;
}
