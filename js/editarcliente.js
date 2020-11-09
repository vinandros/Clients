import { connectDB, DB, showAlert } from "./funciones.js";
const nameInput = document.querySelector("#nombre");
const emailInput = document.querySelector("#email");
const phoneNumberInput = document.querySelector("#telefono");
const companyNameInput = document.querySelector("#empresa");

const formUpdateClient = document.querySelector("#formulario");

let clientID;
document.addEventListener("DOMContentLoaded", () => {
  formUpdateClient.addEventListener("submit", updateClient);
  const URLparameters = new URLSearchParams(window.location.search);
  connectDB();
  clientID = URLparameters.get("id");
  if (clientID) {
    setTimeout(() => {
      getClient(clientID);
    }, 1000);
  }
});

function getClient(ID) {
  const transaction = DB.transaction(["crm"], "readwrite");
  const objectStore = transaction.objectStore("crm");

  const client = objectStore.openCursor();
  client.onsuccess = function (e) {
    const cursor = e.target.result;
    if (cursor) {
      if (cursor.value.id === Number(ID)) {
        fillEditForm(cursor.value);
      }
      cursor.continue();
    }
  };
}

function fillEditForm(clientData) {
  const { name, email, phoneNumber, companyName } = clientData;

  nameInput.value = name;
  emailInput.value = email;
  phoneNumberInput.value = phoneNumber;
  companyNameInput.value = companyName;
}

function updateClient(e) {
  e.preventDefault();
  if (
    nameInput.value === "" ||
    emailInput.value === "" ||
    phoneNumberInput.value === "" ||
    companyNameInput.value === ""
  ) {
    showAlert("Todos los campos son obligatorios.", "error");
    return;
  }

  const clientUpdated = {
    name: nameInput.value,
    email: emailInput.value,
    phoneNumber: phoneNumberInput.value,
    companyName: companyNameInput.value,
    id: Number(clientID),
  };

  const transaction = DB.transaction(["crm"], "readwrite");
  const objectStore = transaction.objectStore("crm");
  objectStore.put(clientUpdated);

  transaction.onerror = function () {
    showAlert("Error al actualizar cliente.");
  };

  transaction.oncomplete = function () {
    showAlert("Cliente actualizado correctamente.");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  };
}
