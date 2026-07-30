import { confettiPieces } from './confettiPieces';
import './celebration.css';

/** A one-shot confetti burst overlay: fixed, non-interactive, pieces fall +
 * drift then the whole thing is unmounted by the provider. Respects reduced
 * motion via the CSS (the animation collapses to near-instant there). */
export function Confetti({ count = 60 }: { count?: number }) {
  return (
    <div className="confetti" data-testid="confetti" aria-hidden="true">
      {confettiPieces(count).map((p, i) => (
        <span
          key={i}
          className="confetti__piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ['--tf-confetti-drift' as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
