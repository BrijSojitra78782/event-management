import { Dimensions, View, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from "expo-router";

import ReportCards from '@/components/reportcards/ReportCards';
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { getAuditSummary } from "@/app/audit/services/auditService";
import { useToast } from "@/context/ToastContext";
import {  ReportsData } from "../../auditPage.data";
import { styles } from "../../auditPage.styles";
import ReportChart from "../../components/ReportChart";
import { Ionicons as VectorIcon } from '@expo/vector-icons';
import { ChartDataItem } from "@/constants/Types";
import {  layoutStyles } from "@/app/_layout";
import { useSession } from "@/context/UserSessionContext";
import { checkAuthError } from "@/utils/roundOff";
import { removeToken } from "@/app/audit/services/authService";


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
  const { height, width } = Dimensions.get("window");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const search = useLocalSearchParams();
  const { auditId, typeId, name, typeName } = search;
  const { showToast } = useToast();
  const navigation = useNavigation();
  const { token, signOut } = useSession();

  var [summary, setSummary] = useState({
    total_asset: 0,
    completed: 0,
    in_use: 0,
    in_maintenance: 0,
    in_stock: 0,
    scrap: 0,
  });

  const fetchAuditSummary = async () => {
    try {
      let data = await getAuditSummary(auditId,typeId,token);
      // console.log("summary",data)
      setSummary(data.data);
    } catch (e: any) {
      showToast({
        type: "error",
        text1: e.message,
      });
      if(checkAuthError(e)){
        signOut();
        router.dismissAll();
          router.replace("/");
      }
    }
  };

  let reportsData = ReportsData.map((report) => {
    return {
      ...report,
      count:
      report.value == "remaining"
      ? summary["total_asset"] - summary["completed"]
      //@ts-ignore
          : summary[report.value],
    };
  });

  let chartData :ChartDataItem[] = [
   { value: summary.completed, color: Colors.primary.background }, // Completed
   { value: summary.total_asset ? summary.total_asset - summary.completed: 1, color: Colors.white }, // Remaining
 ];

  useFocusEffect(
    useCallback(()=>{
      fetchAuditSummary();
    },[])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
        title: name,
        headerTransparent: true,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          textAlign: 'center', fontSize: 25, fontWeight: '600', color: Colors.black
        },
        headerLeft: () => (
          <TouchableOpacity
            style={layoutStyles.backButton}
            onPressIn={() => router.back()}
          >
            <VectorIcon name="chevron-back" size={24} color={Colors.primary.background} />
          </TouchableOpacity>
        )    
    })
    
  }, [navigation]);

  let auditInfo = {
    typeName : typeName,
    auditName : name,
    status : summary.total_asset == summary.completed ? "completed" : "in progress"
  }

  return (
    <ScrollView style={{ ...styles.container }}>
      {/* top section */}
      <LinearGradient
        colors={[Colors.white, Colors.primary.gradient]}
        style={[styles.upperContainer, { height: height / 1.7 + insets.top }]}
      >
        {/* Pie chart conteiner */}
        <View style={styles.chartContainer}>
          <ReportChart data={chartData} auditInfo={auditInfo}/>
        </View>
      </LinearGradient>

      {/* bottom section */}
      <View style={styles.lowerContainer}>
        {/* report cards counters */}
        <ReportCards data={reportsData} />

        {/* Scan button */}
        {summary.total_asset > summary.completed ? <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={{ ...styles.qrButton, height: width * 0.2 }}
            onPress={() => {
              router.push({pathname : `audit/auditPage/${auditId}/${typeId}/scan`,params : {typeName: typeName}});
            }}
          >
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={width * 0.1}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View> : null
        }
      </View>
    </ScrollView>
  );
}
