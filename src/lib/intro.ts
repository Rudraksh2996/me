// Tiny signal so the preloader can tell the hero (and Lenis) when the curtain is up.
let done = false;
const listeners = new Set<() => void>();

export const isIntroDone = () => done;

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

/** Runs `fn` once the intro finishes (immediately if it already has). Returns an unsubscribe. */
export function onIntroDone(fn: () => void) {
  if (done) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => listeners.delete(fn);
}
