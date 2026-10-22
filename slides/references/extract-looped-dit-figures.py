"""Render unmodified figure/table crops from arXiv:2609.40305v1 PDF.
Usage: bundled-python extract-looped-dit-figures.py /path/to/paper.pdf
Requires pdftoppm and Pillow. Coordinates are PDF points, top-left origin.
"""
import hashlib, json, subprocess, sys, tempfile
from pathlib import Path
from PIL import Image
root = Path(__file__).resolve().parents[1]
pdf = Path(sys.argv[1]).resolve()
source = 'https://arxiv.org/pdf/2609.40305v1'
figures = [
 ('fig2-sma',2,[70,90,286,316],'图 2 · SMA 结构（左侧裁切）','先做 Attention，再在 Concat Heads 与 Wₒ 之前调节输出；两种机制二选一。'),
 ('fig2',2,[68,75,544,360],'图 2 · 完整结构','原图中的 N 表示循环次数；本汇报统一记为 K。'),
 ('table4',8,[68,436,544,617],'表 4 · 设计消融','B/32 四项评测均分：朴素循环 56.2；深监督＋XSA 为 59.1。'),
 ('table2',7,[68,162,544,310],'表 2 · 非循环结构对照','最后两行匹配训练与单次预测计算：参数 473M / 260M，均分 58.1 / 59.1。'),
 ('fig1',1,[68,459,544,705],'图 1 · 能力、计算与逐轮修正','图中 FLOPs、参数量、延迟是不同量；3.2× 延迟比属于这组跨模型设置。'),
 ('fig4',6,[68,48,544,270],'图 4 · 质量—计算量／延迟','B/16 六项评测均分；横轴均为对数刻度，不与 B/32 四项均分混用。'),
 ('fig6',7,[68,441,544,637],'图 6 · Loop 与采样步数','在匹配每图 FLOPs 的对照中，4 轮优于单轮＋更多采样步；各点标记步数。'),
 ('fig5',6,[68,275,544,556],'图 5 · 逐轮修正的定性样例','同页比较循环、原始非循环、大模型与 CoT；定性示例不等于完整机制证明。'),
 ('table1',5,[68,65,544,313],'表 1 · 跨模型评测','B/16 六项均分 71.5；InternVL-U 69.0。各模型采用官方设置，不是同预算消融。'),
]
records=[]
out=root/'public/paper-figures/looped-dit'
out.mkdir(parents=True,exist_ok=True)
with tempfile.TemporaryDirectory(prefix='looped-pdf-figures-') as temp:
 pages={}
 for num in sorted({x[1] for x in figures}):
  prefix=Path(temp)/f'p{num}'
  subprocess.run(['pdftoppm','-f',str(num),'-l',str(num),'-r','240','-singlefile','-png',str(pdf),str(prefix)],check=True,capture_output=True)
  pages[num]=Image.open(str(prefix)+'.png').convert('RGB')
 for key,num,box,title,note in figures:
  im=pages[num]
  sx,sy=im.width/612,im.height/792
  crop=im.crop(tuple(round(v*(sx if i%2==0 else sy)) for i,v in enumerate(box)))
  file=f'{key}.png';crop.save(out/file,optimize=True)
  records.append(dict(id=key,page=num,box=box,title=title,note=note,file=f'paper-figures/looped-dit/{file}',width=crop.width,height=crop.height))
data=dict(paper='Looped Diffusion Transformer',version='arXiv:2609.40305v1',source=source,pdfSha256=hashlib.sha256(pdf.read_bytes()).hexdigest(),attribution='Chng et al., 2026',license='CC BY 4.0',licenseUrl='https://creativecommons.org/licenses/by/4.0/',renderDpi=240,figures=records)
(root/'references/looped-dit-figures.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print(f'Rendered {len(records)} crops; total {sum(p.stat().st_size for p in out.glob("*.png"))//1024} KiB')
