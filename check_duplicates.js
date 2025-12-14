const fs = require('fs');
const path = require('path');

const appsData = require('./data/apps.json');
const apps = appsData.apps;

const imageCounts = {};
const duplicates = [];

apps.forEach(app => {
    const img = app.image;
    if (!img) return;

    // Extract ID to be sure (URL query params might differ)
    // Format: https://images.unsplash.com/photo-ID?params
    const match = img.match(/photo-([a-zA-Z0-9-]+)\?/);
    const id = match ? match[1] : img;

    if (imageCounts[id]) {
        imageCounts[id].push(app.name);
    } else {
        imageCounts[id] = [app.name];
    }
});

Object.keys(imageCounts).forEach(id => {
    if (imageCounts[id].length > 1) {
        duplicates.push({
            id,
            count: imageCounts[id].length,
            apps: imageCounts[id]
        });
    }
});

console.log(`Total apps: ${apps.length}`);
console.log(`Total unique images: ${Object.keys(imageCounts).length}`);
console.log(`duplicated images count: ${duplicates.length}`);
console.log(JSON.stringify(duplicates, null, 2));
