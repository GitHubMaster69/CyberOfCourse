import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function RiskGauge({ riskLevel }) {
  const getColor = () => {
    switch (riskLevel) {
      case "low":
        return "green";
      case "medium":
        return "orange";
      case "high":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <View style={[styles.gauge, { backgroundColor: getColor() }]}>
      <Text style={styles.text}>{riskLevel.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gauge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
