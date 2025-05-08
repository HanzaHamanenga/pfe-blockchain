import React, { useState, useEffect } from 'react';
import '../admincss/Documents.css';

const Documents = ({ actor }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await actor.getMyDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [actor]);

  if (loading) return <div className="loading">Loading documents...</div>;

  return (
    <div className="documents-container">
      <h2>My Documents</h2>
      {documents.length === 0 ? (
        <p>No documents found</p>
      ) : (
        <table className="documents-table">
          <thead>
            <tr>
              <th>Document ID</th>
              <th>Category</th>
              <th>Field of Study</th>
              <th>University</th>
              <th>IPFS Hash</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{doc.metadata.category}</td>
                <td>{doc.metadata.fieldOfStudy}</td>
                <td>{doc.metadata.universityName}</td>
                <td className="hash-cell">
                  <a 
                    href={`https://ipfs.io/ipfs/${doc.ipfsHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {doc.ipfsHash.substring(0, 10)}...
                  </a>
                </td>
                <td>{new Date(doc.timestamp/1000000).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Documents;