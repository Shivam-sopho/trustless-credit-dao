import * as fs from 'fs';
import * as path from 'path';

const sourceDir = path.join(__dirname, '../artifacts/contracts');
const destDir = path.join(__dirname, '../web/artifacts/contracts');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// Copy TrustlessCredit.json
const sourceFile = path.join(sourceDir, 'TrustlessCredit.sol/TrustlessCredit.json');
const destFile = path.join(destDir, 'TrustlessCredit.sol/TrustlessCredit.json');

if (!fs.existsSync(path.dirname(destFile))) {
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
}

fs.copyFileSync(sourceFile, destFile);
console.log('Contract artifacts copied to frontend'); 