"""Regenerate the four original explanatory figures with Pillow.
Run from any directory: python3 render_figures.py (requires Pillow).
Data figure: reported LiFT v1 Table 6 values, no interpolation or local experiments.
"""
from pathlib import Path
import json, os
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
FONT = os.environ.get('BLOG_CJK_FONT', '/System/Library/Fonts/Supplemental/Arial Unicode.ttf')
W = 1440
INK, MUTED, BLUE, GREEN, GOLD = '#20364a', '#596d7c', '#436f9a', '#438370', '#aa722b'
BG, LINE = '#f7f9fc', '#d4dee8'

def font(size): return ImageFont.truetype(FONT, size)
def canvas(h, title, subtitle):
    im = Image.new('RGB', (W,h), BG); d=ImageDraw.Draw(im)
    d.text((60,35),title,font=font(43),fill=INK)
    d.text((60,98),subtitle,font=font(24),fill=MUTED)
    return im,d

def text(d, xy, s, size=29, color=INK): d.text(xy,s,font=font(size),fill=color)
def box(d, xy, lines, fill='#e9f0f7', stroke=LINE, size=29):
    x0,y0,x1,y1=xy
    d.rounded_rectangle(xy, radius=18, fill=fill,outline=stroke,width=2)
    total=len(lines)*(size+13)-13
    y=y0+(y1-y0-total)/2-3
    for s in lines:
        b=d.textbbox((0,0),s,font=font(size)); tw=b[2]-b[0]
        text(d,((x0+x1-tw)/2,y),s,size);y+=size+13

def arrow(d, x0,y0,x1,y1,color=MUTED,width=4):
    import math
    d.line((x0,y0,x1,y1),fill=color,width=width)
    a=math.atan2(y1-y0,x1-x0); L=15
    p1=(x1-L*math.cos(a-.5),y1-L*math.sin(a-.5));p2=(x1-L*math.cos(a+.5),y1-L*math.sin(a+.5))
    d.polygon([(x1,y1),p1,p2],fill=color)

def save(im,name): im.save(ROOT/name,optimize=True)

im,d=canvas(840,'同一份计算预算，两个不同的循环','结构示意 · 当前采样位置内保持输入图像和噪声水平不变')
text(d,(65,175),'外层：生成时间 t 随采样更新推进',31,BLUE)
box(d,(65,240,265,330),['图像状态 x(t)'])
box(d,(350,240,890,330),['网络预测：内部允许多轮计算'])
box(d,(990,240,1370,330),['采样更新 → x(t + Δt)'])
arrow(d,265,285,350,285);arrow(d,890,285,990,285)
arrow(d,620,340,620,417,BLUE)
d.rounded_rectangle((65,430,1370,710),radius=23,outline=BLUE,width=3,fill='#ffffff')
text(d,(95,448),'内层：只更新隐状态 h，循环段共享参数',30,BLUE)
for xy,lines in [((95,525,315,620),['前置段 A']),((410,525,820,620),['共享核心 B × K']),((935,525,1335,620),['后置段 C / 预测头'])]:box(d,xy,lines)
arrow(d,315,572,410,572);arrow(d,820,572,935,572)
d.line((740,622,740,665,485,665,485,630),fill=GREEN,width=4);arrow(d,485,650,485,625,GREEN)
text(d,(810,652),'上一轮状态 → 下一轮',25,GREEN)
text(d,(65,754),'K 增加一次预测的内部深度；T 增加整条轨迹的采样更新数。',29)
text(d,(65,804),'自绘示意，依据 Looped-DiT §2、LiFT §2–3；不代表实验结果。',21,MUTED)
save(im,'two-loops.png')

im,d=canvas(760,'中间出口，到底在学什么？','监督示意 · 圆点代表预测空间中的目标，不表示隐状态沿直线移动')
text(d,(65,179),'Looped-DiT：每个出口预测同一张干净图像',31,BLUE)
for i,x in enumerate([140,455,770,1085]):
    box(d,(x,248,x+215,320),[f'第 {i+1} 轮出口'],size=27)
    arrow(d,x+108,325,x+108,371,BLUE)
    box(d,(x,377,x+215,447),['相同目标 x₀'],fill='#e5f1eb',size=27)
