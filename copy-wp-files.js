import { cp } from 'fs/promises';
import { join } from 'path';

const sourceDir = join(process.cwd(), 'attached_assets', 'extracted_site', 'Mjol4GohOxlM.au');
const destDir = join(process.cwd(), 'dist', 'public');

console.log('Copying WordPress files to build output...');

await cp(join(sourceDir, 'index.html'), join(destDir, 'wordpress-index.html'));
await cp(join(sourceDir, 'wp-content'), join(destDir, 'wp-content'), { recursive: true });
await cp(join(sourceDir, 'wp-includes'), join(destDir, 'wp-includes'), { recursive: true });

console.log('WordPress files copied successfully!');
