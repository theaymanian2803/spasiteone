import { readdirSync, existsSync, chmodSync, statSync } from 'fs';
import { join, extname } from 'path';

const NON_BINARY_EXT = new Set(['.json', '.md', '.txt', '.map', '.ts', '.js', '.mjs', '.cjs', '.node', '.wasm']);
const NON_BINARY_NAMES = new Set(['LICENSE', 'README', 'CHANGELOG', 'AUTHORS', 'NOTICE', 'COPYING', 'PATENTS']);
const BINARY_NAMES = new Set(['esbuild']);

function isBinary(file) {
  if (BINARY_NAMES.has(file)) return true;
  if (NON_BINARY_NAMES.has(file)) return false;
  const ext = extname(file).toLowerCase();
  if (ext === '.exe') return true;
  if (ext === '') return true; // no extension = likely a native binary on Linux
  return false;
}

function chmodBinaries(pkgDir) {
  if (!existsSync(pkgDir)) return;
  // Check bin/ subdirectory
  const binDir = join(pkgDir, 'bin');
  if (existsSync(binDir) && statSync(binDir).isDirectory()) {
    for (const file of readdirSync(binDir)) {
      const binPath = join(binDir, file);
      try {
        if (statSync(binPath).isFile()) {
          chmodSync(binPath, 0o755);
          console.log(`[fix-perms] chmod +x ${binPath}`);
        }
      } catch (e) { /* skip on error */ }
    }
  }
  // Check package root for binary files (no extension or named 'esbuild')
  for (const file of readdirSync(pkgDir)) {
    const fullPath = join(pkgDir, file);
    try {
      const stat = statSync(fullPath);
      if (stat.isFile() && isBinary(file) && !NON_BINARY_EXT.has(extname(file).toLowerCase())) {
        chmodSync(fullPath, 0o755);
        console.log(`[fix-perms] chmod +x ${fullPath}`);
      }
    } catch (e) { /* skip on error */ }
  }
}

function scanNodeModules(nmDir) {
  if (!existsSync(nmDir)) return;
  for (const entry of readdirSync(nmDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const pkgPath = join(nmDir, entry.name);

    // Handle scoped packages (@esbuild, @swc, etc.)
    if (entry.name.startsWith('@')) {
      if (entry.name === '@esbuild' || entry.name === '@swc') {
        for (const subPkg of readdirSync(pkgPath, { withFileTypes: true })) {
          if (subPkg.isDirectory()) {
            chmodBinaries(join(pkgPath, subPkg.name));
          }
        }
      }
      // Recurse into scoped package node_modules (pnpm)
      const subNm = join(pkgPath, 'node_modules');
      if (existsSync(subNm)) scanNodeModules(subNm);
      // Check all scoped packages for esbuild/swc binaries
      if (existsSync(pkgPath) && entry.name === '@esbuild') {
        for (const subPkg of readdirSync(pkgPath, { withFileTypes: true })) {
          if (subPkg.isDirectory()) chmodBinaries(join(pkgPath, subPkg.name));
        }
      }
      continue;
    }

    // Handle esbuild and swc/core packages
    if (entry.name === 'esbuild' || entry.name === 'swc') {
      chmodBinaries(pkgPath);
    }

    // Recurse into nested node_modules (pnpm/.pnpm structure)
    if (entry.name === '.pnpm') {
      scanPnpmStore(pkgPath);
    }
    const subNm = join(pkgPath, 'node_modules');
    if (existsSync(subNm)) scanNodeModules(subNm);
  }
}

function scanPnpmStore(pnpmDir) {
  if (!existsSync(pnpmDir)) return;
  for (const entry of readdirSync(pnpmDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const pkgPath = join(pnpmDir, entry.name);
    // Each .pnpm entry has a node_modules
    const nm = join(pkgPath, 'node_modules');
    if (existsSync(nm)) scanNodeModules(nm);
  }
}

console.log('[fix-perms] Fixing esbuild/@esbuild binary permissions...');
const nmRoot = join(process.cwd(), 'node_modules');
scanNodeModules(nmRoot);
console.log('[fix-perms] Done.');
