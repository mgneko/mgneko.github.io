import pandas as pd
import json
import os

INPUT_FILE = os.path.join(".", "webcrawler", "data", "5_servents.xlsx")
OUTPUT_FILE = os.path.join(".", "servants_mapping.json")

CLASS_ORDER = [
    'saber', 'archer', 'lancer', 'rider', 'caster', 'assassin', 'berserker',
    'ruler', 'avenger', 'alterego', 'foreigner', 'mooncancer', 'pretender', 
    'beast', 'unbeast', 'shielder'
]

def generate_servant_json():
    if not os.path.exists(INPUT_FILE):
        print(f"Error: Input file not found at {INPUT_FILE}")
        print("Please ensure the file exists in the specified directory.")
        return

    try:
        print(f"Reading data from {INPUT_FILE}...")
        df = pd.read_excel(INPUT_FILE)

        temp_servant_dict = {}

        for index, row in df.iterrows():
            try:
                collection_no = str(row['collectionNo']).strip() if pd.notna(row['collectionNo']) else ""
                class_name = str(row['className']).strip().lower() if pd.notna(row['className']) else "" # 轉小寫以利比對

                # Check for TW name first, fallback to JP name
                name_tw = str(row['name_TW']).strip() if pd.notna(row['name_TW']) else ""
                name_jp = str(row['name_JP']).strip() if pd.notna(row['name_JP']) else ""

                name = name_tw if name_tw else name_jp

                if not collection_no or not class_name:
                    print(f"Warning: Row {index + 2} skipped due to missing ID or Class.")
                    continue
                if not name:
                    print(f"Warning: Row {index + 2} (ID: {collection_no}) skipped due to missing name.")
                    continue

                if class_name not in temp_servant_dict:
                    temp_servant_dict[class_name] = {}

                temp_servant_dict[class_name][collection_no] = name

            except Exception as e:
                 print(f"Warning: Error processing row {index + 2}: {e}")
                 continue

        sorted_servant_dict = {}

        # 1. 先加入在預定義順序列表中的職階
        for cls in CLASS_ORDER:
            if cls in temp_servant_dict:
                # 可以選擇將職階名稱轉回首字母大寫，讓輸出更美觀，或者維持小寫。這裡示範轉回首字母大寫
                capitalized_cls = cls.capitalize() 
                sorted_servant_dict[capitalized_cls] = temp_servant_dict[cls]

        # 2. 再加入不在列表中的其他職階
        for cls, servants in temp_servant_dict.items():
            if cls not in CLASS_ORDER:
                 capitalized_cls = cls.capitalize() if cls else "Unknown"
                 sorted_servant_dict[capitalized_cls] = servants

        os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

        print(f"Writing data to {OUTPUT_FILE}...")
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(sorted_servant_dict, f, ensure_ascii=False, indent=4)

        print("Successfully generated JSON mapping!")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    generate_servant_json()