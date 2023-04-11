function getSelectedText() {
  return window.getSelection().toString();
}

async function getRegisteredConversionMethods() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      { conversionMethods: [] },
      ({ conversionMethods }) => resolve(conversionMethods)
    );
  });
}

async function createPopup() {
  const popup = document.createElement("div");
  popup.id = "text_converter_popup";
  popup.style.display = "none";

  // Fetch registered conversion methods from storage
  const registeredConversionMethods = await getRegisteredConversionMethods();

  const conversionMethods = [...registeredConversionMethods];

  conversionMethods.forEach((conversion, index) => {
    const btn = document.createElement("button");
    btn.innerHTML = conversion.title || conversion.method; // DISPLAY the title but fall back to method if no title is provided
    btn.onclick = async () => {
      const convertedText = await convertText(
        getSelectedText(),
        conversion.method
      );
      console.log(convertedText);
      showConvertedTextPopup(convertedText);
    };
    popup.appendChild(btn);
  });

  document.body.appendChild(popup);
  return popup;
}

function showPopup(x, y) {
  const popup = document.querySelector("#text_converter_popup");
  popup.style.display = "block";
  popup.style.top = y + "px";
  popup.style.left = x + "px";
}

function hidePopup() {
  const popup = document.querySelector("#text_converter_popup");
  popup.style.display = "none";
}

// Add a new function to fetch the stored API key
async function getApiKey() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ apiKey: "" }, ({ apiKey }) => resolve(apiKey));
  });
}

async function convertText(text, method) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getApiKey()}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "あなたはOpenAIによってトレーニングされた大規模言語モデルのChatGPTです。ユーザーの指示には注意深く従ってください。",
        },
        {
          role: "user",
          content: method.replace(/\{\{\}\}/g, text),
        },
      ],
      max_tokens: 1000,
      temperature: 1,
    }),
  });
  // Replace {{}} with the selected text if it is a user-registered conversion method
  const data = await res.json();
  return data.choices[0].message.content;
}

function showConvertedTextPopup(convertedText) {
  const resultPopup = document.createElement("div");
  resultPopup.id = "text_converter_result_popup";
  resultPopup.innerText = convertedText;
  resultPopup.style.display = "none";
  resultPopup.style.position = "fixed";
  resultPopup.style.zIndex = 10000;
  resultPopup.style.backgroundColor = "white";
  resultPopup.style.border = "1px solid #ccc";
  resultPopup.style.padding = "8px";
  resultPopup.style.borderRadius = "4px";
  resultPopup.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  document.body.appendChild(resultPopup);

  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.style.position = "absolute";
  closeButton.style.top = "2px";
  closeButton.style.right = "4px";
  closeButton.style.background = "none";
  closeButton.style.border = "none";
  closeButton.style.fontSize = "14px";
  closeButton.style.cursor = "pointer";
  closeButton.onclick = hideResultPopup;
  resultPopup.appendChild(closeButton);

  function displayResultPopup(x, y) {
    resultPopup.style.display = "block";
    resultPopup.style.top = y + "px";
    resultPopup.style.left = x + "px";
  }

  function hideResultPopup() {
    resultPopup.style.display = "none";
  }

  displayResultPopup(window.innerWidth / 2, window.innerHeight / 2);
}

document.addEventListener("mouseup", (event) => {
  const selectedText = getSelectedText();

  if (selectedText) {
    showPopup(event.pageX, event.pageY);
  } else {
    hidePopup();
  }
});

createPopup();
