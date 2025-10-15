"use client";
import {
  LazyMotion,
  m,
  AnimatePresence,
  LayoutGroup,
  useReducedMotion,
  useMotionValue,
  useTransform,
  useScroll,
} from "framer-motion";

export function loadMotionFeatures() {
  return import("framer-motion").then((mod) => mod.domAnimation);
}

export {
  AnimatePresence,
  LayoutGroup,
  useReducedMotion,
  useMotionValue,
  useTransform,
  useScroll,
  LazyMotion,
};
export const motion = m;
