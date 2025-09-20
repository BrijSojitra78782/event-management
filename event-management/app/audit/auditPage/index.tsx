import { Dimensions, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import ReportCards from '@/components/reportcards/ReportCards';
import ReportChart from './components/ReportChart';
import { reportsData, chartData } from './auditPage.data';
import { styles } from './auditPage.styles';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


/**
 * @AuditPage component represents the main view for auditing.
 * It includes a pie chart displaying the audit progress, report cards with audit data,
 * and a button for scanning QR codes to navigate to the scan page.
 * 
 * The top section utilizes a linear gradient background and contains the ReportChart component.
 * The bottom section contains the ReportCards component and a QR scan button.
 * 
 */
export default function AuditPage() {
  const { height, width } = Dimensions.get('window');
  const router = useRouter();
  const insets = useSafeAreaInsets();


  return (
    <View style={{...styles.container}}>
      {/* top section */}
      <LinearGradient colors={[ Colors.white, Colors.primary.gradient ]} style={[styles.upperContainer, { height: height / 1.7 + insets.top}]}>

      {/* Pie chart conteiner */}
        <View style={styles.chartContainer}>
          <ReportChart data={chartData} />
        </View>
      </LinearGradient>

      {/* bottom section */}
      <View style={styles.lowerContainer}>

      {/* report cards counters */}
        <ReportCards data={reportsData} />


      {/* Scan button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={{...styles.qrButton, height: width * 0.2}} onPress={() => { router.push('audit/scanPage'); }}>
            <MaterialCommunityIcons name="qrcode-scan" size={width * 0.1} color= {Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

