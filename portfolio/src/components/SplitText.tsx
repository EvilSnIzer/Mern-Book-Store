import { motion } from 'framer-motion'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
  /** Play the reveal (e.g. after the preloader lifts). */
  play?: boolean
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

/**
 * Word-by-word masked reveal. The visible words are `aria-hidden` and the
 * container carries an `aria-label` with the full text, so screen readers
 * read the sentence once and correctly.
 */
export default function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  play = true,
  as: Tag = 'h1',
}: SplitTextProps) {
  const words = text.split(' ')
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden py-[0.08em] -my-[0.08em] align-top"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '115%' }}
            animate={{ y: play ? '0%' : '115%' }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: delay + i * stagger }}
          >
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
