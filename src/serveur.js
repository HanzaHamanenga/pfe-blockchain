import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { idlFactory } from './declarations/document_registry/document_registry.did.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CANISTER_ID = process.env.CANISTER_ID_DOCUMENT_REGISTRY || 'u6s2n-gx777-77774-qaaba-cai';
const IC_HOST = process.env.IC_HOST || 'http://127.0.0.1:4943';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN_SECRET || 'thisprojecthasntbeeneasy';

console.log('Starting with configuration:', {
  CANISTER_ID,
  IC_HOST,
  NODE_ENV: process.env.NODE_ENV || 'development'
});

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 } 
}));

let identity;
try {
  const rawKey = fs.readFileSync(path.join(__dirname, 'admin.key'));
  identity = Ed25519KeyIdentity.fromSecretKey(new Uint8Array(rawKey));
  console.log('✅ Admin identity loaded:', identity.getPrincipal().toString());
} catch (error) {
  console.error('❌ Failed to load identity:', error);
  process.exit(1);
}

const createActor = async () => {
  const agent = new HttpAgent({
    host: IC_HOST,
    identity
  });

  if (IC_HOST.includes('localhost') || IC_HOST.includes('127.0.0.1')) {
    await agent.fetchRootKey().catch(err => {
      console.warn('⚠️ Could not fetch root key:', err.message);
    });
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId: CANISTER_ID
  });
};

const calculateFileHash = (fileBuffer) => {
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
};

const authenticateAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    canister: CANISTER_ID,
    network: IC_HOST,
    principal: identity.getPrincipal().toString()
  });
});

app.post('/admin/register', authenticateAdmin, async (req, res) => {
  try {
    if (!req.files?.document) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { document } = req.files;
    if (document.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files accepted' });
    }

    const contentHash = calculateFileHash(document.data);
    const metadata = {
      category: req.body.category || 'general',
      year: req.body.year || '',
      ownerName: req.body.ownerName || '',
      ownerEmail: req.body.ownerEmail || '',
      universityName: req.body.universityName || '',
      fieldOfStudy: req.body.fieldOfStudy || '',
      fileName: document.name,
      fileType: document.mimetype
    };

    console.log('Calling actor.registerDocument with:', {
      contentHash,
      metadata
    });

    const actor = await createActor();

    try {
      const result = await actor.registerDocument(contentHash, metadata);
      if ('ok' in result) {
        return res.json({
          success: true,
          documentId: result.ok,
          contentHash
        });
      }
      return res.status(400).json({ error: result.err });
    } catch (firstError) {
      console.warn('First attempt failed, retrying...', firstError.message);

      const retryActor = await createActor();

      const retryResult = await retryActor.registerDocument(contentHash, metadata);
      if ('ok' in retryResult) {
        return res.json({
          success: true,
          documentId: retryResult.ok,
          contentHash
        });
      }

      return res.status(400).json({ error: retryResult.err });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/verify', async (req, res) => {
  try {
    if (!req.files?.document) {
      return res.status(400).json({ 
        error: 'No file uploaded',
        details: 'Use "document" field for PDF upload'
      });
    }

    const { document } = req.files;
    if (document.mimetype !== 'application/pdf') {
      return res.status(400).json({
        error: 'Invalid file type',
        details: 'Only PDF files are accepted'
      });
    }

    const contentHash = calculateFileHash(document.data);
    console.log('Verifying hash:', contentHash);

    const actor = await createActor();

    let canisterResponse;
    try {
      canisterResponse = await Promise.race([
        actor.verifyDocument(contentHash),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Canister timeout')), 5000)
        )
      ]);
    } catch (error) {
      console.error('Canister communication failed:', error);
      return res.status(503).json({
        error: 'Service unavailable',
        details: 'Could not reach blockchain',
        suggestion: 'Try again later or check replica status'
      });
    }

    if (!canisterResponse || !Array.isArray(canisterResponse)) {
      console.error('Invalid canister response:', canisterResponse);
      return res.status(502).json({
        error: 'Blockchain response malformed',
        details: 'Expected array of documents'
      });
    }

    const matchingDocs = canisterResponse.filter(doc => 
      doc.contentHash === contentHash
    );

    res.json({
      verified: matchingDocs.length > 0,
      matchCount: matchingDocs.length,
      documents: matchingDocs.map(doc => ({
        id: doc.id,
        registeredAt: new Date(Number(doc.createdAt) / 1000000).toISOString(),
        owner: doc.createdBy.toString(),
        metadata: doc.metadata
      })),
      contentHash,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Verification failed:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      error: 'Verification process error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
  🚀 Server ready at: http://localhost:${PORT}
  ├─ Canister ID: ${CANISTER_ID}
  ├─ IC Network: ${IC_HOST}
  └─ Admin Principal: ${identity.getPrincipal().toString()}
  `);
});

app.get('/favicon.ico', (req, res) => res.status(204).end());
