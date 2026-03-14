'use client';

import { useMemo, useState } from 'react';
import { MapPin, Radar, Search } from 'lucide-react';
import type { DashboardRecord } from '@/lib/googleSheets';

type AtmPoint = {
  id: string;
  name: string;
  x: number;
  y: number;
  status: 'normal' | 'warning';
  source: 'coords' | 'estimated';
};

type AtmMapProps = {
  atmRows: DashboardRecord[];
};

type StatusFilter = 'all' | 'normal' | 'warning';
type SourceFilter = 'all' | 'coords' | 'estimated';

const normalizeKey = (key: string): string => key.toLowerCase().replace(/[^a-z0-9ก-๙]/g, '');

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

const createEstimatedPoint = (index: number, total: number): { x: number; y: number } => {
  const goldenAngle = 137.508;
  const angle = ((index * goldenAngle) * Math.PI) / 180;
  const radius = Math.sqrt((index + 0.5) / Math.max(1, total));

  const cx = 50;
  const cy = 54;
  const maxR = 38;

  const x = cx + Math.cos(angle) * radius * maxR;
  const y = cy + Math.sin(angle) * radius * maxR * 0.72;

  return {
    x: Math.min(96, Math.max(4, x)),
    y: Math.min(94, Math.max(8, y)),
  };
};

const toMapPoints = (rows: DashboardRecord[]): AtmPoint[] => {
  const latAliases = ['lat', 'latitude', 'y', 'coordlat', 'ละติจูด'];
  const lngAliases = ['lng', 'lon', 'long', 'longitude', 'x', 'coordlng', 'ลองจิจูด'];
  const nameAliases = ['name', 'atmname', 'atm', 'branchname', 'location', 'จุดบริการ', 'ชื่อสาขา'];
  const statusAliases = ['status', 'state', 'health', 'สถานะ'];

  const raw = rows.slice(0, 300);

  return raw.map((row, index) => {
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
        source: 'coords',
      };
    }

    const estimated = createEstimatedPoint(index, raw.length);

    return {
      id: `${name}-${index}`,
      name,
      x: estimated.x,
      y: estimated.y,
      status,
      source: 'estimated',
    };
  });
};

export function AtmMap({ atmRows }: AtmMapProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [query, setQuery] = useState('');

  const points = useMemo(() => toMapPoints(atmRows), [atmRows]);

  const filteredPoints = useMemo(
    () =>
      points.filter((point) => {
        const statusOk = statusFilter === 'all' ? true : point.status === statusFilter;
        const sourceOk = sourceFilter === 'all' ? true : point.source === sourceFilter;
        const queryOk = query.trim().length === 0 ? true : point.name.toLowerCase().includes(query.toLowerCase().trim());

        return statusOk && sourceOk && queryOk;
      }),
    [points, query, sourceFilter, statusFilter],
  );

  const warningCount = filteredPoints.filter((point) => point.status === 'warning').length;
  const coordCount = filteredPoints.filter((point) => point.source === 'coords').length;

  return (
    <section className="card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">ATM Location Pulse Map</h2>
          <p className="text-xs text-slate-400">แผนที่จุดกดเงินพร้อม animation และ filter เพื่อดูสถานะ/จุดที่ต้องติดตาม</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
          <Radar className="h-4 w-4" />
          {filteredPoints.length.toLocaleString('th-TH')} points
        </div>
      </div>

      <div className="mb-4 grid gap-3 rounded-xl border border-slate-700/70 bg-slate-900/50 p-3 md:grid-cols-3">
        <label className="space-y-1">
          <span className="text-xs text-slate-400">ค้นหาจุด ATM</span>
          <span className="relative block">
            <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="พิมพ์ชื่อสาขา/ATM"
              className="w-full rounded-lg border border-slate-700 bg-slate-950/70 py-2 pl-8 pr-3 text-sm text-slate-100 outline-none ring-cyan-500/50 transition focus:ring"
            />
          </span>
        </label>

        <label className="space-y-1">
          <span className="text-xs text-slate-400">สถานะ</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/50 transition focus:ring"
          >
            <option value="all">ทั้งหมด</option>
            <option value="normal">Normal</option>
            <option value="warning">Warning</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs text-slate-400">แหล่งพิกัด</span>
          <select
            value={sourceFilter}
            onChange={(event) => setSourceFilter(event.target.value as SourceFilter)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/50 transition focus:ring"
          >
            <option value="all">ทั้งหมด</option>
            <option value="coords">มีพิกัดจริง (lat/lng)</option>
            <option value="estimated">พิกัดประมาณการ</option>
          </select>
        </label>
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
          <path d="M4 58 C20 45, 34 42, 48 44 C58 46, 69 52, 97 66" className="map-ridge" />

          {filteredPoints.map((point, index) => (
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

      <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-4">
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
          <p className="text-xs text-slate-400">Total ATM Points</p>
          <p className="mt-1 text-xl font-semibold text-cyan-200">{filteredPoints.length.toLocaleString('th-TH')}</p>
        </div>
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
          <p className="text-xs text-slate-400">Warning Signals</p>
          <p className="mt-1 text-xl font-semibold text-amber-200">{warningCount.toLocaleString('th-TH')}</p>
        </div>
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
          <p className="text-xs text-slate-400">Normal Signals</p>
          <p className="mt-1 text-xl font-semibold text-emerald-200">
            {(filteredPoints.length - warningCount).toLocaleString('th-TH')}
          </p>
        </div>
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
          <p className="text-xs text-slate-400">Points with Real Coordinates</p>
          <p className="mt-1 text-xl font-semibold text-sky-200">{coordCount.toLocaleString('th-TH')}</p>
        </div>
      </div>

      <div className="mt-3 inline-flex items-center gap-2 text-xs text-slate-400">
        <MapPin className="h-3.5 w-3.5" />
        ถ้าไม่มีพิกัด lat/lng ในชีต ระบบจะแสดงพิกัดประมาณการเพื่อให้เห็นภาพรวมและใช้ filter ตรวจสอบได้สะดวก
      </div>
    </section>
  );
}
