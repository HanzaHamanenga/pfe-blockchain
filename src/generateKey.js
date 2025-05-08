import { Ed25519KeyIdentity } from '@dfinity/identity';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const identity = Ed25519KeyIdentity.generate();

const keyPair = identity.getKeyPair();

const pemHeader = '-----BEGIN PRIVATE KEY-----';
const pemFooter = '-----END PRIVATE KEY-----';
const pemContent = Buffer.from(keyPair.secretKey).toString('base64');

const pem = `${pemHeader}\n${pemContent}\n${pemFooter}`;

const pemPath = join(__dirname, 'admin.pem');
writeFileSync(pemPath, pem);

console.log('✅ Admin Identity Generated:');
console.log('Principal:', identity.getPrincipal().toString());
console.log('PEM file saved to:', pemPath);
console.log('\n🔒 Security Steps:');
console.log('1. Run: chmod 600 admin.pem');
console.log('2. Add "admin.pem" to .gitignore');