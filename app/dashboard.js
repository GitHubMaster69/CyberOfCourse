import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView, Text, Table } from "react-native";
import { fetchDashboardData } from "./utils/firebaseHelpers";
import ComplianceChart from "./components/ComplianceChart";
import RiskGauge from "./components/RiskGauge";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const dashboardData = await fetchDashboardData();
      setData(dashboardData);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  const { employees, company } = data;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Company Dashboard</Text>
      <View style={styles.section}>
        <Text style={styles.subHeader}>Overall Risk</Text>
        <RiskGauge riskLevel={company.overallRisk} />
      </View>
      <View style={styles.section}>
        <Text style={styles.subHeader}>Compliance</Text>
        <ComplianceChart complianceStatus={company.complianceStatus} />
      </View>
      <View style={styles.section}>
        <Text style={styles.subHeader}>Employee Knowledge Levels</Text>
        <Text>High: {company.knowledgeDistribution.high}%</Text>
        <Text>Medium: {company.knowledgeDistribution.medium}%</Text>
        <Text>Low: {company.knowledgeDistribution.low}%</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subHeader}>Employee Details</Text>
        <ScrollView horizontal>
          <View>
            <Text style={styles.tableHeader}>Name</Text>
            {employees.map((emp) => (
              <Text key={emp.id} style={styles.tableCell}>{emp.email}</Text>
            ))}
          </View>
          <View>
            <Text style={styles.tableHeader}>Knowledge Level</Text>
            {employees.map((emp) => (
              <Text key={emp.id} style={styles.tableCell}>{emp.knowledgeLevel}</Text>
            ))}
          </View>
          <View>
            <Text style={styles.tableHeader}>Risk Level</Text>
            {employees.map((emp) => (
              <Text key={emp.id} style={styles.tableCell}>{emp.riskLevel}</Text>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  tableHeader: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  tableCell: {
    marginBottom: 5,
  },
});
