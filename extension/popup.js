document.addEventListener("DOMContentLoaded", function () {
	//Llamada a la API
	fetch("https://run.mocky.io/v3/aadcb90b-4063-49e3-b01c-8e36762fec69")
		.then((response) => response.json())
		.then((data) => generateMultiSelector(data.companies));
});

function generateMultiSelector(companyList) {
	let multiSelector = document.getElementById("selctor-company");
	let options = "";
	companyList.forEach((company) => {
		options += `<option value="${company}">${company}</option>`;
	});
	multiSelector.innerHTML = options;

	multiSelector.addEventListener("change", function () {
		var selectedCompany = multiSelector.value;
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			var currentTab = tabs[0];
			chrome.scripting.executeScript(
				{
					target: { tabId: currentTab.id },
					function: (selectedCompany) => {
						document.cookie = `company=${selectedCompany}`;
					},
					args: [selectedCompany],
				},
				(res) => {}
			);
		});

		chrome.tabs.query({ active: true, currentWindow: true }, function () {
			chrome.tabs.reload();
		});
	});
}
