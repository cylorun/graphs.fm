const fs = require('fs');
const path = require('path');
const terser = require('terser');

// The order or items in the 'files' list is very important, things get declared in the order of the list

const files = [
    {
        minifiedName: "nav-all.min.js",
        files: ['./src/public/js/nav.js']
    },
    {
        minifiedName: "user-all.min.js",
        files: ['./src/public/js/dashboard/dashboard.js', './src/public/js/dashboard/user-redirect.js']
    },
    {
        minifiedName: "artist-all.min.js",
        files: ['./src/public/js/artist/artist.js']
    }
];

const outputDir = './src/public/js';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {recursive: true});
}

(async () => {
    try {
        for (const group of files) {
            const terserInput = {};
            for (const file of group.files) {
                terserInput[file] = fs.readFileSync(file, 'utf8');
            }

            const minified = await terser.minify(terserInput, {
                compress: true,
                mangle: true,
            });

            const outputPath = path.join(outputDir, group.minifiedName);
            if (minified.code) {
                fs.writeFileSync(outputPath, minified.code, 'utf8');
                console.log(`Minified ${group.minifiedName} successfully to ${outputPath}`);
            } else {
                console.error(`Failed to minify ${group.minifiedName}.`);
            }
        }
    } catch (err) {
        console.error('Error during minification:', err);
    }
})();
