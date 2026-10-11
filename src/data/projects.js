/**
 * Projects data — single source of truth.
 * Statuses are exact. No fabricated URLs, metrics, or production claims.
 */

export const PROJECTS = [
  {
    id: 1,
    name: 'ZeroTrace',
    tagline: 'Zombie API Discovery and Defence',
    description:
      'A cybersecurity tool built for iDEA 2.0 (PSBs Hackathon Series 2026, organized by Union Bank of India), ' +
      'Problem Statement PS9. Built as part of Team ShieldOps with teammates Ishmeet Singh and Pushkar Gupta.',
    category: 'Cybersecurity',
    status: 'Hackathon Project',
    tags: ['Cybersecurity', 'API Security', 'Python'],
    githubUrl: '',   // Not yet public
    liveUrl:   '',   // Not deployed
    note: 'Hackathon project (participation only — no placement claimed).',
    featured: true,
  },
  {
    id: 2,
    name: 'Cyber Citadel',
    tagline: 'Cybersecurity Awareness Web Application',
    description:
      'A web application designed to raise awareness about common cybersecurity threats, best practices, and defensive techniques.',
    category: 'Cybersecurity',
    status: 'Personal / Academic Project',
    tags: ['Cybersecurity', 'Web', 'Awareness'],
    githubUrl: '',
    liveUrl:   '',
    featured: true,
  },
  {
    id: 3,
    name: 'SQL Query Explainer & Optimizer',
    tagline: 'Rule-based, fully offline SQL analysis tool',
    description:
      'A single-file HTML tool that explains and suggests optimizations for SQL queries. ' +
      'Fully offline with no backend — all logic runs in the browser.',
    category: 'Developer Utility',
    status: 'Personal / Academic Project',
    tags: ['SQL', 'HTML', 'Browser Tool', 'Developer Utility'],
    githubUrl: '',
    liveUrl:   '',
    featured: false,
  },
  {
    id: 4,
    name: 'COA Instruction Set Simulator',
    tagline: 'Browser-based CPU instruction format simulator',
    description:
      'Demonstrates four CPU instruction formats (three-, two-, one-, and zero-address). ' +
      'Uses the shunting-yard algorithm to convert infix expressions to postfix, then generates code for each addressing mode.',
    category: 'COA / Education',
    status: 'Completed Academic Project',
    tags: ['COA', 'JavaScript', 'Shunting-Yard', 'Simulator'],
    githubUrl: 'https://github.com/Prateekinnovates/COA_25BAI10050_ISS',
    liveUrl:   '',
    featured: true,
  },
  {
    id: 5,
    name: 'Voice-Controlled Wheelchair Prototype',
    tagline: 'Arduino-based assistive technology prototype',
    description:
      'A hardware prototype using Arduino Uno, HC-05 Bluetooth module, and L298N motor driver. ' +
      'Built collaboratively with a seven-member team.',
    category: 'Hardware / IoT',
    status: 'Academic Prototype',
    tags: ['Arduino', 'Bluetooth', 'Hardware', 'Assistive Tech', 'Team Project'],
    githubUrl: '',
    liveUrl:   '',
    featured: false,
  },
];
