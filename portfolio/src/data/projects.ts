/**
 * Projects — data-driven so the gallery, case studies and anything else
 * that needs project info all read from here.
 *
 * To add a real project: fill every TODO, drop a 1200x800 screenshot into
 * `/public/covers/` and reference it via `cover`.
 */
export interface Project {
  id: string
  title: string
  category: string
  year: string
  /** Short blurb shown on the tilted gallery card. */
  summary: string
  /** Screenshot / cover image used as the 3D plane texture. */
  cover: string
  accent?: boolean
  /** Case-study body. problem → approach → stack → result. */
  caseStudy: {
    problem: string
    approach: string
    stack: string[]
    result: string
  }
}

export const projects: Project[] = [
  {
    id: 'latent-rag',
    title: 'Latent RAG',
    category: 'LLM Systems',
    year: '2025',
    summary:
      'Retrieval-augmented generation pipeline for a technical knowledge base — hybrid sparse/dense retrieval with reranking.',
    cover: '/covers/latent-rag.svg',
    accent: true,
    caseStudy: {
      problem:
        'TODO: real problem statement. Example: support engineers spent 40% of their day searching a fragmented wiki; answers were often stale or contradictory.',
      approach:
        'TODO: real approach. Example: built a hybrid retrieval stack (BM25 + dense embeddings) with cross-encoder reranking and citation-grounded generation, evaluated on a held-out Q&A set.',
      stack: ['Python', 'PyTorch', 'FAISS', 'FastAPI', 'OpenAI', 'LangChain'],
      result:
        'TODO: real result. Example: answer accuracy up 31% on the eval set, median time-to-answer down from 6 minutes to 40 seconds.',
    },
  },
  {
    id: 'defect-vision',
    title: 'Defect Vision',
    category: 'Computer Vision',
    year: '2024',
    summary:
      'Real-time surface-defect detection on a manufacturing line — a lightweight model that runs at line speed on edge hardware.',
    cover: '/covers/defect-vision.svg',
    caseStudy: {
      problem:
        'TODO: real problem statement. Example: manual inspection was the bottleneck — inspectors missed subtle defects and throughput was capped.',
      approach:
        'TODO: real approach. Example: trained a small CNN with strong augmentation + distillation from a larger teacher, then quantized it to run on an edge device.',
      stack: ['Python', 'PyTorch', 'OpenCV', 'ONNX Runtime', 'Docker'],
      result:
        'TODO: real result. Example: 98.2% recall on test set, running at 120 FPS on a $60 edge device.',
    },
  },
  {
    id: 'churn-forecast',
    title: 'Churn Forecast',
    category: 'MLOps',
    year: '2024',
    summary:
      'End-to-end churn prediction service with drift monitoring, scheduled retraining and a feature store — built to stay healthy unattended.',
    cover: '/covers/churn-forecast.svg',
    caseStudy: {
      problem:
        'TODO: real problem statement. Example: churn models silently degraded between quarterly retrains; nobody noticed until revenue dipped.',
      approach:
        'TODO: real approach. Example: rebuilt the pipeline around a feature store, automated retraining, and drift monitoring with alerts wired to Slack.',
      stack: ['Python', 'scikit-learn', 'XGBoost', 'Airflow', 'Evidently', 'AWS'],
      result:
        'TODO: real result. Example: reduced silent model degradation to near zero and cut retraining effort from days to hours.',
    },
  },
  {
    id: 'gen-ui',
    title: 'Generative UI',
    category: 'Applied AI',
    year: '2025',
    summary:
      'Streaming, schema-validated UI generation from natural-language prompts — safe by construction, fast by streaming.',
    cover: '/covers/gen-ui.svg',
    accent: true,
    caseStudy: {
      problem:
        'TODO: real problem statement. Example: internal teams needed custom dashboards but every request queued behind engineering.',
      approach:
        'TODO: real approach. Example: LLM generates a JSON schema of the UI, validated against a strict grammar, then streamed to a renderer.',
      stack: ['TypeScript', 'React', 'OpenAI', 'Zod', 'Vercel AI SDK'],
      result:
        'TODO: real result. Example: dashboard requests fulfilled in minutes instead of weeks, with zero invalid-schema renders.',
    },
  },
]
