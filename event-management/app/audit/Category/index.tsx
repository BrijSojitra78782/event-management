import { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  ImageBackground,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

import { ThemedText } from "@/components/ThemedText";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import HeaderRight from "@/components/HeaderRight/HeaderRight";
import BaseCard from "@/components/BaseCard/BaseCard";
import ScreenWrapper from "@/components/ScreenWrapper/ScreenWrapper";

import { router } from "expo-router";

import { default as styles } from "./category.style";
import { getCategories } from "@/app/audit/services/categoryService";
import { useToast } from "@/context/ToastContext";
import { downloadReport, updateAudit } from "@/app/audit/services/auditService";
import { AuditStatus } from "@/constants/Types";
import { useAppContext } from "@/context/AppContext";
import { StorageAccessFramework } from "expo-file-system";
import * as FileSystem from "expo-file-system";
import { useSession } from "@/context/UserSessionContext";
import { checkAuthError } from "@/utils/roundOff";
import { removeToken } from "@/app/audit/services/authService";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width * 0.4;
const CARD_ASPECT_RATIO = 168 / 124;
const CARD_HEIGHT = CARD_WIDTH / CARD_ASPECT_RATIO;
const defaultImage = require("@/assets/images/Category/chair.png");

export default function Category() {
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const { showToast } = useToast();

  const [status, setStatus] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setloading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const { auditId, name, status:auditStatus } = useLocalSearchParams();
  const { token, signOut } = useSession();

  const navigation = useNavigation();

  const toggleState = () => setStatus((prevStatus) => !prevStatus);

  const fetchCategories = async () => {
    try {
      setloading(true);
      const data = await getCategories(token);
      setCategories(data.data);
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
    }finally{
      setloading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
      headerTitleAlign: 'center',
      headerRight: () => <HeaderRight onClick={toggleState} />,
    });
  }, [navigation]);

  useEffect(() => {
    fetchCategories();
  }, []);


  return (
    <ScreenWrapper
      style={[styles.screenWrapper, { backgroundColor: background }]}
    >
      <ThemedText style={[styles.text, { color: text }]}>
        Select a respective category of the asset to start audit.
      </ThemedText>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <ScrollView style={{ paddingTop: 30 }}>
          <View style={styles.cardWrapper}>
            {categories.map((category: any, index: number) => (
              <Pressable key={category.id} onPress={()=>{
                setIsDisabled(true);
                setTimeout(() => setIsDisabled(false), 1000);
                router.push({pathname:`audit/auditPage/${auditId}/${category.id}/`,params:{name:name,typeName:category.type}});
              }}
              disabled = {isDisabled}
              >
                <BaseCard
                  style={[
                    styles.cardContainer,
                    {
                      width: CARD_WIDTH,
                      height: CARD_HEIGHT,
                      marginRight: index % 2 === 0 ? "8%" : 0,
                    },
                  ]}
                >
                  <ImageBackground
                    source={category.image ? { uri: category.image} : defaultImage }
                    resizeMode="contain"
                    style={styles.cardImage}
                  ></ImageBackground>
                  <View style={styles.cardTextContainer}>
                    <ThemedText
                      ellipsizeMode="tail"
                      numberOfLines={2}
                      style={styles.cardMainText}
                      type="title"
                    >
                      {category.type}
                    </ThemedText>
                    {/* <ThemedText
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      style={styles.cardSubText}
                    >
                      {category.type}
                    </ThemedText> */}
                  </View>
                </BaseCard>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}

      {status && <AuditOptions hideSubmit={auditStatus=="COMPLETED"} setStatus={setStatus}  id={auditId}/>}
    </ScreenWrapper>
  );
}


const AuditOptions = ({ hideSubmit,setStatus , id}: {hideSubmit:boolean, setStatus: (e: boolean) => void, id: string | string[]}) => {
  const closeModal = () => {
    setTimeout(() => {
      setStatus(false);
    }, 800);
  };

  const {showToast} = useToast();
  const router = useRouter();
  const {setLoading} = useAppContext();
  const { token,signOut} = useSession();
  
  const handler =  (type: AuditStatus) => {
     updateAudit(id,type,token).then((res)=>{
      showToast({
        type:"success",
        text1 :  `Successfully submitted audit : ${res.data.name}`
      })
      // router.push("audit/assetAuditsPage");
      router.back();
     }).catch(async (e)=>{
       showToast({
        type:"error",
        text1:e.message
       });
       if(checkAuthError(e)){
        signOut();
        
         router.dismissAll();
                       router.replace("/");
                   }
     })
  }

   const handleDownload = async () =>{            
      try {
          setLoading(true);
          const {contentType,data,fileName} = await downloadReport(id,token);            

          const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
          if (!permissions.granted) {
              return;
          }
  
          const fileOnDeviceURI = await FileSystem.StorageAccessFramework.createFileAsync(
              permissions.directoryUri,
              fileName,
              contentType
          );

          await FileSystem.writeAsStringAsync(fileOnDeviceURI, data, {
              encoding: FileSystem.EncodingType.Base64,
          });
        
          showToast({
              type:"success",
              text1:'Audit report saved successfully!'
          })
      
      } catch (error) {
          console.error("Error downloading report:", error);
          Alert.alert('Error', 'Failed to download the report.');
          if(checkAuthError(error)){
            signOut();
            router.dismissAll();
                    router.replace("/");
            }
      }finally{
          setLoading(false)
          closeModal();
      }     
  }

  return (
    <BottomSheet closeModal={closeModal}>
      <View style={styles.optionsContainer}>
       {!hideSubmit ? <TouchableOpacity onPress={()=>handler("COMPLETED")} style={styles.optionsWrapper}>
          <ThemedText style={styles.optionText}>Submit the Audit</ThemedText>
        </TouchableOpacity>:null}
        <TouchableOpacity onPress={handleDownload} style={styles.optionsWrapper}>
          <ThemedText style={styles.optionText}>Download</ThemedText>
        </TouchableOpacity>
        {/* <View>
          <ThemedText style={styles.optionText}>Print</ThemedText>
        </View> */}
      </View>
    </BottomSheet>
  );
};
