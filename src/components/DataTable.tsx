import type { DashboardRecord } from '@/lib/googleSheets';

type DataTableProps = {
  title: string;
  rows: DashboardRecord[];
};

const printableValue = (value: string | number | null): string => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return typeof value === 'number' ? value.toLocaleString() : value;
};

export function DataTable({ title, rows }: DataTableProps) {
  const columns = rows.length ? Object.keys(rows[0]) : [];

  return (
    <section className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="rounded-full bg-slate-700/60 px-3 py-1 text-xs text-slate-300">{rows.length} records</span>
      </div>
      <div className="max-h-[360px] overflow-auto rounded-xl border border-slate-800/80">
        <table className="min-w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-slate-900/90 backdrop-blur">
            <tr>
              {columns.map((column) => (
                <th key={column} className="border-b border-slate-800 px-4 py-3 text-left font-medium text-slate-300">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${title}-${index}`} className="odd:bg-slate-900/60 even:bg-slate-900/20">
                {columns.map((column) => (
                  <td key={column} className="border-b border-slate-800/60 px-4 py-2 text-slate-200">
                    {printableValue(row[column] as string | number | null)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
