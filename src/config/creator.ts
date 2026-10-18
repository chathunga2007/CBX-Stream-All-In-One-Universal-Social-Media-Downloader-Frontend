/**
 * Official Developer Profile, Bio, and Social Links
 * Architect: Chathunga Bimsara (CBX)
 */

export interface CreatorProfile {
  name: string;
  handle: string;
  tagline: string;
  institute: string;
  instituteFull: string;
  bio: string;
  location: string;
  avatarUrl: string;
  badges: string[];
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    portfolio: string;
    email: string;
  };
  stats: {
    label: string;
    value: string;
  }[];
  manifesto: string;
}

export const CREATOR_PROFILE: CreatorProfile = {
  name: "Chathunga Bimsara",
  handle: "CBX",
  tagline: "Software Architect & Modern Full-Stack Engineer",
  institute: "IJSE",
  instituteFull: "Institute of Software Engineering (IJSE)",
  bio: "Full-Stack Software Engineer & Architect passionate about engineering high-throughput media streaming systems, low-latency microservices, and state-of-the-art glassmorphism user experiences. Built CBX-Stream to democratize frictionless universal media archiving with studio-grade fidelity.",
  location: "Sri Lanka",
  avatarUrl: "https://avatars.githubusercontent.com/u/108529244?v=4",
  badges: [
    "IJSE Graduate Software Engineer",
    "FastAPI & Distributed Python",
    "React & TypeScript Artisan",
    "FFmpeg DASH & Transcoding Specialist",
    "Glassmorphism UI/UX Specialist",
  ],
  socialLinks: {
    github: "https://github.com/chathungabimsara",
    linkedin: "https://linkedin.com/in/chathunga-bimsara",
    twitter: "https://twitter.com/chathungab",
    portfolio: "https://chathunga.dev",
    email: "contact@chathunga.dev",
  },
  stats: [
    { label: "Platforms Supported", value: "1000+" },
    { label: "Max Resolution", value: "4K / 8K HDR" },
    { label: "Audio Bitrate", value: "320 kbps" },
    { label: "WebSocket Latency", value: "< 25ms" },
  ],
  manifesto:
    "Engineering software is not merely writing code; it is crafting intuitive, responsive, and resilient digital architectures that empower human curiosity and creative preservation.",
};
