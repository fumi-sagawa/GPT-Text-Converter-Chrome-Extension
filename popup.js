// Inside text-converter-extension/popup.js
document.addEventListener("DOMContentLoaded", () => {
  // API key form event listener
  document
    .querySelector("#apiKeyForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = document.querySelector("#apiKey");
      const apiKey = input.value;
      await storeApiKey(apiKey);
      alert("API Key saved!");
    });

  loadApiKey();

  document
    .querySelector("#conversionMethodForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const titleInput = document.querySelector("#conversionTitle");
      const methodInput = document.querySelector("#conversionMethod");
      const conversionMethod = {
        title: titleInput.value,
        method: methodInput.value,
      };
      await saveConversionMethod(conversionMethod);
      titleInput.value = "";
      methodInput.value = "";
      displayConversionMethods();
    });

  displayConversionMethods();
});

// Save API key to storage
async function storeApiKey(apiKey) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ apiKey }, resolve);
  });
}

// Load API key from storage
async function loadApiKey() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ apiKey: "" }, ({ apiKey }) => {
      const input = document.querySelector("#apiKey");
      input.value = apiKey;
      resolve(apiKey);
    });
  });
}

async function saveConversionMethod(conversionMethod) {
  const conversionMethods = await getConversionMethods();
  conversionMethods.push(conversionMethod);
  return new Promise((resolve) => {
    chrome.storage.sync.set({ conversionMethods }, resolve);
  });
}

async function getConversionMethods() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      { conversionMethods: [] },
      ({ conversionMethods }) => resolve(conversionMethods)
    );
  });
}

async function displayConversionMethods() {
  const conversionMethods = await getConversionMethods();
  const container = document.querySelector("#conversionMethods");
  container.innerHTML = "";
  conversionMethods.forEach((method, index) => {
    const item = document.createElement("div");
    item.textContent = method.title;
    container.appendChild(item);
  });
}

displayConversionMethods();
