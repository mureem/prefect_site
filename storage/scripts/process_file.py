import os
import sys
import logging
import fitz  # PyMuPDF
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
# Аннотирование PDF-файлов
def annotate_pdf(input_path, search_words, output_dir):
    try:
        pdf_document = fitz.open(input_path)
        total_v_count = 0
        all_text_instances = []

        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            for word in search_words:
                text_instances = page.search_for(word)  # Поиск с учетом регистра
                text_instances = [inst for inst in text_instances if page.get_text("text", clip=inst).strip() == word]
                total_v_count += len(text_instances)
                all_text_instances.extend([(page_num, inst, word) for inst in text_instances])

        current_v_count = total_v_count
        for page_num, inst, word in all_text_instances:
            page = pdf_document.load_page(page_num)

            circle_center = fitz.Point(inst.x0 - 14, inst.y1 - 7)
            radius = 10
            circle = fitz.Rect(circle_center.x - radius, circle_center.y - radius,
                               circle_center.x + radius, circle_center.y + radius)

            page.draw_circle(circle_center, radius, color=(1, 1, 0), fill=(1, 1, 0))
            page.draw_circle(circle_center, radius, color=(1, 0, 0), width=1.5)

            annotation_text = f"{current_v_count}"
            text_position = fitz.Point(circle_center.x - 6.0 * len(annotation_text) / 2, circle_center.y + 4)
            page.insert_text(text_position, annotation_text, fontsize=12, color=(1, 0, 0), fontname="Times-Bold")

            current_v_count -= 1

        # Первая страница
        first_page = pdf_document.load_page(0)
        radius_first = 15
        circle_center_first = fitz.Point(first_page.rect.width - radius_first - 20, radius_first + 20)
        first_page.draw_circle(circle_center_first, radius_first, color=(1, 1, 0), fill=(1, 1, 0))
        first_page.draw_circle(circle_center_first, radius_first, color=(1, 0, 0), width=1.5)

        # Добавление счётчика по центру круга
        annotation_text_first = f"{total_v_count}"
        text_position_first = fitz.Point(circle_center_first.x - 9.0 * len(annotation_text_first) / 2, circle_center_first.y + 6)
        first_page.insert_text(text_position_first, annotation_text_first, fontsize=18, color=(1, 0, 0), fontname="Times-Bold")

        base = os.path.basename(input_path)
        output_base = f"annotated_{base}"  # Изменение названия файла
        output_path = os.path.join(output_dir, output_base)

        pdf_document.save(output_path)
        pdf_document.close()
        logging.info(f"Успешно аннотирован файл: {output_path}")
    except Exception as e:
        logging.error(f"Ошибка при аннотировании {input_path}: {e}")

# Обработка файла
def process_file(file_path, search_words, output_dir):
    output_path = os.path.join(output_dir, os.path.basename(file_path))

    if file_path.endswith('.pdf'):
        logging.info(f"Обработка файла: {file_path}")
        annotate_pdf(file_path, search_words, output_dir)

# Основной код
search_words = ["ТинАО", "ТАО", "ТиНАО", "ТРОИЦКИЙ И НОВОМОСКОВСКИЙ АДМИНИСТРАТИВНЫЕ ОКРУГА"]

def main():
    input_file = sys.argv[1]  # Получаем путь к файлу из аргументов командной строки
    # Измените путь к выходной директории
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'processed')

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    process_file(input_file, search_words, output_dir)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()
