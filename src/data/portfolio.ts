// All copy sourced from https://portfolio-rs-zeta.vercel.app/

export const profile = {
  name: "Rudraksh Sharma",
  firstName: "Rudraksh",
  heroWord: "RUDRAKSH",
  kana: "ルドラクシュ",
  role: "Web Developer",
  roles: ["Aspiring Web Developer", "Python Enthusiast", "B.Tech IT"],
  tagline:
    "2nd Year Engg — Python Developer on a relentless sprint toward Agentic AI.",
  bio: "A B.Tech Information Technology student with a foundation in Python and web development, AWS certified in cloud operations and infrastructure.",
  seeking: "Seeking a Summer 2026 Web Development Internship.",
  resume: "/resume.pdf",
};

export const education = {
  degree: "B.Tech in Information Technology",
  years: "2024 — 2028",
};

export const coursework = [
  "Data Structures & Algorithms",
  "Object-Oriented Programming",
  "Database Management Systems",
  "Operating Systems",
  "Computer Networks",
  "Introduction to AI/ML",
  "Linear Algebra",
  "Probability & Statistics",
];

export const certifications = [
  { title: "AWS Certified CloudOps Engineer — Associate", issuer: "Amazon Web Services" },
  { title: "AWS Cloud Foundations Certificate", issuer: "Amazon Web Services" },
];

export type Project = {
  title: string;
  kicker: string;
  description: string;
  tech: string[];
  link: string;
};

export const projects: Project[] = [
  {
    title: "GuardAuth",
    kicker: "CLI Authentication System",
    description:
      "Terminal authentication system with a three-tier architecture, PBKDF2-HMAC-SHA256 salted password hashing and constant-time comparison. Built on dependency injection and the repository pattern.",
    tech: ["Python", "Rich", "hashlib", "JSON"],
    link: "https://github.com/Rudraksh2996/AuthenticationSystem",
  },
  {
    title: "Expense Tracker",
    kicker: "Terminal Finance",
    description:
      "Terminal expense tracker with interactive menus, real-time spending analytics rendered as text-based graphs, category breakdowns and persistent JSON storage.",
    tech: ["Python", "JSON", "CLI"],
    link: "https://github.com/Rudraksh2996/Expense-Tracker",
  },
  {
    title: "Zru Studios",
    kicker: "Interactive Landing Page",
    description:
      "Landing page with glassmorphism and micro-interactions, including a custom 3D card-tilt hook and scroll-triggered lazy loading.",
    tech: ["React.js", "Framer Motion", "JavaScript"],
    link: "https://github.com/Rudraksh2996/zru-studios-landing",
  },
];

export const stack = [
  {
    title: "Frontend & UI",
    kana: "表",
    line: "Interfaces that move with intent.",
    items: ["HTML5", "CSS3", "JavaScript", "React.js", "Framer Motion"],
  },
  {
    title: "Backend & Core",
    kana: "核",
    line: "Logic forged in Python.",
    items: ["Python", "JSON", "Rich CLI", "Data Structures", "OOP"],
  },
  {
    title: "Cloud & Infrastructure",
    kana: "雲",
    line: "Certified to operate in the cloud.",
    items: ["AWS", "Cloud Operations", "Cloud Foundations"],
  },
  {
    title: "Tools",
    kana: "道",
    line: "The instruments of the craft.",
    items: ["Git", "GitHub", "VS Code", "Problem Solving"],
  },
];

export const contact = {
  email: "sharmarudraksh840@gmail.com",
  github: "https://github.com/Rudraksh2996",
  linkedin: "https://www.linkedin.com/in/rudraksh2996/",
  leetcode: "https://leetcode.com/u/Rudraksh_29/",
};

export const chapters = [
  { id: "origin", num: "01", label: "Origin" },
  { id: "works", num: "02", label: "Works" },
  { id: "afterlight", num: "03", label: "Afterlight" },
  { id: "contact", num: "04", label: "Contact" },
];
