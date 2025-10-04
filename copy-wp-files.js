import { cp, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const sourceDir = join(process.cwd(), 'attached_assets', 'extracted_site', 'Mjol4GohOxlM.au');
const destDir = join(process.cwd(), 'dist', 'public');

console.log('Copying WordPress files to build output...');
console.log('Source directory:', sourceDir);
console.log('Destination directory:', destDir);

// Ensure destination directory exists
if (!existsSync(destDir)) {
  console.log('Creating destination directory...');
  await mkdir(destDir, { recursive: true });
}

// Copy WordPress files
try {
  console.log('Copying index.html...');
  await cp(join(sourceDir, 'index.html'), join(destDir, 'wordpress-index.html'));
  
  console.log('Copying wp-content...');
  await cp(join(sourceDir, 'wp-content'), join(destDir, 'wp-content'), { recursive: true });
  
  console.log('Copying wp-includes...');
  await cp(join(sourceDir, 'wp-includes'), join(destDir, 'wp-includes'), { recursive: true });
  
  console.log('WordPress files copied successfully!');
  console.log('Files in dist/public:');
  
  // List the contents to verify
  const { readdir } = await import('fs/promises');
  const files = await readdir(destDir);
  console.log(files.join(', '));
} catch (error) {
  console.error('Error copying WordPress files:', error);
  process.exit(1);
}
