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
    marginRight: "16px"
  }

})

const KhsPdf = ({ data }: GeneratePdfProps) => {
  // const imgLogo = `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`

  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={data.img} />
          <View style={styles.sectionTextHeader}>
            <Text style={styles.textHeader}>Kartu Hasil Studi</Text>
            <Text style={[styles.textAddress, { fontWeight: "bold" }]}>Sekolah Tinggi Manajemen Informatika dan Komputer (STMIK) Banjarbaru</Text>
            <Text style={styles.textAddress}>Jl. Sultan Adam No. 12 Telp. (0511) 3306839 Banjarmasin</Text>
            <Text style={styles.textAddress}>Jl. Ahmad Yani Km. 33,3 No. 38 Loktabat Telp. (0511) 4782881 Banjarbaru</Text>
          </View>
        </View>
        <View style={styles.bottomLine}></View>
        <View style={styles.body}>
          <View style={[styles.classTableRow, { marginTop: "16px" }]}>
            <Text style={{ width: "10%" }}>Nama</Text>
            <Text style={{ width: "50%", marginRight: 2 }}>: {data?.khsStudent?.student?.name}</Text>
            <Text style={{ width: "10%" }}>NIM</Text>
            <Text style={{ width: "27%" }}>: {data?.khsStudent?.student?.nim}</Text>
          </View>
          <View style={styles.classTableRow}>
            <Text style={{ width: "10%" }}>Prodi</Text>
            <Text style={{ width: "50%", marginRight: 2 }}>: {data?.khsStudent?.student?.major?.name}</Text>
            <Text style={{ width: "10%" }}>Jenjang</Text>
            <Text style={{ width: "27%" }}>: {"S1"}</Text>
          </View>
          <View style={styles.classTableRow}>
            <Text style={{ width: "10%" }}>Semester</Text>
            <Text style={{ width: "50%", marginRight: 2 }}>: {`${data?.khsStudent?.semester} ${data?.khsStudent?.period?.semesterType}`}</Text>
            <Text style={{ width: "10%" }}>Thn. Akad</Text>
            <Text style={{ width: "27%" }}>: {data?.khsStudent?.period?.name}</Text>
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
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text style={[styles.tableCellTh]}>SKS</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text style={[styles.tableCellTh]}>NAB</Text>
              </View>
              <View style={[styles.tableCol, { width: "14%" }]}>
                <Text style={[styles.tableCellTh]}>SKSxNAB</Text>
              </View>
            </View>
            {data?.khsDetail?.map((item: any, index: number) => (
              <View key={item?.course?.code} style={styles.tableRow}>
                <View style={[styles.tableCol, { width: "6%" }]}>
                  <Text style={styles.tableCellTd}>{index + 1}</Text>
                </View>
                <View style={[styles.tableCol, { width: "14%" }]}>
                  <Text style={styles.tableCellTd}>{item?.course?.code}</Text>
                </View>
                <View style={[styles.tableCol, { width: "50%" }]}>
                  <Text style={[styles.tableCellTd, { margin: 0, textAlign: "left" }]}>{item?.course?.name}</Text>
                </View>
                <View style={[styles.tableCol, { width: "8%" }]}>
                  <Text style={[styles.tableCellTd]}>{item?.course?.sks}</Text>
                </View>
                <View style={[styles.tableCol, { width: "8%" }]}>
                  <Text style={[styles.tableCellTd]}>{item?.gradeLetter}</Text>
                </View>
                <View style={[styles.tableCol, { width: "14%" }]}>
                  <Text style={[styles.tableCellTd]}>{(Number(item?.course?.sks) * Number(item?.weight))}</Text>
                </View>
              </View>
            ))}
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "70%" }]}>
                <Text style={styles.tableCellTd}>{`Jumlah SKS : ${data?.totalSKS}   Jumlah SKSxNAB : ${data?.totalSKSxNAB}`}</Text>
              </View>
              <View style={[styles.tableCol, { width: "30%" }]}>
                <Text style={styles.tableCellTd}>{`IPK : ${data?.khsStudent?.ips || 0}`}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.contentFooter}>
            <Text style={{ marginBottom: "20px" }}>Jumlah SKS yang boleh diambil: {`${(data?.khsStudent?.maxSks || 1) - 1} - ${data?.khsStudent?.maxSks || 0}`}</Text>
            <Text>Banjarmasin/Banjarbaru, {data?.date}</Text>
            <Text>Ketua Program Studi</Text>
            <Text style={{ marginTop: 24, fontWeight: "bold", fontSize: "10pt" }}>{data?.position?.personName || "................."}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default KhsPdf;