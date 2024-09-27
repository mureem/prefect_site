const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3000', // Разрешаем только этот источник
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Разрешаем использование куки
    optionsSuccessStatus: 204, // Для старых браузеров
};

module.exports = cors(corsOptions); // Экспортируем настроенный CORS
