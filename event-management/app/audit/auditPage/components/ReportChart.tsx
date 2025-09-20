import { Dimensions, Text, View } from "react-native";
import { Platform } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import PieChart from "react-native-pie-chart";
import { reportChart } from "./ReportChart.styles";
import { Colors } from "@/constants/Colors";
import { formatLargeNumbers } from "@/utils/roundOff";


/**
 * A component that displays a pie chart with two sections and a legend matrix.
 * The pie chart represents the progress of a chair audit, with the completed
 * section in blue and the remaining section in white.
 *
 * Props:
 * - data: an array of two objects, each with a 'value' property representing
 *   the percentage of the pie chart that the section should occupy.
 */
export default function ReportChart({ data, auditInfo }: { data: any, auditInfo:  {
    typeName : string,
    auditName : string,
    status : "completed" | "in progress"
  } }) {
    const { width } = Dimensions.get('window');
    auditInfo.typeName = String(auditInfo.typeName).charAt(0).toUpperCase() + String(auditInfo.typeName).slice(1);

    const widthAndHeight = width * 0.7;
    return (
        <View style={reportChart.container}>
            <ThemedText style={reportChart.heading}>{auditInfo.typeName} Audit for <Text style={{ color: Colors.primary.background }}>“{auditInfo.auditName}” </Text> is {auditInfo.status}</ThemedText>
            <View style={reportChart.chartContainer}>
                <PieChart
                    widthAndHeight={widthAndHeight}
                    cover={0.94}
                    series={data}
                />

                <View style={{...reportChart.circularSection, width: width/3 , aspectRatio:1}}>
                    <Text style={reportChart.score}>{formatLargeNumbers(data[0].value)}</Text>
                    <ThemedText style={reportChart.label}>Completed</ThemedText>
                </View>
            </View>

            <View style={reportChart.chartMatrix}>
                <View style={reportChart.coloredBoxContainer}>
                    <View style={{ ...reportChart.coloredBox, backgroundColor: Colors.white }}></View>
                    <ThemedText style={{ color: Colors.black }}>Remaining</ThemedText>
                </View>
                <View style={reportChart.coloredBoxContainer}>
                    <View style={{ ...reportChart.coloredBox, backgroundColor: Colors.primary.background }}></View>
                    <ThemedText style={{ color: Colors.black }}>Completed</ThemedText>
                </View>

            </View>

        </View>
    );
}
