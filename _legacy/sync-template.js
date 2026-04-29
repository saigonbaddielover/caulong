const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const templatePath = path.join(root, 'design', 'template.html');
const indexPath = path.join(root, 'index.html');

const zones = [
    'SHARED_CONSTANTS',
    'SHARED_UTILS',
    'SHARED_COMPONENTS',
    'SHARED_SHELL',
];

function read(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

function zonePattern(zoneName) {
    return new RegExp(
        `([ \\t]*// SYNC-ZONE-START:${zoneName}\\r?\\n)([\\s\\S]*?)([ \\t]*// SYNC-ZONE-END:${zoneName})`,
        'm'
    );
}

function extractZone(source, zoneName) {
    const match = source.match(zonePattern(zoneName));
    if (!match) {
        throw new Error(`Missing zone ${zoneName} in template.html`);
    }
    return match[2];
}

function replaceZone(source, zoneName, content) {
    const pattern = zonePattern(zoneName);
    if (!pattern.test(source)) {
        throw new Error(`Missing zone ${zoneName} in index.html`);
    }
    return source.replace(pattern, `$1${content}$3`);
}

function main() {
    const template = read(templatePath);
    let index = read(indexPath);

    for (const zone of zones) {
        index = replaceZone(index, zone, extractZone(template, zone));
    }

    fs.writeFileSync(indexPath, index, 'utf8');
    console.log(`Synced ${zones.length} zones from design/template.html -> index.html`);
}

main();
