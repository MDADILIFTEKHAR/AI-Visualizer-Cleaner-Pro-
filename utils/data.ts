import { DataSet, ColumnProfile, DataIssue, DataRow, PivotConfig } from '../types';
import * as XLSX from 'xlsx';

// --- Parsing ---

export const parseFile = async (file: File): Promise<DataSet> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        let rows: any[] = [];
        
        // Universal parser using ArrayBuffer for better compatibility
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        rows = XLSX.utils.sheet_to_json(worksheet);

        if (rows.length === 0) {
          throw new Error("No data found in file");
        }

        const columns = Object.keys(rows[0]);
        const profile = profileColumns(rows, columns);
        const issues = detectIssues(rows, profile);

        resolve({
          name: file.name,
          rows,
          columns,
          profile,
          issues
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

// --- Profiling ---

const profileColumns = (rows: any[], columns: string[]): ColumnProfile[] => {
  return columns.map(col => {
    let nonNullValues = rows.map(r => r[col]).filter(v => v !== null && v !== undefined && v !== '');
    const missingCount = rows.length - nonNullValues.length;
    const uniqueCount = new Set(nonNullValues).size;
    
    // Detect type
    const isNumber = nonNullValues.every(v => !isNaN(Number(v)));
    const isDate = nonNullValues.every(v => !isNaN(Date.parse(v)));
    const type = isNumber ? 'number' : isDate ? 'date' : 'string';
    
    // Geo detection (naive)
    const lowerName = col.toLowerCase();
    const isGeo = ['lat', 'lon', 'latitude', 'longitude', 'city', 'country', 'state'].includes(lowerName);

    return {
      name: col,
      type,
      missingCount,
      uniqueCount,
      sample: nonNullValues.slice(0, 5),
      isGeo
    };
  });
};

// --- Issue Detection ---

const detectIssues = (rows: any[], profile: ColumnProfile[]): DataIssue[] => {
  const issues: DataIssue[] = [];

  // Missing Values
  profile.forEach(col => {
    if (col.missingCount > 0) {
      issues.push({
        id: `missing-${col.name}`,
        type: 'missing',
        severity: col.missingCount > rows.length * 0.1 ? 'high' : 'medium',
        description: `Column '${col.name}' has ${col.missingCount} missing values.`,
        column: col.name,
        affectedRows: []
      });
    }
  });

  // Duplicates
  const seen = new Set();
  const duplicateIndices: number[] = [];
  rows.forEach((row, idx) => {
    const s = JSON.stringify(row);
    if (seen.has(s)) duplicateIndices.push(idx);
    else seen.add(s);
  });

  if (duplicateIndices.length > 0) {
    issues.push({
      id: 'duplicates',
      type: 'duplicate',
      severity: 'medium',
      description: `Found ${duplicateIndices.length} duplicate rows.`,
      affectedRows: duplicateIndices
    });
  }

  return issues;
};

// --- Pivot Logic ---

export const generatePivotTable = (data: DataRow[], config: PivotConfig) => {
  const { rows, columns, values } = config;
  const result: any = {};
  
  // Grouping
  data.forEach(row => {
    const rowKey = rows.map(r => row[r]).join(' - ') || 'Total';
    const colKey = columns.map(c => row[c]).join(' - ') || 'Value';

    if (!result[rowKey]) result[rowKey] = {};
    if (!result[rowKey][colKey]) {
      result[rowKey][colKey] = { count: 0, sum: 0, min: Infinity, max: -Infinity, values: [] };
    }

    const valField = values[0]?.field;
    const val = valField ? Number(row[valField]) : 0;
    
    const cell = result[rowKey][colKey];
    cell.count += 1;
    if (!isNaN(val)) {
        cell.sum += val;
        cell.min = Math.min(cell.min, val);
        cell.max = Math.max(cell.max, val);
        cell.values.push(val);
    }
  });

  return result;
};

// --- Cleaning Actions ---

export const cleanMissingValues = (dataset: DataSet, column: string, strategy: 'mean' | 'remove'): DataSet => {
    let newRows = [...dataset.rows];
    
    if (strategy === 'remove') {
        newRows = newRows.filter(r => r[column] !== null && r[column] !== undefined && r[column] !== '');
    } else if (strategy === 'mean') {
        const validValues = newRows.map(r => Number(r[column])).filter(v => !isNaN(v));
        const sum = validValues.reduce((a, b) => a + b, 0);
        const mean = sum / validValues.length;
        
        newRows = newRows.map(r => {
            if (r[column] === null || r[column] === undefined || r[column] === '') {
                return { ...r, [column]: mean };
            }
            return r;
        });
    }

    // Re-profile
    const newProfile = profileColumns(newRows, dataset.columns);
    const newIssues = detectIssues(newRows, newProfile);

    return {
        ...dataset,
        rows: newRows,
        profile: newProfile,
        issues: newIssues
    };
};

export const removeDuplicates = (dataset: DataSet): DataSet => {
    const seen = new Set();
    const newRows: any[] = [];
    
    dataset.rows.forEach(row => {
        // Create a canonical string representation for the row to detect exact duplicates
        const s = JSON.stringify(row);
        if (!seen.has(s)) {
            seen.add(s);
            newRows.push(row);
        }
    });

    const newProfile = profileColumns(newRows, dataset.columns);
    const newIssues = detectIssues(newRows, newProfile);

    return {
        ...dataset,
        rows: newRows,
        profile: newProfile,
        issues: newIssues
    };
};