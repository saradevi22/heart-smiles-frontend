import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchParticipantById, deleteParticipantNote, deleteParticipantPhoto, removeParticipantFromProgram } from '../services/api';

const ParticipantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadParticipant();
  }, [id]);

  const loadParticipant = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetchParticipantById(id);
      setParticipant(response.data.participant);
    } catch (err) {
      console.error('Error loading participant:', err);
      setError(err?.response?.data?.error || 'Failed to load participant');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading Participant...</h2>
      </div>
    );
  }

  if (error || !participant) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '12px 20px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {error || 'Participant not found'}
        </div>
        <button
          onClick={() => navigate('/participants')}
          style={{
            background: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ← Back to Participants
        </button>
      </div>
    );
  }

  const headshotUrl = participant.headshotPictureUrl?.url || participant.headshotPictureUrl || '';
  const uploadedPhotos = participant.uploadedPhotos || [];
  const notes = participant.notes || [];
  const programDetails = participant.programDetails || [];

  return (
    <div style={{ padding: '20px' }}>
      {success && (
        <div style={{
          background: '#d4edda',
          color: '#155724',
          padding: '12px 20px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #c3e6cb'
        }}>
          ✅ {success}
        </div>
      )}
      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '12px 20px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          ❌ {error}
        </div>
      )}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 5px 0' }}>{participant.name}</h1>
          <button
            onClick={() => navigate('/participants')}
            style={{
              background: 'transparent',
              color: '#667eea',
              border: 'none',
              padding: '5px 0',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'underline'
            }}
          >
            ← Back to Participants
          </button>
        </div>
        {user?.role === 'heartSmiles' && (
          <button
            onClick={() => navigate(`/participants/${id}/edit`)}
            style={{
              background: '#ffc107',
              color: '#333',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Edit Participant
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Basic Information */}
        <div style={{
          background: 'white',
          border: '1px solid #e1e5e9',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333', borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>
            Basic Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <strong style={{ color: '#666', fontSize: '13px' }}>Name:</strong>
              <div style={{ marginTop: '3px', color: '#333' }}>{participant.name}</div>
            </div>
            {participant.dateOfBirth && (
              <div>
                <strong style={{ color: '#666', fontSize: '13px' }}>Date of Birth:</strong>
                <div style={{ marginTop: '3px', color: '#333' }}>
                  {new Date(participant.dateOfBirth).toLocaleDateString()}
                </div>
              </div>
            )}
            {participant.identificationNumber && (
              <div>
                <strong style={{ color: '#666', fontSize: '13px' }}>ID Number:</strong>
                <div style={{ marginTop: '3px', color: '#333' }}>{participant.identificationNumber}</div>
              </div>
            )}
            {participant.school && (
              <div>
                <strong style={{ color: '#666', fontSize: '13px' }}>School:</strong>
                <div style={{ marginTop: '3px', color: '#333' }}>{participant.school}</div>
              </div>
            )}
            {participant.address && (
              <div>
                <strong style={{ color: '#666', fontSize: '13px' }}>Address:</strong>
                <div style={{ marginTop: '3px', color: '#333' }}>{participant.address}</div>
              </div>
            )}
            {participant.referralDate && (
              <div>
                <strong style={{ color: '#666', fontSize: '13px' }}>Referral Date:</strong>
                <div style={{ marginTop: '3px', color: '#333' }}>
                  {new Date(participant.referralDate).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Photo */}
        {headshotUrl && (
          <div style={{
            background: 'white',
            border: '1px solid #e1e5e9',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#333', borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>
              Profile Photo
            </h3>
            <img
              src={headshotUrl}
              alt={`${participant.name} profile`}
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                borderRadius: '8px',
                objectFit: 'contain'
              }}
            />
          </div>
        )}
      </div>

      {/* Programs */}
      {(programDetails.length > 0 || (participant.programs && participant.programs.length > 0)) && (
        <div style={{
          background: 'white',
          border: '1px solid #e1e5e9',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333', borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>
            Programs ({programDetails.length || participant.programs?.length || 0})
          </h3>
          {programDetails.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {programDetails.map((program, index) => (
                <div
                  key={program.id || index}
                  style={{
                    background: '#f8f9fa',
                    padding: '10px 15px',
                    borderRadius: '6px',
                    border: '1px solid #e1e5e9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    position: 'relative',
                    flex: '1 1 250px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#333' }}>{program.name}</div>
                    {program.description && (
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        {program.description.length > 100 
                          ? `${program.description.substring(0, 100)}...`
                          : program.description}
                      </div>
                    )}
                  </div>
                  {user?.role === 'heartSmiles' && (
                    <button
                      onClick={async () => {
                        if (window.confirm(`Are you sure you want to remove this participant from "${program.name}"?`)) {
                          try {
                            await removeParticipantFromProgram(id, program.id);
                            setSuccess('Participant removed from program successfully!');
                            await loadParticipant();
                            setTimeout(() => setSuccess(''), 3000);
                          } catch (err) {
                            setError(err?.response?.data?.error || 'Failed to remove participant from program');
                          }
                        }
                      }}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
              No programs assigned yet.
            </div>
          )}
        </div>
      )}

      {/* Uploaded Photos */}
      {uploadedPhotos.length > 0 && (
        <div style={{
          background: 'white',
          border: '1px solid #e1e5e9',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333', borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>
            Uploaded Photos ({uploadedPhotos.length})
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {uploadedPhotos.map((photo, index) => (
              <div key={photo.id || index} style={{ position: 'relative' }}>
                <img
                  src={photo.url}
                  alt={`Photo ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    border: '1px solid #e1e5e9'
                  }}
                />
                {user?.role === 'heartSmiles' && (
                  <button
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this photo?')) {
                        try {
                          await deleteParticipantPhoto(id, photo.id);
                          setSuccess('Photo deleted successfully!');
                          await loadParticipant();
                          setTimeout(() => setSuccess(''), 3000);
                        } catch (err) {
                          setError(err?.response?.data?.error || 'Failed to delete photo');
                        }
                      }
                    }}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(220, 53, 69, 0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}
                    title="Delete photo"
                  >
                    ×
                  </button>
                )}
                {(photo.caption || photo.activity) && (
                  <div style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#666'
                  }}>
                    {photo.caption && <div><strong>Caption:</strong> {photo.caption}</div>}
                    {photo.activity && <div><strong>Activity:</strong> {photo.activity}</div>}
                    {photo.uploadedAt && (
                      <div style={{ marginTop: '3px', fontSize: '11px', color: '#999' }}>
                        {photo.uploadedAt.seconds 
                          ? new Date(photo.uploadedAt.seconds * 1000).toLocaleDateString()
                          : new Date(photo.uploadedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div style={{
        background: 'white',
        border: '1px solid #e1e5e9',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#333', borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>
          Notes ({notes.length})
        </h3>
        {notes.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {notes.map((note, index) => (
              <div
                key={note.id || index}
                style={{
                  background: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '6px',
                  border: '1px solid #e1e5e9',
                  position: 'relative'
                }}
              >
                {user?.role === 'heartSmiles' && (
                  <button
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this note?')) {
                        try {
                          await deleteParticipantNote(id, note.id);
                          setSuccess('Note deleted successfully!');
                          await loadParticipant();
                          setTimeout(() => setSuccess(''), 3000);
                        } catch (err) {
                          setError(err?.response?.data?.error || 'Failed to delete note');
                        }
                      }
                    }}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 10px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '500', color: '#333' }}>
                    {note.author || 'Staff Member'}
                  </div>
                  {note.createdAt && (
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {(() => {
                        try {
                          // Handle Firestore Timestamp format
                          if (note.createdAt && typeof note.createdAt === 'object') {
                            if (note.createdAt.seconds) {
                              return new Date(note.createdAt.seconds * 1000).toLocaleDateString();
                            } else if (note.createdAt.toDate) {
                              return note.createdAt.toDate().toLocaleDateString();
                            } else if (note.createdAt._seconds) {
                              return new Date(note.createdAt._seconds * 1000).toLocaleDateString();
                            }
                          }
                          // Handle Date object or ISO string
                          const date = new Date(note.createdAt);
                          if (!isNaN(date.getTime())) {
                            return date.toLocaleDateString();
                          }
                          return 'Invalid Date';
                        } catch (e) {
                          console.error('Error formatting note date:', e, note.createdAt);
                          return 'Invalid Date';
                        }
                      })()}
                    </div>
                  )}
                </div>
                {note.type && (
                  <div style={{
                    display: 'inline-block',
                    background: '#667eea',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    marginBottom: '8px'
                  }}>
                    {note.type}
                  </div>
                )}
                <div style={{ color: '#333', lineHeight: '1.6' }}>{note.content}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
            No notes yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantDetail;

