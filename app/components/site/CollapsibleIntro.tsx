"use client";

import { useState } from "react";
import { getSentencePreview } from "@/app/utils/collapsibleIntro";

type CollapsibleIntroClasses = {
  collapsibleText: string;
  collapsiblePanel: string;
  collapsibleButton: string;
};

type CollapsibleIntroProps = {
  text: string;
  classes: CollapsibleIntroClasses;
};

export function CollapsibleIntro({ text, classes }: CollapsibleIntroProps) {
  const [open, setOpen] = useState(false);
  const preview = getSentencePreview(text).preview.replace(/[.!?]+$/, "");

  return (
    <div
      className={classes.collapsibleText}
      data-open={open ? "true" : "false"}
      role="button"
      tabIndex={0}
      onClick={() => setOpen((value) => !value)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") setOpen((value) => !value);
      }}
      aria-expanded={open}
    >
      <p className={classes.collapsiblePanel}>
        {open ? text : <>{preview}<button className={classes.collapsibleButton} type="button" onClick={(event) => { event.stopPropagation(); setOpen(true); }}>...</button></>}
      </p>
    </div>
  );
}
