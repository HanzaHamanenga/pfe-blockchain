import { Actor, HttpAgent } from '@dfinity/agent';
import React, { useState, useEffect } from 'react';
import { idlFactory } from '../../../declarations/blockchain_backend';
import { CANISTER_IDS } from '../config';
import './Verify.css';

function Verify() {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actor, setActor] = useState(null);

  useEffect(() => {
    const initActor = async () => {
      try {
        const agent = new HttpAgent({
          host: process.env.DFX_NETWORK === 'ic'
            ? 'https://ic0.app'
            : 'http://localhost:4943'
        });

      
        if (process.env.DFX_NETWORK !== 'ic') {
          await agent.fetchRootKey().catch(e => {
            console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
            console.error(e);
          });
        }

        
        const backendActor = Actor.createActor(idlFactory, {
          agent,
          canisterId: CANISTER_IDS.BLOCKCHAIN_BACKEND
        });

        setActor(backendActor);
      } catch (error) {
        console.error("Failed to initialize actor:", error);
      }
    };

    initActor();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      generateHash(selectedFile);
    }
  };

  const generateHash = async (file) => {
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHash(hashHex);
    } catch (error) {
      console.error("Error generating hash:", error);
      alert("Failed to generate document hash");
    }
  };

  const verifyDocument = async () => {
    if (!hash) {
      alert('Please select a file first');
      return;
    }

    if (!actor) {
      alert('Connection to blockchain not established yet');
      return;
    }

    setLoading(true);
    setCertificate(null);

    try {
      const result = await actor.verifyDocument(hash);
      console.log("Received result:", result); 
      const certificateData = parseCertificateResult(result);
      setCertificate(certificateData);
    } catch (error) {
      console.error("Verification failed:", error);
      alert(`Verification failed: ${error.message || 'Document not found or verification error'}`);
    } finally {
      setLoading(false);
    }
  };

  const parseCertificateResult = (result) => {
    if (!result || typeof result !== 'string') {
      console.error("Invalid certificate result:", result);
      return null;
    }

    
    const lines = result.split('\n');
    
    const tokenId = extractValueFromLine(lines, 'Token ID:');
    const owner = extractValueFromLine(lines, 'Owner:');
    const name = extractValueFromLine(lines, 'Name:');
    const hash = extractValueFromLine(lines, 'Hash:');
    const description = extractValueFromLine(lines, 'Description:');
    const mintedAt = extractValueFromLine(lines, 'Minted At:');

    return {
      tokenId,
      owner,
      name,
      hash,
      description,
      mintedAt,
    };
  };

  const extractValueFromLine = (lines, label) => {
    const line = lines.find(line => line.includes(label));
    return line ? line.split(`${label}`)[1].trim() : '';
  };

  return (
    <div className="verify-container">
      <h2>Verify Document</h2>
      <div className="file-upload">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={loading}
        />
        {hash && <p className="hash-display">Document Hash: <span className="hash-value">{hash}</span></p>}
      </div>

      <button
        className="verify-button"
        onClick={verifyDocument}
        disabled={!hash || loading || !actor}
      >
        {loading ? 'Verifying...' : 'Verify Document'}
      </button>

      {certificate && (
        <div className="certificate">
          <h3>Digital Certificate</h3>
          <div className="certificate-content">
            <p><strong>Token ID:</strong> {certificate.tokenId}</p>
            <p><strong>Owner:</strong> {certificate.owner}</p>
            <p><strong>Name:</strong> {certificate.name}</p>
            <p><strong>Hash:</strong> {certificate.hash}</p>
            <p><strong>Description:</strong> {certificate.description}</p>
            <p><strong>Minted At:</strong> {
              isNaN(Number(certificate.mintedAt))
                ? certificate.mintedAt
                : new Date(Number(certificate.mintedAt) / 1000000).toLocaleString()
            }</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Verify;
