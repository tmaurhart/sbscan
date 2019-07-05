var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

    var openDB = indexedDB.open("SBScanDatabase", 1);

    openDB.onupgradeneeded = function () {
        var db = {}
        db.result = openDB.result;
        db.store = db.result.createObjectStore("SBScanObject", { keyPath: "id" });
        if (fileindex) db.index = db.store.createIndex("NameIndex", fileindex);
    };


function getStoreIndexedDB(openDB) {
    var db = {};
    db.result = openDB.result;
    db.tx = db.result.transaction("SBScanObject", "readwrite");
    db.store = db.tx.objectStore("SBScanObject");
    db.index = db.store.index("NameIndex");

    return db;
}

function saveIndexedDB(filename, filedata, fileindex) {
    var openDB = openIndexedDB(fileindex);

    openDB.onsuccess = function () {
        var db = getStoreIndexedDB(openDB);

        db.store.put({ id: filename, data: filedata });
    }

    return true;
}

function findIndexedDB(filesearch, callback) {
    return loadIndexedDB(null, callback, filesearch);
}

function loadIndexedDB(filename, callback, filesearch) {
    var openDB = openIndexedDB();

    openDB.onsuccess = function () {
        var db = getStoreIndexedDB(openDB);

        var getData;
        if (filename) {
            getData = db.store.get(filename);
        } else {
            getData = db.index.get(filesearch);
        }

        getData.onsuccess = function () {
            callback(getData.result.data);
        };

        db.tx.oncomplete = function () {
            db.result.close();
        };
    }

    return true;
}

function example() {
    var fileindex = ["name.last", "name.first"];
    saveIndexedDB(12345, { name: { first: "John", last: "Doe" }, age: 42 });
    saveIndexedDB(67890, { name: { first: "Bob", last: "Smith" }, age: 35 }, fileindex);

    loadIndexedDB(12345, callbackJohn);
    findIndexedDB(["Smith", "Bob"], callbackBob);
}

function callbackJohn(filedata) {
    console.log(filedata.name.first);
}

function callbackBob(filedata) {
    console.log(filedata.name.first);
}