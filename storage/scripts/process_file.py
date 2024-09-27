import sys
import os

def process_file(file_path):
    try:
        # Здесь может быть любая логика обработки файла
        with open(file_path, 'r') as file:
            data = file.read()

        # Пример изменения файла (можно заменить любой другой операцией)
        processed_data = data.upper()

        # Определяем абсолютный путь для сохранения обработанного файла
        script_dir = os.path.dirname(os.path.abspath(__file__))
        output_path = os.path.join(script_dir, '../processed', os.path.basename(file_path))
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        # Сохраняем изменённый файл
        with open(output_path, 'w') as file:
            file.write(processed_data)

        print(output_path)  # Выводим путь к обработанному файлу для дальнейшего использования
    except Exception as e:
        print(f"Error processing file: {e}", file=sys.stderr)

if __name__ == "__main__":
    file_path = sys.argv[1]  # Получаем путь к файлу из аргументов командной строки
    process_file(file_path)