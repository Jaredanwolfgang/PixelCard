import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { SiteConfig, SocialIconId, TagDef } from "./types";

const CONFIG_PATH = path.join(process.cwd(), "site.config.yaml");

const SOCIAL_ICONS: SocialIconId[] = [
  "github",
  "linkedin",
  "mail",
  "website",
  "twitter",
  "scholar",
  "bilibili",
  "rss",
];

declare global {
  // eslint-disable-next-line no-var
  var __pixelcardConfig: SiteConfig | undefined;
  // eslint-disable-next-line no-var
  var __pixelcardConfigMtime: number | undefined;
}

function isSocialIcon(v: unknown): v is SocialIconId {
  return typeof v === "string" && (SOCIAL_ICONS as string[]).includes(v);
}

function normalize(raw: Record<string, unknown>): SiteConfig {
  const site = (raw.site ?? {}) as Record<string, string>;
  const profile = (raw.profile ?? {}) as Record<string, string>;
  const academic = (raw.academic ?? {}) as Record<string, unknown>;

  const socials = Array.isArray(raw.socials)
    ? (raw.socials as Record<string, string>[])
        .filter((s) => isSocialIcon(s.icon) && typeof s.href === "string" && s.href.trim())
        .map((s) => ({ icon: s.icon as SocialIconId, href: s.href.trim() }))
    : [];

  const tags = (Array.isArray(raw.tags) ? raw.tags : []) as TagDef[];
  const friends = Array.isArray(raw.friends) ? (raw.friends as SiteConfig["friends"]) : [];

  return {
    site: {
      name: site.name || "PixelCard",
      title: site.title || "PixelCard",
      description: site.description || "",
      copyright: site.copyright || "",
    },
    profile: {
      name: profile.name || "Your Name",
      handle: profile.handle || "@you",
      bio: profile.bio || "",
      avatar: profile.avatar || "",
      location: profile.location || "",
      email: profile.email || "",
    },
    socials,
    tags,
    friends,
    academic: {
      headline: String(academic.headline ?? ""),
      about: String(academic.about ?? "").trim(),
      news: (academic.news as SiteConfig["academic"]["news"]) ?? [],
      education: (academic.education as SiteConfig["academic"]["education"]) ?? [],
      experience: (academic.experience as SiteConfig["academic"]["experience"]) ?? [],
      publications:
        (academic.publications as SiteConfig["academic"]["publications"]) ?? [],
      projects: (academic.projects as SiteConfig["academic"]["projects"]) ?? [],
    },
  };
}

/** 读取根目录 site.config.yaml（开发时按 mtime 热更新） */
export function getSiteConfig(): SiteConfig {
  const stat = fs.statSync(CONFIG_PATH);
  const mtime = stat.mtimeMs;
  if (
    globalThis.__pixelcardConfig &&
    globalThis.__pixelcardConfigMtime === mtime
  ) {
    return globalThis.__pixelcardConfig;
  }
  const raw = yaml.load(fs.readFileSync(CONFIG_PATH, "utf8")) as Record<
    string,
    unknown
  >;
  const config = normalize(raw);
  globalThis.__pixelcardConfig = config;
  globalThis.__pixelcardConfigMtime = mtime;
  return config;
}

export function getTags(): TagDef[] {
  return getSiteConfig().tags;
}

export function getTag(id: string | null | undefined): TagDef {
  const tags = getTags();
  return tags.find((t) => t.id === id) ?? tags[0];
}

export function findTag(tags: TagDef[], id: string | null | undefined): TagDef {
  return tags.find((t) => t.id === id) ?? tags[0];
}
