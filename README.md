# Zangoo Furniture

Next.js storefront and landing-page project for Zangoo/Furniture Co.

## Development

```bash
npm run dev
```

Open [https://www.zaango.co.uk](https://www.zaango.co.uk).

## Landing Pages

- [Mattresses category](https://www.zaango.co.uk/collections/bedroom/mattresses/)
- [Product page wireframe preview](https://www.zaango.co.uk/product-page-wireframe/)

## Product Pages

- [RestCore Ortho](https://www.zaango.co.uk/collections/bedroom/mattresses/restcore-ortho/)
- [AlignPlus Ortho](https://www.zaango.co.uk/collections/bedroom/mattresses/alignplus-ortho/)
- [OrthoLux Pocket](https://www.zaango.co.uk/collections/bedroom/mattresses/ortholux-pocket/)
- [SpineGuard Ortho](https://www.zaango.co.uk/collections/bedroom/mattresses/spineguard-ortho/)
- [Capri Ortho Mattress](https://www.zaango.co.uk/collections/bedroom/mattresses/capri-ortho-mattress/)
- [Capri Ortho Mattress 2](https://www.zaango.co.uk/collections/bedroom/mattresses/capri-ortho-mattress2/)

## Image Assets

Public images live in [`public/`](./public/). Use descriptive, lowercase, hyphenated filenames that describe the product, context, and asset purpose. Avoid generic filenames such as `m1.jpeg`, `image.png`, or `award1.jpeg`.

### Homepage Images

- [`/ukas-iso-9001-quality-management-certification.jpeg`](./public/ukas-iso-9001-quality-management-certification.jpeg) - UKAS ISO 9001 award image used in the homepage awards strip.
- [`/green-organisation-award-member-certification.jpeg`](./public/green-organisation-award-member-certification.jpeg) - Green Organisation award image used in the homepage awards strip.

### Capri Ortho Images

- [`/capri-ortho-mattress-bedroom-hero.webp`](./public/capri-ortho-mattress-bedroom-hero.webp) - Capri Ortho bedroom hero image.
- [`/capri-ortho-mattress-product-cutout.webp`](./public/capri-ortho-mattress-product-cutout.webp) - Capri Ortho product cutout image.
- [`/capri-ortho-mattress-bedroom-lifestyle.jpeg`](./public/capri-ortho-mattress-bedroom-lifestyle.jpeg) - Capri Ortho bedroom lifestyle source image.
- [`/capri-ortho-mattress-damask-fabric-close-up.jpeg`](./public/capri-ortho-mattress-damask-fabric-close-up.jpeg) - Damask fabric close-up used by the Capri Ortho landing-page diagrams.

## Asset Guidelines

- Keep landing-page imagery as separate files in `public/`; do not embed production images as base64 in HTML or React.
- Use meaningful `alt` text for visible content images.
- Prefer WebP for large product/hero images when quality allows.
- Keep README image links updated when homepage or landing-page imagery changes.

## Commit Guidelines

Use clear commit messages with a short subject and a body comment when useful:

```bash
git commit -m "Improve Capri Ortho landing page assets" -m "Renames image files for SEO/AEO and documents homepage image usage."
```
