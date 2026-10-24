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
    if (!panel) return;

    const inlineHeight = panel.style.height;
    panel.style.height = "auto";
    const targetHeight = panel.scrollHeight;
    const previousHeight = previousHeightRef.current;

    if (previousHeight === null) {
      panel.style.height = `${targetHeight}px`;
      return;
    }

    panel.style.height = `${previousHeight}px`;
    void panel.offsetHeight;
    const frame = requestAnimationFrame(() => {
      panel.style.height = `${targetHeight}px`;
      previousHeightRef.current = null;
    });

    return () => {
      cancelAnimationFrame(frame);
      if (panel.style.height === "auto") {
        panel.style.height = inlineHeight;
      }
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
