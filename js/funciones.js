export let DB;
const formNewClient = document.querySelector("#formulario");

export function connectDB() {
  const openConnectionDB = window.indexedDB.open("crm", 1);
  openConnectionDB.onerror = function () {
    console.log("Error connecting to DB!");
  };
  openConnectionDB.onsuccess = function () {
    console.log("Succesfully connected to DB edit");
    DB = openConnectionDB.result;
  };
}

export function showAlert(msg, type) {
  const alert = document.querySelector(".alerta");
  if (!alert) {
    const msgDiv = document.createElement("div");
    msgDiv.textContent = msg;
    msgDiv.classList.add(
      "px-4",
      "py-3",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "mt-6",
      "text-center",
      "border",
      "alerta"
    );
    if (type === "error") {
      msgDiv.classList.add("bg-red-100", "border-red-400", "text-red-700");
    } else {
      msgDiv.classList.add(
        "bg-green-100",
        "border-green-400",
        "text-green-700"
      );
    }

    formNewClient.appendChild(msgDiv);

    setTimeout(() => {
      msgDiv.remove();
    }, 3000);
  }
}
