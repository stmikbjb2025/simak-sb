import { GeneratePdfProps } from "@/lib/types/pdftype";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingVertical: 32,
    paddingHorizontal: 32,
    fontSize: "10pt",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  bottomLine: {
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 100,
    justifySelf: "center",
  },
  textHeader: {
    fontSize: "12pt",
    fontWeight: "bold",
    justifyContent: "center",
    marginBottom: 2,
  },
  textAddress: {
    fontSize: "10pt",
    justifyContent: "center",
  },
  body: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  textHeading1: {
    fontSize: "11pt",
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 14,
    marginBottom: 14,
  },
  classTableRow: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    marginBottom: 2,
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    borderStyle: "solid",
    borderColor: "#000",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 5,
  },
  tableCellTh: {
    margin: "auto",
    fontSize: "9pt",
    fontWeight: "bold",
  },
  tableCellTd: {
    margin: "auto",
    fontSize: "9pt",
  },
  footer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  contentFooter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 1,
  }
})


const AssessmentPdf = ({ data }: GeneratePdfProps) => {
  // const imgLogo = `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`

  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={data.img} />
          <Text style={styles.textHeader}>Sekolah Tinggi Manajemen Informatika dan Komputer (STMIK) Banjarbaru</Text>
          <Text style={styles.textAddress}>Jl. Sultan Adam No. 12 Telp. (0511) 3306839 Banjarmasin</Text>
          <Text style={styles.textAddress}>Jl. Ahmad Yani Km. 33,3 No. 38 Loktabat Telp. (0511) 4782881 Banjarbaru</Text>
        </View>
        <View style={styles.bottomLine}></View>
        <View style={styles.body}>
          <Text style={styles.textHeading1}>DAFTAR NILAI MATA KULIAH</Text>
          <View style={styles.classTableRow}>
            <Text style={{ width: "12%" }}>Mata Kuliah</Text>
            <Text style={{ width: "45%", marginRight: 2 }}>: {data?.academicClass?.course?.name}</Text>
            <Text style={{ width: "10%" }}>Dosen</Text>
            <Text style={{ width: "33%" }}>: {data?.academicClass?.lecturername}</Text>
          </View>
          <View style={styles.classTableRow}>
            <Text style={{ width: "12%" }}>Prodi</Text>
            <Text style={{ width: "45%", marginRight: 2 }}>: {data?.academicClass?.course?.major?.name}</Text>
            <Text style={{ width: "10%" }}>Kelas</Text>
            <Text style={{ width: "33%" }}>: {data?.academicClass?.name}</Text>
          </View>
          <View style={styles.classTableRow}>
            <Text style={{ width: "12%" }}>Semester</Text>
            <Text style={{ width: "45%", marginRight: 2 }}>: -</Text>
            <Text style={{ width: "10%" }}>Hari, Jam</Text>
            <Text style={{ width: "33%" }}>: -</Text>
          </View>
          <View style={styles.classTableRow}>
            <Text style={{ width: "12%" }}>Thn. Akad</Text>
            <Text style={{ width: "45%", marginRight: 2 }}>: {data?.academicClass?.period?.name}</Text>
            <Text style={{ width: "10%" }}>Tanggal</Text>
            <Text style={{ width: "33%" }}>: -</Text>
          </View>
          <View style={styles.table} wrap={false}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <Text style={styles.tableCellTh}>No</Text>
              </View>
              <View style={[styles.tableCol, { width: "16%" }]}>
                <Text style={styles.tableCellTh}>NIM</Text>
              </View>
              <View style={[styles.tableCol, { width: "35%" }]}>
                <Text style={styles.tableCellTh}>Nama Mahasiswa</Text>
              </View>

              {data?.assessmentDetail?.map((items: any) => (
                <View style={[styles.tableCol, { width: "8%" }]} key={items?.id} wrap={false}>
                  <Text style={[styles.tableCellTh]}>{items.grade?.acronym}</Text>
                </View>
              ))}
              <View style={[styles.tableCol, { width: "7%" }]}>
                <Text style={[styles.tableCellTh]}>Ttl</Text>
              </View>
              <View style={[styles.tableCol, { width: "7%" }]}>
                <Text style={[styles.tableCellTh]}>Nilai</Text>
              </View>
            </View>
            {/* Rows */}
            {data?.khsDetails?.map((item: any, index: number) => (
              <View key={item?.id || index} style={styles.tableRow} wrap={false}>
                <View style={[styles.tableCol, { width: "5%" }]}>
                  <Text style={styles.tableCellTd}>{index + 1}</Text>
                </View>
                <View style={[styles.tableCol, { width: "16%" }]}>
                  <Text style={styles.tableCellTd}>{item?.khs?.student?.nim || '-'}</Text>
                </View>
                <View style={[styles.tableCol, { width: "35%" }]}>
                  <Text style={[styles.tableCellTd, { margin: 0, textAlign: "left" }]} wrap={false}>{item?.khs?.student?.name || '-'}</Text>
                </View>
                {data?.assessmentDetail?.map((assessment: any) => {
                  const grade = item?.khsGrade?.find((grade: any) => grade.assessmentDetailId === assessment.id);
                  return (
                    <View key={assessment.id} style={[styles.tableCol, { width: "8%" }]}>
                      <Text style={styles.tableCellTd}>
                        {grade ? `${grade.score}` : "-"}
                      </Text>
                    </View>
                  );
                })}
                <View style={[styles.tableCol, { width: "7%" }]}>
                  <Text style={styles.tableCellTd}>
                    {`${Number(item?.finalScore ?? 0).toFixed(2)}`}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: "7%" }]}>
                  <Text style={styles.tableCellTd}>
                    {`${item?.gradeLetter ?? '-'}`}
                  </Text>
                </View>
              </View>
            ))}

          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.contentFooter}>
            <Text>Banjarmasin/Banjarbaru, {data?.date}</Text>
            <Text>Dosen Pengampu</Text>
            <Text style={{ marginTop: 18, fontWeight: "bold", fontSize: "10pt" }}>{data?.academicClass?.lecturername}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default AssessmentPdf;