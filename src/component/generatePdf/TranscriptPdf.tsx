import { GeneratePdfProps } from "@/lib/types/pdftype";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

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
  body: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  textHeading1: {
    fontSize: "12pt",
    fontWeight: "bold",
    alignSelf: "center",
    paddingVertical: 8,
  },
  classTableRow: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    marginBottom: "8px",
    marginTop: "8px",
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
  },
  tableCellTh: {
    margin: "auto",
    fontSize: "10pt",
    fontWeight: "bold",
    paddingVertical: "1px",
  },
  tableCellTd: {
    margin: "auto",
    fontSize: "9pt",
    paddingVertical: "1px",
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


const TranscriptPdf = ({ data }: GeneratePdfProps) => {
  return (
    <Document>
      <Page size={"LEGAL"} style={styles.page} wrap={false}>
        <View style={styles.body}>
          <Text style={styles.textHeading1}>TRANSKIP NILAI SEMENTARA</Text>
          <View style={[styles.classTableRow]}>
            <Text style={{ width: "10%", fontWeight: "bold", }}>NAMA</Text>
            <Text style={{ width: "50%", marginRight: 2, fontWeight: "bold", }}>: {data?.dataStudent?.name}</Text>
            <Text style={{ width: "10%", fontWeight: "bold", }}>NIM</Text>
            <Text style={{ width: "27%", fontWeight: "bold", }}>: {data?.dataStudent?.nim}</Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <Text style={styles.tableCellTh}>NO</Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text style={styles.tableCellTh}>KODE</Text>
              </View>
              <View style={[styles.tableCol, { width: "56%" }]}>
                <Text style={styles.tableCellTh}>MATA KULIAH</Text>
              </View>
              <View style={[styles.tableCol, { width: "7%" }]}>
                <Text style={[styles.tableCellTh]}>SKS</Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text style={[styles.tableCellTh]}>NILAI</Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text style={[styles.tableCellTh]}>BOBOT</Text>
              </View>
            </View>
            {data?.coursesFinal.map((course: any, index: number) => (
              <View style={styles.tableRow} key={course.course.id}>
                <View style={[styles.tableCol, { width: "5%" }]}>
                  <Text style={styles.tableCellTd}>{index + 1}</Text>
                </View>
                <View style={[styles.tableCol, { width: "12%" }]}>
                  <Text style={styles.tableCellTd}>{course?.course?.code}</Text>
                </View>
                <View style={[styles.tableCol, { width: "56%" }]}>
                  <Text style={[styles.tableCellTd, { marginLeft: 1, textAlign: "left" }]}>{course?.course?.name}</Text>
                </View>
                <View style={[styles.tableCol, { width: "7%" }]}>
                  <Text style={[styles.tableCellTd]}>{course?.course?.sks}</Text>
                </View>
                <View style={[styles.tableCol, { width: "6%" }]}>
                  <Text style={[styles.tableCellTd]}>{course?.weight}</Text>
                </View>
                <View style={[styles.tableCol, { width: "6%" }]}>
                  <Text style={[styles.tableCellTd]}>{course?.gradeLetter}</Text>
                </View>
                <View style={[styles.tableCol, { width: "8%" }]}>
                  <Text style={[styles.tableCellTd]}>{(Number(course?.course?.sks) * Number(course?.weight))}</Text>
                </View>
              </View>
            ))}
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <Text style={[styles.tableCellTd, { color: "white" }]}>{"."}</Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "56%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "7%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "56%" }]}>
                <Text style={styles.tableCellTd}>{"Jumlah SKS yang sudah diambil"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "7%" }]}>
                <Text style={[styles.tableCellTd]}>{data?.totalSKSTranscript}</Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text style={[styles.tableCellTd]}>{data?.totalBobotTranscript}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "56%" }]}>
                <Text style={[styles.tableCellTd]}>{"IPK"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "7%" }]}>
                <Text style={[styles.tableCellTd]}>{data?.gpaCalculationTranscript}</Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <Text style={[styles.tableCellTd, { color: "white" }]}>{"."}</Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "56%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "7%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
            </View>
            {data?.coursesUnfinishSorted.map((course: any, index: number) => (
              <View style={styles.tableRow} key={course?.course?.id}>
                <View style={[styles.tableCol, { width: "5%" }]}>
                  <Text style={styles.tableCellTd}>{data?.coursesFinal.length + index + 1}</Text>
                </View>
                <View style={[styles.tableCol, { width: "12%" }]}>
                  <Text style={styles.tableCellTd}>{course?.course?.code}</Text>
                </View>
                <View style={[styles.tableCol, { width: "56%" }]}>
                  <Text style={[styles.tableCellTd, { marginLeft: 1, textAlign: "left" }]}>{course?.course?.name}</Text>
                </View>
                <View style={[styles.tableCol, { width: "7%" }]}>
                  <Text style={[styles.tableCellTd]}>{course?.course?.sks}</Text>
                </View>
                <View style={[styles.tableCol, { width: "6%" }]}>
                  <Text style={[styles.tableCellTd]}>{ }</Text>
                </View>
                <View style={[styles.tableCol, { width: "6%" }]}>
                  <Text style={[styles.tableCellTd]}>{ }</Text>
                </View>
                <View style={[styles.tableCol, { width: "8%" }]}>
                  <Text style={[styles.tableCellTd]}>{0}</Text>
                </View>
              </View>
            ))}
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <Text style={[styles.tableCellTd, { color: "white" }]}>{"."}</Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "56%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "7%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "56%" }]}>
                <Text style={styles.tableCellTd}>{"Jumlah SKS yang belum diambil"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "7%" }]}>
                <Text style={[styles.tableCellTd]}>{data?.totalSKSUnfinish}</Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <Text style={styles.tableCellTd}></Text>
              </View>
              <View style={[styles.tableCol, { width: "56%" }]}>
                <Text style={[styles.tableCellTd]}>{"TOTAL SKS"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "7%" }]}>
                <Text style={[styles.tableCellTd]}>{data?.totalSKSTranscript + data?.totalSKSUnfinish}</Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "6%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
              <View style={[styles.tableCol, { width: "8%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "5%" }]}>
                <View style={{ borderBottomWidth: 1 }}>
                  <Text style={[styles.tableCellTd, { color: "white" }]}>.</Text>
                </View>
                <View style={{ borderBottomWidth: 1 }}>
                  <Text style={[styles.tableCellTd, { color: "white" }]}>.</Text>
                </View>
                <View>
                  <Text style={[styles.tableCellTd, { color: "white" }]}>.</Text>
                </View>
              </View>
              <View style={[styles.tableCol, { width: "12%" }]}>
                <View style={{ borderBottomWidth: 1 }}>
                  <Text style={[styles.tableCellTd, { color: "white" }]}>.</Text>
                </View>
                <View style={{ borderBottomWidth: 1 }}>
                  <Text style={[styles.tableCellTd, { color: "white" }]}>.</Text>
                </View>
                <View>
                  <Text style={[styles.tableCellTd, { color: "white" }]}>.</Text>
                </View>
              </View>
              <View style={[styles.tableCol, { width: "56%" }]}>
                <Text style={[styles.tableCellTd]}>{"JUDUL SKRIPSI"}</Text>
              </View>
              <View style={[styles.tableCol, { width: "27%" }]}>
                <Text style={[styles.tableCellTd]}></Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.contentFooter}>
            <Text style={{ fontSize: "10pt" }}>Banjarmasin/Banjarbaru, {data?.date}</Text>
          </View>
        </View>
        <View>
          <Text style={{ fontSize: "10pt", marginTop: 8 }}>{"NB:"}</Text>
          <View style={{ display: "flex", flexDirection: 'row', marginTop: 2 }}>
            <Text style={{ fontSize: "10pt", width: "5%" }}>{"1."}</Text>
            <Text style={{ fontSize: "10pt", width: "65%" }}>{"Transkrip nilai sementara ini dibuat berdasarkan konversi mata kuliah."}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: 'row', marginTop: 2 }}>
            <Text style={{ fontSize: "10pt", width: "5%" }}>{"2."}</Text>
            <Text style={{ fontSize: "10pt", width: "65%" }}>{"Mahasiswa yang bersangkutan harap mencek ulang nilai yang tertera pada transkrip nilai sementara."}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: 'row', marginTop: 2 }}>
            <Text style={{ fontSize: "10pt", width: "5%" }}>{"3."}</Text>
            <Text style={{ fontSize: "10pt", width: "65%" }}>{"Apabila terdapat kesalahan nilai dengan KHS yang dimiliki Mahasiswa harap konfirmasi ke Prodi, paling lambat 3 hari setelah menerima transkrip nilai sementara ini  dengan melampirkan bukti KHS"}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: 'row', marginTop: 2 }}>
            <Text style={{ fontSize: "10pt", width: "5%" }}>{"4."}</Text>
            <Text style={{ fontSize: "10pt", width: "65%" }}>{"Apabila di kemudian hari terdapat perbedaan antara data transkrip nilai sementara ini dengan database STMIK Banjarbaru, maka data yang diakui adalah data yang ada pada database STMIK Banjarbaru."}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: 'row', marginTop: 21 }}>
            <Text style={{ fontSize: "10pt", width: "5%" }}>{ }</Text>
            <View>
              <Text style={{ fontSize: "10pt" }}>{"Telah diterima,"}</Text>
              <Text style={{ fontSize: "10pt", marginTop: 16 }}>{data?.dataStudent?.name}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default TranscriptPdf;