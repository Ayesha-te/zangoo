"use client";

import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";

export type CustomerReview = {
  id: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
  verified?: boolean;
  media?: string[];
};

type ReviewSort = "recent" | "highest" | "lowest" | "media";

export function CustomerReviews({
  reviews: initialReviews,
  title = "What Our Customers Say",
  intro,
}: {
  reviews: CustomerReview[];
  title?: string;
  intro?: string;
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [sort, setSort] = useState<ReviewSort>("recent");
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [uploads, setUploads] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const reviewGridRef = useRef<HTMLDivElement>(null);
  const reviewFormRef = useRef<HTMLDetailsElement>(null);

  const moveReviews = (direction: number) => {
    reviewGridRef.current?.scrollBy({ left: direction * reviewGridRef.current.clientWidth, behavior: "smooth" });
  };

  const visibleReviews = useMemo(() => {
    const result = sort === "media" ? reviews.filter((review) => review.media?.length) : [...reviews];
    return result.sort((a, b) => {
      if (sort === "highest") return b.rating - a.rating;
      if (sort === "lowest") return a.rating - b.rating;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [reviews, sort]);

  function onFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []).slice(0, 3);
    const files = selected.filter((file) => file.size <= 5 * 1024 * 1024);
    setUploadError(files.length < selected.length ? "Each image must be 5MB or smaller." : "");
    setUploads(files.map((file) => URL.createObjectURL(file)));
  }

  function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    setReviews((current) => [{
      id: `customer-${Date.now()}`,
      name: name.trim(),
      date: new Date().toISOString(),
      rating,
      comment: comment.trim(),
      media: uploads,
    }, ...current]);
    setName("");
    setComment("");
    setRating(5);
    setUploads([]);
    setUploadError("");
    setSort("recent");
    setSubmitted(true);
    if (reviewFormRef.current) reviewFormRef.current.open = false;
  }

  return (
    <section className="customer-reviews" id="reviews" aria-labelledby="customer-reviews-title">
      <div className="customer-reviews-head">
        <div>
          <h2 id="customer-reviews-title">{title}</h2>
          {intro ? <p>{intro}</p> : null}
        </div>
        <label>
          <span>Sort reviews</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as ReviewSort)}>
            <option value="recent">Recent</option>
            <option value="highest">Highest</option>
            <option value="lowest">Lowest</option>
            <option value="media">Reviews with media</option>
          </select>
        </label>
      </div>
      {submitted ? <p className="customer-review-success" role="status">Your review was sent successfully.</p> : null}

      <div className="customer-review-slider">
        <div className="customer-review-grid" ref={reviewGridRef}>
          {visibleReviews.map((review) => (
          <article className="customer-review-card" key={review.id}>
            <div className="customer-review-author">
              <span aria-hidden="true">{review.name.charAt(0).toUpperCase()}</span>
              <div><strong>{review.name}</strong>{review.verified ? <small>Verified purchase</small> : null}</div>
            </div>
            <div className="customer-review-rating">
              <span role="img" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
              <time dateTime={review.date}>{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(review.date))}</time>
            </div>
            <p>&ldquo;{review.comment}&rdquo;</p>
            {review.media?.length ? (
              <div className="customer-review-media">
                {review.media.map((source, index) => <img src={source} alt={`Photo attached to ${review.name}'s review ${index + 1}`} key={`${source}-${index}`} />)}
              </div>
            ) : null}
          </article>
          ))}
          {!visibleReviews.length ? <p className="customer-review-empty">No reviews with photos yet.</p> : null}
        </div>
        <div className="customer-review-slider-controls" aria-label="Review navigation">
          <button className="customer-review-prev" type="button" onClick={() => moveReviews(-1)} aria-label="Previous reviews">&#8249;</button>
          <button className="customer-review-next" type="button" onClick={() => moveReviews(1)} aria-label="Next reviews">&#8250;</button>
        </div>
      </div>

      <details className="customer-review-form-wrap" ref={reviewFormRef}>
        <summary>Leave a review</summary>
        <form className="customer-review-form" onSubmit={submitReview}>
          <label>Name<input required value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label>Rating<select value={rating} onChange={(event) => setRating(Number(event.target.value))}>{[5, 4, 3, 2, 1].map((value) => <option value={value} key={value}>{value} stars</option>)}</select></label>
          <label className="customer-review-comment">Your feedback<textarea required rows={4} value={comment} onChange={(event) => setComment(event.target.value)} /></label>
          <label className="customer-review-upload">
            <span>Add photos (up to 3)</span>
            <span className="customer-review-file-button">Choose File</span>
            <span className="customer-review-file-name">{uploads.length ? `${uploads.length} photo${uploads.length === 1 ? "" : "s"} selected` : "No file chosen"}</span>
            <input type="file" accept="image/*" multiple onChange={onFiles} />
          </label>
          {uploadError ? <small className="customer-review-upload-error">{uploadError}</small> : null}
          {uploads.length ? <div className="customer-review-media customer-review-preview">{uploads.map((source) => <img src={source} alt="Review upload preview" key={source} />)}</div> : null}
          <button type="submit">Submit review</button>
        </form>
      </details>
    </section>
  );
}
