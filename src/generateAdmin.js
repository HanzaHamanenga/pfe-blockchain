import { Ed25519KeyIdentity } from '@dfinity/identity';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const identity = Ed25519KeyIdentity.generate();

const rawKey = identity.getKeyPair().secretKey.slice(0, 32);

const keyPath = join(__dirname, 'admin.key');
const pemPath = join(__dirname, 'admin.pem');

writeFileSync(keyPath, rawKey);
writeFileSync(pemPath, [
  '-----BEGIN PRIVATE KEY-----',
  Buffer.from(rawKey).toString('base64'),
  '-----END PRIVATE KEY-----'
].join('\n'));

console.log('✅ Admin Identity Generated');
console.log('Principal:', identity.getPrincipal().toString());
console.log('Files created:');
console.log(`- ${keyPath}`);
console.log(`- ${pemPath}`);

console.log('\n🔒 Run these commands:');
console.log(`chmod 600 ${keyPath}`);
console.log(`chmod 600 ${pemPath}`);
console.log('echo "admin.key" >> .gitignore');
console.log('echo "admin.pem" >> .gitignore');