#!/usr/bin/env python3
"""Migrate Hexo posts from Blogs/source into PixelCard content/posts.

Does NOT delete or modify the source files.
"""

from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]  # Jaredan/
OLD_POSTS = ROOT / "Blogs" / "source" / "_posts"
OLD_IMAGES = ROOT / "Blogs" / "source" / "images"
NEW_POSTS = ROOT / "Blogs-Template" / "pixelcard" / "content" / "posts"

# PixelCard tag ids: academic | projects | life | essays | tech
POST_META: dict[str, dict] = {
    "compsci180_0": {
        "tag": "projects",
        "excerpt": "COMPSCI 180 Project 0：焦距、自拍构图与 Dolly Zoom 等相机成像实验。",
        "image_dirs": ["compsci180/proj_0"],
        "cover": "images/compsci180/proj_0/view.jpg",
    },
    "compsci180_1": {
        "tag": "projects",
        "excerpt": "COMPSCI 180 Project 1：用图像金字塔与 NCC 对齐 Prokudin-Gorskii 三通道照片并上色。",
        "image_dirs": ["compsci180/proj_1"],
        "cover": "images/compsci180/proj_1/flight.png",
    },
    "compsci180_2": {
        "tag": "projects",
        "excerpt": "COMPSCI 180 Project 2：卷积滤波、频域混合与图像锐化等 Filters and Frequencies 实验。",
        "image_dirs": ["compsci180/proj_2"],
        "cover": "images/compsci180/proj_2/2_2_hybrid.png",
    },
    "compsci180_3": {
        "tag": "projects",
        "excerpt": "COMPSCI 180 Project 3：单应性估计、图像扭曲与全景拼接（Mosaicing）。",
        "image_dirs": ["compsci180/proj_3"],
        "cover": "images/compsci180/proj_3/main_stack.png",
    },
    "compsci180_4": {
        "tag": "projects",
        "excerpt": "COMPSCI 180 Project 4：相机标定、NeRF 训练与狗狗三维重建可视化。",
        "image_dirs": ["compsci180/proj_4"],
        "cover": "images/compsci180/proj_4/doggy_data.jpg",
    },
    "compsci180_5": {
        "tag": "projects",
        "excerpt": "COMPSCI 180 Project 5：扩散模型去噪、采样、CFG 与自训练实验记录。",
        "image_dirs": ["compsci180/proj_5", "compsci180/proj_5b"],
        "cover": "images/compsci180/proj_5/part_0/high_resolution_50/1.png",
    },
    "dynamic_programming": {
        "tag": "academic",
        "excerpt": "动态规划核心思路与经典题型笔记整理。",
        "image_dirs": ["dynamic_programming"],
        "cover": "images/dynamic_programming/Untitled.png",
    },
    "gaussian_distribution": {
        "tag": "academic",
        "excerpt": "高斯分布的定义、几何直观与机器学习中的基本应用。",
        "image_dirs": ["machine_learning"],
        "cover": "images/machine_learning/gaussian_distribution.png",
    },
    "kvcache": {
        "tag": "tech",
        "excerpt": "一文梳理 LLM 推理中的 KV Cache 原理与常见优化思路。",
        "image_dirs": ["kvcache"],
        "cover": "images/kvcache/kvcache.gif",
    },
    "machine_learning_quizzes": {
        "tag": "academic",
        "excerpt": "机器学习课程测验题回顾与要点整理。",
        "image_dirs": [],
        "cover": None,
    },
    "machine_learning_review": {
        "tag": "academic",
        "excerpt": "基于 PRML 的机器学习复习笔记汇总。",
        "image_dirs": [],
        "cover": None,
    },
    "projects_hub": {
        "tag": "projects",
        "excerpt": "个人项目合集：课程项目、分布式与机器学习相关实践。",
        "image_dirs": ["project_hubs", "logos"],
        "cover": "images/project_hubs/pipeline.png",
    },
    "rnn": {
        "tag": "academic",
        "excerpt": "从 n-gram 到 RNN：语言模型与循环神经网络要点速览。",
        "image_dirs": [],
        "cover": None,
    },
}


