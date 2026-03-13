const BRANCH_SHEET_ID = '1QYlJKK4ijp-oeMUKMAPBD_buuPLP4wUDHNmOgzJmtPk';
const BRANCH_GID = '695915812';
const ATM_SHEET_ID = '1nRuVfB2XAFIsVFQr_CoJwPKRFC3NUHSj3icOepoL8mI';
const ATM_GID = '1100078309';

export type DashboardRecord = Record<string, string | number | null>;

const toNumber = (value: string): number | string => {
  const parsed = Number(value.replace(/,/g, '').trim());
  return Number.isFinite(parsed) ? parsed : value;
};

const normalizeRow = (headers: string[], row: string[]): DashboardRecord => {
  return headers.reduce<DashboardRecord>((acc, header, index) => {
    const key = header.trim() || `column_${index + 1}`;
    const rawValue = row[index] ?? '';
    acc[key] = rawValue.length ? toNumber(rawValue) : null;
    return acc;
  }, {});
};

const getCsvUrl = (sheetId: string, gid: string): string =>
  `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;

const parseCsvLine = (line: string): string[] => {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
};

const parseCsv = (csv: string): DashboardRecord[] => {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => normalizeRow(headers, parseCsvLine(line)));
};

const fetchSheet = async (sheetId: string, gid: string): Promise<DashboardRecord[]> => {
  const response = await fetch(getCsvUrl(sheetId, gid), {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet data (${response.status})`);
  }

  const csv = await response.text();
  return parseCsv(csv);
};

export const loadDashboardData = async () => {
  const [branchData, atmData] = await Promise.all([
    fetchSheet(BRANCH_SHEET_ID, BRANCH_GID),
    fetchSheet(ATM_SHEET_ID, ATM_GID),
  ]);

  return { branchData, atmData };
};
