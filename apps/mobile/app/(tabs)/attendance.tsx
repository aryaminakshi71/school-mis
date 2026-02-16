import { FlatList, StyleSheet, Text, View } from "react-native";
const attendance = [
  {
    id: "1",
    date: "Feb 16, 2026",
    present: 1180,
    absent: 54,
    percentage: "95.6%",
  },
  {
    id: "2",
    date: "Feb 15, 2026",
    present: 1200,
    absent: 34,
    percentage: "97.2%",
  },
  {
    id: "3",
    date: "Feb 14, 2026",
    present: 1156,
    absent: 78,
    percentage: "93.7%",
  },
];
export default function AttendanceScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Attendance</Text>
        <Text style={styles.subtitle}>Daily records</Text>
      </View>
      <FlatList
        data={attendance}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.attendanceCard}>
            <Text style={styles.date}>{item.date}</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{item.present}</Text>
                <Text style={styles.statLabel}>Present</Text>
              </View>
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: "#EF4444" }]}>
                  {item.absent}
                </Text>
                <Text style={styles.statLabel}>Absent</Text>
              </View>
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: "#059669" }]}>
                  {item.percentage}
                </Text>
                <Text style={styles.statLabel}>Rate</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { padding: 20, paddingTop: 60, backgroundColor: "#059669" },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 14, color: "#D1FAE5", marginTop: 4 },
  attendanceCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
  },
  date: { fontSize: 16, fontWeight: "600", color: "#1F2937", marginBottom: 12 },
  statsRow: { flexDirection: "row", justifyContent: "space-around" },
  stat: { alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#10B981" },
  statLabel: { fontSize: 12, color: "#6B7280", marginTop: 4 },
});
