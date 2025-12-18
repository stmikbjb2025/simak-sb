import { format } from 'date-fns';
import ExcelJS from 'exceljs';
import { lecturerName } from '../utils';

export async function exportSchedule({ data }: { data: any }) {
  const workbook = new ExcelJS.Workbook();

  for (const schedule of data?.scheduleDetail) {
    const worksheet = workbook.addWorksheet(`${schedule?.title}`);
  
    // Tinggi Row masing masing worksheet
    worksheet.properties.defaultRowHeight = 30;
    const strColumn = ['A', 'B', 'C', 'D','E', 'F', 'G', 'H', 'I', 'J']
    const headerTable = [
      'HARI',
      'JAM',
      'KODE',
      'MATA KULIAH',
      'SKS',
      'KLS',
      'SMT',
      'PRODI',
      'RUANG',
      'DOSEN PENGAJAR',
    ];
  
    // <!-------------------Menambahkan DATA MAHASISWA SI---------------------------->
  
    // === [1] Baris Judul Besar (Merged)
    worksheet.mergeCells("A2:J2")
    const titleCell = worksheet.getCell('A2')
    titleCell.value = `JADWAL PERKULIAHAN SEMESTER ${data?.period?.name.toUpperCase()}`
    titleCell.font = { size: 16, bold: true, name: 'Times New Roman', family: 1 }
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
    
    worksheet.mergeCells("A3:J3")
    const subTitleCellA3 = worksheet.getCell('A3')
    subTitleCellA3.value = `STMIK BANJARBARU`
    subTitleCellA3.font = { size: 16, bold: true, name: 'Times New Roman', family: 1 }
    subTitleCellA3.alignment = { vertical: 'middle', horizontal: 'center' }
    
    worksheet.addRow([])
    const headerSI = worksheet.addRow(headerTable);
  
    headerSI.height = 25;
    headerSI.eachCell((cell) => {
      cell.font = {
        size: 12,
        name: 'Times New Roman',
        family: 1,
        bold: true
      }
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

    const courseColumnsIndex = headerTable.indexOf('MATA KULIAH') + 1;
    const lecturerColumnsIndex = headerTable.indexOf('DOSEN PENGAJAR') + 1;
    
    // Ukuran lebar column
    const colWidths = [10, 14, 14, 45, 8, 10, 8, 10, 10, 45];
    colWidths.forEach((w, i) => {
      worksheet.getColumn(i + 1).width = w
    });
    
    schedule?.schedules.forEach((items: any[], i: number) => {
      for (const element of items) {
        const frontTitle = element?.academicClass?.lecturer?.frontTitle;
        const name = element?.academicClass?.lecturer?.name;
        const backTitle = element?.academicClass?.lecturer?.backTitle;
        const rowdata: (string | number)[] = [
          element?.dayName,
          `${format(element?.time?.timeStart, 'HH.mm') } - ${format(element?.time?.timeFinish, 'HH.mm')}`,
          element?.academicClass?.course?.code,
          element?.academicClass?.course?.name,
          element?.academicClass?.course?.sks,
          element?.academicClass?.name,
          element?.academicClass?.semester,
          element?.academicClass?.course?.major?.stringCode,
          element?.room?.name,
          `${frontTitle ? frontTitle + " " : ""}${name}${backTitle ? ", " + backTitle : ""}`,
        ];
        const addRow = worksheet.addRow(rowdata);
        addRow.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          },
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
              argb: `${(element.dayName === "SENIN" && "c6e0b4")
                || (element.dayName === "SELASA" && "bdd7ee")
                || (element.dayName === "RABU" && "ffe699")
                || (element.dayName === "KAMIS" && "dbdbdb")
                || (element.dayName === "JUMAT" && "f8cbad")
                || (element.dayName === "SABTU" && "b4c6e7")
                || (element.dayName === "MINGGU" && "d9d9d9")}`
            },
          }
          cell.font = {
            size: 11,
            name: 'Times New Roman',
            family: 1,

          },
          cell.alignment = { vertical: 'middle', horizontal: 'center' }
        });
        addRow.height = 25;

        worksheet.eachRow((row, rowNumber) => {
          const cellCourse = row.getCell(courseColumnsIndex);
          const cellLecturer = row.getCell(lecturerColumnsIndex);
          if (rowNumber > 5) { // Skip header row
            cellCourse.alignment = { vertical: 'middle' }
            cellLecturer.alignment = { vertical: 'middle' }
          }
        });
      }
    })
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}