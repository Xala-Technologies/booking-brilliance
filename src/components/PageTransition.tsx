import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, useRef } from "react";
import { pageEnter } from "@/lib/motion";

interface Props {
  children: ReactNode;
  className?: string;
}

/**
 * On the FIRST mount of the SPA we skip the entry animation entirely.
 * SSR renders the page contents already visible, and `initial="hidden"`
 * (opacity: 0, y: 12) was causing Lighthouse to measure LCP at 12.9s
 * because the page stayed invisible until framer-motion hydrated and
 * ran the fade-in animation. On subsequent client-side navigations we
 * animate normally — those start from an already-mounted shell so the
 * fade is welcome UX.
 *
 * Detection: a module-level flag stays `false` until the first
 * <PageTransition> instance renders. The first instance reads the
 * flag (=> firstMount=true), then flips it. Every later instance
 * (including post-navigation remounts) sees firstMount=false and
 * gets the standard fade-in.
 */
let hasMountedOnce = false;

const PageTransition = ({ children, className }: Props) => {
  const reduced = useReducedMotion();
  const firstMountRef = useRef(!hasMountedOnce);
  if (firstMountRef.current) hasMountedOnce = true;

  if (reduced) return <>{children}</>;
  return (
    <motion.div
      // First load → SSR rendered visible; don't fade in. Later
      // navigations → standard hidden→visible fade. Exit variant runs
      // when AnimatePresence (in App.tsx) unmounts the page during a
      // route change, giving us a clean fade-out before the next page.
      initial={firstMountRef.current ? "visible" : "hidden"}
      animate="visible"
      exit="exit"
      variants={pageEnter}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
