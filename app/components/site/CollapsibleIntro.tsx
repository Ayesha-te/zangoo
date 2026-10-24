"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { getSentencePreview } from "@/app/utils/collapsibleIntro";

type CollapsibleIntroClasses = {
  collapsibleText: string;
  collapsiblePanel: string;
  collapsibleButton: string;
  collapsiblePreview: string;
  collapsibleFull: string;
};

type CollapsibleIntroProps = {
  text: string;
  classes: CollapsibleIntroClasses;
};

export function CollapsibleIntro({ text, classes }: CollapsibleIntroProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLParagraphElement>(null);
  const previousHeightRef = useRef<number | null>(null);
  const preview = getSentencePreview(text).preview;

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const previousHeight = previousHeightRef.current;
    // Only animate after a toggle; otherwise the panel keeps its natural (auto) height.
    if (!panel || previousHeight === null) return;
    previousHeightRef.current = null;

    panel.style.height = "auto";
    const targetHeight = panel.scrollHeight;
    panel.style.height = `${previousHeight}px`;
    void panel.offsetHeight;
    const frame = requestAnimationFrame(() => {
      panel.style.height = `${targetHeight}px`;
    });
    // Back to auto once the 0.5s transition ends, so late font loads or a rotated phone never clip the text.
    const release = window.setTimeout(() => {
      panel.style.height = "auto";
    }, 550);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(release);
      panel.style.height = "auto";
    };
  }, [open]);

  const toggleOpen = () => {
    const panel = panelRef.current;
    if (!panel) {
      setOpen((current) => !current);
      return;
    }

    previousHeightRef.current = panel.getBoundingClientRect().height;
    setOpen((current) => !current);
  };

  return (
    <div
      className={classes.collapsibleText}
      data-open={open ? "true" : "false"}
    >
      <p ref={panelRef} className={classes.collapsiblePanel}>
        <span className={classes.collapsiblePreview}>{preview}</span>
        <span className={classes.collapsibleFull}>{text}</span>
        {" "}
        <button className={classes.collapsibleButton} type="button" onClick={toggleOpen} aria-expanded={open}>
          {open ? "Show less" : "Show more"}
        </button>
      </p>
    </div>
  );
}
