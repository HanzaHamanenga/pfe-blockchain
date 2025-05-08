import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Card0.css';

const Card0 = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    if (!file) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await fetch('http://localhost:3001/verify', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer thisprojecthasntbeeneasy', 
        }
      });
      
      if (!response.ok) {
        throw new Error('Verification failed');
      }
      
      const data = await response.json();
      setResult(data); 
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card0">
      <h1>Verify Document Authenticity <span>Powered by Blockchain</span></h1>
      
      <div className="verification-box">
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])} 
          accept=".pdf"
        />
        
        <button onClick={handleVerification} disabled={!file || loading}>
          {loading ? 'Verifying...' : 'Verify Document'}
        </button>
        
        {result && (
          <div className={`result ${result.verified ? 'valid' : 'invalid'}`}>
            {result.verified ? (
              <>
                <h3>✅ Document Verified</h3>
                {result.documents.map(doc => (
                  <div key={doc.id} className="document-info">
                    <p><strong>Owner:</strong> {doc.metadata.ownerName}</p>
                    <p><strong>Institution:</strong> {doc.metadata.universityName}</p>
                    <p><strong>Year:</strong> {doc.metadata.year}</p>
                    <p><strong>Type:</strong> {doc.metadata.category}</p>
                  </div>
                ))}
              </>
            ) : result.error ? (
              <p className="error">Error: {result.error}</p>
            ) : (
              <p>❌ Document not found in registry</p>
            )}
          </div>
        )}
      </div>
      
      <Link to="/card1">How verification works →</Link>
    </div>
  );
};

export default Card0;
