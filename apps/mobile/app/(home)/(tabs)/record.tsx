import React from "react";
import { StyleSheet, ScrollView } from "react-native";

// import EditScreenInfo from "@/components/EditScreenInfo";
import { View } from "@/components/Themed";
import { RecordButton } from "@/components/RecordButton";

export default function TabTwoScreen() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <RecordButton />
        {/* <EditScreenInfo path="app/(tabs)/two.tsx" /> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
