import { useState } from 'react';
import Navbar from '../../components/navbar/Navbar';

export default function Presentations() {
    const [file, setFile] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Сохраняем выбранный файл
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3001/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('File uploaded successfully:', data);
                setDownloadUrl(data.downloadUrl);  // Сохраняем ссылку на скачивание
                console.log('Download URL:', data.downloadUrl);  // Логируем
            } else {
                const errorText = await response.text(); // Получаем текст ошибки
                console.error('File upload failed:', errorText);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <h1>Добро пожаловать на страницу презентаций!</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} required />
                <button type="submit">Загрузить файл</button>
            </form>

            {/* Отображаем ссылку на скачивание, если она доступна */}
            {downloadUrl && (
                <div>
                    {/* Измените здесь, чтобы включить полный URL */}
                    <a href={`http://localhost:3001${downloadUrl}`} download>
                        Скачать обработанный файл
                    </a>
                </div>
            )}
        </div>
    );
}
