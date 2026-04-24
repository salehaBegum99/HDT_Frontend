import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useApplication } from '../context/ApplicationContext';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import './DocumentUploadPage.css';
import './FormPage.css';

// ── Match backend documents model exactly ──
const DOCUMENT_TYPES = [
  { key: 'photo',        label: 'Passport Photo',       required: true,  accept: '.jpg,.jpeg,.png' },
  { key: 'aadhaarCard',  label: 'Aadhaar Card',          required: true,  accept: '.pdf,.jpg,.jpeg,.png' },
  { key: 'marksheet',    label: 'Latest Marksheet',      required: true,  accept: '.pdf,.jpg,.jpeg,.png' },
  { key: 'incomeProof',  label: 'Income Proof',          required: true,  accept: '.pdf,.jpg,.jpeg,.png' },
  { key: 'bankPassbook', label: 'Bank Passbook',         required: true,  accept: '.pdf,.jpg,.jpeg,.png' },
  { key: 'feeReceipt',   label: 'Fee Receipt',           required: false, accept: '.pdf,.jpg,.jpeg,.png' },
];

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const UploadStatus = { IDLE: 'idle', UPLOADING: 'uploading', SUCCESS: 'success', ERROR: 'error' };

const DocumentUploadItem = ({ docType, onFileChange }) => {
  const [file, setFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      setErrorMsg('File type not supported');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMsg('File exceeds 10MB limit');
      return;
    }

    // ✅ Just store in state + context, NO upload yet
    setFile(selectedFile);
    setErrorMsg('');
    onFileChange(docType.key, selectedFile);
  };

  const handleRemove = () => {
    setFile(null);
    setErrorMsg('');
    onFileChange(docType.key, null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="doc-item">
      <div className="doc-item__header">
        <span className="doc-item__label">{docType.label}</span>
        {docType.required && <Badge variant="default">Required</Badge>}
      </div>

      {file ? (
        // ✅ Show selected file (not uploaded yet)
        <div className="doc-item__uploaded">
          <div className="doc-item__file-info">
            <FileText size={18} className="doc-item__file-icon" />
            <div>
              <p className="doc-item__filename">{file.name}</p>
              <p className="doc-item__meta">{formatSize(file.size)}</p>
            </div>
            <Badge variant="default" size="sm">Ready</Badge>
            <button className="doc-item__remove-btn" onClick={handleRemove}>
              <Trash2 size={15} />
            </button>
          </div>
          <p className="doc-item__success-text">
            <CheckCircle size={14} /> File selected — will upload on submit
          </p>
        </div>
      ) : (
        <div
  className={`doc-item__dropzone ...`}
  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
  onDragLeave={() => setDragging(false)}
  onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
  onClick={() => inputRef.current?.click()}
  role="button"
  tabIndex={0}
>
  <Upload size={22} className="doc-item__upload-icon" />
  <p className="doc-item__drop-text">Drag & drop or click to select</p>
  
  {/* ❌ Remove this button — it's causing double click */}
  {/* <span className="doc-item__select-btn">Select File</span> */}
  
  {/* ✅ Replace with plain span, no click handler */}
  <span className="doc-item__select-btn">Select File</span>

  {errorMsg && (
    <p className="doc-item__error-text"><XCircle size={13} /> {errorMsg}</p>
  )}

  <input
    ref={inputRef}
    type="file"
    accept={docType.accept}
    className="doc-item__file-input"
    onChange={(e) => {
      e.stopPropagation(); // ← Add this
      handleFile(e.target.files[0]);
    }}
  />
</div>
      )}
    </div>
  );
};

const DocumentUploadPage = () => {
  const navigate = useNavigate();
  const { setDocument, documents } = useApplication();

  // Check all required docs uploaded
  const requiredKeys = DOCUMENT_TYPES.filter(d => d.required).map(d => d.key);
  const allRequiredUploaded = requiredKeys.every(key => documents[key] !== null);

  return (
    <PageLayout headerProps={{ showBack: true, title: 'Upload Documents' }}>
      <div className="doc-upload-page">
        <div className="doc-upload-page__intro">
          <h1 className="doc-upload-page__title">Document Upload</h1>
          <p className="doc-upload-page__desc">
            Please upload all required documents. Max file size: 10MB each.
          </p>
        </div>

        <div className="doc-upload-page__list">
          {DOCUMENT_TYPES.map((doc) => (
            <DocumentUploadItem key={doc.key} docType={doc} onFileChange={setDocument} />
          ))}
        </div>

        {!allRequiredUploaded && (
          <p style={{ color: '#e53e3e', fontSize: '13px', textAlign: 'center', marginBottom: '12px' }}>
            Please upload all required documents to continue.
          </p>
        )}

        <Button
          variant="primary" fullWidth size="lg"
          disabled={!allRequiredUploaded}
          onClick={() => navigate('/apply/consent')}
        >
          Continue to Consent &amp; Privacy
        </Button>
      </div>
    </PageLayout>
  );
};

export default DocumentUploadPage;