import json
import math
import re # 引入 Regex 模組
from web_crawl import get_lucky_bag_arr

# 目標網址 (FGO 10週年福袋公告)
url = "https://news.fate-go.jp/2025/10th_luckybag/"

CLASS_KEYS = [
    "saber", "archer", "lancer", "rider", "caster", "assassin", "berserker",
    "ruler", "avenger", "alterego", "mooncancer", "foreigner", "pretender", "beast", "unbeast"
]

def split_list_into_chunks(data, n):
    k, m = divmod(len(data), n)
    return [data[i * k + min(i, m):(i + 1) * k + min(i + 1, m)] for i in range(n)]

def map_to_keys(data_list):
    mapped_dict = {}
    for idx, ids in enumerate(data_list):
        if idx < len(CLASS_KEYS):
            key = CLASS_KEYS[idx]
        else:
            key = f"extra_{idx}"
        mapped_dict[key] = ids
    return mapped_dict

def generate_json():
    print("開始抓取網頁資料...")
    svt_arr = get_lucky_bag_arr(url)

    total_bags = len(svt_arr)
    class_count = len(CLASS_KEYS)
    print(f"抓取完成，共有 {total_bags} 袋資料。")

    if total_bags == 0:
        return

    estimated_groups = max(1, round(total_bags / class_count))
    print(f"自動判定為 {estimated_groups} 大組 (Group)。")

    chunks = split_list_into_chunks(svt_arr, estimated_groups)

    result_json = {}
    for i, chunk_data in enumerate(chunks):
        group_name = f"group_{i+1}"
        result_json[group_name] = map_to_keys(chunk_data)
        print(f"  - {group_name}: 分配到 {len(chunk_data)} 袋")

    # --- 輸出邏輯修改 ---

    # 1. 先產生標準 JSON 字串 (會有多餘換行)
    json_str = json.dumps(result_json, ensure_ascii=False, indent=2)

    # 2. 定義壓縮陣列的函式
    # 將 [ \n 1, \n 2 \n ] 轉為 [1, 2]
    def compact_array(match):
        content = match.group(0)
        # 移除換行與所有空白
        content = re.sub(r'\s+', '', content)
        # 補回逗號後的一個空格，符合一般閱讀習慣 [1, 2, 3]
        content = content.replace(',', ', ')
        return content

    # 3. 使用 Regex 尋找所有數字陣列並壓縮
    # Pattern 說明: 尋找以 [ 開頭，] 結尾，且內容只包含數字、逗號、空白的字串
    json_str = re.sub(r'\[[\d,\s]+\]', compact_array, json_str)

    output_filename = "luckybag_web.json"
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(json_str)

    print(f"\n成功輸出 JSON 檔案: {output_filename} (已壓縮陣列格式)")

if __name__ == "__main__":
    generate_json()