document.addEventListener("DOMContentLoaded", function () {
  generateCompanySelector();
  generateStreetViewEvent();
  applyCookieState("apply_street_view", setStreetViewState);
});

function generateMultiSelector(companyList) {
  let multiSelector = document.getElementById("selector-company");
  let options = "";
  companyList.forEach((company) => {
    options += `<option value="${company}">${company}</option>`;
  });
  multiSelector.innerHTML = options;
  setCompanyEvent(multiSelector);
}

function setCookie(key, value) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];
    chrome.scripting.executeScript(
      {
        target: { tabId: currentTab.id },
        function: (key, value) => {
          document.cookie = `${key}=${value}`;
        },
        args: [key, value],
      },
      (res) => {}
    );
  });
  reloadPage();
}

function deleteCookie(key) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];
    chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      function: (key) => {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      },
      args: [key],
    });
  });
  reloadPage();
}

function applyCookieState(key, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.cookies.get({ url: tabs[0].url, name: key }, function (cookie) {
      if (cookie) callback(cookie.value);
    });
  });
}

function setStreetViewState(value) {
  document.getElementById("street-view").checked = Boolean(value);
}
function setCompanyState(value) {
  document.getElementById("selector-company").value = value;
}

function setCompanyEvent(multiSelector) {
  multiSelector.addEventListener("change", function () {
    var selectedCompany = multiSelector.value;
    setCookie("company", selectedCompany);
  });
}

function generateStreetViewEvent() {
  let streetViewInput = document.getElementById("street-view");
  streetViewInput.addEventListener("change", function () {
    if (streetViewInput.checked) {
      setCookie("apply_street_view", "true");
      return;
    }
    deleteCookie("apply_street_view");
  });
}

function reloadPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, function () {
    chrome.tabs.reload();
  });
}

function generateCompanySelector() {
  fetch("https://run.mocky.io/v3/aadcb90b-4063-49e3-b01c-8e36762fec69")
    .then((response) => response.json())
    .then((data) => generateMultiSelector(data.companies))
    .then(() => applyCookieState("company", setCompanyState));
}
