import { ListItem } from "@/constants/Types";
import { cardStyle } from "./ReportCards.styles";
import { ThemedText } from "@/components/ThemedText";
import { TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { formatLargeNumbers } from "@/utils/roundOff";
import { StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";


/**
 * A component that displays a set of report cards.
 * 
 * Props:
 * - data: an array of six objects, each with a 'title' property and a 'count' property.
 *   The 'title' property will be used as the title of the card, and the 'count' property will
 *   be used as the count of the card.
 * 
 * The component displays the cards in a 3x3 grid, with the first card in the top left
 * and the last card in the bottom right. The cards are centered in their respective grid
 * cells.
 * 
 * The component also displays a faint grid to help the user visualize the layout of the
 * cards.
 * 
 * The component uses the `ThemedText` component to display the titles and counts of the
 * cards. The component also uses the `View` component to display the cards themselves.
 */
export default function ReportCards({ data }: { data: ListItem[] }) {
  const route = useRouter();
  const search = useLocalSearchParams();
  const { auditId, typeId, typeName } = search;

  const handleCardPress = (title: string) => {
    if(title == "Remaining")
    route.push({pathname:`audit/auditPage/${auditId}/${typeId}/missingAssetsPage`,params:{typeName}});
  };

  const style = StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%'
    },
  })
  data.forEach((item, index) => {
    item.title = item.title ?? '-'
    item.formatedCount = formatLargeNumbers(item.count) ?? '-'
  })

  return (
    <View style={cardStyle.gridContainer}>
      <View style={style.row}>
        <View style={cardStyle.cell}>
          <View style={cardStyle.contentLeft}>
            <ThemedText ellipsizeMode="tail" numberOfLines={1} style={cardStyle.title}>{data[0].title}</ThemedText>
            <ThemedText style={{ ...cardStyle.count, color: Colors.primary.background }}>{data[0].formatedCount}</ThemedText>
          </View>
        </View>
        {/* <View style={cardStyle.cell}>
      </View> */}
        <View style={cardStyle.cell}>
          <View style={cardStyle.contentRight}>
            <ThemedText ellipsizeMode="tail" numberOfLines={1} style={[cardStyle.title, {textAlign:'right'}]}>{data[1].title}</ThemedText>
            <ThemedText style={cardStyle.count}>{data[1].formatedCount}</ThemedText>
          </View>
        </View>
      </View>

      <View style={style.row}>
        <View style={cardStyle.cell}>
          <View style={cardStyle.contentLeft}>
            <ThemedText ellipsizeMode="tail" numberOfLines={1} style={cardStyle.title}>{data[2].title}</ThemedText>
            <ThemedText style={cardStyle.count}>{data[2].formatedCount}</ThemedText>
          </View>
        </View>
        <View style={[cardStyle.contentLeft, { alignItems: 'center' }]}>
          <ThemedText ellipsizeMode="tail" numberOfLines={1} style={cardStyle.title}>{data[3].title}</ThemedText>
          <ThemedText style={cardStyle.count}>{data[3].formatedCount}</ThemedText>
        </View>
        <View style={cardStyle.cell}>
          <View style={cardStyle.contentRight}>
            <ThemedText ellipsizeMode="tail" numberOfLines={1} style={[cardStyle.title, {textAlign:'right'}]}>{data[4].title}</ThemedText>
            <ThemedText style={cardStyle.count}>{data[4].formatedCount}</ThemedText>
          </View>
        </View>
      </View>


      <View style={style.row}>
        <View style={cardStyle.cell}>
          <View style={cardStyle.contentLeft}>
            <ThemedText ellipsizeMode="tail" numberOfLines={1} style={cardStyle.title}>{data[5].title}</ThemedText>
            <ThemedText style={cardStyle.count}>{data[5].formatedCount}</ThemedText>
          </View>
        </View>
        {/* <View style={cardStyle.cell}>
      </View> */}
        <TouchableOpacity onPress={() => { handleCardPress(data[6].title) }} style={cardStyle.cell}>
          <View style={cardStyle.contentRight}>
            <ThemedText ellipsizeMode="tail" numberOfLines={1} style={[cardStyle.title, {color: Colors.red , textAlign:'right'} ]}>{data[6].title}</ThemedText>
            <ThemedText style={cardStyle.count}>{data[6].formatedCount}</ThemedText>
          </View>
        </TouchableOpacity>
      </View>

    </View>
  );
}
