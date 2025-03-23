import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const TEXT_FOLDERS = ['css', 'js'];
const NODE_ENV = process.env.NODE_ENV;

const supportsBrotli = (req: Request): boolean => {
    const acceptEncoding = req.headers['accept-encoding'];

    if (typeof acceptEncoding === 'string') {
        const encodings = acceptEncoding.split(',').map(x => x.toLowerCase().trim());
        return encodings.includes('br');
    }

    if (Array.isArray(acceptEncoding)) {
        const encodings = acceptEncoding.map(x => x.toLowerCase().trim());
        return encodings.includes('br');
    }

    return false;
};

const supportsGzip = (req: Request): boolean => {
    const acceptEncoding = req.headers['accept-encoding'];

    if (typeof acceptEncoding === 'string') {
        const encodings = acceptEncoding.split(',').map(x => x.toLowerCase().trim());
        return encodings.includes('gzip');
    }

    if (Array.isArray(acceptEncoding)) {
        const encodings = acceptEncoding.map(x => x.toLowerCase().trim());
        return encodings.includes('gzip');
    }

    return false;
};

const staticHandler = (req: Request, res: Response, next: NextFunction): void => {
    if (NODE_ENV !== 'production') return next();

    let resourcePath = req.path;
    if (resourcePath.endsWith('/')) {
        resourcePath = resourcePath.slice(0, resourcePath.length - 1);
    }

    const subs = resourcePath.split('/');
    if (!subs.some(sub => TEXT_FOLDERS.includes(sub))) {
        return next();
    }

    const absolutePath = path.join(__dirname, '../public', resourcePath);
    const brotliPath = `${absolutePath}.br`;
    const gzipPath = `${absolutePath}.gz`;

    if (supportsBrotli(req) && fs.existsSync(brotliPath)) {
        res.setHeader('Content-Encoding', 'br');
        res.setHeader('Content-Type', getContentType(resourcePath));
        fs.createReadStream(brotliPath).pipe(res);
        return;
    }

    if (supportsGzip(req) && fs.existsSync(gzipPath)) {
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Type', getContentType(resourcePath));
        fs.createReadStream(gzipPath).pipe(res);
        return;
    }

    if (fs.existsSync(absolutePath)) {
        res.setHeader('Content-Type', getContentType(resourcePath));
        fs.createReadStream(absolutePath).pipe(res);
        console.log("Default for:" + absolutePath);
        return;
    }

    console.log("nothjing for:" + absolutePath);

    next(); // If it's not a text-based static file it continues to the express.static middleware
};

const getContentType = (filePath: string): string => {
    if (filePath.includes('api/translations')) return 'application/json';
    const ext = path.extname(filePath);
    switch (ext) {
        case '.css': return 'text/css';
        case '.js': return 'application/javascript';
        case '.json': return 'application/json';
        default: return 'application/octet-stream';
    }
};

export { staticHandler };
