const hostUrl = "http://localhost:3000/api"
const requestUrls = {
	warehouses: hostUrl + "/warehouses",
	products: hostUrl + "/products",
	categories: hostUrl + "/categories"
}

function getCategoryNote(rootNode, nodeId) {

	if (Array.isArray(rootNode)) {
		for (const node of rootNode) {
			if (node._id == nodeId) {
				return node;
			}

			const foundNote = getCategoryNote(node, nodeId);

			if (foundNote) {
				return foundNote;
			}
		}
	}

	if (!rootNode) {
		return null;
	}

	if (rootNode._id === nodeId) {
		return rootNode;
	}

	// console.log(rootNode.children)

	for (const child of rootNode.children) {
		const foundNote = getCategoryNote(child, nodeId);
		if (foundNote) {
			return foundNote;
		}
	}

	return null;
}

function showDeleteToast() {
	var myToastEl = document.getElementById('toast-delete')
	var myToast = bootstrap.Toast.getOrCreateInstance(myToastEl) // Returns a Bootstrap toast instance
	myToast.show()
}

function showSuccessToast() {
	var myToastEl = document.getElementById('toast-success')
	var myToast = bootstrap.Toast.getOrCreateInstance(myToastEl) // Returns a Bootstrap toast instance
	myToast.show()
}

function fillDataIntoForm(dataObject) {
	document.getElementById("form-delete").hidden = false;
	for (const key in dataObject) {

		const fieldInput = document.getElementById("form-input-" + key);

		if (fieldInput) {
			fieldInput.value = dataObject[key];
			fieldInput.innerText = dataObject[key];
		}

	}
	document.getElementById("form-delete").onclick = () => {
		deleteDataWithId(dataObject.id);
	};
}

function toggleModal() {
	let myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'))
	myModal.toggle();
}

function clearForm() {
	const fieldInputs = document.querySelectorAll("[id^='form-input']");
	for (const fieldInput of fieldInputs) {
		fieldInput.value = "";
		fieldInput.classList.remove("is-invalid");
		fieldInput.classList.remove("is-valid");
		fieldInput.innerText = "";
	}
	document.getElementById("form-input-id").innerHTML = "<i><code>will be provided</code></i>";
	document.getElementById("form-delete").hidden = true;
}

function getFormField(fieldName) {
	return document.getElementById("form-input-" + fieldName);
}

function createRequest(requestUrl, targetUrl, requestBody, successCallback) {
	// create new
	const isCreation = document.getElementById("form-delete").hidden;
	let destinationUrl = targetUrl
	if (!isCreation && !targetUrl) {
		destinationUrl = requestUrl + "/" + getFormField("id").innerText;
	}

	fetch(destinationUrl, {
			method: (isCreation) ? "POST" : "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(requestBody)
		}).then((res) => res.json())
		.then(successCallback)
		.catch((err) => console.log(err))
}