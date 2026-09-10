const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function Leaf(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a10 10 0 0 1-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </svg>
  );
}

export function Sprout(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M7 20h10" />
      <path d="M12 20c0-3.5 0-7-3-9-2-1.3-4-1-5-1 0 2 .5 4 2 5.5S11 18 12 20Z" />
      <path d="M12 20c0-4 1-7 4-8.5 1.7-.85 3-1 4-1 0 2-.5 3.7-2 5.2S15 19 12 20Z" />
    </svg>
  );
}

export function Truck(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M14 18V6a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h1" />
      <path d="M14 9h4l3 3v5a1 1 0 0 1-1 1h-1" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

export function Home(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

export function Snowflake(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 2v20M4.5 6l15 12M19.5 6l-15 12" />
    </svg>
  );
}

export function Store(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 9h16l-1-5H5L4 9Z" />
      <path d="M5 9v11h14V9" />
      <path d="M9 20v-5h6v5" />
    </svg>
  );
}

export function QrIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM21 14v7M17 21h4M21 17.5h.01" />
    </svg>
  );
}

export function Check(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

export function ArrowRight(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export function MapPin(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export const stageIcons = {
  harvest: Sprout,
  cold_storage: Snowflake,
  transport: Truck,
  market: Store,
  delivered: Home,
};
