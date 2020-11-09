import createDB from "./db.js";
const clientList = document.querySelector("#listado-clientes");
let DB;
document.addEventListener("DOMContentLoaded", () => {
  createDB();
  if (window.indexedDB.open("crm", 1)) {
    getClients();
  }

  clientList.addEventListener("click", deleteClient);
});

function getClients() {
  const openConnectionDB = window.indexedDB.open("crm", 1);
  openConnectionDB.onerror = function () {
    console.log("Error connecting to DB!");
  };

  openConnectionDB.onsuccess = function () {
    console.log("Succesfully connected to DB");
    DB = openConnectionDB.result;

    const objectStore = DB.transaction("crm").objectStore("crm");

    objectStore.openCursor().onsuccess = function (e) {
      const cursor = e.target.result;

      if (cursor) {
        const { name, phoneNumber, email, companyName, id } = cursor.value;

        clientList.innerHTML += ` 
        <tr>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${name} </p>
              <p class="text-sm leading-10 text-gray-700"> ${email} </p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
              <p class="text-gray-700">${phoneNumber}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
              <p class="text-gray-600">${companyName}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
              <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
              <a href="#" data-clientid="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
          </td>
        </tr>
  `;
        cursor.continue();
      } else {
        console.log("No hay más registros...");
      }
    };
  };
}

function deleteClient(e) {
  if (e.target.classList.contains("eliminar")) {
    const clientID = Number(e.target.dataset.clientid);
    const confirmation = confirm("Deseas eliminar este Cliente?");
    if (confirmation) {
      const transaction = DB.transaction(["crm"], "readwrite");
      const objectStore = transaction.objectStore("crm");

      objectStore.delete(clientID);

      transaction.oncomplete = function () {
        console.log("eliminado");
        e.target.parentElement.parentElement.remove();
      };

      transaction.onerror = function () {
        console.log("error");
      };
    }
  }
}
