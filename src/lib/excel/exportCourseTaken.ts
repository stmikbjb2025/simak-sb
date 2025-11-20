import ExcelJS from 'exceljs';
import { Period } from '@/generated/prisma/client';

interface ExportCourseTakenProps{
  dataPeriod: Period;
  years: number[];
  dataCoursesByMajor: {
    major: {name: string; stringCode: string};
    courses: Record<string, string | number>[];
  }[]
}

export async function exportCourseTaken({ data }: { data: ExportCourseTakenProps }) {
  
  const workbook = new ExcelJS.Workbook();
  // Iterasi data 
  for (const dataCourses of data?.dataCoursesByMajor) {
    const worksheet = workbook.addWorksheet(`Mata Kuliah ${dataCourses?.major?.stringCode}`);
  
    // Tinggi Row masing masing worksheet
    worksheet.properties.defaultRowHeight = 25;
    // <!-------------------Menambahkan DATA  MATKUL SI---------------------------->
  
    // === [1] Baris Judul Besar (Merged)
    worksheet.mergeCells('A2:P2');
    const titleCell = worksheet.getCell('A2')
    titleCell.value = `REKAPITULASI MATA KULIAH PROGRAM STUDI ${dataCourses?.major?.name?.toUpperCase()}`
    titleCell.font = { size: 14, bold: true }
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
    
    worksheet.mergeCells('A3:P3');
    const subTitleCell = worksheet.getCell('A3')
    subTitleCell.value = `${data?.dataPeriod?.name}`
    subTitleCell.font = { size: 12, bold: true }
    subTitleCell.alignment = { vertical: 'middle', horizontal: 'center' }

    // ukuran lebar column
    const colWidths = [4, 18, 60, 8, 8, 8, 8, 10, ...data?.years.map(() => 8) ,10];
    colWidths.forEach((w, i) => (worksheet.getColumn(i + 1).width = w));
    const strColumn = ['A', 'B', 'C', 'D','E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    
    
    // TABLE
    worksheet.mergeCells("A5:A6");
    worksheet.mergeCells("B5:B6");
    worksheet.mergeCells("C5:C6");
    worksheet.mergeCells("D5:H5"); // Mahasiswa (jumlah)
    worksheet.mergeCells(`I5:${strColumn[colWidths.length - 1]}5`); // Angkatan (jumlah)

    worksheet.getCell("A5").value = "No.";
    worksheet.getCell("B5").value = "Kode Mata Kuliah";
    worksheet.getCell("C5").value = "Nama Mata Kuliah";
    worksheet.getCell("D5").value = "Mahasiswa (jumlah)";
    worksheet.getCell("I5").value = "Angkatan (jumlah)";

    const headerRow6 = [
      "BJB",
      "BJM",
      "ONLINE",
      "SORE",
      "Total",
      ...data?.years.map((year: number) => year.toString()),
      "Total",
    ];
    worksheet.spliceRows(6, 1, ["", "", "", ...headerRow6]);

    // Styling header
    [5, 6].forEach((r) => {
      worksheet.getRow(r).font = { bold: true, size: 12 };
      worksheet.getRow(r).alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    });

    // Border header
    for (let r = 5; r <= 6; r++) {
      for (let c = 1; c <= colWidths.length; c++) {
        worksheet.getCell(r, c).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    }

    dataCourses?.courses.forEach((items: Record<string, string | number>, i: number) => {
      const rowdata: (string | number)[] = [
        i + 1,
        items?.code,
        items?.name,
        items?.BJB,
        items?.BJM,
        items?.ONLINE,
        items?.SORE,
        items?.totalStudents,
        ...data?.years.map((year: number) => items[year] || 0),
        items?.totalStudents,
      ];

      const addRow = worksheet.addRow(rowdata)
      addRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
      cell.font = {size: 12},
      cell.alignment = { vertical: 'middle' }
      })
    })
  }
  
  
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}