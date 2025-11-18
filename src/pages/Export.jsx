import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { exportParticipantsCsv } from '../services/api';
import api from '../services/api';

const Export = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [exportType, setExportType] = useState('participants');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      let response;
      let filename;

      if (exportType === 'participants') {
        response = await exportParticipantsCsv();
        filename = `participants_${new Date().toISOString().split('T')[0]}.csv`;
      } else if (exportType === 'programs') {
        response = await api.get('/export/programs', { responseType: 'blob' });
        filename = `programs_${new Date().toISOString().split('T')[0]}.csv`;
      } else {
        response = await api.get('/export/combined', { responseType: 'blob' });
        filename = `combined_data_${new Date().toISOString().split('T')[0]}.csv`;
      }

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Export error:', err);
      setError(err?.response?.data?.error || 'Export failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Export Data</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Export participant and program data to CSV format for Qualtrics upload and reporting.
      </p>

      <div style={{
        background: 'white',
        border: '1px solid #e1e5e9',
        borderRadius: '8px',
        padding: '30px',
        maxWidth: '600px'
      }}>
        <h3 style={{ margin: '0 0 20px 0' }}>Export Options</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Export Type
          </label>
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="participants">Participants Only</option>
            <option value="programs">Programs Only</option>
            <option value="combined">Combined Data</option>
          </select>
          <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
            {exportType === 'participants' && 'Export all participant data (excluding images)'}
            {exportType === 'programs' && 'Export all program data'}
            {exportType === 'combined' && 'Export participants and programs in a combined format'}
          </p>
        </div>

        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '10px 15px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '10px 15px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #c3e6cb'
          }}>
            ✅ Export completed successfully! File downloaded.
          </div>
        )}

        <button
          onClick={handleExport}
          disabled={loading}
          style={{
            background: loading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            width: '100%',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Exporting...' : `Export ${exportType.charAt(0).toUpperCase() + exportType.slice(1)}`}
        </button>

        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '13px',
          color: '#666'
        }}>
          <strong>Note:</strong> The exported CSV file is formatted for Qualtrics upload. Images are excluded from the export. 
          The file will be named with today's date for easy organization.
        </div>
      </div>
    </div>
  );
};

export default Export;
