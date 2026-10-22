import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('sharp');
const root=path.resolve(import.meta.dirname,'..');
async function walk(dir){const entries=await fs.readdir(dir,{withFileTypes:true});const files=[];for(const e of entries){const p=path.join(dir,e.name);if(e.isDirectory()&&!['source','fonts'].includes(e.name))files.push(...await walk(p));else if(e.isFile()&&p.endsWith('.svg'))files.push(p);}return files;}
for(const p of await walk(root)){
 if(p.includes('/animations/'))continue;
 await sharp(p).png().toFile(p.replace(/\.svg$/,'.png'));
}
for(const size of [16,32,48,180,192,512])await sharp(path.join(root,'icons/nextjobber-profile-plum.svg')).resize(size,size).png().toFile(path.join(root,`icons/nextjobber-icon-${size}.png`));
console.log('Raster exports complete.');
