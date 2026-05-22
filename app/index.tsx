import { useRouter } from "expo-router";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <View style={styles.headerContainer}>
        <Text style={styles.gameTitle}>MEMORY</Text>
        <Text style={styles.gameSubtitle}>Challenge your brain</Text>
      </View>


      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => router.push("/game")}
          activeOpacity={0.9}
        >
          <Text style={[styles.buttonText, styles.primaryButtonText]}>START GAME</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push("/leaderboard")}
          activeOpacity={0.9}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>LEADERBOARD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A", // Deep Slate / Dark mode background
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingTop: 80,
    paddingBottom: 60,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  gameTitle: {
    fontSize: 48,
    fontWeight: "900",
    color: "#F8FAFC",
    letterSpacing: 4,
  },
  gameSubtitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#38BDF8", // Electric blue accent
    letterSpacing: 8,
    marginTop: -4,
  },
  counterCard: {
    backgroundColor: "#1E293B",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  counterLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 2,
    marginBottom: 4,
  },
  counterValue: {
    fontSize: 64,
    fontWeight: "900",
    color: "#FDE047", // Vibrant yellow text
    marginBottom: 16,
  },
  incrementButton: {
    backgroundColor: "#334155",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  incrementButtonText: {
    color: "#F8FAFC",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 1,
  },
  menuContainer: {
    width: "100%",
    gap: 16, // Clean spacing between layout buttons
  },
  button: {
    width: "100%",
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 0, // Crisp hard shadow for brutalist style
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: "#FDE047", // Neon Yellow
    borderColor: "#000000",
  },
  primaryButtonText: {
    color: "#0F172A",
  },
  secondaryButton: {
    backgroundColor: "#0F172A",
    borderColor: "#38BDF8", // Electric blue border
  },
  secondaryButtonText: {
    color: "#38BDF8",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
});