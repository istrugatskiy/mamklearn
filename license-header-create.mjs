import fs from 'fs/promises';
// Fetch all files in dist subdirectory that end with js
const files = await fs.readdir('dist', { withFileTypes: true });
const js_files = files.filter((f) => f.isFile() && f.name.endsWith('.js'));
// Read the content of each file and add a license header
for (const file of js_files) {
    const content = await fs.readFile(`dist/${file.name}`, 'utf-8');
    const license_header = `// Visit '/about' for license info.\n`;
    await fs.writeFile(`dist/${file.name}`, license_header + content);
}
