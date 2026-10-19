export interface ProjectShowcase {
  title: string;
  category: string;
  description: string;
  tags: string[];
  githubUrl: string;
  badge?: string;
}

export interface CreatorProfile {
  name: string;
  handle: string;
  tagline: string;
  institute: string;
  instituteFull: string;
  diploma: string;
  bio: string;
  location: string;
  avatarUrl: string;
  whatsappUrl: string;
  frontendRepoUrl: string;
  backendRepoUrl: string;
  badges: string[];
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    portfolio: string;
    whatsapp: string;
    email: string;
  };
  stats: {
    label: string;
    value: string;
  }[];
  projects: ProjectShowcase[];
  manifesto: string;
}

export const CREATOR_PROFILE: CreatorProfile = {
  name: "Chathunga Bimsara",
  handle: "chathunga2007",
  tagline: "Undergraduate Software Engineer & Full-Stack Developer | UI/UX Designer",
  institute: "IJSE",
  instituteFull: "Institute of Java Software Engineering (IJSE)",
  diploma: "Higher National Diploma in Software Engineering (HNDSE)",
  bio: "Undergraduate Software Engineer from Galle, Sri Lanka, studying at IJSE. Passionate about engineering high-throughput media streaming systems, low-latency microservices, robust Java enterprise architectures, and state-of-the-art glassmorphism user experiences. Built CBX-Stream to democratize frictionless universal media archiving with studio-grade fidelity.",
  location: "Galle, Sri Lanka",
  avatarUrl: "https://chathunga-bimsara-portfolio-web.vercel.app/assest/my-photo.jpg",
  whatsappUrl: "https://wa.me/94767945968?text=Hello%20Chathunga!%20I%20am%20reaching%20out%20via%20CBX-Stream.",
  frontendRepoUrl: "https://github.com/chathunga2007/CBX-Stream-All-In-One-Universal-Social-Media-Downloader-Frontend",
  backendRepoUrl: "https://github.com/chathunga2007/CBX-Stream-All-In-One-Universal-Social-Media-Downloader-Backend",
  badges: [
    "IJSE Undergraduate Software Engineer",
    "Java OOP & MVC Architecture Expert",
    "FastAPI & Distributed Python",
    "React 18 & TypeScript Artisan",
    "FFmpeg DASH & Transcoding Specialist",
    "Glassmorphism & Cyber UI/UX Specialist",
  ],
  socialLinks: {
    github: "https://github.com/chathunga2007",
    linkedin: "https://www.linkedin.com/in/chathunga-bimsara-02a728387/",
    twitter: "https://x.com/Chathunga2007",
    portfolio: "https://chathunga-bimsara-portfolio-web.vercel.app/",
    whatsapp: "https://wa.me/94767945968",
    email: "mailto:wggachathungabimsara2007@gmail.com",
  },
  stats: [
    { label: "Platforms Supported", value: "1000+" },
    { label: "Max Stream Quality", value: "4K / 8K HDR" },
    { label: "Audio Bitrate", value: "320 kbps" },
    { label: "Direct Support", value: "WhatsApp 24/7" },
  ],
  projects: [
    {
      title: "CBX-Stream Frontend (Vite + React)",
      category: "Frontend Architecture",
      description: "State-of-the-art reactive glassmorphism web client with dynamic Chameleon theme engine, DASH stream selectors, and studio audio visualizers.",
      tags: ["React 18", "TypeScript", "TailwindCSS", "Framer Motion"],
      githubUrl: "https://github.com/chathunga2007/CBX-Stream-All-In-One-Universal-Social-Media-Downloader-Frontend",
      badge: "Frontend Repo",
    },
    {
      title: "CBX-Stream Backend (FastAPI + FFmpeg)",
      category: "Backend Engine",
      description: "High-throughput asynchronous Python microservice engine leveraging yt-dlp, FFmpeg DASH muxing, WebSockets, and chunked streaming.",
      tags: ["FastAPI", "Python", "FFmpeg", "yt-dlp", "WebSockets"],
      githubUrl: "https://github.com/chathunga2007/CBX-Stream-All-In-One-Universal-Social-Media-Downloader-Backend",
      badge: "Backend Repo",
    },
    {
      title: "Flex Gym Management System",
      category: "Enterprise Desktop App",
      description: "1st Semester Final Project at IJSE built using pure Java and MVC architecture with automated membership registration, attendance, and payments.",
      tags: ["Java", "MVC", "MySQL", "OOP"],
      githubUrl: "https://github.com/chathunga2007/Gym_Membership_Management_System-1st-Semester-Final-Project-Using-MVC-Architecture-",
      badge: "IJSE Final Project",
    },
    {
      title: "Connect 4 Tactical Game",
      category: "Interactive Gaming Engine",
      description: "Connect Four game implemented with Java object-oriented principles, minimax logic, and dynamic two-player board mechanics.",
      tags: ["Java", "OOP", "Game Logic"],
      githubUrl: "https://github.com/chathunga2007/Connect_Four_Game-Assignment-OOP-",
      badge: "OOP Assignment",
    },
    {
      title: "Stock & Inventory Management",
      category: "Terminal Application",
      description: "Robust terminal-based inventory management system in Java handling real-time item tracking, restocking alerts, and accounting reports.",
      tags: ["Java", "CLI", "Data Structures"],
      githubUrl: "https://github.com/chathunga2007/PRF-Project",
    },
    {
      title: "Official Personal Portfolio",
      category: "Interactive 3D Web Application",
      description: "Developer portfolio featuring dynamic theme engines, Web Audio FX, 3D Canvas sphere, terminal HUD, and multi-language support.",
      tags: ["HTML5", "CSS3", "JavaScript", "Audio API"],
      githubUrl: "https://github.com/chathunga2007/My-Official-Personal-Portfolio-Web",
    },
  ],
  manifesto:
    "Engineering software is not merely writing code; it is crafting intuitive, responsive, and resilient digital architectures that empower human curiosity and creative preservation.",
};
