// This doesn't need to be in its own module - I would keep all local storage code colocated
// You have parameterised this function prematurely - it is only called in one place.

// I would rename this something like 'checkLocalStorageAvailability'
export default function storageAvailable(type) {
  // There is no need to test the browser api here - just checking that it exists on the window is probably enough
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

// Under what circumstances are you expecting local storage not to be defined?
// This code is only targeting browser environments and LS is supported in 95% of all browsers
// Useful website: https://caniuse.com/mdn-api_window_localstorage
