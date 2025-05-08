import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../admincss/UploadForm.css';

const UploadForm = () => {
  const [formData, setFormData] = useState({
    file: null,
    category: 'diploma',
    year: new Date().getFullYear().toString(),
    ownerName: '',
    ownerEmail: '',
    universityName: '',
    fieldOfStudy: '',
  });
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false,
    documentId: null,
    contentHash: null
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) return;
    
    setStatus({ ...status, loading: true, error: null });

    try {
      const formPayload = new FormData();
      formPayload.append('document', formData.file);
      formPayload.append('category', formData.category);
      formPayload.append('year', formData.year);
      formPayload.append('ownerName', formData.ownerName);
      formPayload.append('ownerEmail', formData.ownerEmail);
      formPayload.append('universityName', formData.universityName);
      formPayload.append('fieldOfStudy', formData.fieldOfStudy);

      
     const response = await axios.post('http://localhost:3001/admin/register', formPayload, {
        headers: {
          'Authorization': 'Bearer thisprojecthasntbeeneasy',
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      });
      
      

      setStatus({
        loading: false,
        success: true,
        error: null,
        documentId: response.data.documentId,
        contentHash: response.data.contentHash
      });

      setFormData({
        ...formData,
        file: null,
        ownerName: '',
        ownerEmail: '',
        universityName: '',
        fieldOfStudy: ''
      });

    } catch (error) {
      console.error('Registration Error:', error);
      if (error.response?.status === 401) {
        navigate('/admin');
      }
      setStatus({
        ...status,
        loading: false,
        error: error.response?.data?.error || 'Failed to register document'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'file' ? files[0] : value
    }));
  };

  return (
    <div className="upload-form-container">
      <h2>Register New Academic Document</h2>
      
      {status.error && (
        <div className="alert alert-error">
          {status.error}
        </div>
      )}
      
      {status.success && (
        <div className="alert alert-success">
          <p>Document registered successfully!</p>
          <div className="document-details">
            <p><strong>Document ID:</strong> {status.documentId}</p>
            <p><strong>Content Hash:</strong> 
              <code className="hash">{status.contentHash}</code>
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="document-form">
        <div className="form-group">
          <label htmlFor="file">Document File (PDF only, max 5MB)</label>
          <input
            id="file"
            type="file"
            name="file"
            onChange={handleChange}
            accept=".pdf,application/pdf"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Document Type</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="diploma">Diploma</option>
              <option value="degree">Degree</option>
              <option value="masters">Master's</option>
              <option value="phd">PhD</option>
              <option value="certificate">Certificate</option>
              <option value="transcript">Transcript</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="year">Year Issued</label>
            <input
              id="year"
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear()}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ownerName">Owner's Full Name</label>
            <input
              id="ownerName"
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ownerEmail">Owner's Email</label>
            <input
              id="ownerEmail"
              type="email"
              name="ownerEmail"
              value={formData.ownerEmail}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="universityName">Institution Name</label>
          <input
            id="universityName"
            type="text"
            name="universityName"
            value={formData.universityName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fieldOfStudy">Field of Study</label>
          <input
            id="fieldOfStudy"
            type="text"
            name="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={handleChange}
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={status.loading}
        >
          {status.loading ? (
            <>
              <span className="spinner"></span>
              Registering...
            </>
          ) : (
            'Register Document'
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;