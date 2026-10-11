/**
 * Achievements data — single source of truth.
 * Represents only verified facts. No fabricated awards, placements, or metrics.
 */

export const ACHIEVEMENTS = [
  {
    id: 1,
    category: 'Academics',
    title: 'Class X — 92%',
    organization: 'Montfort Inter College, Lucknow (CBSE)',
    date: '2023',
    description: 'Completed Class X with 92% aggregate under CBSE board.',
    verificationUrl: '',
    tags: ['CBSE', 'Academics'],
  },
  {
    id: 2,
    category: 'Academics',
    title: 'Class XII — 86%',
    organization: 'Montfort Inter College, Lucknow (CBSE)',
    date: '2025',
    description: 'Completed Class XII with 86% aggregate under CBSE board.',
    verificationUrl: '',
    tags: ['CBSE', 'Academics'],
  },
  {
    id: 3,
    category: 'Certifications',
    title: 'Microsoft Azure Fundamentals (AZ-900)',
    organization: 'Microsoft',
    date: '', // Date not provided
    description: 'Earned the AZ-900 certification, demonstrating foundational knowledge of Microsoft Azure cloud services.',
    verificationUrl: '', // TODO: Add Credly/Microsoft credential URL when available
    tags: ['Cloud', 'Microsoft', 'Azure'],
  },
  {
    id: 4,
    category: 'Hackathons',
    title: 'iDEA 2.0 — Hackathon Participant',
    organization: 'PSBs Hackathon Series 2026, organized by Union Bank of India',
    date: '2026',
    description:
      'Participated in iDEA 2.0 (Problem Statement PS9 — Zombie API Discovery and Defence) as part of Team ShieldOps ' +
      'with teammates Ishmeet Singh and Pushkar Gupta. Built ZeroTrace for the hackathon.',
    note: 'Participation only. No placement or award is claimed.',
    verificationUrl: '',
    tags: ['Hackathon', 'Cybersecurity', 'Team'],
  },
  {
    id: 5,
    category: 'Other',
    title: 'Cultural Event Anchor — Himachal Day & Fresher Night',
    organization: 'Chandigarh University',
    date: '2025–2026',
    description:
      'Anchored cultural events at Chandigarh University, including a Himachal Day event and a fresher orientation concert night.',
    verificationUrl: '',
    tags: ['Leadership', 'Hosting', 'Culture'],
  },
  {
    id: 6,
    category: 'Other',
    title: 'Organized & Scripted Himachal Day Cultural Event',
    organization: 'Chandigarh University',
    date: '2025–2026',
    description:
      'Organized and scripted a full Himachal Day cultural programme as a two-anchor event at Chandigarh University.',
    verificationUrl: '',
    tags: ['Leadership', 'Event Management', 'Scripting'],
  },
];

export const CATEGORIES = ['All', 'Academics', 'Certifications', 'Hackathons', 'Projects', 'Other'];
