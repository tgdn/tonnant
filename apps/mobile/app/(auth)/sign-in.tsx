import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Link, useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";

import { LogoWithText } from "@/components/LogoWithText";

export default function SignInScreen() {
  const { styles, theme } = useStyles(stylesheet);
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded || !emailAddress || !password) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.contentContainer}
      >
        <LogoWithText width="55%" />
        <View
          style={{
            marginTop: 30,
            width: "100%",
            gap: 12,
          }}
        >
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
          <Pressable style={styles.button} onPress={onSignInPress}>
            <Text style={styles.buttonText}>Sign In</Text>
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
          <Text style={styles.helpText}>Don't have an account?</Text>
          <Link href="/sign-up">
            <Text style={styles.linkText}>Sign up</Text>
          </Link>
        </View>
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
