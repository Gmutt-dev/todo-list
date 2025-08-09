import storageAvailable from "./storageAvailable";

// It's nice to prefix booleans variables with 'is' 'has' 'should' etc.
// isLSAvailable
export const localStorageAvailable = storageAvailable("localStorage");

if (!localStorageAvailable) {
  alert(
    "Browser Local Storage is unavailable.  All changes will be lost on refresh or close"
  );
}

// These functions are 'leaky' in that they rely on variables declared in the global scope.
// You could encapsulate this entire module into a class
// You could also pass the availability as a parameter
export function getStoredItem(key) {
  if (localStorageAvailable && localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key));
  } else return []; // Why return an array if this is a single item? null or undefined might be more appropriate. If we are storing a list, we might want to be more explicit in naming
}

export function setStoredItem(key, value) {
  if (localStorageAvailable) {
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(value));
  }
}
