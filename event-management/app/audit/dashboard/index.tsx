import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import styles from "./dashboard.style";
import { Alert, TouchableOpacity, View } from "react-native";
import { checkAuthError, formatLargeNumbers } from "@/utils/roundOff";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { Colors } from "@/constants/Colors";
import { getDashboardCount } from "@/app/audit/services/dashboardService";
import { useSession } from "@/context/UserSessionContext";
import { useToast } from "@/context/ToastContext";
import { ActivityIndicator } from "react-native-paper";
import { removeToken } from "@/app/audit/services/authService";
import { layoutStyles } from "../../_layout";
import { Octicons } from "@expo/vector-icons";
import { generateAllQRs } from "@/app/audit/services/assetService";

type cardObj = {
  label: string;
  count: number;
  link?: string;
  linkText?: string;
};

let cardData: cardObj[] = [
  {
    label: "Assets",
    count: 0,
    link: "audit/createAssetPage",
    linkText: "Add Asset",
  },

  {
    label: "Audits",
    count: 0,
    link: "audit/assetAuditsPage",
    linkText: "View Audits",
  },
  {
    label: "Users",
    count: 0,
    link: "audit/manageUsersPage",
    linkText: "Manage Users",
  }
];

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [card, setCards] = useState<Array<cardObj>>([]);
  const { token, signOut } = useSession();
  const { showToast } = useToast();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(()=>{
      setLoading(true);
      getDashboardCount(token)
      .then((data) => {
        setCards(cardData.map((d) => {
          if (d.label == "Assets") {
            d.count = data.assets;
          } else if (d.label == "Audits") {
            d.count = data.audits;
          } else if (d.label == "Users") {
            d.count = data.users;
          }

          return d;
        }))
      })
      .catch(async (e) => {
        showToast({
          type: "error",
          text1: e.message,
        });
        if (checkAuthError(e)) {
          signOut()
          router.dismissAll();
          router.replace("/");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  },[]));

  const downloadQRs = async () =>{
    try {
      let data = await generateAllQRs(token);
      showToast({
        type:"success",
        text1:data.data,
        text2:"This may take a while. Please check your email later."
      });
    } catch (error:any) {
      showToast({ type: "error", text1: error.message });
      if (checkAuthError(error)) {
        signOut();
        router.dismissAll();
        router.replace("/");
      }
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={layoutStyles.backButton}
          onPressIn={() => {
            Alert.alert(
              'Download all asset QR codes?',
              "Once generated, you'll receive an email with all QR codes. This may take a moment.",
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  style: 'default',
                  text: "Ok",
                  onPress: () => {
                    downloadQRs();
                  }
                }
              ],
            )
          }}>
          <Octicons name="download" size={24} color={Colors.primary.background} />
        </TouchableOpacity> 
      )
    });
  }, [navigation]);

  return (
    <ThemedView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary.background} />
      ) : (!card ?
        (<View style={styles.notFound}>
          <ThemedText type="subtitle">Something went wrong!</ThemedText>
        </View>) :
        <View style={styles.cardsContainer}>
          {card.map((card) => (
            <Card key={card.label} data={card} />
          ))}
        </View>
      )}
    </ThemedView>
  );
}

function Card({ data }: { data: cardObj }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity  onPressIn={() => router.push(data.link)} style={styles.visibleCard}>
        <ThemedText type="header">{formatLargeNumbers(data.count)}</ThemedText>
        <ThemedText>{data.label}</ThemedText>
        {data.link && (
          <TouchableOpacity
            onPressIn={() => router.push(data.link)}
            style={styles.link}
          >
            <ThemedText
              style={{ color: Colors.primary.background }}
              type="label"
            >
              {data.linkText}
            </ThemedText>
            <MaterialIcons
              name="navigate-next"
              size={20}
              color={Colors.primary.background}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default Dashboard;
