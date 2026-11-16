import { ScrollView, StyleSheet, Text, View } from "react-native";

const stats = [
  { label: "Total Students", value: "1,234", icon: "👨‍🎓" },
  { label: "Present Today", value: "1,180", icon: "✅" },
  { label: "Absent", value: "54", icon: "❌" },
  { label: "Staff", value: "85", icon: "👨‍🏫" },
];
const notices = [
  { id: "1", title: "Exam Schedule Released", date: "Today", priority: "High" },
  {
    id: "2",
    title: "Parent-Teacher Meeting",
    date: "Tomorrow",
    priority: "Medium",
  },
];
export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>School MIS</Text>
        <Text style={styles.subtitle}>Manage your school</Text>
      </View>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statIcon}>{stat.icon}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.sectionTitle}>Notices</Text>
      {notices.map((notice) => (
        <View key={notice.id} style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>{notice.title}</Text>
          <View style={styles.noticeMeta}>
            <Text style={styles.noticeDate}>{notice.date}</Text>
            <View
              style={[
                styles.priorityBadge,
                notice.priority === "High"
                  ? styles.highBadge
                  : styles.mediumBadge,
              ]}
            >
              <Text style={styles.priorityText}>{notice.priority}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { padding: 20, paddingTop: 60, backgroundColor: "#059669" },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 14, color: "#D1FAE5", marginTop: 4 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", padding: 12 },
  statCard: {
    width: "46%",
    margin: "2%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },
  statIcon: { fontSize: 28 },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 8,
  },
  statLabel: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  noticeCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
  },
  noticeTitle: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  noticeMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  noticeDate: { fontSize: 14, color: "#6B7280" },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  highBadge: { backgroundColor: "#FEE2E2" },
  mediumBadge: { backgroundColor: "#FEF3C7" },
  priorityText: { fontSize: 10, fontWeight: "600" },
});
