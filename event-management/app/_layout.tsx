import { useEffect } from 'react';
import {  StyleSheet, TouchableOpacity } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useNavigation } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import Ionicons from '@expo/vector-icons/AntDesign';
import { Ionicons as VectorIcon } from '@expo/vector-icons';
import PaperProviderWrapper from '@/components/PaperProviderWrapper';
import { Routes } from '@/constants/Routes';
import { Colors } from '@/constants/Colors';
import { AppContextProvider } from '@/context/AppContext';
import Loader from '@/components/Loader';
import { ToastProvider } from '@/context/ToastContext';
import { SessionProvider, useSession } from '@/context/UserSessionContext';
import { useFonts } from 'expo-font';


export const layoutStyles = StyleSheet.create({
  backButton : {
    // backgroundColor: "red",
    justifyContent:"center",
    alignItems:"center",
    height:"100%",
    paddingTop : 12,
    paddingBottom : 10,
    paddingRight:15,
  },
})
 
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppContextProvider>
      <ToastProvider>
        <SessionProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <App/>
          </ThemeProvider>
        </SessionProvider>
      </ToastProvider>
    </AppContextProvider>
  );
}

function App(){

  const [loaded] = useFonts({
    Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
  });

  const { loading, isAdmin } = useSession();

  useEffect(() => {
    if (loaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, loading]);


  return(
    <PaperProviderWrapper>
      <Stack>
                {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
        <Stack.Screen name="index" options={{
          headerShown: false,

        }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="audit/auditPage/[auditId]/[typeId]/scan/index" options={{
          title: 'Asset Audit',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            textAlign: 'center', fontSize: 25, fontWeight: '600', color: Colors.black
          },
          headerStyle: {
            backgroundColor: Colors.white
          },
          headerLeft: () => (
            <TouchableOpacity
              style={layoutStyles.backButton}
              onPressIn={() => router.back()}
            >
              <VectorIcon name="chevron-back" size={24} color={Colors.primary.background} />
            </TouchableOpacity>
          )
        }} />
        <Stack.Screen name="audit/assetAuditsPage/index"
          
          options={{
            title: 'Asset Audits',
            headerTitleAlign: 'left',              
            headerLeft: () => (
              <TouchableOpacity
                style={layoutStyles.backButton}
                onPressIn={() => router.back()}
              >
                <VectorIcon name="chevron-back" size={24} color={Colors.primary.background} />
              </TouchableOpacity>
            ),
            headerRight: () => ( isAdmin() ?
              <TouchableOpacity
                style={{ marginRight: 12, justifyContent:"center", alignItems:"center",}}
                onPressIn={() => router.push(Routes.createAudit)}
              >
                <Ionicons name="pluscircleo" size={24} color={Colors.primaryButton.background} />
              </TouchableOpacity> : null
            ) ,
          }}
        />
        <Stack.Screen name="audit/createAuditPage/index"
          options={{
            title: 'Create an Audit',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity
                style={layoutStyles.backButton}
                onPressIn={() =>{
                  router.back()
                }}
              >
              {/* <FontAwesome name="angle-left" size={24} color="#8B4FF2" style={{ marginRight: 20 }} /> */}

                <VectorIcon name="chevron-back" size={24} color={Colors.primary.background} />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen name="audit/Category/index" options={{
          headerLeft: (props) => (
            <TouchableOpacity style={layoutStyles.backButton} onPressIn={() => {
              router.back()}}>
                <VectorIcon name="chevron-back" size={24} color={Colors.primary.background} />
              {/* <FontAwesome name="angle-left" size={24} color="#8B4FF2" style={{ marginRight: 20 }} /> */}
            </TouchableOpacity>
          )
        }
        } />
       
        <Stack.Screen name="audit/generateQRPage/[assetTag]/index"
          options={{
            title: 'Create QR',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity
                style={layoutStyles.backButton}
                onPressIn={() => router.back()}
              >
                <VectorIcon name="chevron-back" size={24} color={Colors.primary.background} />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen name="audit/createAssetPage/index"
          options={{
            title: 'Create an asset',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity
                style={layoutStyles.backButton}
                onPressIn={() => router.back()}
              >
                <VectorIcon name="chevron-back" size={24} color={Colors.primary.background} />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen name="audit/manageUsersPage/index"
          options={{
            title: 'Manage Users',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity
                style={layoutStyles.backButton}
                onPressIn={() => router.back()}
              >
                <VectorIcon name="chevron-back" size={24} color={Colors.primary.background} />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen name="Home/index" options={{ headerShown: false }} />
        <Stack.Screen name='audit/dashboard/index' options={{
            title: 'Admin Dashboard',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity
                style={layoutStyles.backButton}
                onPressIn={() => router.back()}
              >
                <VectorIcon name="chevron-back" size={24} color={Colors.primary.background} />
              </TouchableOpacity>
            )
          }}/>
      <Stack.Screen name='event/eventPage/index' options={{
            title: 'Events',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity
                style={layoutStyles.backButton}
                onPressIn={() => router.back()}
              >
                <VectorIcon name="chevron-back" size={24} color={Colors.primary.background} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 12, justifyContent: "center", alignItems: "center" }}
                onPressIn={() => {
                  router.setParams({ openNewItemModal: "true" });
                }}
              >
                <Ionicons name="pluscircleo" size={24} color={Colors.primaryButton.background} />
              </TouchableOpacity>
            )
          }}/>
      </Stack>
      <StatusBar style="dark" />
      <Loader />
    </PaperProviderWrapper>
  )
}
