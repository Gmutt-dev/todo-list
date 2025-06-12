import storageAvailable from "./storageAvailable";

// Check that localStorage is available on the browser
export const localStorageAvailable = storageAvailable("localStorage");

if (!localStorageAvailable) {
    alert("Browser Local Storage is unavailable.  All changes will be lost on refresh or close");
}

export function getStoredItem(key) {
    if (localStorageAvailable && localStorage.getItem(key)) {
        return JSON.parse(localStorage.getItem(key));
    } else return [];
}

export function setStoredItem(key, value) {
    if (localStorageAvailable) {
        localStorage.removeItem(key);
        localStorage.setItem(key, JSON.stringify(value));
    }
}