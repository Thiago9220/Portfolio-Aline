import { copyFile, mkdir, rm } from 'node:fs/promises';
import { basename, dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

if (basename(dist) !== 'dist' || !dist.startsWith(`${root}${sep}`)) {
  throw new Error('Invalid build output path');
}

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, 'client'), { recursive: true });
await mkdir(join(dist, 'client', 'assets'), { recursive: true });
await mkdir(join(dist, 'server'), { recursive: true });

for (const file of ['index.html', 'en.html', 'styles.css', 'script.js']) {
  await copyFile(join(root, file), join(dist, 'client', file));
}

const assetFiles = [
  'Aline-Lacerda-FlowCV-Resume-20260108.pdf',
  'TWD.webp',
  'U-dictionary.webp',
  'einerd.webp',
  'favicon.svg',
  'fredanime.webp',
  'jaqueline.webp',
  'jazzghost.webp',
  'lucaslira.webp',
  'natanporai.webp',
  'offlinetv.webp',
  'og-card.jpg',
  'perfil.webp',
  'renatogarcia.webp',
  'rivollplay.webp',
  'sessaonerd.webp',
  'service-icons.svg',
  'sypherpk.webp',
  'tokyo ghoul.webp',
  'viainfinda.webp',
  'vicionerd.webp',
  'wildcat.webp'
];

for (const file of assetFiles) {
  await copyFile(join(root, 'assets', file), join(dist, 'client', 'assets', file));
}

await copyFile(join(root, 'worker', 'index.js'), join(dist, 'server', 'index.js'));

console.log('Static portfolio build completed.');
