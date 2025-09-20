import React, { useState } from "react";
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import styles from "../assets/styles/styles";
import { Colors } from "@/constants/Colors";
import useForm from "@/hooks/useForm";
import { useToast } from "@/context/ToastContext";
import {
  getToken,
  login,
  verifyToken,
} from "@/app/audit/services/authService";
import { useSession } from "@/context/UserSessionContext";
import { StatusBar } from "expo-status-bar";

const Index = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [popupError, setPopuperror] = useState<string>("");
  const [scheduled, setScheduled] = useState<ReturnType<typeof setTimeout> | null>(null);

  const { token, signIn, loading } = useSession();

  /**
    * Validates a form field by checking if the trimmed value is empty.
    *
    * @param field - The name of the field to validate, either 'username' or 'password'.
    * @param value - The current value of the field to validate.
    * @author Dev Muliya
    * @returns A string containing an error message if the field is empty, otherwise an empty string.
    */
  const validateForm = (fieldName: string, value: string) => {
    value = value.trim();
    if (value.trim() === '') {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
    } else {
      const emailRegex =
        /^[a-zA-Z]+\.[a-zA-Z]+[0-9]*@(?:google\.com)$/;
      if (fieldName === "username") {
        if (value.trim() === "") {
          return `Email is required`;
        } else if (!emailRegex.test(value)) {
          return "Enter a valid Email Address";
        }
      }
    }
  };

  const { values, errors, handleChange, handleSubmit } = useForm({
    username: '',
    password: '',
  }, validateForm);

  const [secureText, setSecureText] = useState(true);

  const togglePasswordVisibility = () => {
    setSecureText(!secureText);
  };

  const navigateToHome = () => {
    router.replace("/Home"); // Push new route onto the stack
  };

  // console.log("index",useRootNavigationState())
  // console.log("TOken",token);

  if (loading) return null;

  // preventing redirecting multiple times
  if (!scheduled && token) {
    return <Redirect href="/Home" />;
  }

  const handleLogin = async () => {
    try {
      const { username, password } = values;
      const data = await login(username, password);
      // signIn({ token: data.token, user: data.user });
      var name = username.split("@")[0].split(".");
      name = name[0] + " " + name[1];
      showToast({
        type: "success",
        text1: "Hi " + name,
        text2: "Login successfully.",
        position: "bottom",
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
      });
      // To test the toast, first display the toast message and then redirect to the home screen after 1 seconds
      let id = setTimeout(() => {
        navigateToHome();
      }, 1000);
      setScheduled(id);
    } catch (error: any) {
      setPopuperror(error.message);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollStyle}>
      <Toast />
      <ImageBackground
        source={require("@/assets/images/Login.jpg")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.container}>
          <View>
            <ThemedText style={styles.welcomeTxt} type="title">
              Welcome!
              <Text style={styles.loginTxt}>
                {" "}
                Login{" "}
              </Text>
              to get started.
            </ThemedText>
          </View>
          <View>
            <View style={styles.inputContainer}>
              <ThemedText type="title" style={styles.inputLable}>
                Email
              </ThemedText>
              <TextInput
                style={styles.input}
                value={values.username}
                onChangeText={(text) => handleChange("username", text)}
                placeholder="Enter your email here"
                placeholderTextColor={Colors.light.placeHolderTint}
              />
              {errors.username ? (
                <Text style={styles.errorText}>{errors.username}</Text>
              ) : null}
            </View>
            <View style={styles.inputContainer}>
              <View>
                <ThemedText type="title" style={styles.inputLable}>Password</ThemedText>
                <TextInput
                  style={styles.input}
                  value={values.password}
                  secureTextEntry={secureText}
                  onChangeText={(text) => handleChange('password', text)}
                  placeholder="Enter your password here"
                  placeholderTextColor={Colors.light.placeHolderTint}
                />
                <TouchableOpacity
                  style={styles.passwordVisibilityIcon}
                  onPress={togglePasswordVisibility}
                >
                  <Ionicons
                    name={secureText ? "eye-off" : "eye"}
                    size={24}
                    color={Colors.light.iconGray}
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>
            <TouchableOpacity
              onPress={(e) => { handleSubmit(e, handleLogin) }}
              style={{
                ...styles.loginBtn,
                backgroundColor: !(values.password && values.username) ? Colors.btnBackgroundDisable : Colors.btnBackgroundEnable,
                opacity: !(values.password && values.username) ? 0.5 : 1,
              }}
              disabled={!(values.password && values.username)}
            >
              <Text style={styles.loginBtnTxt}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <ThemedText style={styles.footerTxt}>
            Crafted by
            <ThemedText style={styles.companyName}> Brij Sojitra </ThemedText>
          </ThemedText>
        </View>
      </ImageBackground>
      <StatusBar translucent={false} />
    </ScrollView>
  );
};

export default Index;
