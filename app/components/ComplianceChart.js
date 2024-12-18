import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";

// ComplianceChart component that displays a bar chart of compliance progress
// The compliance status is passed as a prop and determines the data for the chart
// The component uses the BarChart component from react-native-chart-kit to display the data
// The component is used in the Dashboard component to display compliance progress


export default function ComplianceChart({ complianceStatus }) {
  const data = {
    labels: Object.keys(complianceStatus),
    datasets: [
      {
        data: Object.values(complianceStatus),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Compliance Progress</Text>
      <BarChart
        data={data}
        width={300}
        height={200}
        yAxisSuffix="%"
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
