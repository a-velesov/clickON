#!/usr/bin/env python3
"""
Простой генератор иконок для расширения ClickON
Создает базовые PNG иконки без дополнительных зависимостей
Требует: Python 3 и библиотеку Pillow
Установка: pip install Pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
except ImportError:
    print("❌ Библиотека Pillow не установлена!")
    print("Установите её командой: pip install Pillow")
    exit(1)

def create_icon(size):
    """Создает иконку указанного размера"""
    # Создаем изображение с градиентом
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Рисуем скругленный прямоугольник (фон)
    radius = int(size * 0.1875)  # 24/128
    
    # Градиент от фиолетового к пурпурному
    for y in range(size):
        # Интерполяция цвета
        ratio = y / size
        r = int(102 + (118 - 102) * ratio)
        g = int(126 + (75 - 126) * ratio)
        b = int(234 + (162 - 234) * ratio)
        color = (r, g, b, 255)
        draw.line([(0, y), (size, y)], fill=color)
    
    # Создаем маску для скругленных углов
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([(0, 0), (size-1, size-1)], radius=radius, fill=255)
    
    # Применяем маску
    img.putalpha(mask)
    
    # Рисуем курсор мыши (белый)
    scale = size / 128
    points = [
        (int(40*scale), int(25*scale)),
        (int(40*scale), int(80*scale)),
        (int(50*scale), int(70*scale)),
        (int(58*scale), int(90*scale)),
        (int(68*scale), int(86*scale)),
        (int(60*scale), int(66*scale)),
        (int(75*scale), int(66*scale)),
    ]
    
    # Тень курсора
    shadow_points = [(x+2, y+2) for x, y in points]
    draw.polygon(shadow_points, fill=(0, 0, 0, 80))
    
    # Курсор
    draw.polygon(points, fill=(255, 255, 255, 255), outline=(51, 51, 51, 255))
    
    # Зеленый круг с галочкой
    circle_center = (int(90*scale), int(90*scale))
    circle_radius = int(22*scale)
    
    # Тень круга
    draw.ellipse([
        circle_center[0] - circle_radius + 2,
        circle_center[1] - circle_radius + 2,
        circle_center[0] + circle_radius + 2,
        circle_center[1] + circle_radius + 2
    ], fill=(0, 0, 0, 60))
    
    # Зеленый круг
    draw.ellipse([
        circle_center[0] - circle_radius,
        circle_center[1] - circle_radius,
        circle_center[0] + circle_radius,
        circle_center[1] + circle_radius
    ], fill=(76, 175, 80, 255))
    
    # Белая галочка
    check_width = max(2, int(4*scale))
    check_points = [
        (int(80*scale), int(90*scale)),
        (int(87*scale), int(97*scale)),
        (int(100*scale), int(82*scale))
    ]
    
    # Рисуем галочку линиями
    draw.line([check_points[0], check_points[1]], fill=(255, 255, 255, 255), width=check_width)
    draw.line([check_points[1], check_points[2]], fill=(255, 255, 255, 255), width=check_width)
    
    return img

def main():
    """Основная функция"""
    print("🎨 Создание иконок для расширения ClickON...\n")
    
    # Создаем папку icons, если её нет
    icons_dir = "icons"
    if not os.path.exists(icons_dir):
        os.makedirs(icons_dir)
        print(f"📁 Создана папка {icons_dir}/")
    
    # Размеры иконок
    sizes = [16, 32, 48, 128]
    
    # Создаем иконки
    for size in sizes:
        try:
            icon = create_icon(size)
            filename = os.path.join(icons_dir, f"icon{size}.png")
            icon.save(filename, "PNG")
            print(f"✅ Создана иконка {size}x{size}: {filename}")
        except Exception as e:
            print(f"❌ Ошибка при создании иконки {size}x{size}: {e}")
    
    print("\n✨ Генерация завершена!")
    print(f"📁 Иконки сохранены в папке {icons_dir}/")
    print("\n💡 Теперь можете установить расширение в Chrome!")
    print("   Инструкции: см. README.md или INSTALLATION_RU.md")

if __name__ == "__main__":
    main()


