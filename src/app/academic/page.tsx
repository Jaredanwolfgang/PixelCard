import Link from "next/link";
import { AvatarGlyph } from "@/components/SocialIcons";
import PrintButton from "@/components/PrintButton";
import { getSiteConfig } from "@/lib/config";

export function generateMetadata() {
  const { site } = getSiteConfig();
  return { title: `学术主页 · ${site.name}` };
}

export default function AcademicPage() {
  const { site, profile, socials, academic } = getSiteConfig();
  const academicSocials = socials.filter((s) =>
    ["github", "scholar", "linkedin", "mail"].includes(s.icon)
  );

  return (
    <>
      <span className="wordmark">{site.name}</span>
      <main className="academic-page">
        <header className="academic-header">
          <div>
            <h1>{profile.name}</h1>
            <div className="sub">{academic.headline}</div>
            <div className="contact">
              {[profile.email, profile.location].filter(Boolean).join(" · ")}
            </div>
            <div className="academic-links">
              {academicSocials.map((s, i) => (
                <span key={`${s.icon}-${s.href}`}>
                  {i > 0 && "·"}
                  <a
                    href={s.href}
                    target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={s.href.startsWith("mailto:") ? undefined : "noreferrer"}
                  >
                    {s.icon === "github"
                      ? "GitHub"
                      : s.icon === "scholar"
                        ? "Google Scholar"
                        : s.icon === "linkedin"
                          ? "LinkedIn"
                          : "Email"}
                  </a>
                </span>
              ))}
              {academicSocials.length > 0 && "·"}
              <Link href="/">博客 ↗</Link>
            </div>
          </div>
          <div className="academic-photo">
            {profile.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar} alt={profile.name} />
            ) : (
              <AvatarGlyph />
            )}
          </div>
        </header>

        <hr className="academic-hr" />

        <section className="academic-section">
          <h2>关于我</h2>
          <p>{academic.about}</p>
        </section>

        {!!academic.news.length && (
          <section className="academic-section">
            <h2>动态</h2>
            {academic.news.map((n) => (
              <div className="news-row" key={`${n.date}-${n.text}`}>
                <span className="when">{n.date}</span>
                <span>{n.text}</span>
              </div>
            ))}
          </section>
        )}

        <hr className="academic-hr" />

        {!!academic.education.length && (
          <section className="academic-section">
            <h2>教育经历</h2>
            {academic.education.map((e) => (
              <div className="cv-row" key={`${e.period}-${e.school}`}>
                <span className="when">{e.period}</span>
                <div>
                  <div className="what">{e.school}</div>
                  <div className="detail">{e.detail}</div>
                </div>
              </div>
            ))}
          </section>
        )}

        {!!academic.experience.length && (
          <section className="academic-section">
            <h2>工作经历</h2>
            {academic.experience.map((e) => (
              <div className="cv-row" key={`${e.period}-${e.title}`}>
                <span className="when">{e.period}</span>
                <div>
                  <div className="what">{e.title}</div>
                  <div className="detail">{e.detail}</div>
                </div>
              </div>
            ))}
          </section>
        )}

        <hr className="academic-hr" />

        {!!academic.publications.length && (
          <section className="academic-section">
            <h2>论文 / 发表</h2>
            {academic.publications.map((p, i) => (
              <div className="pub-row" key={p.title}>
                <div className="pt">
                  <span>
                    [{i + 1}] {p.title}
                  </span>
                  {p.link && (
                    <Link href={p.link}>{p.linkLabel || "查看 →"}</Link>
                  )}
                </div>
                <div className="pd">{p.venue}</div>
              </div>
            ))}
          </section>
        )}

        {!!academic.projects.length && (
          <section className="academic-section">
            <h2>项目经历</h2>
            {academic.projects.map((p) => (
              <div className="pub-row" key={p.name}>
                <div className="pt">
                  <span>{p.name}</span>
                  {p.href && (
                    <Link href={p.href}>{p.linkLabel || "相关 →"}</Link>
                  )}
                </div>
                <div className="pd no-indent">{p.description}</div>
              </div>
            ))}
          </section>
        )}

        <hr className="academic-hr" />

        <footer className="academic-footer">
          <span>{site.copyright || `© ${profile.name} · Built with PixelCard`}</span>
          <PrintButton label="打印简历" />
        </footer>
      </main>
    </>
  );
}
