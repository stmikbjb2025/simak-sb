import { GeneratePdfProps } from "@/lib/types/pdftype";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingVertical: 40,
    paddingHorizontal: 32,
    fontSize: "11pt",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  bottomLine: {
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  sectionTextHeader: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 1,
    marginLeft: "16px"
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 100,
    justifySelf: "center",
  },
  textHeader: {
    fontSize: "21pt",
    fontWeight: "bold",
    justifyContent: "center",
    marginBottom: 2,
  },
  textAddress: {
    justifyContent: "center",
  },
  body: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  classTableRow: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    marginBottom: "8px",
    gap: "4px"
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
    paddingVertical: "4px",
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


const KrsPdf = ({ data }: GeneratePdfProps) => {
  // const imgLogo = `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`
  const totalSKS = data?.krsStudent?.krsDetail
    .map((item: any) => item.course.sks)
    .reduce((acc: any, init: any) => acc + init, 0);

  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={data.img} />
          <View style={styles.sectionTextHeader}>
            <Text style={styles.textHeader}>Kartu Rencana Studi</Text>
            <Text style={[styles.textAddress, { fontWeight: "bold" }]}>Sekolah Tinggi Manajemen Informatika dan Komputer (STMIK) Banjarbaru</Text>
            <Text style={styles.textAddress}>Jl. Sultan Adam No. 12 Telp. (0511) 3306839 Banjarmasin</Text>
            <Text style={styles.textAddress}>Jl. Ahmad Yani Km. 33,3 No. 38 Loktabat Telp. (0511) 4782881 Banjarbaru</Text>
          </View>
        </View>
        <View style={styles.bottomLine}></View>
        <View style={styles.body}>
          <View style={[styles.classTableRow, { marginTop: "16px" }]}>
            <Text style={{ width: "10%" }}>Nama</Text>
            <Text style={{ width: "50%", marginRight: 2 }}>: {data?.krsStudent?.student?.name}</Text>
            <Text style={{ width: "10%" }}>NIM</Text>
            <Text style={{ width: "27%" }}>: {data?.krsStudent?.student?.nim}</Text>
          </View>
          <View style={styles.classTableRow}>
            <Text style={{ width: "10%" }}>Prodi</Text>
            <Text style={{ width: "50%", marginRight: 2 }}>: {data?.krsStudent?.student?.major?.name}</Text>
            <Text style={{ width: "10%" }}>Jenjang</Text>
            <Text style={{ width: "27%" }}>: {"S1"}</Text>
          </View>
          <View style={styles.classTableRow}>
            <Text style={{ width: "10%" }}>Semester</Text>
            <Text style={{ width: "50%", marginRight: 2 }}>: {`${data?.semester} ${data?.krsStudent?.reregister?.period?.semesterType}`}</Text>
            <Text style={{ width: "10%" }}>IPK</Text>
            <Text style={{ width: "27%" }}>: {data?.krsStudent?.ips}</Text>
          </View>
          <View style={styles.classTableRow}>
            <Text style={{ width: "10%" }}>Thn. Akad</Text>
            <Text style={{ width: "50%", marginRight: 2 }}>: {data?.krsStudent?.reregister?.period?.name}</Text>
            <Text style={{ width: "10%" }}>Max. SKS</Text>
            <Text style={{ width: "27%" }}>: {data?.krsStudent?.maxSks !== 0 ? `${data?.krsStudent?.maxSks - 1} - ${data?.krsStudent?.maxSks}` : data?.krsStudent?.maxSks}</Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={styles.tableCellTh}>No</Text>
              </View>
              <View style={[styles.tableCol, { width: "14%" }]}>
                <Text style={styles.tableCellTh}>Kode MK</Text>
              </View>
              <View style={[styles.tableCol, { width: "50%" }]}>
                <Text style={styles.tableCellTh}>Nama Mata Kuliah</Text>
              </View>
              <View style={[styles.tableCol, { width: "10%" }]}>
                <Text style={[styles.tableCellTh]}>SKS</Text>
              </View>
              <View style={[styles.tableCol, { width: "10%" }]}>
                <Text style={[styles.tableCellTh]}>Dosen</Text>
              </View>
              <View style={[styles.tableCol, { width: "10%" }]}>
                <Text style={[styles.tableCellTh]}>Status</Text>
              </View>
            </View>
            {data?.krsStudent?.krsDetail?.map((item: any, index: number) => (
              <View key={item.course.code} style={styles.tableRow}>
                <View style={[styles.tableCol, { width: "6%" }]}>
                  <Text style={styles.tableCellTd}>{index + 1}</Text>
                </View>
                <View style={[styles.tableCol, { width: "14%" }]}>
                  <Text style={styles.tableCellTd}>{item.course.code}</Text>
                </View>
                <View style={[styles.tableCol, { width: "50%" }]}>
                  <Text style={[styles.tableCellTd, { margin: 0, textAlign: "left" }]}>{item.course.name}</Text>
                </View>
                <View style={[styles.tableCol, { width: "10%" }]}>
                  <Text style={[styles.tableCellTd]}>{item.course.sks}</Text>
                </View>
                <View style={[styles.tableCol, { width: "10%" }]}>
                  <Text style={[styles.tableCellTd]}>{"-"}</Text>
                </View>
                <View style={[styles.tableCol, { width: "10%" }]}>
                  <Text style={[styles.tableCellTd]}>{item.isAcc ? "ACC" : "Belum ACC"}</Text>
                </View>
              </View>
            ))}
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "70%" }]}>
                <Text style={styles.tableCellTd}>Total SKS :</Text>
              </View>
              <View style={[styles.tableCol, { width: "10%" }]}>
                <Text style={styles.tableCellTd}>{totalSKS}</Text>
              </View>
              <View style={[styles.tableCol, { width: "10%" }]}>
                <Text style={styles.tableCellTd}>-</Text>
              </View>
              <View style={[styles.tableCol, { width: "10%" }]}>
                <Text style={[styles.tableCellTd]}>-</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.contentFooter}>
            <Text>Banjarmasin/Banjarbaru, {data?.date}</Text>
            <Text>Dosen Wali</Text>
            <Text style={{ marginTop: 24, fontWeight: "bold", fontSize: "10pt" }}>{data?.lecturerNameKrs}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default KrsPdf;