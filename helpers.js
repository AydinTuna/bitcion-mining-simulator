import fs from "fs"

export function dateFormatter(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}.${milliseconds}`;

    return formattedTime
}

export function elapsedTimeFormatter(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = milliseconds % 1000;
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;

    return formattedTime
}

export function readFile(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf-8', (err, data) => {
            if (err) {
                reject("Error reading the file: " + err);
            } else if (!data.trim()) {
                if (fileName === "blockchain.json") {
                    resolve([]);
                } else {
                    resolve(0);
                }
            } else {
                try {
                    const jsonData = JSON.parse(data);
                    if (fileName === "wallet.json") {
                        resolve(jsonData.walletBalance);
                    } else if (fileName === "blockchain.json") {
                        resolve(jsonData);
                    }
                } catch (parseError) {
                    reject("Error parsing JSON: " + parseError.message);
                }
            }
        });
    });
}

export function writeToFile(fileName, updatedData) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, JSON.stringify(updatedData, null, 2), (err) => {
            if (err) {
                reject("Error writing the file: " + err);
            } else {
                resolve("File updated successfully!");
            }
        });
    });
}

export function objectToHex(obj) {
    const jsonString = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(jsonString);
    let hexString = '';
    for (let byte of bytes) {
        hexString += byte.toString(16).padStart(2, '0');
    }

    return hexString;
}