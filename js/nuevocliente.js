import { showAlert, DB } from "./funciones.js";

document.addEventListener("DOMContentLoaded", () => {
  connectDB();

  formNewClient.addEventListener("submit", checkClientData);
});

function connectDB() {
  const openConnectionDB = window.indexedDB.open("crm", 1);
  openConnectionDB.onerror = function () {
    console.log("Error connecting to DB!");
  };
  openConnectionDB.onsuccess = function () {
    console.log("Succesfully connected to DB");
    DB = openConnectionDB.result;
  };
}

function checkClientData(e) {
  e.preventDefault();

  const name = document.querySelector("#nombre").value;
  const email = document.querySelector("#email").value;
  const phoneNumber = document.querySelector("#telefono").value;
  const companyName = document.querySelector("#empresa").value;

  if (name === "" || email === "" || phoneNumber === "" || companyName === "") {
    showAlert("Todos los campos son obligatorios.", "error");
    return;
  }

  const newClient = {
    name,
    email,
    phoneNumber,
    companyName,
    id: Date.now(),
  };

  createNewClient(newClient);
  formNewClient.reset();
}

function createNewClient(newClient) {
  const transaction = DB.transaction(["crm"], "readwrite");
  const objectStore = transaction.objectStore("crm");
  objectStore.add(newClient);

  transaction.onerror = function () {
    showAlert("Error agregando el nuevo Cliente.", "error");
  };

  transaction.oncomplete = function () {
    showAlert("Cliente agregado exitosamente.");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  };
}
