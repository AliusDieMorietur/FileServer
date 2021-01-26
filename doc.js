const fs = require('fs');
const os = require('os');

const DEFINITIONS_PATH = './src/server/lib/types.d.ts';

const data = fs.readFileSync(DEFINITIONS_PATH).toString();
const lines = data.split(os.EOL);

let doc = ''

for (let line of lines) {
  const skipRule = 
    line.startsWith('///') || 
    line.startsWith('import') ||
    line.startsWith('type') ||
    line.startsWith('}') ||
    !line.trim() ||
    line.length === 0;
  if (skipRule) continue;
  if (line.startsWith('export')) {
    const [_, object, name] = line.split(' ');
    const actions = {
      'class': () => {
        doc += 
          `\n# ${name}\n| property / method | definition |\n| - | - |\n`;
      },
      'const': () => {
        doc += `\n# ${line.slice(13)}\n`;
      }
    };
    actions[object]();
  } else {
    line = line.replace(';', '').trim();
    if (line.includes('(')) {
      const index = line.indexOf('(');
      const method = line.slice(0, index)
      const defenition = line.slice(index)
      doc += `| ${method} | ${defenition} |\n`; 
    } else if (line.includes(':')) {
      const index = line.indexOf(':');
      line = line.replace(':', '');
      const name = line.slice(0, index).trim();
      const type = line.slice(index).trim();
      doc += `| ${name} | ${type} |\n`; 
    } else {
      doc += `| ${line} | any |\n`; 
    }
  };
  console.log('l: ', line);
}

console.log(doc);