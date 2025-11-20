import ExcelJS from "exceljs";

type Grade = {
  id: string;
  name: string;
  acronym: string;
};

type AssessmentDetail = {
  id: string;
  percentage: number;
  grade: Grade;
}

type Course = {
  id: string;
  code: string;
  name: string;
  major: {
    id: string;
    name: string;
  };
  assessment: {
    name: string;
    assessmentDetail: AssessmentDetail[];
  };
}

type KhsGrade = {
  id: string;
  assessmentDetailId: string;
  assessmentDetail: AssessmentDetail;
  score: number;
  percentage: number;
}

interface AcademicClass {
  id: string;
  name: string;
  course: Course;
  lecturer: {
    name: string;
  };
  assessment: {
    assessmentDetail: AssessmentDetail[];
  };
  period: {
    id: string;
    name: string;
  }
}

interface KhsDetail {
  id: string;
  finalScore: number;
  gradeLetter: string;
  khs: {
    student: {
      id: string;
      name: string;
      nim: string;
    }
  };
  khsGrade: KhsGrade[];
}

export async function exportAssessmentTemplate(data: { academicClass: AcademicClass; khsDetails: KhsDetail[] }) {
  const assessmentDetails = data?.academicClass?.course.assessment?.assessmentDetail || [];

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`${data?.academicClass?.course.code}-${data?.academicClass?.course?.name.replace(/[*?:\\/\[\]]/g, ' ')}`);
  worksheet.properties.defaultRowHeight = 25;
  // SET HEADERS
  const headersRow1 = [
    { header: 'no', key: 'no' },
    { header: 'nim', key: 'nim' },
    { header: 'name', key: 'name' },
    ...assessmentDetails.map((detail: AssessmentDetail) => ({
      header: detail.grade.name ?? "Unknown",
      key: detail.grade.id,
    })),
    { header: 'finalScore', key: 'finalScore' },
    { header: 'gradeLetter', key: 'gradeLetter' },
    { header: 'uids', key: 'uids' }
  ]

  // COlUMN HURUF
  const strColumn = ['A', 'B', 'C', 'D','E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
  const headers = [
    'No',
    'NIM',
    "Nama Mahasiswa",
    ...assessmentDetails.map((detail: AssessmentDetail) => `${detail.grade?.name} (${detail?.percentage}%)` || "Unknown"),
    "Nilai Akhir",
    "Abs",
    "uids",
  ]

  worksheet.columns = headersRow1;
  
  const row1 = worksheet.getRow(1);
  row1.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '000000' },
  }
  row1.font = {
    color: { argb: '000000' }
  }


