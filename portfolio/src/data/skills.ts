/**
 * Skills — rendered as floating 3D word tags in the Skills section and
 * as an accessible, duplicate DOM list. Categorised into clusters so the
 * 3D field reads as related groups instead of noise.
 */
export interface SkillCluster {
  label: string
  skills: string[]
}

export const skills: SkillCluster[] = [
  {
    label: 'Models & ML',
    skills: ['PyTorch', 'Transformers', 'Diffusion', 'scikit-learn', 'XGBoost', 'Computer Vision'],
  },
  {
    label: 'LLM / GenAI',
    skills: ['RAG', 'Fine-tuning', 'Agents', 'Prompting', 'Embeddings'],
  },
  {
    label: 'Data & Infra',
    skills: ['Python', 'SQL', 'Spark', 'Feature Stores', 'Airflow', 'Docker', 'Kubernetes'],
  },
  {
    label: 'MLOps',
    skills: ['CI/CD', 'Drift Monitoring', 'Model Serving', 'AWS', 'GCP', 'Evidently'],
  },
]

/** Flat, de-duplicated list used for the 3D tags + DOM fallback. */
export const skillTags: string[] = Array.from(
  new Set(skills.flatMap((c) => c.skills)),
)
