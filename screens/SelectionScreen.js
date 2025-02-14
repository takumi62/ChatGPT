import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants';

const SelectionScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: COLORS.primary }]}
                onPress={() => navigation.navigate('GoalSetting')}
            >
                <Text style={[styles.buttonText, { color: COLORS.white }]}>Setting goals</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: COLORS.primary }]}
                onPress={() => navigation.navigate('HabitSetting')}
            >
                <Text style={[styles.buttonText, { color: COLORS.white }]}>Setting habits</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: 250,
        paddingVertical: SIZES.padding * 1.5,
        marginVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        ...FONTS.h3,
    },
});

export default SelectionScreen;
