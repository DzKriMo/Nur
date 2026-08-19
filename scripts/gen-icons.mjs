// Generates the Nur PWA icons (192/512 + maskable variants) as PNGs without
// any image dependency: a small hand-rolled PNG encoder + per-pixel drawing
// of the app emblem (emerald gradient, gold ring, crescent and khatam star).
//
// Run: node scripts/gen-icons.mjs
import zlib from 'zlib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'icons');

// ---------- PNG encoding ----------
const CRC_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        t[n] = c >>> 0;
    }
    return t;
})();

function crc32(buf) {
    let c = 0xffffffff;
    for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(td), 0);
    return Buffer.concat([len, td, crc]);
}

function encodePng(width, height, rgba) {
    const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 6; // color type RGBA
    const raw = Buffer.alloc((width * 4 + 1) * height);
    for (let y = 0; y < height; y++) {
        raw[y * (width * 4 + 1)] = 0; // filter: none
        rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
    }
    const idat = zlib.deflateSync(raw, { level: 9 });
    return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

// ---------- Drawing ----------
const GOLD = [200, 146, 42, 255];
const EMERALD_TOP = [6, 95, 70, 255];
const EMERALD_BOTTOM = [2, 44, 34, 255];

function lerp(a, b, t) {
    return [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t), 255];
}

function pointInPoly(px, py, verts) {
    let inside = false;
    for (let i = 0, j = verts.length - 1; i < verts.length; j = i++) {
        const xi = verts[i][0], yi = verts[i][1];
        const xj = verts[j][0], yj = verts[j][1];
        if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
}

function buildStar(cx, cy, outer, inner) {
    const verts = [];
    const N = 8;
    for (let i = 0; i < N * 2; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const a = Math.PI / 2 + i * (Math.PI / N);
        verts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return verts;
}

const STAR = buildStar(0.5, 0.56, 0.17, 0.075);

function colorAt(nx, ny, maskable) {
    if (maskable) {
        nx = 0.5 + (nx - 0.5) / 0.72;
        ny = 0.5 + (ny - 0.5) / 0.72;
    }

    let c = lerp(EMERALD_TOP, EMERALD_BOTTOM, ny);
    const dx = nx - 0.5;
    const dy = ny - 0.5;
    const dist = Math.hypot(dx, dy);

    // Gold ring
    if (dist >= 0.37 && dist <= 0.4) return GOLD;

    // Crescent (top center), punched out with the background color
    const outerDist = Math.hypot(nx - 0.5, ny - 0.2);
    const innerDist = Math.hypot(nx - 0.55, ny - 0.2);
    if (outerDist <= 0.12 && innerDist >= 0.09) return GOLD;

    // Khatam star
    if (pointInPoly(nx, ny, STAR)) return GOLD;

    return c;
}

function render(size, maskable) {
    const S = 4; // supersampling for anti-aliasing
    const px = Buffer.alloc(size * size * 4);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            for (let sy = 0; sy < S; sy++) {
                for (let sx = 0; sx < S; sx++) {
                    const nx = (x + (sx + 0.5) / S) / size;
                    const ny = (y + (sy + 0.5) / S) / size;
                    const c = colorAt(nx, ny, maskable);
                    r += c[0]; g += c[1]; b += c[2]; a += c[3];
                }
            }
            const n = S * S;
            const i = (y * size + x) * 4;
            px[i] = Math.round(r / n);
            px[i + 1] = Math.round(g / n);
            px[i + 2] = Math.round(b / n);
            px[i + 3] = Math.round(a / n);
        }
    }
    return px;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const targets = [
    ['icon-192.png', 192, false],
    ['icon-512.png', 512, false],
    ['icon-maskable-192.png', 192, true],
    ['icon-maskable-512.png', 512, true],
];
for (const [name, size, maskable] of targets) {
    const png = encodePng(size, size, render(size, maskable));
    fs.writeFileSync(path.join(OUT_DIR, name), png);
    console.log(`wrote public/icons/${name} (${size}x${size}, ${(png.length / 1024).toFixed(1)} KiB)`);
}
