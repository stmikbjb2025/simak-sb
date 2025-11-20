import ExcelJS from 'exceljs';
import { Major, Period } from '@/generated/prisma/client';

interface Students {
  student: {
    name: string;
    nim: string;
    major: Major;
  },
  semesterStatus: string;
}

interface ExportStudentActiveInactiveProps {
  dataPeriod: Period;
  dataStudentByMajor: {
    major: Major;
    students: Students[];
  }[];
}

export async function exportStudentActiveInactive({ data }: { data: ExportStudentActiveInactiveProps }) {
  
  const workbook = new ExcelJS.Workbook();
  // Iterasi data 
  for (const dataStudent of data?.dataStudentByMajor) {
    const worksheet = workbook.addWorksheet(`Mahasiswa ${dataStudent?.major?.stringCode}`);
  
    // Tinggi Row masing masing worksheet
    worksheet.properties.defaultRowHeight = 25;
  
    const headerTable = [
      'No',
      'NIM',
      'NAMA MAHASISWA',
      'STATUS',
    ];
  
    // <!-------------------Menambahkan DATA MAHASISWA SI---------------------------->
  
    // === [1] Baris Judul Besar (Merged)
    worksheet.mergeCells("A2:C2")
    const titleCell = worksheet.getCell('A2')
    titleCell.value = `DAFTAR MAHASISWA AKTIF DAN NONAKTIF`
    titleCell.font = { size: 14, bold: true }
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
    
    worksheet.mergeCells("A3:C3")
    const subTitleCellA3 = worksheet.getCell('A3')
    subTitleCellA3.value = `PROGRAM STUDI ${dataStudent?.major?.name?.toUpperCase()}`
    subTitleCellA3.font = { size: 12, bold: true }
    subTitleCellA3.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells("A4:C4")
    const subTitleCellA4 = worksheet.getCell('A4')
    subTitleCellA4.value = `${data?.dataPeriod?.name}`
    subTitleCellA4.font = { size: 12, bold: true }
    subTitleCellA4.alignment = { vertical: 'middle', horizontal: 'center' }

    const studentActive = dataStudent?.students.filter((student: Students) => student.semesterStatus === 'AKTIF');
    const studentInactive = dataStudent?.students.filter((student: Students) => student.semesterStatus !== 'AKTIF');
    const students = [...studentActive, ...studentInactive];
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
    const colWidths = [5, 25, 55, 15];
    colWidths.forEach((w, i) => {
      worksheet.getColumn(i + 1).width = w
    });

    students.forEach((items: Students, i: number) => {
      const rowdata: (string | number)[] = [
        i + 1,
        items?.student?.nim,
        items?.student?.name,
        items?.semesterStatus,
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
    
  }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}