import { GeneratePdfProps } from "@/lib/types/pdftype";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingVertical: 24,
    paddingBottom: 32,
    paddingHorizontal: 32,
    fontSize: "11pt",
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
    textTransform: "uppercase",
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
    fontSize: "11pt",
    fontWeight: "bold",
  },
  tableCellTd: {
    margin: "auto",
    fontSize: "10pt",
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


const StudentUnregisteredKrsPdf = ({ data }: GeneratePdfProps) => {
  // const imgLogo = `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`

  return (
    <Document>
      {data?.dataStudentsUnregisteredKrs?.map((items: any) => (
        <Page size={"A4"} style={styles.page} key={items?.major?.id}>
          <View>
            <View style={styles.header}>
              <Image style={styles.logo} src={data.img} />
              <Text style={styles.textHeader}>Sekolah Tinggi Manajemen Informatika dan Komputer (STMIK) Banjarbaru</Text>
              <Text style={styles.textAddress}>Jl. Sultan Adam No. 12 Telp. (0511) 3306839 Banjarmasin</Text>
              <Text style={styles.textAddress}>Jl. Ahmad Yani Km. 33,3 No. 38 Loktabat Telp. (0511) 4782881 Banjarbaru</Text>
            </View>
            <View style={styles.bottomLine}></View>
            <View style={styles.body}>
              <Text style={[styles.textHeading1, { marginTop: "14px" }]}>DAFTAR MAHASISWA YANG BELUM KRS PROGRAM STUDI {items?.major?.name}</Text>
              <Text style={styles.textHeading1}>{data?.dataPeriod?.name}</Text>
              <View style={[styles.table, { marginTop: "18px" }]}>
                <View style={styles.tableRow}>
                  <View style={[styles.tableCol, { width: "5%" }]}>
                    <Text style={styles.tableCellTh}>No</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "15%" }]}>
                    <Text style={styles.tableCellTh}>NIM</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "36%" }]}>
                    <Text style={styles.tableCellTh}>Nama Mahasiswa</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "36%" }]}>
                    <Text style={styles.tableCellTh}>Dosen Wali</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "12%" }]}>
                    <Text style={styles.tableCellTh}>Semester</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "10%" }]}>
                    <Text style={styles.tableCellTh}>IPS</Text>
                  </View>
                </View>
                {items.students.map((student: any, index: number) => (
                  <View key={student.id || index} style={styles.tableRow} wrap={false}>
                    <View style={[styles.tableCol, { width: "5%" }]}>
                      <Text style={styles.tableCellTd}>{index + 1}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "15%" }]}>
                      <Text style={[styles.tableCellTd, { margin: 0, textAlign: "left" }]}>{student?.student?.nim}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "36%" }]}>
                      <Text style={[styles.tableCellTd, { margin: 0, textAlign: "left" }]}>{student?.student?.name}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "36%" }]}>
                      <Text style={[styles.tableCellTd, { margin: 0, textAlign: "left" }]}>{student?.student?.name}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "12%" }]}>
                      <Text style={styles.tableCellTd}>{student?.reregisterDetail?.semester}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "10%" }]}>
                      <Text style={styles.tableCellTd}>{student?.ips}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  )
}

export default StudentUnregisteredKrsPdf;