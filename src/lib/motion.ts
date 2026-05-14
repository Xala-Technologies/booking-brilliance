import type { Variants, Transition } from "framer-motion";

const editorialEase: Transition["ease"] = [0.22, 1, 0.36, 1];

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: editorialEase },
  },
};

export const revealFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.72, ease: editorialEase },
  },
};

export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: editorialEase },
  },
};

export const viewportOnce = {
  once: true,
  margin: "0px 0px -10% 0px",
};
