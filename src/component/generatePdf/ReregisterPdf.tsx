import { GeneratePdfProps } from "@/lib/types/pdftype";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingVertical: 24,
    paddingHorizontal: 40,
    fontSize: 12,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  bottomLine: {
    borderBottomStyle: "solid",
    borderBottomWidth: .8,
    borderBottomColor: "gray",
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: "red",
    borderRadius: 100,
    justifySelf: "center",
    marginTop: 6,
  },
  sectionTextHeader: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 1,
  },
  textHeader: {
    fontSize: 12,
    fontWeight: "bold",
    justifyContent: "center",
  },
  textAddress: {
    fontSize: 12,
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
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "center",
    paddingVertical: 18,
  },
  tableHeading: {
    fontSize: 12,
    fontWeight: "bold",
    textDecoration: "underline",
  },
  table: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
  },
  tableRow: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    marginVertical: 2,
    alignItems: "center",
  },
  columnField: {
    width: "17%",
    flexWrap: "wrap",
  },
  columnComma: {
    width: "2%",
  },
  columnData: {
    width: "81%",
    borderBottomStyle: "dotted",
    borderBottomWidth: 2,
    borderBottomColor: "black",
    display: "flex",
    flexWrap: "wrap",
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 1,
  }

})


const ReregisterPdf = ({ data }: GeneratePdfProps) => {
  // const imgLogo = `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`
  return (
    <Document>
      <Page size={"LETTER"} style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Image src={data.img} />
          </View>
          <View style={styles.sectionTextHeader}>
            <Text style={styles.textHeader}>SEKOLAH TINGGI MANAJEMEN INFORMATIKA DAN KOMPUTER</Text>
            <Text style={styles.textHeader}>(STMIK) BANJARBARU</Text>
            <Text style={styles.textHeader}>IJIN MENDIKNAS RI NO. 15 / D / O / 2003</Text>
            <View style={styles.sectionTextHeader}>
              <Text style={styles.textAddress}>Jl. A. Yani Km. 33,3 Loktabat, Banjarbaru Telp. 0511-4782881</Text>
              <Text style={styles.textAddress}>Jl. Sultan Adam No. 12, Banjarmasin Telp. 0511-3306839</Text>
              <Text style={styles.textAddress}>www.stmik-banjarbaru.ac.id</Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomLine}></View>
        <View style={styles.body}>
          <Text style={styles.textHeading1}>FORMULIR REGISTRASI MAHASISWA</Text>
          <View style={styles.table}>
            <Text style={styles.tableHeading}>DATA MAHASISWA</Text>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Nama Lengkap</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={[styles.columnData, { textTransform: "uppercase" }]}>{data?.reregister?.student?.name}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>NIM</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>{data?.reregister?.student?.nim}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Tempat/Tanggal Lahir</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>{data?.reregister?.student?.placeOfBirth.toUpperCase()}, {data?.reregister?.student?.birthday}</Text>
            </View>
            <View style={styles.tableRow} wrap={false}>
              <Text style={styles.columnField}>Alamat Sekarang</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={[styles.columnData, { textTransform: "uppercase" }]}>{data?.reregister?.student?.address}</Text>
            </View>
            <View style={styles.tableRow} wrap={false}>
              <Text style={styles.columnField}>Alamat Asal</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={[styles.columnData, { textTransform: "uppercase" }]}>{data?.reregister?.student?.domicile}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>No. HP</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>{data?.reregister?.student?.hp}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Program Studi</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={[styles.columnData, { textTransform: "uppercase" }]}>{data?.reregister?.student?.major?.name}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Semester</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>{data?.reregister?.reregister?.period?.semesterType}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Tahun Akademik</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>{data?.reregister?.reregister?.period?.year}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Kampus</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>{data?.reregister?.campusType}</Text>
            </View>
          </View>
          <View style={styles.table}>
            <Text style={styles.tableHeading}>DATA ORANG TUA</Text>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Nama Orang Tua/Wali</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={[styles.columnData, { textTransform: "uppercase" }]}>{data?.reregister?.student?.guardianName}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>NIK Orang Tua/Wali</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>{data?.reregister?.student?.guardianNIK}</Text>
            </View>
            <View style={styles.tableRow} wrap={false}>
              <Text style={styles.columnField}>Alamat Lengkap</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={[styles.columnData, { textTransform: "uppercase" }]}>{data?.reregister?.student?.guardianAddress}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>No. Telp/HP</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>{data?.reregister?.student?.guardianHp}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Pekerjaan</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={[styles.columnData, { textTransform: "uppercase" }]}>{data?.reregister?.student?.guardianJob}</Text>
            </View>
          </View>
          <View style={styles.table}>
            <Text style={styles.tableHeading}>DATA IBU KANDUNG</Text>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>Nama Ibu Kandung</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={[styles.columnData, { textTransform: "uppercase" }]}>{data?.reregister?.student?.motherName}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.columnField}>NIK Ibu Kandung</Text>
              <Text style={styles.columnComma}>:</Text>
              <Text style={styles.columnData}>{data?.reregister?.student?.motherNIK}</Text>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Text>Banjarmasin/Banjarbaru, {data?.date}</Text>
          <Text>Mahasiswa</Text>
          <Text style={{ marginTop: 12, fontWeight: "bold", textTransform: "uppercase" }}>{data?.reregister?.student?.name}</Text>
        </View>
      </Page>
    </Document>
  )
}

export default ReregisterPdf;