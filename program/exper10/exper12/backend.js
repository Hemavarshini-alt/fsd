const fs = require("fs");
// Create File
fs.writeFile("sample.txt", "This is a sample file.\n", (err) => {
 if (err) throw err;
 console.log("File created successfully.");
 // Read File
 fs.readFile("sample.txt", "utf8", (err, data) => {
 if (err) throw err;
 console.log("\nFile Content:");
 console.log(data);
 // Update File
 fs.appendFile("sample.txt", "This content is appended.\n", (err) => {
 if (err) throw err;
 console.log("File updated successfully.");
 // Delete File
 fs.unlink("sample.txt", (err) => {
 if (err) throw err;
 console.log("File deleted successfully.");
 });
 });
 });
});