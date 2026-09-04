import sys
import os
from PIL import Image, ImageDraw, ImageFilter

def process_image(img_path, color_arg=None):
    if not os.path.exists(img_path):
        print(f"錯誤：找不到圖片 {img_path}")
        sys.exit(1)

    output_dir = "./images/servents"
    os.makedirs(output_dir, exist_ok=True)

    base_name = os.path.basename(img_path)
    name, _ = os.path.splitext(base_name)
    out_path = os.path.join(output_dir, f"{name}.png")

    color_map = {
        '0': (237, 28, 36), 'r': (237, 28, 36),
        '1': (34, 177, 76), 'g': (34, 177, 76),
        '2': (163, 73, 164), 'p': (163, 73, 164)
    }

    try:
        # 開啟原圖
        img = Image.open(img_path).convert("RGB")
        width, height = img.size

        if color_arg is not None:
            if color_arg not in color_map:
                print("錯誤：顏色參數必須為 0, 1, 2 或 r, g, p")
                sys.exit(1)

            border_color = color_map[color_arg]

            draw = ImageDraw.Draw(img)
            # 換算 50x50 下為 2 像素的外框
            border_thickness = max(int(width * (2 / 50)), 1)

            for i in range(border_thickness):
                draw.rectangle([i, i, width - 1 - i, height - 1 - i], outline=border_color)

        # 縮放至 50x50 (使用 LANCZOS 確保無鋸齒)
        final_img = img.resize((50, 50), Image.Resampling.LANCZOS)

        # 增加微幅遮罩銳化 (Unsharp Mask)，解決縮小後產生的柔和/模糊感，提升視覺畫質
        final_img = final_img.filter(ImageFilter.UnsharpMask(radius=1, percent=100, threshold=3))

        # 存檔設定：
        # compress_level=1 (降低壓縮率增加檔案大小，範圍0-9)
        # optimize=False (不進行額外壓縮最佳化)
        # dpi=(96, 96) (模擬 Windows 小畫家預設解析度)
        final_img.save(out_path, compress_level=1, optimize=False, dpi=(96, 96))

        print(f"處理成功：{out_path}")

    except Exception as e:
        print(f"錯誤：{e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2 or len(sys.argv) > 3:
        print("Usage: python color.py [img.png] [0~2/r/g/p (optional)]")
        sys.exit(1)

    img_path = sys.argv[1]
    color_arg = sys.argv[2].lower() if len(sys.argv) == 3 else None
    process_image(img_path, color_arg)