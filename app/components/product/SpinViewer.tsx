"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

/** Horizontal drag distance (px) that turns the product by one frame. */
const PIXELS_PER_FRAME = 36;

/**
 * Full-screen "360° View": drag or swipe across the photo (or use the arrows / arrow keys) to turn the product.
 * With a 360° frame set (product.spin360: photos taken all the way round, in order) this is a true spin; until a
 * product has one, it turns through the product's own photos.
 */
export function SpinViewer({ frames, title, onClose }: { frames: Array<{ src: string; alt: string }>; title: string; onClose: () => void }) {
  const [frame, setFrame] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const dragStart = useRef<{ x: number; frame: number } | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const count = frames.length;
  const step = (by: number) => {
    setHintVisible(false);
    setFrame((current) => (((current + by) % count) + count) % count);
  };

  // Focus the viewer (for arrow keys / Escape) and stop the page behind from scrolling.
  useEffect(() => {
    dialogRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") onClose();
    else if (event.key === "ArrowLeft") step(-1);
    else if (event.key === "ArrowRight") step(1);
    else return;
    event.preventDefault();
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, frame };
    setDragging(true);
    setHintVisible(false);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragStart.current) return;
    // Dragging right turns the product to the right (like spinning it by hand).
    const moved = Math.round((dragStart.current.x - event.clientX) / PIXELS_PER_FRAME);
    setFrame((((dragStart.current.frame + moved) % count) + count) % count);
  }

  function endDrag() {
    dragStart.current = null;
    setDragging(false);
  }

  return (
    <div className="spin-overlay" onMouseDown={onClose}>
      <div
        className="spin-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`${title} 360° view`}
        tabIndex={-1}
        ref={dialogRef}
        onKeyDown={onKeyDown}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="spin-head">
          <strong>{title} · 360° View</strong>
          <button type="button" className="spin-close" aria-label="Close 360° view" onClick={onClose}>&times;</button>
        </div>
        <div
          className={`spin-stage${dragging ? " is-dragging" : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {/* Every frame is loaded up front and stacked, so turning never waits for a download. */}
          {frames.map((image, index) => (
            <img key={`${image.src}-${index}`} src={image.src} alt={index === frame ? image.alt : ""} draggable={false} className={index === frame ? "is-current" : undefined} />
          ))}
          {hintVisible ? <span className="spin-hint" aria-hidden="true">&#8592; Drag to rotate &#8594;</span> : null}
        </div>
        <div className="spin-controls">
          <button type="button" onClick={() => step(-1)} aria-label="Turn left">&#8592;</button>
          <input
            type="range"
            min={0}
            max={count - 1}
            value={frame}
            onChange={(event) => {
              setHintVisible(false);
              setFrame(Number(event.target.value));
            }}
            aria-label="Rotation"
            aria-valuetext={`View ${frame + 1} of ${count}`}
          />
          <button type="button" onClick={() => step(1)} aria-label="Turn right">&#8594;</button>
        </div>
      </div>
    </div>
  );
}
