type CollectionIconProps = {
  kind: "sofa" | "dining" | "bed" | "lamp";
};

type AwardIconProps = {
  kind:
    | "trophy"
    | "palette"
    | "leaf"
    | "star"
    | "shield"
    | "recycle"
    | "britain"
    | "medal"
    | "lab"
    | "globe"
    | "bolt"
    | "card";
};

type BlogVisualProps = {
  kind: "dining-room" | "chair-trend" | "sustainable-room";
};

type ReviewVisualProps = {
  kind: "living-room" | "bedroom";
};

export function SofaIllustration() {
  return (
    <svg
      viewBox="0 0 560 320"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      style={{ maxHeight: "88vh", display: "block" }}
      aria-hidden="true"
    >
      <ellipse cx="280" cy="312" rx="246" ry="12" fill="rgba(26,46,68,.09)" />
      <rect x="192" y="256" width="8" height="36" rx="4" fill="#7a9ab8" />
      <rect x="360" y="256" width="8" height="36" rx="4" fill="#7a9ab8" />
      <rect x="228" y="256" width="8" height="36" rx="4" fill="#7a9ab8" />
      <rect x="328" y="256" width="8" height="36" rx="4" fill="#7a9ab8" />
      <rect x="183" y="246" width="196" height="11" rx="5" fill="#9ab8d0" />
      <circle cx="256" cy="242" r="5" fill="rgba(255,255,255,.7)" />
      <rect x="72" y="196" width="416" height="78" rx="17" fill="#ccd9e8" />
      <rect x="72" y="136" width="416" height="66" rx="13" fill="#bed0e2" />
      <rect x="58" y="162" width="23" height="112" rx="11" fill="#b0c4d8" />
      <rect x="479" y="162" width="23" height="112" rx="11" fill="#b0c4d8" />
      <rect x="84" y="200" width="124" height="70" rx="9" fill="#dce8f4" />
      <rect x="218" y="200" width="123" height="70" rx="9" fill="#dce8f4" />
      <rect x="352" y="200" width="123" height="70" rx="9" fill="#dce8f4" />
      <line x1="146" y1="202" x2="146" y2="268" stroke="#c0d2e6" strokeWidth="1.5" />
      <line x1="280" y1="202" x2="280" y2="268" stroke="#c0d2e6" strokeWidth="1.5" />
      <line x1="413" y1="202" x2="413" y2="268" stroke="#c0d2e6" strokeWidth="1.5" />
      <rect x="84" y="140" width="121" height="60" rx="7" fill="#d0e0f0" />
      <rect x="216" y="140" width="127" height="60" rx="7" fill="#d0e0f0" />
      <rect x="354" y="140" width="119" height="60" rx="7" fill="#d0e0f0" />
      <rect x="188" y="152" width="43" height="44" rx="7" fill="rgba(74,144,217,.5)" transform="rotate(-6 188 152)" />
      <rect x="328" y="154" width="39" height="40" rx="6" fill="rgba(214,168,90,.6)" transform="rotate(5 328 154)" />
      <rect x="90" y="272" width="11" height="26" rx="5" fill="#6a8aaa" />
      <rect x="454" y="272" width="11" height="26" rx="5" fill="#6a8aaa" />
      <rect x="204" y="272" width="11" height="26" rx="5" fill="#6a8aaa" />
      <rect x="349" y="272" width="11" height="26" rx="5" fill="#6a8aaa" />
      <rect x="50" y="82" width="5" height="142" rx="2.5" fill="#8aaac8" />
      <ellipse cx="52" cy="78" rx="21" ry="28" fill="#c8ddf0" opacity=".9" />
      <ellipse cx="52" cy="72" rx="13" ry="18" fill="#ddeeff" />
      <rect x="507" y="226" width="6" height="56" rx="3" fill="#4a90d9" opacity=".6" />
      <ellipse cx="510" cy="220" rx="25" ry="30" fill="#4a90d9" opacity=".42" />
      <ellipse cx="510" cy="210" rx="17" ry="23" fill="#5a9fd8" opacity=".52" />
    </svg>
  );
}

