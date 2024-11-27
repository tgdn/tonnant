import * as React from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";

import { LogoWithText } from "@/components/LogoWithText";

export default function SignUpScreen() {
  const { styles, theme } = useStyles(stylesheet);
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded || !emailAddress || !password || !firstName || !lastName) {
      return;
    }
    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.contentContainer}
      >
        <LogoWithText width="55%" />
        {!pendingVerification && (
          <>
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Email..."
                placeholderTextColor={theme.colors.sonicSilver}
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
              />
              <TextInput
                style={styles.input}
                value={password}
                placeholder="Password..."
                secureTextEntry={true}
                placeholderTextColor={theme.colors.sonicSilver}
                onChangeText={(password) => setPassword(password)}
              />
              <TextInput
                style={styles.input}
                value={firstName}
                placeholder="First name..."
                placeholderTextColor={theme.colors.sonicSilver}
                onChangeText={(firstName) => setFirstName(firstName)}
              />
              <TextInput
                style={styles.input}
                value={lastName}
                placeholder="Last name..."
                placeholderTextColor={theme.colors.sonicSilver}
                onChangeText={(lastName) => setLastName(lastName)}
              />
              <Pressable style={styles.button} onPress={onSignUpPress}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </Pressable>
            </View>
            <View
              style={{
                marginTop: 30,
                width: "100%",
                flexDirection: "row",
                gap: 5,
              }}
            >
              <Text style={styles.helpText}>Already have an account?</Text>
              <Pressable
                onPress={() => {
                  router.dismiss();
                }}
              >
                <Text style={styles.linkText}>Sign in</Text>
              </Pressable>
            </View>
          </>
        )}
        {pendingVerification && (
          <View style={styles.formContainer}>
            <TextInput
              value={code}
              style={styles.input}
              inputMode="numeric"
              placeholder="Code..."
              placeholderTextColor={theme.colors.sonicSilver}
              onChangeText={(code) => setCode(code)}
            />
            <Pressable style={styles.button} onPress={onPressVerify}>
              <Text style={styles.buttonText}>Verify Email</Text>
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: theme.colors.backgroundColor,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    marginTop: 30,
    width: "100%",
    gap: 12,
  },
  input: {
    height: 45,
    padding: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: theme.colors.lightGray,
    borderRadius: 4,
  },
  button: {
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: theme.colors.dark,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "500",
    letterSpacing: 0.25,
    color: "white",
  },
  helpText: {
    color: theme.colors.sonicSilver,
  },
  linkText: {
    fontWeight: "500",
    color: theme.colors.purpleBlue,
  },
}));
