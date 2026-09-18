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
  const preview = getSentencePreview(text).preview;

  return (
    <div
      className={classes.collapsibleText}
      data-open={open ? "true" : "false"}
    >
      <p className={classes.collapsiblePanel}>
        {open ? text : preview}
        {" "}
        <button className={classes.collapsibleButton} type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
          {open ? "Show less" : "Show more"}
        </button>
      </p>
    </div>
  );
}
