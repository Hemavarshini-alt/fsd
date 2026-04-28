const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "sample.txt");

// ================= CREATE FILE =================
fs.writeFile(filePath, "Line 1: Hello\nLine 2: Node.js\nLine 3: Hema\nLine 2: fullstack\n", (err) => {
  if (err) {
    console.error("❌ Error creating file:", err.message);
    return;
  }

  console.log("✅ File created successfully.");

  // ================= CHECK FILE EXISTS =================
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("❌ File does not exist.");
      return;
    }

    console.log("📁 File exists.");

    // ================= READ FILE =================
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("❌ Error reading file:", err.message);
        return;
      }

      console.log("\n📖 File Content:\n" + data);

      // ================= COUNT LINES =================
      const lines = data.split("\n").filter(line => line.trim() !== "");
      console.log("🔢 Total Lines:", lines.length);

      // ================= APPEND TIMESTAMP =================
      const timestamp = new Date().toLocaleString();
      const appendData = `Appended at: ${timestamp}\n`;

      fs.appendFile(filePath, appendData, (err) => {
        if (err) {
          console.error("❌ Error appending data:", err.message);
          return;
        }

        console.log("✏️ Timestamp appended successfully.");

        // ================= DELETE FILE =================
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (err) {
            console.error("❌ File not found for deletion.");
            return;
          }

          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("❌ Error deleting file:", err.message);
              return;
            }

            console.log("🗑️ File deleted successfully.");
          });
        });
      });
    });
  });
});