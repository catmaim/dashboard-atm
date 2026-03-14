import { AlertTriangle, Building2, CalendarClock, Landmark, MonitorSmartphone } from 'lucide-react';
import { DashboardCard } from '@/components/DashboardCard';
import { DataTable } from '@/components/DataTable';
import { AtmMap } from '@/components/AtmMap';
import { loadDashboardData, type DashboardRecord } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

const getNumericFields = (rows: DashboardRecord[]): number[] => {
  return rows.flatMap((row) =>
    Object.values(row).filter((value): value is number => typeof value === 'number' && Number.isFinite(value)),
  );
};

const formatCompact = (value: number): string =>
  new Intl.NumberFormat('th-TH', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

export default async function HomePage() {
  let branchData: DashboardRecord[] = [];
  let atmData: DashboardRecord[] = [];
  let loadError: string | null = null;

  try {
    const result = await loadDashboardData();
    branchData = result.branchData;
    atmData = result.atmData;
  } catch {
    loadError = 'ไม่สามารถโหลดข้อมูลจาก Google Sheets ได้ชั่วคราว แต่หน้าแดชบอร์ดยังเปิดใช้งานได้';
  }

  const branchNumbers = getNumericFields(branchData);
  const atmNumbers = getNumericFields(atmData);

  const totalBranchScore = branchNumbers.reduce((sum, value) => sum + value, 0);
  const totalAtmScore = atmNumbers.reduce((sum, value) => sum + value, 0);
  const avgAtmHealth = atmNumbers.length ? totalAtmScore / atmNumbers.length : 0;

  return (
    <main className="min-h-screen bg-aura px-6 py-8 md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="card p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Executive monitoring</p>
          <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Branch & ATM Performance Dashboard</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            แดชบอร์ดสรุปภาพรวมข้อมูลจาก Google Sheets สำหรับการนำเสนอผู้บริหาร โดยเน้นภาพรวมสาขาและเครื่อง ATM แบบเรียลไทม์พร้อมดีไซน์ระดับพรีเมี่ยม
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
            <CalendarClock className="h-4 w-4" />
            Refreshed every 5 minutes
          </div>
        </header>

        {loadError ? (
          <section className="card flex items-center gap-3 border-amber-400/30 bg-amber-500/10 p-4 text-amber-100">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm">{loadError}</p>
          </section>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Total Branch Records"
            value={branchData.length.toLocaleString('th-TH')}
            description="จำนวนแถวข้อมูลจากชีตสาขา"
            icon={<Building2 className="h-5 w-5" />}
          />
          <DashboardCard
            title="Total ATM Records"
            value={atmData.length.toLocaleString('th-TH')}
            description="จำนวนแถวข้อมูลจากชีต ATM"
            icon={<MonitorSmartphone className="h-5 w-5" />}
          />
          <DashboardCard
            title="Branch Numeric Volume"
            value={formatCompact(totalBranchScore)}
            description="ผลรวมตัวเลขทั้งหมดจากข้อมูลสาขา"
            icon={<Landmark className="h-5 w-5" />}
          />
          <DashboardCard
            title="ATM Health Index"
            value={formatCompact(avgAtmHealth)}
            description="ค่าเฉลี่ยตัวเลขจากข้อมูล ATM"
            icon={<MonitorSmartphone className="h-5 w-5" />}
          />
        </section>

        <section>
          <AtmMap atmRows={atmData} />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <DataTable title="Branch Data" rows={branchData} />
          <DataTable title="ATM Data" rows={atmData} />
        </section>
      </div>
    </main>
  );
}
