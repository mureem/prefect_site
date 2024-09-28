import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/Navbar';
import styles from './presentations.module.css';

const PresentationUpload = () => {
    const [file, setFile] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(10);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3001/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Ошибка при загрузке файла:', errorText);
                alert('Произошла ошибка при загрузке файла');
                return;
            }

            const data = await response.json();
            console.log('Файл загружен успешно:', data);

            // Проверяем корректность downloadUrl
            if (data.downloadUrl && typeof data.downloadUrl === 'string') {
                setDownloadUrl(data.downloadUrl);
                setUploadProgress(100);
                alert('Файл успешно загружен!');
            } else {
                throw new Error('Некорректный downloadUrl');
            }
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
            alert('Произошла ошибка при загрузке файла');
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        if (file) {
            document.title = `Загрузка презентации (${Math.floor((uploadProgress || 0) / 10)}%)`;
        }
    }, [file, uploadProgress]);

    return (
        <div className={styles.container}>
            <Navbar />
            <h1>Загрузка презентации</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    onChange={handleFileChange}
                    required
                    accept=".ppt,.pptx,.pdf"
                />
                <button type="submit" disabled={!file}>{isUploading ? 'Загрузка...' : 'Загрузить файл'}</button>
            </form>

            {downloadUrl && typeof downloadUrl === 'string' && (
                <div className={styles.downloadLink}>
                    <a href={`${process.env.REACT_APP_API_URL}${downloadUrl}`} download>
                        Скачать обработанный файл
                    </a>
                </div>
            )}

            {uploadProgress > 0 && (
                <div className={styles.progressBar}>
                    <span style={{ width: `${uploadProgress}%` }}>{uploadProgress}%</span>
                </div>
            )}
        </div>
    );
};

export default PresentationUpload;
