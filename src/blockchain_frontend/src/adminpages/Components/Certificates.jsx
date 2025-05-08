import React, { useState } from 'react';
import '../admincss/Certificates.css';

const Certificates = ({ certificates = [] }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  
  const sampleCertificates = [
    {
      id: 1,
      owner: 'John Doe',
      email: 'john@example.com',
      document: 'Computer Science Degree',
      category: 'degree',
      dateIssued: '2023-05-15',
      status: 'verified',
      txHash: '0x123...456'
    },
    {
      id: 2,
      owner: 'Jane Smith',
      email: 'jane@example.com',
      document: 'MBA Masters',
      category: 'masters',
      dateIssued: '2023-06-20',
      status: 'pending',
      txHash: ''
    },
    
  ];

  const allCertificates = [...sampleCertificates, ...certificates];
  
  const filteredCertificates = activeTab === 'all' 
    ? allCertificates 
    : allCertificates.filter(cert => cert.status === activeTab);

  const handleGenerateNFT = (certificate) => {
    
    console.log('Generating NFT for:', certificate);
    setSelectedCertificate(certificate);
    
  
    setTimeout(() => {
      alert(`NFT Certificate generated successfully for ${certificate.owner}'s ${certificate.document}`);
      
      certificate.status = 'verified';
      certificate.txHash = '0x789...abc'; 
      setSelectedCertificate(null);
    }, 2000);
  };

  return (
    <div className="certificates">
      <h2>NFT Certificates</h2>
      
      <div className="certificate-tabs">
        <button 
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          All Certificates
        </button>
        <button 
          className={activeTab === 'verified' ? 'active' : ''}
          onClick={() => setActiveTab('verified')}
        >
          Verified
        </button>
        <button 
          className={activeTab === 'pending' ? 'active' : ''}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
      </div>

      {filteredCertificates.length === 0 ? (
        <p className="no-certificates">No certificates found.</p>
      ) : (
        <div className="certificate-table-container">
          <table className="certificate-table">
            <thead>
              <tr>
                <th>Owner</th>
                <th>Document</th>
                <th>Category</th>
                <th>Date Issued</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCertificates.map((cert) => (
                <tr key={cert.id}>
                  <td>
                    <div className="owner-info">
                      <div className="owner-name">{cert.owner}</div>
                      <div className="owner-email">{cert.email}</div>
                    </div>
                  </td>
                  <td>{cert.document}</td>
                  <td className="category-tag">{cert.category}</td>
                  <td>{cert.dateIssued}</td>
                  <td>
                    <span className={`status-badge ${cert.status}`}>
                      {cert.status}
                    </span>
                  </td>
                  <td>
                    {cert.status === 'pending' ? (
                      <button 
                        className="generate-button"
                        onClick={() => handleGenerateNFT(cert)}
                        disabled={selectedCertificate?.id === cert.id}
                      >
                        {selectedCertificate?.id === cert.id ? 'Generating...' : 'Generate NFT'}
                      </button>
                    ) : (
                      <div className="verified-info">
                        <span className="tx-hash" title={cert.txHash}>
                          {cert.txHash.substring(0, 6)}...{cert.txHash.substring(cert.txHash.length - 4)}
                        </span>
                        <button className="view-button">View</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedCertificate && (
        <div className="generation-modal">
          <div className="modal-content">
            <h3>Generating NFT Certificate</h3>
            <p>Processing {selectedCertificate.owner}'s {selectedCertificate.document}...</p>
            <div className="loading-spinner"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;