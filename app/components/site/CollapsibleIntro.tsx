"use client";

import { useState } from "react";

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

  return (
    <div className={classes.collapsibleText} data-open={open ? "true" : "false"}>
      <p className={classes.collapsiblePanel}>{text}</p>
      <button className={classes.collapsibleButton} type="button" onClick={() => setOpen((value) => !value)}>
        {open ? "Show less" : "Show more"}
      </button>
    </div>
  );
}
