"""Reproduce original ELT v3 figure crops. Usage: bundled-python script.py paper.pdf"""
import hashlib,json,subprocess,sys,tempfile
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1];pdf=Path(sys.argv[1]).resolve()
items=[
 ('fig2',2,[60,85,538,339],'图 2 · Anytime 的含义','概念示意：ILSD 让中间出口也接近可用输出；图中的 Solution Space 不是在线停止判据。'),
 ('fig1',1,[60,188,538,425],'图 1 · 同一训练运行，不同循环预算','原文 L 是本汇报 K；多种循环预算可生成图像，不代表学习了自动停机策略。'),
 ('fig3',5,[60,85,538,361],'图 3 · 训练与多出口读出','图中的可选出口表示支持多种深度；一次采样调用按指定预算执行一次共享输出头。'),
 ('algorithm2',25,[60,84,538,323],'算法 2 · 给定循环预算的推理','循环次数 L 是算法输入；for range(L) 后读出，没有基于样本状态的停止判断。'),
 ('fig13',25,[60,408,538,586],'图 13 · 多出口与完整 ILSD 消融','左侧为 DiT，右侧为 masked generation；多出口训练与完整损失分开比较，不把全部早退收益归于蒸馏项。'),
]
out=root/'public/paper-figures/elt';out.mkdir(parents=True,exist_ok=True);records=[]
with tempfile.TemporaryDirectory(prefix='elt-figures-') as temp:
 pages={}
 for n in sorted({x[1] for x in items}):
  prefix=Path(temp)/f'p{n}';subprocess.run(['pdftoppm','-f',str(n),'-l',str(n),'-r','240','-singlefile','-png',str(pdf),str(prefix)],check=True,capture_output=True)
  pages[n]=Image.open(str(prefix)+'.png').convert('RGB')
 for key,n,box,title,note in items:
  im=pages[n];sx,sy=im.width/595.276,im.height/841.89
  crop=im.crop(tuple(round(v*(sx if i%2==0 else sy)) for i,v in enumerate(box)));crop.save(out/f'{key}.png',optimize=True)
  records.append(dict(id=key,page=n,box=box,title=title,note=note,file=f'paper-figures/elt/{key}.png',width=crop.width,height=crop.height))
data=dict(paper='ELT: Elastic Looped Transformers for Visual Generation',version='arXiv:2604.09168v3',source='https://arxiv.org/pdf/2604.09168v3',pdfSha256=hashlib.sha256(pdf.read_bytes()).hexdigest(),attribution='Goyal et al., 2026',license='CC BY-NC-SA 4.0',licenseUrl='https://creativecommons.org/licenses/by-nc-sa/4.0/',renderDpi=240,figures=records)
(root/'references/elt-figures.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n');print(f'Rendered {len(records)} ELT crops')
