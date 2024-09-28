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

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const uploadedFilePath = req.file.path;
    const pythonScriptPath = path.join(__dirname, '../storage/scripts/process_file.py');

    // Запускаем Python-процесс
    const pythonProcess = spawn('python', [pythonScriptPath, uploadedFilePath]);

    // Инициализируем переменные для хранения вывода
    let stdoutData = '';
    let stderrData = '';

    // Обрабатываем stdout
    pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
    });

    // Обрабатываем stderr
    pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
    });

    // Ожидаем завершения процесса
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python процесс завершился с кодом ${code}`);
            res.status(500).send('Ошибка скрипта Python.');
            return;
        }

        // Отправляем объединенный вывод
        const fullOutput = stdoutData + stderrData;
        console.log('Вывод Python:', fullOutput.trim());

        // Обработка вывода для извлечения URL скачивания
        const processedFilePath = fullOutput.trim();
        if (!processedFilePath) {
            return res.status(500).send('Не найден путь к обработанному файлу.');
        }

        // Возвращаем URL скачивания клиенту
        res.json({ downloadUrl: `/download/${path.basename(processedFilePath)}` });
    });
});

const fs = require('fs').promises; // Используем промисы для асинхронных операций с файловой системой

// Маршрут для скачивания обработанного файла
app.get('/download/:filename', async (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../storage/processed/', filename);

    console.log(`Download file path: ${filePath}`);

    try {
        // Проверяем существование файла
        await fs.access(filePath);

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
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Читаем содержимое файла
        const fileBuffer = await fs.readFile(filePath);

        // Отправляем файл клиенту
        res.send(fileBuffer);
    } catch (error) {
        console.error(`Error reading or sending file: ${error.message}`);
        res.status(404).send('File not found or could not be read.');
    }
});


// Запуск сервера
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
