import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    position: 'relative',
  },
  header: {
    textAlign: 'center',
    marginBottom: 15,
    borderBottom: '1 solid #000',
    paddingBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 3,
    color: '#444',
  },
  section: {
    marginBottom: 15,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCol: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  signatureSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  signatureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  signatureBox: {
    width: '48%',
    marginBottom: 15,
    padding: 10,
  },
  signatureLine: {
    borderBottom: '1 solid black',
    width: '100%',
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  signatureSubtext: {
    fontSize: 8,
    textAlign: 'center',
    color: '#666',
    marginTop: 2,
  },
  officialStamp: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    border: '2 solid red',
    padding: 5,
    transform: 'rotate(-15deg)',
  },
  stampText: {
    color: 'red',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  notedBySection: {
    marginTop: 20,
    borderTop: '1 solid #000',
    paddingTop: 10,
  },
  dualSignatureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cityOfficialSignature: {
    width: '45%',
    marginBottom: 15,
    padding: 5,
  },
});

const ReportDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>SK MONTHLY ACCOMPLISHMENT REPORT</Text>
        <Text style={styles.subtitle}>For the Month of JANUARY 2025</Text>
        <Text style={styles.subtitle}>BARANGAY BALINGAYAN SANGGUNIANG KABATAAN</Text>
        <Text style={styles.subtitle}>CITY OF CALAPAN</Text>
        <Text style={styles.subtitle}>PROVINCE OF ORIENTAL MINDORO</Text>
        <Text style={styles.subtitle}>MINAROPA REGION</Text>
      </View>

     <View style={styles.section}>
        <Text style={styles.title}>PART I: PROGRAMS/PROJECTS, ACTIVITIES (PPAs) UNDERTAKEN</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: '25%' }]}>
              <Text>PPA TITLE PER CENTER OF PARTICIPATION</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '10%' }]}>
              <Text>STATUS</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '20%' }]}>
              <Text>TIMEFRAME</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '15%' }]}>
              <Text>COST/ AMOUNT</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '15%' }]}>
              <Text>FUND SOURCE</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '15%' }]}>
              <Text>REMARKS</Text>
            </View>
          </View>

          {/* Table Rows */}
          {[
            'Health', 'Education', 'Economic Empowerment', 
            'Social inclusion and Equity', 'Peace-building and Security',
            'Governance', 'Active Citizenship', 'Environment', 'Global Mobility'
          ].map((category) => (
            <View style={styles.tableRow} key={category}>
              <View style={[styles.tableCol, { width: '25%' }]}><Text>{category}</Text></View>
              <View style={[styles.tableCol, { width: '10%' }]}><Text></Text></View>
              <View style={[styles.tableCol, { width: '20%' }]}><Text></Text></View>
              <View style={[styles.tableCol, { width: '15%' }]}><Text></Text></View>
              <View style={[styles.tableCol, { width: '15%' }]}><Text></Text></View>
              <View style={[styles.tableCol, { width: '15%' }]}><Text></Text></View>
            </View>
          ))}
        </View>
        <Text style={{ marginTop: 5 }}>Agriculture</Text>
      </View>

      {/* Part II: Local Legislation */}
      <View style={styles.section}>
        <Text style={styles.title}>PART II: LOCAL LEGISLATION</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: '20%' }]}><Text>SESSIONS</Text></View>
            <View style={[styles.tableColHeader, { width: '20%' }]}><Text>Date Conducted</Text></View>
            <View style={[styles.tableColHeader, { width: '15%' }]}><Text>Present</Text></View>
            <View style={[styles.tableColHeader, { width: '15%' }]}><Text>Absent</Text></View>
            <View style={[styles.tableColHeader, { width: '30%' }]}><Text>Resolution(s) Passed</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '20%' }]}><Text>Regular</Text></View>
            <View style={[styles.tableCol, { width: '20%' }]}><Text>8 January 2025</Text></View>
            <View style={[styles.tableCol, { width: '15%' }]}><Text>8</Text></View>
            <View style={[styles.tableCol, { width: '15%' }]}><Text>0</Text></View>
            <View style={[styles.tableCol, { width: '30%' }]}><Text></Text></View>
          </View>
          <Text style={{ marginTop: 5 }}>Special</Text>
        </View>
      </View>

      {/* Part III: Katipunan ng Kabataan Assembly */}
      <View style={styles.section}>
        <Text style={styles.title}>PART III: KATPUNAN NG KABATAAN ASSEMBLY</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: '25%' }]}><Text>CY 2025</Text></View>
            <View style={[styles.tableColHeader, { width: '25%' }]}><Text>Date Conducted</Text></View>
            <View style={[styles.tableColHeader, { width: '15%' }]}><Text>Present</Text></View>
            <View style={[styles.tableColHeader, { width: '15%' }]}><Text>Absent</Text></View>
            <View style={[styles.tableColHeader, { width: '20%' }]}><Text>Resolution(s) Passed</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '25%' }]}><Text>1st Semester</Text></View>
            <View style={[styles.tableCol, { width: '25%' }]}><Text>8 March 2025</Text></View>
            <View style={[styles.tableCol, { width: '15%' }]}><Text></Text></View>
            <View style={[styles.tableCol, { width: '15%' }]}><Text></Text></View>
            <View style={[styles.tableCol, { width: '20%' }]}><Text></Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '25%' }]}><Text>2nd Semester</Text></View>
            <View style={[styles.tableCol, { width: '25%' }]}><Text>8 October 2025</Text></View>
            <View style={[styles.tableCol, { width: '15%' }]}><Text></Text></View>
            <View style={[styles.tableCol, { width: '15%' }]}><Text></Text></View>
            <View style={[styles.tableCol, { width: '20%' }]}><Text></Text></View>
          </View>
          <Text style={{ marginTop: 5 }}>Special</Text>
        </View>
      </View>

        <View>
          <View style={styles.section}>
            <Text style={styles.title}>PART IV: CHECKLIST OF REPORTS/DOCUMENTS</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={[styles.tableColHeader, { width: '70%' }]}>
                  <Text>REPORT(S)/ DOCUMENT(S)</Text>
                </View>
                <View style={[styles.tableColHeader, { width: '30%' }]}>
                  <Text>DATE SUBMITTED</Text>
                </View>
              </View>

              {[
                'Monthly PPA Progress Report December 2024',
                'Monthly BarKaDa Report January 2025',
                'Monthly BaRCO Report January 2025',
                'Monthly MAPAC Report January 2025',
                'SCFD#* Quarter 2024',
                'SK Assembly #* Semester 2024 Minutes',
                'Updated CFID# 2025-2027',
                'SK Budget 2025',
                'ABTP 2025',
                'ABTP 2024 Accomplishments',
              ].map((doc) => (
                <View style={styles.tableRow} key={doc}>
                  <View style={[styles.tableCol, { width: '70%' }]}>
                    <Text>{doc}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: '30%' }]}>
                    <Text></Text>
                  </View>
                </View>
              ))}

              <View style={[styles.tableRow, { marginTop: 20 }]}>
                <View style={[styles.tableCol, { width: '100%', alignItems: 'center', padding: 10 }]}>
                  <Text>Noted by:</Text>
                  <View style={{ borderBottomWidth: 1, borderBottomColor: 'black', width: '60%', marginTop: 15 }} />
                  <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginTop: 5 }}>
                    EnP. IVAN STEPHEN F. FADRI, CPA, CESE
                  </Text>
                  <Text style={{ fontSize: 8, textAlign: 'center', color: '#666', marginTop: 2 }}>
                    City Director
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>



      

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
        <View style={{ width: '60%', alignItems: 'center', padding: 10 }}>
          <Text>Attested by:</Text>
          <View style={{ borderBottomWidth: 1, borderBottomColor: 'black', width: '100%', marginTop: 15 }} />
          <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginTop: 5 }}>
            JUAN M. DELA CRUZ
          </Text>
          <Text style={{ fontSize: 8, textAlign: 'center', color: '#666', marginTop: 2 }}>
            SK Chairperson
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
        <View style={{ width: '60%', alignItems: 'center', padding: 10 }}>
          <Text>Attested by:</Text>
          <View style={{ width: '100%', marginTop: 15 }} />
          <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginTop: 5 }}>
            SANGGUNIANG KABATAAN MEMBERS
          </Text>
        </View>
      </View>


        <View style={styles.dualSignatureContainer}>
          <View style={styles.cityOfficialSignature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>FIRST NAME MI LAST NAME</Text>
          </View>

          <View style={styles.cityOfficialSignature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>FIRST NAME MI LAST NAME</Text>
          </View>
        </View>

        <View style={styles.dualSignatureContainer}>
          <View style={styles.cityOfficialSignature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>FIRST NAME MI LAST NAME</Text>
          </View>

          <View style={styles.cityOfficialSignature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>FIRST NAME MI LAST NAME</Text>
          </View>
        </View>

        <View style={styles.dualSignatureContainer}>
          <View style={styles.cityOfficialSignature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>FIRST NAME MI LAST NAME</Text>
          </View>

          <View style={styles.cityOfficialSignature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>FIRST NAME MI LAST NAME</Text>
          </View>
        </View>

        
        
        

    </Page>
  </Document>
);

const DownloadButton = () => (
  <PDFDownloadLink
    document={<ReportDocument />}
    fileName="SK_Accomplishment_Report_January_2025.pdf"
  >
    {({ loading }) => (
      <button style={{
        padding: '10px 20px',
        background: '#0066cc',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        {loading ? 'Generating PDF...' : 'Download Official Report'}
      </button>
    )}
  </PDFDownloadLink>
);

export default DownloadButton;