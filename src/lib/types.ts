export type SocialIconId =
  | "github"
  | "linkedin"
  | "mail"
  | "website"
  | "twitter"
  | "scholar"
  | "bilibili"
  | "rss";

export interface TagDef {
  id: string;
  name: string;
  nameEn: string;
  accent: string;
  accentSoft: string;
  coverFrom: string;
  coverTo: string;
  icons: string[];
}

export interface SocialLink {
  icon: SocialIconId;
  href: string;
}

export interface Friend {
  name: string;
  url: string;
  bio: string;
  color: string;
  /** Optional avatar path or absolute URL */
  avatar?: string;
}

export interface AcademicNews {
  date: string;
  text: string;
}

export interface AcademicRow {
  period: string;
  school?: string;
  title?: string;
  detail: string;
}

export interface AcademicPublication {
  title: string;
  venue: string;
  link?: string;
  linkLabel?: string;
}

export interface AcademicProject {
  name: string;
  description: string;
  href?: string;
  linkLabel?: string;
  tags?: string[];
}

export interface SiteConfig {
  site: {
    name: string;
    title: string;
    description: string;
    copyright: string;
  };
  profile: {
    name: string;
    handle: string;
    bio: string;
    avatar: string;
    location: string;
    email: string;
  };
  socials: SocialLink[];
  tags: TagDef[];
  friends: Friend[];
  academic: {
    headline: string;
    about: string;
    news: AcademicNews[];
    education: AcademicRow[];
    experience: AcademicRow[];
    publications: AcademicPublication[];
    projects: AcademicProject[];
  };
}

/** Markdown 文章（互动计数在合并 stats 后填入） */
export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  tagId: string;
  content: string;
  publishedAt: string;
  readingTime: number;
  draft: boolean;
  views: number;
  likes: number;
  comments: number;
}

export interface Comment {
  id: number;
  slug: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface PostStats {
  views: number;
  likes: number;
  comments: number;
}
