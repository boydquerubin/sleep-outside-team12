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

// get URL parameter with validation
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const value = urlParams.get(param);
  if (!value) {
    console.warn(`Parameter "${param}" not found in URL`);
  }
  return value;
}

// render a list of items using a template function
export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  if (!parentElement) {
    console.error('Parent element is null or undefined');
    return;
  }
  if (!Array.isArray(list)) {
    console.error('List is not an array:', list);
    parentElement.innerHTML = '<p>No products available.</p>';
    return;
  }
  if (list.length === 0) {
    console.warn('List is empty');
    parentElement.innerHTML = '<p>No products found.</p>';
    return;
  }
  try {
    const htmlStrings = list.map(item => {
      try {
        const html = template(item);
        return html || ''; // Garante que html seja uma string
      } catch (error) {
        console.error(`Error rendering template for item ID: ${item.Id || 'unknown'}`, item, error);
        return '';
      }
    }).filter(html => html.trim()); // Remove strings vazias ou apenas espaços
    if (htmlStrings.length === 0) {
      console.warn('No valid HTML generated for the list');
      parentElement.innerHTML = '<p>No valid products to display.</p>';
      return;
    }
    if (clear) {
      parentElement.innerHTML = "";
    }
    parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
  } catch (error) {
    console.error('Error rendering list:', error);
    parentElement.innerHTML = '<p>Error rendering product list.</p>';
  }
}

// render a single template with optional callback
export function renderWithTemplate(template, parentElement, data, callback) {
  if (!parentElement) {
    console.error('Parent element is null or undefined');
    return;
  }
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// load a template file
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

// load header and footer templates
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

// check if a file exists (useful for debugging JSON files)
export async function checkFileExists(path) {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`Error checking file existence for "${path}":`, error);
    return false;
  }
}