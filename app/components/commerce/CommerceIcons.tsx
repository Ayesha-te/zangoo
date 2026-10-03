import type { ReactNode, SVGProps } from "react";

function Icon({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>{children}</svg>;
}

export const HeartIcon = (props: SVGProps<SVGSVGElement>) => <Icon {...props}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" /></Icon>;
export const TrashIcon = (props: SVGProps<SVGSVGElement>) => <Icon {...props}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" /></Icon>;
export const MinusIcon = (props: SVGProps<SVGSVGElement>) => <Icon {...props}><path d="M5 12h14" /></Icon>;
export const PlusIcon = (props: SVGProps<SVGSVGElement>) => <Icon {...props}><path d="M12 5v14M5 12h14" /></Icon>;
export const LockIcon = (props: SVGProps<SVGSVGElement>) => <Icon {...props}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></Icon>;
export const ArrowIcon = (props: SVGProps<SVGSVGElement>) => <Icon {...props}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>;
export const CheckCircleIcon = (props: SVGProps<SVGSVGElement>) => <Icon {...props}><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></Icon>;
export const BagIcon = (props: SVGProps<SVGSVGElement>) => <Icon {...props}><path d="M6 7h12l1 14H5L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" /></Icon>;

const features = [
  { label: "Double-sided", icon: <path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" /> },
  { label: "Hand-tufted", icon: <><circle cx="12" cy="12" r="2" /><path d="M12 3v5M12 16v5M3 12h5M16 12h5" /></> },
  { label: "Wire edge", icon: <rect x="5" y="5" width="14" height="14" rx="2" /> },
  { label: "Approx. 26cm deep", icon: <path d="M12 3 21 12 12 21 3 12z" /> },
];

export function ProductFeatures() {
  return <ul className="commerce-features">{features.map((feature) => <li key={feature.label}><Icon width="15" height="15">{feature.icon}</Icon><span>{feature.label}</span></li>)}</ul>;
}