def parse_hexo(md: str) -> tuple[dict, str]:
    if not md.startswith("---"):
        return {}, md
    end = md.find("\n---", 3)
    if end == -1:
        return {}, md
    fm_raw = md[3:end].strip()
    body = md[end + 4 :].lstrip("\n")
    data: dict = {}
    for line in fm_raw.splitlines():
        if ":" not in line:
            continue
        key, val = line.split(":", 1)
        data[key.strip()] = val.strip().strip('"').strip("'")
    return data, body


def convert_hexo_notes(body: str) -> str:
    body = re.sub(r"<!--more-->\s*", "", body)
    pattern = re.compile(
        r"\{%\s*note\s*[^%]*?%\}\s*(.*?)\s*\{%\s*endnote\s*%\}",
        re.DOTALL,
    )

    def repl(m: re.Match[str]) -> str:
        inner = m.group(1).strip()
        return f'<div class="callout">{inner}</div>'

    return pattern.sub(repl, body)


def rewrite_image_urls(body: str, slug: str) -> str:
    # Absolute Hexо paths -> PixelCard media route
    body = body.replace("/images/", f"/media/{slug}/images/")
    # Markdown images already absolute via /media; also fix rare relative forms
    return body


def copy_image_dirs(slug: str, dirs: list[str]) -> None:
    dest_root = NEW_POSTS / slug / "images"
    dest_root.mkdir(parents=True, exist_ok=True)
    for rel in dirs:
        src = OLD_IMAGES / rel
        dst = dest_root / rel
        if not src.exists():
            print(f"  ! missing image source: {src}")
            continue
        if dst.exists():
            shutil.rmtree(dst)
        shutil.copytree(src, dst)
        print(f"  + copied images/{rel}")


def migrate_one(stem: str, meta: dict) -> None:
    src = OLD_POSTS / f"{stem}.md"
    if not src.exists():
        print(f"SKIP missing {src}")
        return

    raw = src.read_text(encoding="utf-8")
    fm, body = parse_hexo(raw)
    body = convert_hexo_notes(body)
    body = rewrite_image_urls(body, stem)

    title = fm.get("title", stem)
    date = (fm.get("date") or "1970-01-01")[:10]
    tag = meta["tag"]
    excerpt = meta["excerpt"]

    out_dir = NEW_POSTS / stem
    out_dir.mkdir(parents=True, exist_ok=True)
    copy_image_dirs(stem, meta["image_dirs"])

    cover_line = ""
    if meta.get("cover"):
        cover_rel = meta["cover"]
        # verify exists under post images
        if (out_dir / cover_rel).exists():
            cover_line = f'cover: "./{cover_rel}"\n'
        else:
            print(f"  ! cover missing for {stem}: {cover_rel}")

    # Escape quotes in title/excerpt for YAML
    def q(s: str) -> str:
        return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'

    front = (
        "---\n"
        f"title: {q(title)}\n"
        f"excerpt: {q(excerpt)}\n"
        f"tag: {tag}\n"
        f"{cover_line}"
        f'publishedAt: "{date}"\n'
        "draft: false\n"
        "---\n\n"
    )

    (out_dir / "images").mkdir(parents=True, exist_ok=True)
    # keep empty images folder usable
    gitkeep = out_dir / "images" / ".gitkeep"
    if not any(out_dir.joinpath("images").rglob("*")):
        gitkeep.write_text("")

    (out_dir / "index.md").write_text(front + body, encoding="utf-8")
    print(f"OK {stem} -> tag={tag}")


def main() -> None:
    print(f"OLD_POSTS = {OLD_POSTS}")
    print(f"NEW_POSTS = {NEW_POSTS}")
    assert OLD_POSTS.is_dir(), OLD_POSTS
    assert NEW_POSTS.is_dir(), NEW_POSTS

    for stem, meta in POST_META.items():
        print(f"\n=== {stem} ===")
        migrate_one(stem, meta)

    # Ensure old posts untouched
    old_count = len(list(OLD_POSTS.glob("*.md")))
    print(f"\nDone. Old posts still present: {old_count}")


if __name__ == "__main__":
    main()
