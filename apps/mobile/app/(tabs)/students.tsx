import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const students = [
  {
    id: "1",
    name: "John Smith",
    grade: "Class 10-A",
    roll: "001",
    attendance: "95%",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    grade: "Class 10-A",
    roll: "002",
    attendance: "92%",
  },
  {
    id: "3",
    name: "Mike Davis",
    grade: "Class 9-B",
    roll: "015",
    attendance: "88%",
  },
];
export default function StudentsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Students</Text>
        <Text style={styles.subtitle}>{students.length} enrolled</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search students..."
          style={styles.searchInput}
          placeholderTextColor="#9CA3AF"
        />
      </View>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.studentCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{item.name}</Text>
              <Text style={styles.studentGrade}>
                {item.grade} • Roll: {item.roll}
              </Text>
            </View>
            <Text style={styles.attendance}>{item.attendance}</Text>
          </TouchableOpacity>
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
  searchContainer: { padding: 16 },
  searchInput: { backgroundColor: "#fff", padding: 12, borderRadius: 8 },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#059669",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  studentInfo: { flex: 1, marginLeft: 12 },
  studentName: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  studentGrade: { fontSize: 14, color: "#6B7280" },
  attendance: { fontSize: 14, fontWeight: "600", color: "#059669" },
});
