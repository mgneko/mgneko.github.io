import requests
import pandas as pd
import re
import unicodedata
from bs4 import BeautifulSoup

# 職階對照表
CLASS_NAME_MAP = {
    "セイバー": "Saber", "アーチャー": "Archer", "ランサー": "Lancer",
    "ライダー": "Rider", "キャスター": "Caster", "アサシン": "Assassin",
    "バーサーカー": "Berserker", "ルーラー": "Ruler", "アヴェンジャー": "Avenger",
    "ムーンキャンサー": "Mooncancer", "アルターエゴ": "Alterego",
    "フォーリナー": "Foreigner", "プリテンダー": "Pretender",
    "ビースト": "Beast", "アンビースト": "Unbeast", "シールダー": "Shielder",
}

# 特殊名稱修正表
NAME_UPDATES = {
    "巌窟王 エドモン･ダンテス": "巌窟王",
    "ジェームズ･モリアーティ(新宿のアーチャー)": "ジェームズ・モリアーティ",
    "魔王信長(織田信長)": "魔王信長",
    "グレゴリー･ラスプーチン": "言峰綺礼",
    "武田信玄(武田晴信)": "武田晴信",
    "アルトリア・キャスター(バーサーカー)": "アルトリア・キャスター",
    "救世主トネリコ(雨の魔女トネリコ)": "雨の魔女トネリコ",
    "阿曇磯良(ひびき＆千鍵)" : "ひびき＆千鍵",
    "カレン･Ｃ･オルテンシア(アムール〔カレン〕)": "アムール〔カレン〕"
}

def normalize_text(text):
    """標準化文字"""
    if not text:
        return ""
    normalized = unicodedata.normalize('NFKC', text)
    return normalized.strip()

def process_servant_name(svt_name):
    """清洗從者名稱"""
    name = NAME_UPDATES.get(svt_name, svt_name)
    name = normalize_text(name)
    name = name.replace(":", "：")
    return name

def get_lucky_bag_svt_name(url):
    """爬取網頁"""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"[Error] 無法抓取網頁: {e}")
        return []

    soup = BeautifulSoup(response.content, 'html.parser')
    table_mixed = []

    tables = soup.find_all("table", class_="trbgcolor")

    for table in tables:
        servants = []
        current_class = ""
        current_rarity = ""
        rows = table.select("tr")

        for row in rows:
            class_node = row.find("td", class_="bd_l_none")
            name_node = row.find("span", class_="icon_right_txt")
            star_node = row.find("td", class_="servant_star bg_star_lb")

            if class_node:
                current_class = class_node.text.strip()
            if star_node:
                current_rarity = star_node.text.strip()

            if name_node and current_rarity == "★★★★★":
                servants.append(f"{current_class}_{name_node.text.strip()}")

        if servants:
            table_mixed.append(servants)

    return table_mixed

def get_lucky_bag_arr(url, excel_path="./data/5_servents.xlsx"):
    """主邏輯"""
    try:
        df = pd.read_excel(excel_path)
    except FileNotFoundError:
        print(f"[Error] 找不到 Excel 檔案: {excel_path}")
        return []

    # 1. 建立查找字典
    lookup_dict = {}
    for _, row in df.iterrows():
        # 修正 Excel 中的特殊職階名稱
        c_name = row['className']
        if c_name == 'Unbeastolgamarie':
            c_name = 'Unbeast'

        clean_jp_name = process_servant_name(row['name_JP'])
        key = f"{c_name}{clean_jp_name}"
        lookup_dict[key] = row['collectionNo']

    # 2. 抓取資料
    raw_data = get_lucky_bag_svt_name(url)
    table_collections = []

    # 用來儲存錯誤訊息的列表
    missing_log = []

    print(f"正在處理 {len(raw_data)} 組福袋資料...\n")

    for idx, group in enumerate(raw_data):
        group_ids = []
        print(f"--- Group {idx + 1} ---")

        for entry in group:
            try:
                raw_class, raw_name = entry.split("_", 1)
            except ValueError:
                continue

            class_eng = CLASS_NAME_MAP.get(raw_class, raw_class)
            name_jp = process_servant_name(raw_name)
            key = f"{class_eng}{name_jp}"

            collection_no = lookup_dict.get(key)

            # Retry logic
            if not collection_no:
                name_no_brackets = re.sub(r'\(.*?\)', '', name_jp)
                name_no_brackets = re.sub(r'（.*?）', '', name_no_brackets)
                key_retry = f"{class_eng}{name_no_brackets}"
                collection_no = lookup_dict.get(key_retry)

            if collection_no:
                group_ids.append(collection_no)
            else:
                # [修改點] 記錄無法匹配的項目
                msg = f"[MISS] 無法匹配: {raw_name} (Class: {class_eng})\n         嘗試 Key: {key}"
                print(f"  {msg}")
                missing_log.append(msg + "\n")

        if group_ids:
            table_collections.append(group_ids)

    # [修改點] 將錯誤輸出成檔案
    if missing_log:
        with open("missing_servants.txt", "w", encoding="utf-8") as f:
            f.writelines(missing_log)
        print(f"\n[Info] 已將 {len(missing_log)} 筆無法匹配的資料寫入 missing_servants.txt")

    return table_collections