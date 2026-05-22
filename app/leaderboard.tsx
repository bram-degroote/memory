import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getScores, resetScore } from "../database/crud";

interface ScoreRow {
    id: number;
    name: string;
    time: number;
}

export default function LeaderBoard() {
    const router = useRouter();
    const [scores, setScores] = useState<ScoreRow[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchScores() {
        try {
            const rows = await getScores() as unknown as ScoreRow[];
            const sortedRows = (rows || []).sort((a, b) => a.time - b.time);
            setScores(sortedRows.slice(0, 10));
        } catch (error) {
            console.error("Failed to load leaderboard:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchScores();
    }, []);

    const handleReset = async () => {
        Alert.alert(
            "Clear Leaderboard",
            "Are you sure you want to delete all high scores?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Reset",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await resetScore();
                            setScores([]);
                        } catch (error) {
                            console.error("Failed to reset scores:", error);
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const getRankColor = (index: number) => {
        if (index === 0) return "#FDE047";
        if (index === 1) return "#94A3B8";
        if (index === 2) return "#B45309";
        return "#38BDF8";
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.homeButton} onPress={() => router.replace("/")}>
                    <Text style={styles.homeButtonText}>BACK</Text>
                </TouchableOpacity>
                <Text style={styles.titleText}>TOP LEAGUE</Text>
                <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                    <Text style={styles.resetButtonText}>RESET</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#38BDF8" />
                </View>
            ) : scores.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyText}>NO RECORDS YET</Text>
                </View>
            ) : (
                <FlatList
                    data={scores}
                    keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item, index }) => (
                        <View style={[styles.rankRow, { borderColor: getRankColor(index) }]}>
                            <View style={styles.leftSection}>
                                <Text style={[styles.rankNumber, { color: getRankColor(index) }]}>
                                    #{index + 1}
                                </Text>
                                <Text style={styles.playerName}>{(item.name || "ANONYMOUS").toUpperCase()}</Text>
                            </View>
                            <Text style={[styles.playerTime, { color: getRankColor(index) }]}>
                                {formatTime(item.time)}
                            </Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F172A",
        paddingHorizontal: 16,
        paddingTop: 60,
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
        width: "100%",
    },
    homeButton: {
        backgroundColor: "#1E293B",
        borderWidth: 2,
        borderColor: "#38BDF8",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 0,
        elevation: 3,
        minWidth: 80,
        alignItems: "center",
    },
    homeButtonText: {
        color: "#38BDF8",
        fontWeight: "900",
        fontSize: 14,
        letterSpacing: 1,
    },
    titleText: {
        fontSize: 24,
        fontWeight: "900",
        color: "#F8FAFC",
        letterSpacing: 2,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        color: "#64748B",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 1,
    },
    listContainer: {
        paddingBottom: 40,
        gap: 12,
    },
    rankRow: {
        backgroundColor: "#1E293B",
        borderWidth: 2,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 0,
        elevation: 3,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    rankNumber: {
        fontSize: 20,
        fontWeight: "900",
        width: 38,
    },
    playerName: {
        color: "#F8FAFC",
        fontSize: 18,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
    playerTime: {
        fontSize: 18,
        fontWeight: "900",
        letterSpacing: 1,
    },
    resetButton: {
        backgroundColor: "#1E293B",
        borderWidth: 2,
        borderColor: "#FDE047",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 0,
        elevation: 3,
        minWidth: 80,
        alignItems: "center",
    },
    resetButtonText: {
        color: "#FDE047",
        fontWeight: "900",
        fontSize: 14,
        letterSpacing: 1,
    },
});