text(d,(65,499),'LiFT：深度坐标 s 指定逐渐接近最终速度目标的位置',31,GREEN)
d.line((160,613,1260,613),fill=LINE,width=6)
for x,s,label in [(160,'0','初始预测'),(435,'1/4','中间目标'),(710,'1/2','中间目标'),(985,'3/4','中间目标'),(1260,'1','最终目标')]:
    d.ellipse((x-12,601,x+12,625),fill=GREEN)
    text(d,(x-24,555),f's={s}',25,GREEN);text(d,(x-55,643),label,25)
text(d,(65,713),'自绘示意，依据 Looped-DiT §2.1、LiFT §3.1；中间监督不保证逐轮单调改善。',22,MUTED)
save(im,'supervision.png')

im,d=canvas(850,'RRT 初始化：共享基础矩阵，保留低秩差异','结构示意 · 只画共享块内一个位置的对应矩阵；并非所有原始层混成一个矩阵')
for y,label in [(195,'原始矩阵 W₁'),(320,'原始矩阵 W₂'),(445,'原始矩阵 W₃')]:
    box(d,(65,y,370,y+90),[label]);arrow(d,370,y+45,515,363,BLUE)
box(d,(520,300,925,430),['对应矩阵取平均','共享基础矩阵 W̄'],fill='#e5f1eb',size=30)
arrow(d,925,365,1030,365,GREEN)
box(d,(1035,280,1370,455),['按位置保留残差','ΔW(r) ≈ B(r) A(r)','截断 SVD 初始化'],fill='#fff1df',size=28)
text(d,(65,587),'第 r 轮使用：W̄ + B(r) A(r)',38,INK)
text(d,(65,658),'共享部分相同；各位置的低秩增量不同；继续训练时两者都更新。',30)
text(d,(65,724),'低秩增量的秩控制额外参数量与原始权重的近似精度。',28,GOLD)
text(d,(65,801),'自绘示意，依据 Relaxed Recursive Transformers §2.2–2.3。',23,MUTED)
save(im,'rrt-mechanism.png')

meta=json.loads((ROOT/'lift-grid.json').read_text()); rows=meta['rows']
im,d=canvas(900,'LiFT：循环深度 × 采样步数的实测 FID','同一 L/2-R10 checkpoint · ImageNet 256 × 256 · 50,000 samples · 越低越好')
ks=[1,2,4,8,16,32]; ts=[10,25,50,100]
text(d,(450,172),'推理循环深度 K',28,BLUE)
x0,y0,cw,ch=220,260,188,115
for j,k in enumerate(ks):text(d,(x0+j*cw+74,215),str(k),29)
for i,t in enumerate(ts):
    text(d,(65,y0+i*ch+24),f'T = {t}',29,BLUE)
    for j,k in enumerate(ks):
        row=next(r for r in rows if r[:2]==[t,k]); fid=row[3]
        q=(fid-10.9)/(48.7-10.9); q=max(0,min(1,q))
        lo=(212,235,226);hi=(244,216,190); color=tuple(round(a+(b-a)*q) for a,b in zip(lo,hi))
        xy=(x0+j*cw,y0+i*ch,x0+(j+1)*cw-9,y0+(i+1)*ch-9)
        d.rounded_rectangle(xy,12,fill=color)
        label=f'{fid:.3f}';b=d.textbbox((0,0),label,font=font(34))
        text(d,(xy[0]+(cw-9-(b[2]-b[0]))/2,xy[1]+27),label,34)
        if (t,k) in [(50,2),(25,4),(10,16)]: d.rounded_rectangle(xy,12,outline=BLUE,width=4)
text(d,(65,755),'描边配置 (T,K)：(50,2) 8.070；(25,4) 7.397；(10,16) 11.027 TFLOPs / 图像。',22)
text(d,(65,801),'数据来源：LiFT v1，附录 A.3 表 6。仅重绘报告值，无插值；FLOPs 不含 VAE 解码。',23,MUTED)
text(d,(65,846),'四个 T 值与六个 K 值构成 24 个点；成本不同，低 FID 不自动代表预算更优。',24,MUTED)
save(im,'lift-allocation.png')
