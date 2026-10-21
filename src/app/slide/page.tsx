import Link from "next/link";
import { slideDecks } from "@/lib/slides";
import styles from "./slides.module.css";

export const metadata = {
  title: "Slides · Jaredan",
  description: "论文调研与组会汇报，包含可交互的机制图和实验结果。",
};

export default function SlidesPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}><Link href="/">← Jaredan / 博客</Link><span>RESEARCH TALKS</span></nav>
      <header className={styles.header}>
        <div className={styles.eyebrow}>SLIDES / 汇报与分享</div>
        <h1>把问题，放到屏幕上讲。</h1>
        <p>论文调研、机制拆解，以及值得继续追问的地方。</p>
      </header>
      <div className={styles.grid}>
        {slideDecks.map((deck, index) => (
          <article className={styles.card} key={deck.slug}>
            <Link href={`/slide/${deck.slug}`} className={styles.preview} aria-label={`打开汇报：${deck.title}`}>
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              <div className={styles.diagram} aria-hidden="true"><span>Depth<br /><b>↻</b></span><i>×</i><span>Step<br /><b>→</b></span></div>
              <span className={styles.play}>打开汇报 ↗</span>
            </Link>
            <div className={styles.body}>
              <div className={styles.meta}>{deck.date} <span>{deck.version}</span></div>
              <h2><Link href={`/slide/${deck.slug}`}>{deck.title}</Link></h2>
              <p>{deck.description}</p>
              <div className={styles.tags}>{deck.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
              <div className={styles.bottom}><span>{deck.pages} 页 · {deck.duration}</span><Link href={deck.article}>阅读调研笔记 →</Link></div>
            </div>
          </article>
        ))}
      </div>
      <footer className={styles.footer}>使用 Slidev 制作 · 支持方向键翻页、全屏展示与总览</footer>
    </main>
  );
}
