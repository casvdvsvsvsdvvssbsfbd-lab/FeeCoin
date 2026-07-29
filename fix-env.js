const fs = require('fs');
const path = require('path');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      walk(full);
    } else if ((entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) && !full.includes('node_modules')) {
      let content = fs.readFileSync(full, 'utf8');
      if (content.includes('import.meta.env.VITE_')) {
        content = content.replace(/import\.meta\.env\.VITE_/g, 'process.env.NEXT_PUBLIC_');
        fs.writeFileSync(full, content);
        console.log('Fixed: ' + full);
      }
    }
  }
}

walk('src');
console.log('Done');