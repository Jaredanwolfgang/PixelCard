"use client";

import Link from "next/link";
import { AvatarGlyph, SocialIcon } from "./SocialIcons";
import FriendsModal from "./FriendsModal";
import { useSiteConfig } from "./SiteProvider";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`;
  return String(n);
}

export default function ProfileSidebar({
  views,
  likes,
}: {
  views: number;
  likes: number;
}) {
  const { site, profile, socials, friends } = useSiteConfig();

  return (
    <aside className="sidebar-card">
      <div className="avatar">
        {profile.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatar} alt={profile.name} />
        ) : (
          <AvatarGlyph />
        )}
      </div>
      <div className="name">{profile.name}</div>
      <div className="handle">{profile.handle}</div>
      <div className="bio">{profile.bio}</div>

      <hr className="hairline" />

      <div className="stats-row">
        <div>
          <div className="num">{formatCount(views)}</div>
          <div className="lbl">浏览</div>
        </div>
        <div>
          <div className="num">{formatCount(likes)}</div>
          <div className="lbl">获赞</div>
        </div>
        <FriendsModal count={friends.length} friends={friends} />
      </div>

      <hr className="hairline" />

      <nav className="side-links">
        <Link href="/academic">
          学术主页 <span className="arr">→</span>
        </Link>
        <Link href="/archive">
          全部博客 <span className="arr">→</span>
        </Link>
        <Link href="/slide">
          汇报 Slides <span className="arr">→</span>
        </Link>
      </nav>

      <div className="social-row">
        {socials.map((s) => (
          <a
            key={`${s.icon}-${s.href}`}
            href={s.href}
            aria-label={s.icon}
            target={s.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={s.href.startsWith("mailto:") ? undefined : "noreferrer"}
          >
            <SocialIcon id={s.icon} />
          </a>
        ))}
      </div>

      <div className="copyright">{site.copyright || `© ${site.name}`}</div>
    </aside>
  );
}