// DATA-DATA HEADING dan MATKUL
    // === [1] Baris Judul Besar (Merged)
  worksheet.mergeCells("A2:K2")
  const titleCell = worksheet.getCell('A2')
  titleCell.value = 'DAFTAR NILAI MATA KULIAH'
  titleCell.font = { size: 14, bold: true }
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  
  // === [2] Baris Sub Judul Besar (Merged)
  worksheet.mergeCells("A3:K3")
  const subTitleCell = worksheet.getCell('A3')
  subTitleCell.value = "PASTIKAN CELL TIDAK DIUBAH, AGAR IMPORT BERJALAN DENGAN BAIK."
  subTitleCell.font = { size: 11, bold: true }
  subTitleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  
  // === [3] Baris Sub Judul 1 Besar (Merged)
  // worksheet.mergeCells('A3', String.fromCharCode(67 + assessmentDetails.length + 2) + '1')
  worksheet.mergeCells("A4:K4")
  const subTitle1Cell = worksheet.getCell('A4')
  subTitle1Cell.value = "DISARANKAN UNTUK MENYIMPAN DI FORMAT .xlsx"
  subTitle1Cell.font = { size: 11, bold: true }
  subTitle1Cell.alignment = { vertical: 'middle', horizontal: 'center' }
  subTitle1Cell.border = {
    bottom: { style: 'medium' },
  }
  
  // === [4] Baris Matkul
  worksheet.mergeCells("A6:B6")
  const matkul = worksheet.getCell('A6')
  matkul.value = "Mata Kuliah"
  matkul.font = { size: 11, }
  matkul.alignment = { vertical: 'middle' }
  
  const matkulField = worksheet.getCell('C6')
  matkulField.value = `: ${data?.academicClass?.course?.name.toUpperCase()}`
  matkulField.font = { size: 11, }
  matkulField.alignment = { vertical: 'middle'}
  
  // === [4] Baris Dosen
  worksheet.mergeCells("D6:E6")
  const lecturer = worksheet.getCell('D6')
  lecturer.value = "Dosen Pengampu"
  lecturer.font = { size: 11, }
  lecturer.alignment = { vertical: 'middle' }
  
  worksheet.mergeCells("F6:K6")
  const lecturerField = worksheet.getCell('F6')
  lecturerField.value = `: ${data?.academicClass?.lecturer?.name.toUpperCase()}`
  lecturerField.font = { size: 11, }
  lecturerField.alignment = { vertical: 'middle'}
  
  // === [4] Baris Prodi
  worksheet.mergeCells("A7:B7")
  const prodi = worksheet.getCell('A7')
  prodi.value = "Prodi"
  prodi.font = { size: 11, }
  prodi.alignment = { vertical: 'middle' }
  
  const prodiField = worksheet.getCell('C7')
  prodiField.value = `: ${data?.academicClass?.course?.major?.name.toUpperCase()}`
  prodiField.font = { size: 11, }
  prodiField.alignment = { vertical: 'middle'}
  
  // === [4] Baris kelas
  worksheet.mergeCells("D7:E7")
  const academicClassName = worksheet.getCell('D7')
  academicClassName.value = "Kelas"
  academicClassName.font = { size: 11, }
  academicClassName.alignment = { vertical: 'middle' }
  
  worksheet.mergeCells("F7:K7")
  const academicClassField = worksheet.getCell('F7')
  academicClassField.value = `: ${data?.academicClass?.name.toUpperCase()}`
  academicClassField.font = { size: 11, }
  academicClassField.alignment = { vertical: 'middle' }
  
  // === [4] Baris semester
  worksheet.mergeCells("A8:B8")
  const semester = worksheet.getCell('A8')
  semester.value = "Semester"
  semester.font = { size: 11, }
  semester.alignment = { vertical: 'middle' }
  
  const semesterField = worksheet.getCell('C8')
  semesterField.value = `: -`
  semesterField.font = { size: 11, }
  semesterField.alignment = { vertical: 'middle'}
  
  // === [4] Baris schedule
  worksheet.mergeCells("D8:E8")
  const schedule = worksheet.getCell('D8')
  schedule.value = "Hari, Jam"
  schedule.font = { size: 11, }
  schedule.alignment = { vertical: 'middle' }
  
  worksheet.mergeCells("F8:K8")
  const scheduleField = worksheet.getCell('F8')
  scheduleField.value = `: -`
  scheduleField.font = { size: 11, }
  scheduleField.alignment = { vertical: 'middle' }
  
  // === [4] Baris semester
  worksheet.mergeCells("A9:B9")
  const period = worksheet.getCell('A9')
  period.value = "Thn. Akad"
  period.font = { size: 11, }
  period.alignment = { vertical: 'middle' }
  
  const periodField = worksheet.getCell('C9')
  periodField.value = `: -`
  periodField.font = { size: 11, }
  periodField.alignment = { vertical: 'middle'}
  
  // === [4] Baris schedule
  worksheet.mergeCells("D9:E9")
  const date = worksheet.getCell('D9')
  date.value = "Tanggal"
  date.font = { size: 11, }
  date.alignment = { vertical: 'middle' }
  
  worksheet.mergeCells("F9:K9")
  const dateField = worksheet.getCell('F9')
  dateField.value = `: -`
  dateField.font = { size: 11, }
  dateField.alignment = { vertical: 'middle'}

  worksheet.addRow([])
  const header = worksheet.addRow(headers);
  header.height = 100;
  header.eachCell((cell) => {
    cell.font = { bold: true }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDDDDDD' }, // abu-abu muda
    }
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
  })

  const colWidths = [4, 15, 45, ...assessmentDetails.map(() => 10), 10, 8, 40];
  colWidths.forEach((w, i) => {
    worksheet.getColumn(i + 1).width = w
  })

  const uidsColumnsIndex = headers.indexOf('uids') + 1;
  const finalScoreColumnsIndex = headers.indexOf('Nilai Akhir') + 1;
  const absColumnsIndex = headers.indexOf('Abs') + 1;
  const assessmentDetailIndex = assessmentDetails.map((_, i: number) => i + 3)
  

  data?.khsDetails.forEach((items: KhsDetail, i: number) => {
    const rowdata: (string | number)[] = [
      i + 1,
      items.khs.student.nim,
      items.khs.student.name.toUpperCase(),
      ...assessmentDetails.map((assessmentDetail: AssessmentDetail) => {
        items.khsGrade.find((g: KhsGrade) => g.assessmentDetailId === assessmentDetail.id);
        return 0;
      }),
      0,
      "E",
      items.id,
    ];

    const addRow = worksheet.addRow(rowdata);
    addRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
      cell.alignment = { vertical: 'middle' }
    });

    worksheet.eachRow((row, rowNumber) => {
      const cell = row.getCell(uidsColumnsIndex);
      if (rowNumber > 10) { // Skip header row
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '000000' }, // abu-abu muda
        }
        
      }
    });

    // finalScore & Abs formula
    worksheet.eachRow((_, rowNumber) => {
      if (rowNumber >= 12) {
        // finalScore
        const finalScoreColumns = `${strColumn[finalScoreColumnsIndex - 1]}${rowNumber}`;
        const finalScoreCell = worksheet.getCell(finalScoreColumns)
        const formulaStr = assessmentDetailIndex.map((el: number, i: number) => `(${strColumn[el]}${rowNumber} * (${assessmentDetails[i].percentage} / 100))`)
        finalScoreCell.value = {
          formula: `${formulaStr.join(" + ")}`,
        }

        // Abs
        const absColumns = `${strColumn[absColumnsIndex - 1]}${rowNumber}`;
        const absCell = worksheet.getCell(absColumns);
        absCell.value = {
          formula: `IF(${finalScoreColumns}>=85,"A",IF(${finalScoreColumns}>=80,"AB",IF(${finalScoreColumns}>=70,"B",IF(${finalScoreColumns}>=60,"BC",IF(${finalScoreColumns}>=56,"C",IF(${finalScoreColumns}>=40,"D","E"))))))`
        }
      }
    })
  });

  // Locked Cell
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, cellNumber) => {
      cell.protection = { locked: true };
      if (rowNumber >= 12 && cellNumber >= 4 && cellNumber !== uidsColumnsIndex) {
        cell.protection = { locked: false };
      }
      if (rowNumber < 11 && rowNumber !== 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        }
      }
    })
  });

  await worksheet.protect(`${data?.academicClass?.course.code}`, {
    selectLockedCells: true,
    selectUnlockedCells: true,
    formatCells: false,
    formatColumns: false,
    formatRows: false,
    insertColumns: false,
    insertRows: false,
    deleteColumns: false,
    deleteRows: false,
  })




  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}