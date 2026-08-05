const fs = require('fs/promises');
const { createWriteStream } = require('fs');
const path = require('path');

const srcFolder = path.join(__dirname, 'styles');
const distFolder = path.join(__dirname, 'project-dist');
const distFile = path.join(distFolder, 'bundle.css');


async function mergeStyles() {
    try {
        await fs.mkdir(distFolder, { recursive: true});
        const output = createWriteStream(distFile);

        const files = await fs.readdir(srcFolder, { withFileTypes: true});
        for (const file of files) {
            if (file.isFile() && path.extname(file.name) === '.css') {
                const filePath = path.join(srcFolder, file.name);
                const cssContent = await fs.readFile(filePath, 'utf-8');
                output.write(cssContent + '\n');
            }
        }
        output.end();
        console.log('Styles merged successfully');
    } catch (error) {
        console.log('Error styles:', error.message);
    }
}
mergeStyles();
