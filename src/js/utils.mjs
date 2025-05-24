// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error retrieving localStorage key "${key}":`, error);
    return null;
  }
}

// save data to local storage
export function setLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  const element = qs(selector);
  if (element) {
    element.addEventListener("touchend", (event) => {
      event.preventDefault();
      callback();
    });
    element.addEventListener("click", callback);
  } else {
    console.warn(`Element not found for selector "${selector}"`);
  }
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  // O `innerHTML` do elemento pai é definido com o conteúdo do template
  // Isso sobrescreve qualquer conteúdo existente.
  parentElement.innerHTML = template; 
  
  // Se houver um callback, ele é executado com os dados.
  // Isso é útil para adicionar funcionalidade ou manipular o DOM depois que o template é renderizado.
  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to load template from "${path}"`);
    }
    return await res.text();
  } catch (error) {
    console.error(`Error loading template "${path}":`, error);
    throw error;
  }
}

export async function loadHeaderFooter() {
  console.log("Attempting to load header/footer. DOM readyState:", document.readyState);
  try {
    const headerTemplate = await loadTemplate("../partials/header.html");
    const footerTemplate = await loadTemplate("../partials/footer.html");

    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");

    if (!headerElement) {
      console.error("Header element (#main-header) not found in the DOM");
    } else {
      headerElement.innerHTML = headerTemplate;
    }

    if (!footerElement) {
      console.error("Footer element (#main-footer) not found in the DOM");
    } else {
      footerElement.innerHTML = footerTemplate;
    }

    // Dispatch custom event to signal header/footer are loaded
    window.dispatchEvent(new Event("headerFooterLoaded"));
  } catch (error) {
    console.error("Error loading header/footer templates:", error);
  }
}