export function FeaturedChairIcon() {
  return (
    <svg viewBox="0 0 120 120" width="72" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="18" y="52" width="84" height="36" rx="10" fill="rgba(74,144,217,.18)" />
      <rect x="24" y="36" width="72" height="22" rx="8" fill="rgba(74,144,217,.22)" />
      <rect x="30" y="54" width="22" height="32" rx="6" fill="rgba(74,144,217,.2)" />
      <rect x="56" y="54" width="22" height="32" rx="6" fill="rgba(74,144,217,.2)" />
      <rect x="12" y="46" width="10" height="42" rx="5" fill="rgba(74,144,217,.13)" />
      <rect x="98" y="46" width="10" height="42" rx="5" fill="rgba(74,144,217,.13)" />
    </svg>
  );
}

export function CollectionIcon({ kind }: CollectionIconProps) {
  if (kind === "dining") {
    return (
      <svg viewBox="0 0 80 60" width="58" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="18" y="20" width="44" height="6" rx="3" fill="rgba(184,203,224,.3)" />
        <rect x="22" y="26" width="5" height="26" rx="2.5" fill="rgba(184,203,224,.22)" />
        <rect x="53" y="26" width="5" height="26" rx="2.5" fill="rgba(184,203,224,.22)" />
        <rect x="8" y="12" width="9" height="36" rx="4.5" fill="rgba(184,203,224,.18)" />
        <rect x="63" y="12" width="9" height="36" rx="4.5" fill="rgba(184,203,224,.18)" />
      </svg>
    );
  }

  if (kind === "bed") {
    return (
      <svg viewBox="0 0 80 60" width="58" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="8" y="28" width="64" height="24" rx="4" fill="rgba(74,144,217,.18)" />
        <rect x="8" y="15" width="64" height="15" rx="4" fill="rgba(74,144,217,.22)" />
        <rect x="12" y="18" width="24" height="12" rx="3" fill="rgba(74,144,217,.22)" />
        <rect x="44" y="18" width="24" height="12" rx="3" fill="rgba(74,144,217,.22)" />
      </svg>
    );
  }

  if (kind === "lamp") {
    return (
      <svg viewBox="0 0 80 60" width="58" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="37" y="6" width="6" height="28" rx="3" fill="rgba(214,168,90,.5)" />
        <ellipse cx="40" cy="40" rx="20" ry="13" fill="rgba(74,144,217,.2)" />
        <ellipse cx="40" cy="43" rx="13" ry="8" fill="rgba(214,168,90,.35)" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 80 60" width="58" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="5" y="28" width="70" height="24" rx="6" fill="rgba(74,144,217,.22)" />
      <rect x="5" y="16" width="70" height="14" rx="4" fill="rgba(74,144,217,.16)" />
      <rect x="9" y="30" width="20" height="20" rx="4" fill="rgba(74,144,217,.2)" />
      <rect x="31" y="30" width="18" height="20" rx="4" fill="rgba(74,144,217,.2)" />
      <rect x="51" y="30" width="20" height="20" rx="4" fill="rgba(74,144,217,.2)" />
    </svg>
  );
}

export function AwardIcon({ kind }: AwardIconProps) {
  if (kind === "britain") {
    return <span className="asset-wordmark" aria-hidden="true">GB</span>;
  }

  return (
    <svg viewBox="0 0 48 48" width="32" height="32" aria-hidden="true" className="asset-icon">
      {kind === "trophy" && (
        <>
          <path d="M16 8h16v8c0 7-4 12-8 12s-8-5-8-12V8Z" fill="#D6A85A" />
          <path d="M12 11H7c0 7 3 11 9 12M36 11h5c0 7-3 11-9 12" fill="none" stroke="#B8892E" strokeWidth="3" strokeLinecap="round" />
          <path d="M24 28v7M17 40h14" stroke="#7A5700" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {kind === "palette" && (
        <>
          <path d="M24 7C14 7 7 14 7 24c0 9 7 17 17 17h3c3 0 4-4 2-6-1-1-1-3 2-3h3c4 0 7-3 7-8 0-10-7-17-17-17Z" fill="#8BADC8" />
          <circle cx="17" cy="19" r="3" fill="#1557A7" />
          <circle cx="25" cy="16" r="3" fill="#D6A85A" />
          <circle cx="31" cy="23" r="3" fill="#2E7D32" />
        </>
      )}
      {kind === "leaf" && (
        <>
          <path d="M38 8C22 9 11 18 10 37c17-1 27-12 28-29Z" fill="#8BC48A" />
          <path d="M12 36c8-9 15-14 25-25" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {kind === "star" && <path d="m24 6 5 12 13 1-10 8 3 13-11-7-11 7 3-13-10-8 13-1 5-12Z" fill="#D6A85A" />}
      {kind === "shield" && (
        <>
          <path d="M24 6 38 11v10c0 10-6 17-14 21-8-4-14-11-14-21V11l14-5Z" fill="none" stroke="#4D667D" strokeWidth="3" />
          <path d="M18 24h12" stroke="#1557A7" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {kind === "recycle" && (
        <>
          <path d="M21 9 14 20h10M31 15l7 11-5 9M14 31h19" fill="none" stroke="#4D667D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m14 20-3-8M38 26l5-6M33 31l5 6" fill="none" stroke="#4D667D" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {kind === "medal" && (
        <>
          <path d="M17 6h14l-4 14h-6L17 6Z" fill="#1557A7" />
          <circle cx="24" cy="29" r="11" fill="#D6A85A" />
          <path d="m24 23 2 4 4 1-3 3 1 5-4-2-4 2 1-5-3-3 4-1 2-4Z" fill="#7A5700" />
        </>
      )}
      {kind === "lab" && (
        <>
          <path d="M19 7h10M21 7v12L11 37c-1 2 1 4 3 4h20c2 0 4-2 3-4L27 19V7" fill="none" stroke="#4D667D" strokeWidth="3" strokeLinecap="round" />
          <path d="M17 32h14" stroke="#1557A7" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {kind === "globe" && (
        <>
          <circle cx="24" cy="24" r="17" fill="none" stroke="#2E7D32" strokeWidth="3" />
          <path d="M7 24h34M24 7c5 5 7 11 7 17s-2 12-7 17M24 7c-5 5-7 11-7 17s2 12 7 17" fill="none" stroke="#2E7D32" strokeWidth="2" />
        </>
      )}
      {kind === "bolt" && <path d="M27 5 10 27h13l-2 16 17-23H25l2-15Z" fill="#D6A85A" />}
      {kind === "card" && (
        <>
          <rect x="7" y="13" width="34" height="22" rx="4" fill="#8BADC8" />
          <path d="M7 20h34" stroke="#1A2E44" strokeWidth="4" />
          <path d="M13 29h10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function ChairMedalVisual() {
  return (
    <svg viewBox="0 0 180 140" width="94" height="94" aria-hidden="true" className="asset-scene">
      <ellipse cx="90" cy="124" rx="54" ry="7" fill="rgba(26,46,68,.12)" />
      <rect x="64" y="34" width="52" height="16" rx="8" fill="#9D5E5E" />
      <rect x="72" y="50" width="10" height="38" fill="#D8E6F2" />
      <rect x="98" y="50" width="10" height="38" fill="#D8E6F2" />
      <path d="M56 88c3-22 16-34 34-34s31 12 34 34H56Z" fill="#B56A5C" />
      <rect x="58" y="84" width="64" height="18" rx="7" fill="#A45C54" />
      <path d="M68 102 60 128M112 102l8 26M81 102l-2 22M99 102l2 22" stroke="#6B3D4C" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

export function ReviewVisual({ kind }: ReviewVisualProps) {
  if (kind === "bedroom") {
    return (
      <svg viewBox="0 0 100 100" width="72" height="72" aria-hidden="true" className="asset-scene">
        <rect x="13" y="26" width="74" height="49" rx="7" fill="#D9E7F3" />
        <rect x="13" y="18" width="74" height="22" rx="7" fill="#B8CFE6" />
        <rect x="19" y="23" width="25" height="18" rx="4" fill="#EAF3FA" />
        <rect x="56" y="23" width="25" height="18" rx="4" fill="#EAF3FA" />
        <rect x="13" y="70" width="74" height="10" rx="4" fill="#8BADC8" />
        <path d="M21 80v10M79 80v10" stroke="#6A8AAA" strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" width="72" height="72" aria-hidden="true" className="asset-scene">
      <rect x="14" y="46" width="72" height="30" rx="10" fill="#D9E7F3" />
      <rect x="19" y="30" width="62" height="23" rx="8" fill="#B8CFE6" />
      <rect x="10" y="41" width="11" height="37" rx="6" fill="#9CBFDF" />
      <rect x="79" y="41" width="11" height="37" rx="6" fill="#9CBFDF" />
      <rect x="25" y="52" width="20" height="22" rx="5" fill="#EAF3FA" />
      <rect x="55" y="52" width="20" height="22" rx="5" fill="#EAF3FA" />
      <path d="M26 78v10M74 78v10" stroke="#6A8AAA" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function BlogVisual({ kind }: BlogVisualProps) {
  if (kind === "chair-trend") {
    return (
      <svg viewBox="0 0 220 130" width="150" height="92" aria-hidden="true" className="asset-scene">
        <rect x="74" y="28" width="72" height="22" rx="11" fill="#8BADC8" />
        <path d="M64 86c4-29 21-45 46-45s42 16 46 45H64Z" fill="#4A90D9" opacity=".65" />
        <rect x="60" y="80" width="100" height="24" rx="10" fill="#D6A85A" opacity=".7" />
        <path d="M76 104 66 126M144 104l10 22M96 104l-3 20M124 104l3 20" stroke="#8BADC8" strokeWidth="7" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "sustainable-room") {
    return (
      <svg viewBox="0 0 220 130" width="150" height="92" aria-hidden="true" className="asset-scene">
        <rect x="42" y="70" width="94" height="32" rx="10" fill="#B8CFE6" />
        <rect x="48" y="48" width="82" height="28" rx="8" fill="#D0E2F0" />
        <path d="M164 32c-30 2-49 21-50 59 33-3 50-24 50-59Z" fill="#8BC48A" />
        <path d="M118 88c15-18 27-32 44-51" stroke="#2E7D32" strokeWidth="5" strokeLinecap="round" />
        <circle cx="56" cy="28" r="12" fill="#D6A85A" opacity=".7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 220 130" width="150" height="92" aria-hidden="true" className="asset-scene">
      <rect x="42" y="52" width="136" height="48" rx="12" fill="#D9E7F3" />
      <rect x="54" y="34" width="112" height="28" rx="10" fill="#B8CFE6" />
      <rect x="32" y="48" width="18" height="54" rx="9" fill="#9CBFDF" />
      <rect x="170" y="48" width="18" height="54" rx="9" fill="#9CBFDF" />
      <rect x="64" y="60" width="38" height="36" rx="7" fill="#EAF3FA" />
      <rect x="118" y="60" width="38" height="36" rx="7" fill="#EAF3FA" />
      <rect x="92" y="24" width="42" height="32" rx="6" fill="#D6A85A" opacity=".65" />
    </svg>
  );
}

export function MapPinIcon() {
  return (
    <svg viewBox="0 0 80 80" width="58" height="58" aria-hidden="true" className="asset-icon">
      <path d="M40 7c-15 0-26 11-26 26 0 19 26 40 26 40s26-21 26-40C66 18 55 7 40 7Z" fill="#1557A7" />
      <circle cx="40" cy="33" r="10" fill="#E8EFF7" />
    </svg>
  );
}
