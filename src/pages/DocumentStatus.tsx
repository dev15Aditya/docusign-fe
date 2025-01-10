import React from 'react';
import './DocumentStatus.css';

type Status = {
  hasUploaded: boolean;
  hasAccepted: boolean;
  uploadTimestamp?: string | null;
  acceptanceTimestamp?: string | null;
};

type UploadedDocument = {
  type: string;
  upload_timestamp: string;
  file_uri: string;
};

type Participant = {
  name: string;
  email: string;
  role: string;
  status: Status;
};

type Props = {
  documentId: string;
  status: string;
  participants: Participant[];
  files: { primary: string; secondary: string };
  currentUser: {
    role: string;
    name: string;
    status: Status;
    uploaded_documents: UploadedDocument[];
  };
};

const DocumentStatus: React.FC<Props> = ({ participants, files, currentUser }) => {
  return (
    <div className="document-container">
      <h1 className="document-title">Document Details</h1>
      <div className="current-user-section">
        <h2 className="section-title">Current User</h2>
        <p>Name: {currentUser.name}</p>
        <p>Role: {currentUser.role}</p>
        <p>Status: {currentUser.status?.hasUploaded ? 'Uploaded' : 'Not Uploaded'}</p>
        <div className="uploaded-documents">
          <h3 className="section-subtitle">Uploaded Documents:</h3>
          <div className="document-previews">
            {(currentUser?.uploaded_documents || []).map((doc, index) => (
              <div key={index} className="document-card">
                <a href={doc.file_uri} target="_blank" rel="noopener noreferrer">
                  <img
                    src={doc.file_uri}
                    alt={doc.type}
                    className="document-thumbnail"
                  />
                </a>
                <p className="document-info">Type: {doc.type}</p>
                <p className="document-info">Uploaded At: {doc.upload_timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="participants-section">
        <h2 className="section-title">Participants</h2>
        <table className="participants-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Uploaded</th>
              <th>Accepted</th>
              <th>File Preview</th>
            </tr>
          </thead>
          <tbody>
            {(participants || []).map((participant, index) => (
              <tr key={index}>
                <td>{participant.name}</td>
                <td>{participant.email}</td>
                <td>{participant.role}</td>
                <td>{participant.status.hasUploaded ? 'Yes' : 'No'}</td>
                <td>{participant.status.hasAccepted ? 'Yes' : 'No'}</td>
                <td>
                  {files.primary && participant.status.hasUploaded ? (
                    <a
                      href={files.primary}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-link"
                    >
                      View File
                    </a>
                  ) : (
                    'No File'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentStatus;