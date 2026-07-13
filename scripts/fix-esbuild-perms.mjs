import { readdirSync, existsSync, chmodSync, statSync } from 'fs';
import { join } from 'path';

function fixPerms(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'esbuild' || entry.name.startsWith('@esbuild')) {
        fixBinaries(fullPath);
      }
      if (entry.name === '@esbuild') {
        fixBinaries(fullPath);
      }
      if (entry.name === 'node_modules') continue;
      fixPerms(fullPath);
    }
  }
}

function fixBinaries(dir) {
  if (!existsSync(dir)) return;
  const binDir = join(dir, 'bin');
  if (existsSync(binDir)) {
    for (const file of readdirSync(binDir)) {
      const binPath = join(binDir, file);
      try {
        chmodSync(binPath, 0o755);
        console.log(`[fix-perms] chmod +x ${binPath}`);
      } catch (e) {
        // Windows or read-only fs — silently ignore
      }
    }
  }
}

console.log('[fix-perms] Fixing esbuild binary permissions...');
fixPerms(join(process.cwd(), 'node_modules'));
console.log('[fix-perms] Done.');
