export let DB;

export default function createDB() {
  const createDB = window.indexedDB.open("crm");
  createDB.onsuccess = function () {
    console.log("DB Succesfully created");
    DB = createDB.result;
  };
  createDB.onerror = function () {
    console.log("Error creating DB!, not supported by brower");
  };

  createDB.onupgradeneeded = function (e) {
    const db = e.target.result;

    const objectStore = db.createObjectStore("crm", {
      keyPath: "id",
      autoIncrement: true,
    });

    objectStore.createIndex("name", "name", { unique: false });
    objectStore.createIndex("email", "email", { unique: true });
    objectStore.createIndex("phoneNumber", "phoneNumber", { unique: false });
    objectStore.createIndex("companyName", "companyName", { unique: false });
    objectStore.createIndex("id", "id", { unique: false });

    console.log("DB ready!");
  };
}
