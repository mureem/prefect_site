const express = require('express');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const cors = require('./cors/cors'); // Импортируем конфигурацию CORS

const app = express();
const port = process.env.PORT || 3001;

app.use(cors); // Включаем CORS для всех маршрутов

// Настройка Multer для загрузки файлов с оригинальными именами
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../storage/uploads/'));  // Путь для сохранения загруженных файлов
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);  // Сохраняем файл с оригинальным именем
    }
});

const upload = multer({ storage });

// Маршрут для загрузки и обработки файлов
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const uploadedFilePath = req.file.path;
    const pythonScriptPath = path.join(__dirname, '../storage/scripts/process_file.py');

    // Запуск Python-скрипта
    const pythonProcess = spawn('python', [pythonScriptPath, uploadedFilePath]);

    // Обработка вывода Python-скрипта
    pythonProcess.stdout.on('data', (data) => {
        console.log(`Python output: ${data.toString()}`);  // Логируем вывод Python
        const processedFilePath = data.toString().trim();

        if (!processedFilePath) {
            return res.status(500).send('No processed file path returned.');
        }

        // Возвращаем клиенту путь для скачивания файла
        res.json({ downloadUrl: `/download/${path.basename(processedFilePath)}` });
    });

    // Обработка ошибок, если они есть
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error from Python script: ${data.toString()}`);
        res.status(500).send('Error processing file.');
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python process exited with code ${code}`);
            res.status(500).send('Python script error.');
        }
    });
});

const fs = require('fs');

// Маршрут для скачивания обработанного файла
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../storage/processed/', filename);

    console.log(`Download file path: ${filePath}`); // Лог для проверки пути

    // Определяем расширение файла
    const extension = path.extname(filename);

    // Устанавливаем MIME-тип в зависимости от расширения
    let mimeType = 'application/octet-stream';  // По умолчанию - бинарные данные
    if (extension === '.txt') {
        mimeType = 'text/plain';
    } else if (extension === '.pdf') {
        mimeType = 'application/pdf';
    }

    res.setHeader('Content-Type', mimeType);
    res.download(filePath, filename, (err) => {
        if (err) {
            console.error(`Error downloading file: ${err}`);
            res.status(404).send('File not found.');
        }
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
