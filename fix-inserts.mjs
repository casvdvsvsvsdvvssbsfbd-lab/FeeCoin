import { readFileSync, writeFileSync } from 'fs';

const file = 'src/lib/supabase.ts';
let c = readFileSync(file, 'utf8');

// Add 'as never' to all .insert({...}) calls that don't already have it
// We need to find .insert({ ... }) without 'as never' and add it
const insertRegex = /\.insert\(\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\s*\)/g;
c = c.replace(insertRegex, ".insert($1 as never)");

// Wait - that won't work well. Let me use a simpler approach: find .insert({ on one line and the closing }) on another
// Actually, let's just find all instances of ".insert({" and replace the closing "})" with "} as never)"
// But we need to be careful about which ones are insert calls

// Revert if we broke something, use a different approach
let lines = c.split('\n');
let inInsert = false;
let braceDepth = 0;
let insertStartIndent = '';
let result = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  // Check if this line starts an .insert({ call
  if (line.match(/\.insert\(\s*\{?\s*$/)) {
    inInsert = true;
    braceDepth = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
    result.push(line);
    continue;
  }
  
  if (inInsert) {
    braceDepth += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
    
    // Check if this line closes the insert
    if (line.match(/^\s*\}\)/) && !line.includes('as never')) {
      line = line.replace(/\}\)/, '} as never)');
    }
    
    result.push(line);
    if (braceDepth <= 0) {
      inInsert = false;
    }
    continue;
  }
  
  result.push(line);
}

c = result.join('\n');
writeFileSync(file, c);
console.log('Fixed insert calls in supabase.ts');
