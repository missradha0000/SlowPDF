const fs = require("fs");
const path = require("path");

function getFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else if (filePath.endsWith(".html")) {
      results.push(filePath);
    }
  });
  return results;
}

const files = getFiles("tools").concat(getFiles("pages")).concat(["index.html"]);

files.forEach(file => {
  let content = fs.readFileSync(file, "utf8");
  let original = content;

  // Remove hamburger listener patterns if present
  content = content.replace(/hamburgerBtn(?:\?\.)?\.addEventListener\s*\(\s*['"]click['"][\s\S]*?\)\s*;?/gi, "// (Handled universally by nav-memory.js)");
  content = content.replace(/closeModalBtn(?:\?\.)?\.addEventListener\s*\(\s*['"]click['"][\s\S]*?\)\s*;?/gi, "// (Handled universally by nav-memory.js)");

  if (content !== original) {
    fs.writeFileSync(file, content, "utf8");
    console.log("Updated:", file);
  }
});
