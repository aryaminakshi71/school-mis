import { FlatList, StyleSheet, Text, View } from "react-native";

const grades = [
  {
    id: "1",
    subject: "Mathematics",
    class: "Class 10-A",
    avgGrade: "85%",
    status: "Good",
  },
  {
    id: "2",
    subject: "English",
    class: "Class 10-A",
    avgGrade: "78%",
    status: "Average",
  },
  {
    id: "3",
    subject: "Science",
    class: "Class 10-A",
    avgGrade: "92%",
    status: "Excellent",
  },
];
export default function GradesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Grades</Text>
        <Text style={styles.subtitle}>Academic performance</Text>
      </View>
      <FlatList
        data={grades}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.gradeCard}>
            <View style={styles.subjectInfo}>
              <Text style={styles.subject}>{item.subject}</Text>
              <Text style={styles.class}>{item.class}</Text>
            </View>
            <View style={styles.gradeInfo}>
              <Text style={styles.avgGrade}>{item.avgGrade}</Text>
              <View
                style={[
                  styles.statusBadge,
                  item.status === "Excellent"
                    ? styles.excellentBadge
                    : item.status === "Good"
                      ? styles.goodBadge
                      : styles.averageBadge,
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
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
  gradeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
  },
  subjectInfo: { flex: 1 },
  subject: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  class: { fontSize: 14, color: "#6B7280", marginTop: 2 },
  gradeInfo: { alignItems: "flex-end" },
  avgGrade: { fontSize: 20, fontWeight: "bold", color: "#059669" },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  excellentBadge: { backgroundColor: "#D1FAE5" },
  goodBadge: { backgroundColor: "#DBEAFE" },
  averageBadge: { backgroundColor: "#FEF3C7" },
  statusText: { fontSize: 10, fontWeight: "600" },
});
