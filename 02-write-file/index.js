const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a'});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
console.log('Hey! Tell something....(for exit write "exit" or turn Ctrl + C:\n');

const closeProcess = () => {
    console.log('\nWell done. Good Buy!');
    rl.close();
    writeStream.end();
    process.exit();
};
rl.on('line', (input) => {
    if(input.trim() === 'exit') {
        closeProcess();
    } else {
        writeStream.write(`${input}\n`);
    }
});
rl.on('SIGINT', () => {
    closeProcess();
});