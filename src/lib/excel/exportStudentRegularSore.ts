import ExcelJS from 'exceljs';
import { Major, Period } from '@/generated/prisma/client';

interface Students {
  student: {
    name: string;
    nim: string;
    major: Major;
  },
  campusType: string;
}

interface DataStudent {
  campusType: string;
  students: Students[];
}

interface ExportStudentRegularSoreProps {
  dataPeriod: Period;
  dataStudents: DataStudent[];
};

export async function exportStudentRegularSore({ data }: { data: ExportStudentRegularSoreProps }) {
  
  const workbook = new ExcelJS.Workbook();
  // Iterasi data 
  for (const dataStudent of data?.dataStudents) {
    const worksheet = workbook.addWorksheet(`Mahasiswa ${dataStudent?.campusType}`);
  
    // Tinggi Row masing masing worksheet
    worksheet.properties.defaultRowHeight = 25;
  
    const headerTable = [
      'No',
      'NIM',
      'NAMA MAHASISWA',
    ];
  
    // <!-------------------Menambahkan DATA MAHASISWA SI---------------------------->
  
    // === [1] Baris Judul Besar (Merged)
    worksheet.mergeCells("A2:C2")
    const titleCell = worksheet.getCell('A2')
    titleCell.value = `DAFTAR MAHASISWA REGULAR ${dataStudent.campusType}`
    titleCell.font = { size: 14, bold: true }
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells("A3:C3")
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
    const colWidths = [4, 25, 55];
    colWidths.forEach((w, i) => {
      worksheet.getColumn(i + 1).width = w
    });
    
    dataStudent?.students.forEach((items: Students, i: number) => {
      const rowdata: (string | number)[] = [
        i + 1,
        items?.student?.nim,
        items?.student?.name,
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