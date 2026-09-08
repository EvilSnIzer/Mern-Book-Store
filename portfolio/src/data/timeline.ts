/**
 * Career timeline — rendered as milestones along a 3D curve in the
 * Timeline section. Fill in real roles, dates and descriptions.
 */
export interface Milestone {
  id: string
  year: string
  title: string
  org: string
  description: string
}

export const timeline: Milestone[] = [
  {
    id: 'm1',
    year: '2022',
    title: 'Started in ML',
    org: 'University / Self-taught',
    description:
      'TODO: real detail. First serious work with ML — coursework, Kaggle, and a first production model.',
  },
  {
    id: 'm2',
    year: '2023',
    title: 'First production systems',
    org: 'Your first company',
    description:
      'TODO: real detail. Shipped first end-to-end ML service; learned what "works in prod" really means.',
  },
  {
    id: 'm3',
    year: '2024',
    title: 'Senior / ownership',
    org: 'Current or past role',
    description:
      'TODO: real detail. Owned the full lifecycle of high-impact models; introduced MLOps practices.',
  },
  {
    id: 'm4',
    year: '2025',
    title: 'LLM systems',
    org: 'Current role',
    description:
      'TODO: real detail. Leading LLM / retrieval systems work; focus on reliability and evaluation.',
  },
]
