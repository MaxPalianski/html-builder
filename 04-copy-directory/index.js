const fs = require('fs/promises');
const path = require('path');

const srcPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

async function copyDir() {
    try {
    await fs.rm(destPath, {recursive: true, force: true});
    await fs.mkdir(destPath, { recursive: true});
    const files = await fs.readdir(srcPath);

    for (const file of files) {
    
    const srcFile = path.join(srcPath, file);
    const destFile = path.join(destPath, file);
    await fs.copyFile(srcFile, destFile);
    }
    console.log('Folder copyed!');
    } catch (error) {
        console.log('Copyed error:', error.message);
    }
}
copyDir();