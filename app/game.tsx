import { createNewScore } from "@/database/crud";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Card } from "../components/card";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SCREEN_PADDING = 12;
const TOTAL_AVAILABLE_WIDTH = SCREEN_WIDTH - (SCREEN_PADDING * 2);
const GAP_SIZE = 8;
const TOTAL_GAPS_WIDTH = GAP_SIZE * 3;
const EXACT_CARD_SIZE = (TOTAL_AVAILABLE_WIDTH - TOTAL_GAPS_WIDTH) / 4;

const SYMBOLS = [
    "👾", "🚀", "🕹️", "🪐", "🛸", "🤖", "⭐", "🛰️",
    "☄️", "🛡️", "🔋", "🔮",
];

const generateNewGameBoard = () => {
    const duplicatedSymbols = [...SYMBOLS, ...SYMBOLS];
    for (let i = duplicatedSymbols.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [duplicatedSymbols[i], duplicatedSymbols[j]] = [duplicatedSymbols[j], duplicatedSymbols[i]];
    }

    return duplicatedSymbols.map((symbol, index) => ({
        id: index + 1,
        value: symbol,
        isFlipped: false,
        isMatched: false,
    }));
};

export default function Game() {
    const router = useRouter();

    const [cards, setCards] = useState(generateNewGameBoard);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [seconds, setSeconds] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [playerName, setPlayerName] = useState("");
    const [showModal, setShowModal] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isTimerActive) {
            timerRef.current = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isTimerActive]);

    const handleReset = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setCards(generateNewGameBoard());
        setSelectedIds([]);
        setSeconds(0);
        setIsTimerActive(false);
        setIsGameFinished(false);
        setShowModal(false);
        setPlayerName("");
    };

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleSaveScore = () => {
        if (!playerName.trim()) {
            Alert.alert("Error", "Please enter your name!");
            return;
        }
        createNewScore(seconds, playerName);
        setShowModal(false);
        handleReset();
    };

    const handleCardPress = (clickedId: number) => {
        const clickedCard = cards.find(c => c.id === clickedId);
        if (selectedIds.length >= 2 || isGameFinished || clickedCard?.isFlipped || clickedCard?.isMatched) return;

        if (!isTimerActive) {
            setIsTimerActive(true);
        }

        setCards((prevCards) =>
            prevCards.map((card) =>
                card.id === clickedId ? { ...card, isFlipped: true } : card
            )
        );

        const newSelection = [...selectedIds, clickedId];
        setSelectedIds(newSelection);

        if (newSelection.length === 2) {
            const [firstId, secondId] = newSelection;

            const updatedCards = cards.map((card) =>
                card.id === clickedId ? { ...card, isFlipped: true } : card
            );

            const firstCard = updatedCards.find((c) => c.id === firstId);
            const secondCard = updatedCards.find((c) => c.id === secondId);

            if (firstCard && secondCard && firstCard.value === secondCard.value) {
                setTimeout(() => {
                    const nextCards = updatedCards.map((card) =>
                        card.id === firstId || card.id === secondId
                            ? { ...card, isFlipped: false, isMatched: true }
                            : card
                    );

                    setCards(nextCards);
                    setSelectedIds([]);

                    const allMatched = nextCards.every((card) => card.isMatched);
                    if (allMatched) {
                        setIsTimerActive(false);
                        setIsGameFinished(true);
                        setTimeout(() => setShowModal(true), 500);
                    }
                }, 400);
            } else {
                setTimeout(() => {
                    setCards((prevCards) =>
                        prevCards.map((card) =>
                            card.id === firstId || card.id === secondId
                                ? { ...card, isFlipped: false }
                                : card
                        )
                    );
                    setSelectedIds([]);
                }, 1000);
            }
        }
    };

    return (
        <View style={styles.gameContainer}>
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.homeButton} onPress={() => router.replace("/")}>
                    <Text style={styles.homeButtonText}>BACK</Text>
                </TouchableOpacity>

                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>{formatTime(seconds)}</Text>
                </View>

                <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                    <Text style={styles.resetButtonText}>RESET</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {cards.map((card) => (
                    <View key={card.id} style={styles.cardWrapper}>
                        <Card
                            value={card.value}
                            isFlipped={card.isFlipped}
                            isMatched={card.isMatched}
                            onPress={() => handleCardPress(card.id)}
                        />
                    </View>
                ))}
            </View>

            <Modal visible={showModal} transparent={true} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>VICTORY!</Text>
                        <Text style={styles.modalSubtitle}>Your Time: {formatTime(seconds)}</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="ENTER YOUR NAME"
                            placeholderTextColor="#64748B"
                            value={playerName}
                            onChangeText={setPlayerName}
                            autoCapitalize="characters"
                            maxLength={15}
                        />

                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveScore}>
                            <Text style={styles.saveButtonText}>SAVE SCORE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


const styles = StyleSheet.create({
    gameContainer: {
        flex: 1,
        backgroundColor: "#0F172A",
        paddingHorizontal: SCREEN_PADDING,
        paddingTop: 60,
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
        width: "100%",
        paddingHorizontal: 4,
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
    timerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    timerText: {
        fontSize: 32,
        fontWeight: "900",
        color: "#38BDF8",
        letterSpacing: 2,
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
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: GAP_SIZE,
    },
    cardWrapper: {
        width: EXACT_CARD_SIZE,
        height: EXACT_CARD_SIZE,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.85)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    modalContent: {
        backgroundColor: "#1E293B",
        borderRadius: 24,
        padding: 32,
        width: "100%",
        maxWidth: 340,
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#22C55E",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 36,
        fontWeight: "900",
        color: "#22C55E",
        letterSpacing: 2,
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#94A3B8",
        marginBottom: 24,
    },
    input: {
        backgroundColor: "#0F172A",
        color: "#F8FAFC",
        borderWidth: 2,
        borderColor: "#334155",
        borderRadius: 12,
        width: "100%",
        height: 52,
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 20,
        letterSpacing: 1,
    },
    saveButton: {
        backgroundColor: "#22C55E",
        width: "100%",
        height: 52,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#000000",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 0,
        elevation: 4,
    },
    saveButtonText: {
        color: "#0F172A",
        fontSize: 16,
        fontWeight: "900",
        letterSpacing: 1.5,
    },
});