const fs = require('fs/promises');
const path = require('path');

const distFolder = path.join(__dirname, 'project-dist');
const stylesFolder = path.join(__dirname, 'styles');
const distStyleFile = path.join(distFolder, 'style.css');

const assetsFolder = path.join(__dirname, 'assets');
const distAssetsFolder = path.join(distFolder, 'assets');

const templateFile = path.join(__dirname, 'template.html');
const componentsFolder = path.join(__dirname, 'components');
const distHtmlFile = path.join(distFolder, 'index.html');

async function copyDir(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyDir(srcPath, destPath);
        } else if (entry.isFile()) {
            await fs.copyFile(srcPath, destPath);
        }
    }
}

async function buildPage() {
    try {
        await fs.rm(distFolder, { recursive: true, force: true});
        await fs.mkdir(distFolder, { recursive: true });
        const files = await fs.readdir(stylesFolder, { withFileTypes: true });
        const stylesArray = [];
        for (const file of files) {
            if (file.isFile() && path.extname(file.name) === '.css') {
                const filePath = path.join(stylesFolder, file.name);
                const cssContent = await fs.readFile(filePath, 'utf-8');
                stylesArray.push(cssContent);
            }
        }
        await fs.writeFile(distStyleFile, stylesArray.join('\n'));
        console.log('Styles compiled successfully');
        await copyDir(assetsFolder, distAssetsFolder);
        console.log('Assets copied!');
        
        let templateContent = await fs.readFile(templateFile, 'utf-8');
        const componentFiles = await fs.readdir(componentsFolder, { withFileTypes: true });
        for (const file of componentFiles) {
            if (file.isFile() && path.extname(file.name) === '.html') {
                const componentName = path.parse(file.name).name;
                const componentPath = path.join(componentsFolder, file.name);
                const componentContent = await fs.readFile(componentPath, 'utf-8');
                templateContent = templateContent.replaceAll(`{{${componentName}}}`, componentContent);
            }
        }
        
        await fs.writeFile(distHtmlFile, templateContent);
        console.log('HTML page assembled successfully');
    } catch (error) {
        console.log('Error', error.message);
    }
}
buildPage();