import ExcelJS from 'exceljs';
import { Period } from '@/generated/prisma/client';

interface Students {
  nim: string;
  name: string;
  major: { stringCode: string };
  reregisterDetail: { semester: number, lecturer: { name: string } };
  transcript: { totalSks: number, ipkTranscript: number };
  _count: { krs: number };
}

interface ExportStudentTakingThesisProps {
  dataPeriod: Period;
  dataStudent: Students[];
}

export async function exportStudentTakingThesis({ data }: { data: ExportStudentTakingThesisProps }) {
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`Daftar Mahasiswa`);

  // Tinggi Row masing masing worksheet
  worksheet.properties.defaultRowHeight = 25;

  const headerTable = [
    'No',
    'NIM',
    'Nama Mahasiswa',
    'Prodi',
    'Dosen Penasehat/Wali Akademik',
    'Semester',
    'Jumlah SKS',
    'IP Semester',
    'Status TA',
  ];

  // <!-------------------Menambahkan DATA MAHASISWA SI---------------------------->

  // === [1] Baris Judul Besar (Merged)
  worksheet.mergeCells("A2:I2")
  const titleCell = worksheet.getCell('A2')
  titleCell.value = `REKAP MAHASISWA PROGRAM TA`
  titleCell.font = { size: 14, bold: true }
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  
  worksheet.mergeCells("A3:I3")
  const subTitleCellA3 = worksheet.getCell('A3')
  subTitleCellA3.value = `${data?.dataPeriod?.name}`
  subTitleCellA3.font = { size: 12, bold: true }
  subTitleCellA3.alignment = { vertical: 'middle', horizontal: 'center' }
  
  worksheet.addRow([])
  const headerSI = worksheet.addRow(headerTable);

  headerSI.height = 30;
  headerSI.eachCell((cell) => {
    cell.font = { size: 12, bold: true }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDDDDDD' },
    }
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
  });
  
  // Ukuran lebar column
  const colWidths = [4, 14, 35, 6, 35, 10, 12, 12, 15];
  colWidths.forEach((w, i) => {
    worksheet.getColumn(i + 1).width = w
  });
  
  data?.dataStudent.forEach((items: Students, i: number) => {
    const rowdata: (string | number)[] = [
      i + 1,
      items?.nim,
      items?.name,
      items?.major?.stringCode || "-",
      items?.reregisterDetail?.lecturer?.name,
      items?.reregisterDetail?.semester || "-",
      items?.transcript?.totalSks || "-",
      items?.transcript?.ipkTranscript || "-",
      (items?._count?.krs > 1 ? "Perpanjang" : "Baru"),
    ];

    const addRow = worksheet.addRow(rowdata);
    addRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
      cell.font = {size: 12},
      cell.alignment = { vertical: 'middle' }
    });
    addRow.height = 30;
  })
  
  
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}