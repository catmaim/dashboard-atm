import { MapPin, Radar } from 'lucide-react';
import type { DashboardRecord } from '@/lib/googleSheets';

type AtmPoint = {
  id: string;
  name: string;
  x: number;
  y: number;
  status: 'normal' | 'warning';
};

type AtmMapProps = {
  atmRows: DashboardRecord[];
};

const normalizeKey = (key: string): string => key.toLowerCase().replace(/[^a-z0-9]/g, '');

const findValueByAliases = (row: DashboardRecord, aliases: string[]): string | number | null => {
  const entries = Object.entries(row);
  const found = entries.find(([key]) => aliases.includes(normalizeKey(key)));
  return found ? found[1] : null;
};

const toNumber = (value: string | number | null): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value.replace(/,/g, '').trim());
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const hashText = (text: string): number => {
  let hash = 0;

  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }

  return hash;
};

const createFallbackPoint = (row: DashboardRecord, index: number): { x: number; y: number } => {
  const seed = JSON.stringify(row) || `${index}`;
  const hash = hashText(seed);

  const x = 8 + (hash % 84);
  const y = 12 + ((hash >> 8) % 76);

  return { x, y };
};

const toMapPoints = (rows: DashboardRecord[]): AtmPoint[] => {
  const latAliases = ['lat', 'latitude', 'y', 'coordlat'];
  const lngAliases = ['lng', 'lon', 'long', 'longitude', 'x', 'coordlng'];
  const nameAliases = ['name', 'atmname', 'atm', 'branchname', 'location', 'จุดบริการ', 'ชื่อสาขา'];
  const statusAliases = ['status', 'state', 'health', 'สถานะ'];

  const points = rows.slice(0, 120).map((row, index) => {
    const lat = toNumber(findValueByAliases(row, latAliases));
    const lng = toNumber(findValueByAliases(row, lngAliases));
    const nameRaw = findValueByAliases(row, nameAliases);
    const statusRaw = findValueByAliases(row, statusAliases);

    const name = typeof nameRaw === 'string' && nameRaw.trim().length > 0 ? nameRaw : `ATM #${index + 1}`;

    const statusText = `${statusRaw ?? ''}`.toLowerCase();
    const status: 'normal' | 'warning' = /down|offline|fail|warning|เสีย|ขัดข้อง/.test(statusText)
      ? 'warning'
      : 'normal';

    if (lat !== null && lng !== null && lat <= 90 && lat >= -90 && lng <= 180 && lng >= -180) {
      const x = ((lng + 180) / 360) * 100;
      const y = ((90 - lat) / 180) * 100;
      return {
        id: `${name}-${index}`,
        name,
        x: Math.min(95, Math.max(5, x)),
        y: Math.min(95, Math.max(5, y)),
        status,
      };
    }

    const fallback = createFallbackPoint(row, index);

    return {
      id: `${name}-${index}`,
      name,
      x: fallback.x,
      y: fallback.y,
      status,
    };
  });

  return points;
};

export function AtmMap({ atmRows }: AtmMapProps) {
  const points = toMapPoints(atmRows);
  const warningCount = points.filter((point) => point.status === 'warning').length;

  return (
    <section className="card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">ATM Location Pulse Map</h2>
          <p className="text-xs text-slate-400">แผนที่จุดกดเงินพร้อม animation เพื่อดูการกระจายตัวและสถานะโดยรวม</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
          <Radar className="h-4 w-4" />
          {points.length.toLocaleString('th-TH')} points
        </div>
      </div>

      <div className="map-stage relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/70 p-2">
        <svg viewBox="0 0 100 100" className="h-[380px] w-full rounded-xl bg-slate-950/70">
          <defs>
            <linearGradient id="mapGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="100" height="100" fill="url(#mapGlow)" />

          {points.map((point, index) => (
            <g key={point.id}>
              <circle
                cx={point.x}
                cy={point.y}
                r="0.85"
                className={point.status === 'warning' ? 'fill-amber-300' : 'fill-emerald-300'}
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="1.2"
                className={point.status === 'warning' ? 'map-pulse-warning' : 'map-pulse-normal'}
                style={{ animationDelay: `${(index % 18) * 0.12}s` }}
              />
            </g>
          ))}
        </svg>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.18),transparent_36%),radial-gradient(circle_at_78%_68%,rgba(34,197,94,0.14),transparent_32%)]" />
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
          <p className="text-xs text-slate-400">Total ATM Points</p>
          <p className="mt-1 text-xl font-semibold text-cyan-200">{points.length.toLocaleString('th-TH')}</p>
        </div>
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
          <p className="text-xs text-slate-400">Warning Signals</p>
          <p className="mt-1 text-xl font-semibold text-amber-200">{warningCount.toLocaleString('th-TH')}</p>
        </div>
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
          <p className="text-xs text-slate-400">Normal Signals</p>
          <p className="mt-1 text-xl font-semibold text-emerald-200">
            {(points.length - warningCount).toLocaleString('th-TH')}
          </p>
        </div>
      </div>

      <div className="mt-3 inline-flex items-center gap-2 text-xs text-slate-400">
        <MapPin className="h-3.5 w-3.5" />
        ถ้าไม่มีพิกัด lat/lng ในชีต ระบบจะกระจายจุดแบบอัตโนมัติเพื่อให้เห็นภาพรวมบนแผนที่ได้ทันที
      </div>
    </section>
  );
}
