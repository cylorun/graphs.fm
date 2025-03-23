const fs = require('fs-extra');
const zlib = require('zlib');
const path = require('path');

const compressFile = async (filePath) => {
    const brotli = zlib.createBrotliCompress();
    const gzip = zlib.createGzip();

    // brotli compression
    const brotliPath = `${filePath}.br`;
    const brotliStream = fs.createReadStream(filePath).pipe(brotli).pipe(fs.createWriteStream(brotliPath));
    await new Promise((resolve, reject) => brotliStream.on('finish', resolve).on('error', reject));

    // gzip compression
    const gzipPath = `${filePath}.gz`;
    const gzipStream = fs.createReadStream(filePath).pipe(gzip).pipe(fs.createWriteStream(gzipPath));
    await new Promise((resolve, reject) => gzipStream.on('finish', resolve).on('error', reject));
};

const compressFilesInDirectory = async (directory, extensions) => {
    const files = await fs.readdir(directory);
    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) {
            await compressFilesInDirectory(filePath, extensions);
        } else if (extensions.some(ext => file.endsWith(ext))) {
            console.log(`Compressing: ${filePath}`);
            await compressFile(filePath);
        }
    }
};

const compressDir = async (dir, extensions) =>  {
    try {
        console.log('Starting compression...');
        await compressFilesInDirectory(dir, extensions);
        console.log('Compression completed.');
    } catch (error) {
        console.error('Error during compression:', error);
    }
}

compressDir('./src/public', ['.min.js', '.css']);