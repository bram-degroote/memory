import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CardProps {
    value: string;
    isFlipped: boolean;
    isMatched: boolean;
    onPress: () => void;
}

export function Card({ value, isFlipped, isMatched, onPress }: CardProps) {
    const isDisabled = isFlipped || isMatched;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
            style={[
                styles.cardBase,
                isFlipped ? styles.cardFront : styles.cardBack,
                isMatched && styles.cardMatched,
            ]}
        >
            {isFlipped || isMatched ? (
                <Text style={[styles.cardValue, isMatched && styles.valueMatched]}>
                    {value}
                </Text>
            ) : (
                <View style={styles.mysteryPattern}>
                    <Text style={styles.questionMark}>?</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardBase: {
        aspectRatio: 0.75,
        flex: 1,
        margin: 0,
        borderRadius: 1,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 0,
        elevation: 4,
    },
    cardBack: {
        backgroundColor: "#38BDF8",
        borderColor: "#0F172A",
    },
    cardFront: {
        backgroundColor: "#1E293B",
        borderColor: "#FDE047",
    },
    cardMatched: {
        backgroundColor: "#0F172A",
        borderColor: "#22C55E",
        opacity: 0.6,
    },
    questionMark: {
        fontSize: 28,
        fontWeight: "900",
        color: "#0F172A",
    },
    cardValue: {
        fontSize: 32,
    },
    valueMatched: {
        transform: [{ scale: 0.9 }],
    },
    mysteryPattern: {
        justifyContent: "center",
        alignItems: "center",
    }
});