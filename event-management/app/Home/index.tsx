import { FC, useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";
import Constants from "expo-constants";
import { ThemedText } from "@/components/ThemedText";
import Feather from "@expo/vector-icons/Feather";

import homeStyles from "./home.style";
import { removeToken } from "@/app/audit/services/authService";
import { useSession } from "@/context/UserSessionContext";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width * 0.4;
const CARD_ASPECT_RATIO = 185 / 190;
const CARD_HEIGHT = CARD_WIDTH / CARD_ASPECT_RATIO;

const styles = homeStyles({
  headerHeight: Constants.statusBarHeight,
  cardWidth: CARD_WIDTH,
  cardHeight: CARD_HEIGHT,
});

export default function Home() {
  const { getUserName, signOut, isAdmin } = useSession();

  const onCardClick = (card:any) => {
    if(card.mainText == "Asset Audit") {
      if (isAdmin()) {
        router.push("audit/dashboard");
      } else {
        router.push("audit/assetAuditsPage");
      }
    } else if(card.mainText == "Events") {
      router.push("event/eventPage");
    } else if(card.mainText == "Parking") {
      return;
    }
  };

  const onLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'You are about to logout. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          style: 'default',
          text: "Ok",
          onPress: async () => {
            await removeToken();
            signOut();
            router.dismissAll();
            router.replace("/");
          }
        }
      ],
    )
  };

  useLayoutEffect(
    useCallback(() => {
      router.dismissAll();
    }, [])
  );

  // console.log("Home")

  return (
    <ImageBackground
      source={require("@/assets/images/Home/dashboard-bg.png")}
      resizeMode="cover"
      style={styles.screenBackground}
    >
      <View style={styles.screenWrapper}>
        <HomeHeader name={getUserName()} onLogout={onLogout} />
        <ThemedText style={styles.screenText}>
          Welcome to {"\n"}
          <ThemedText style={styles.screenHighlightedText}>
            Smart App
          </ThemedText>
        </ThemedText>
        <Cards onCardClick={onCardClick} />
      </View>
    </ImageBackground>
  );
}

type ChildProps = {
  name: string;
  onLogout: () => void;
};

const HomeHeader: FC<ChildProps> = (props) => {
  return (
    <View style={styles.homeHeaderWrapper}>
      <View style={styles.homeHeaderContainer}>
        <ImageBackground
          source={require("@/assets/images/Home/profile.png")}
          resizeMode="cover"
          style={styles.profileImageContainer}
          imageStyle={styles.profileImage}
        ></ImageBackground>
        <ThemedText style={styles.profileName}>Hey {props.name}!</ThemedText>
      </View>
      <TouchableOpacity onPress={props.onLogout}>
        <View
          style={{
            borderWidth: 1,
            borderColor: "white",
            borderRadius: 4,
            padding: 9,
          }}
        >
          <Feather name="power" size={18} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

type CardProps = {
  onCardClick: () => void;
};

const cardsArray: any = [
  {
    image: require("@/assets/images/Home/events.png"),
    mainText: "Events",
    subText: "Last Event",
    lastText: "Diwali Celebration",
  },
  {
    image: require("@/assets/images/Home/asset.png"),
    mainText: "Asset Audit",
    subText: "Last audit was done",
    lastText: "01/06/2024",
  },
  {
    image: require("@/assets/images/Home/parking.png"),
    mainText: "Parking",
    subText: "Last Event",
    lastText: "Diwali Celebration",
  },
];

const Cards: FC<CardProps> = (props) => {
  const { onCardClick } = props;
  return (
    <View style={styles.cardWrapper}>
      {cardsArray.map((card: any, index: any) => {
        return (
          <TouchableWithoutFeedback key={index} onPress={()=>onCardClick(card)}>
            <View
              style={[
                styles.cardContainer,
                { marginRight: index % 2 === 0 ? "8%" : 0 },
              ]}
            >
              <ImageBackground
                source={card.image}
                resizeMode="contain"
                style={styles.cardImage}
              ></ImageBackground>
              <View style={styles.cardTextContainer}>
                <ThemedText style={styles.cardMainText} type="title">
                  {card.mainText}
                </ThemedText>
                <ThemedText
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={styles.cardSubText}
                >
                  {card.subText}
                </ThemedText>
                <ThemedText style={styles.cardLastText}>
                  {card.lastText}
                </ThemedText>
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
};
