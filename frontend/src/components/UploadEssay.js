import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/UploadEssay.css';
import { FaUpload, FaSpinner } from 'react-icons/fa';  // Import only used icons

const UploadEssay = () => {
    const [file, setFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [aiOrHuman, setAiOrHuman] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (loading && progress < 100) {
            const interval = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress < 90) {
                        return prevProgress + 10;
                    }
                    return prevProgress;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [loading, progress]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setError('');
            setLoading(true);
            setProgress(0);
            setStatus('Uploading image to server...');

            const uploadResponse = await axios.post('http://127.0.0.1:5000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percent);
                }
            });

            setStatus('Processing image with AWS Textract...');
            setProgress(50);

            // Simulate delay and set progress to 100 when done
            setTimeout(() => {
                setProgress(100);
                setExtractedText(uploadResponse.data.extracted_text);
                setAiOrHuman(uploadResponse.data.ai_or_human);
                setLoading(false);
                setStatus('Prediction complete!');
            }, 3000);
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to upload the image. Please try again.');
            setLoading(false);
            setProgress(0);
            setStatus('');
        }
    };

    return (
        <center>
        <div className="upload-page">
            <header>
            </header>
            <div className="upload-container">
                <h2><FaUpload /> Upload Your Essay Image</h2> {/* Removed the duplicate title here */}
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? <FaSpinner className="loading-icon" /> : <FaUpload />} Upload and Check
                </button>
                {loading && (
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                )}
                {status && <p>{status}</p>}
                {error && <div className="error-message">{error}</div>}
            </div>
            
            <div className="results-container">
                {extractedText && (
                    <div className="extracted-text">
                        <h3>Extracted Text:</h3>
                        <p>{extractedText}</p>
                    </div>
                )}
                {aiOrHuman && (
                    <div className="prediction">
                        <h3>Prediction:</h3>
                        <p>{aiOrHuman}</p>
                    </div>
                )}
            </div>
        </div>
        </center>
    );
};

export default UploadEssay;
