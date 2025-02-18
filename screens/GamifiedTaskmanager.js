import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../themes/ThemeProvider';

const GamifiedTaskmanager = () => {
    const { colors } = useTheme();
  return (
    <SafeAreaView style={styles.container} backgroundColor={colors.background}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar} />
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Lv. 1</Text>
            </View>
          </View>
          <Text style={styles.username}>@user</Text>
          <Text style={styles.xpText}>872 / 1000 XP</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard} backgroundColor="rgba(217, 119, 6, 0.15)">
            <Ionicons name="trophy" size={24} color="#d97706" />
            <Text style={[styles.statValue, {color: colors.text}]}>15</Text>
            <Text style={styles.statLabel}>Goals Completed</Text>
          </View>
          <View style={styles.statCard} backgroundColor="rgba(234, 88, 12, 0.15)">
            <Ionicons name="calendar" size={24} color="#ea580c" />
            <Text style={[styles.statValue, {color: colors.text}]}>5</Text>
            <Text style={styles.statLabel}>Habits Formed</Text>
          </View>
          <View style={styles.statCard} backgroundColor="rgba(8, 145, 178, 0.15)">
            <Ionicons name="star" size={24} color="#0891b2" />
            <Text style={[styles.statValue, {color: colors.text}]}>872</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
        </View>

        <View style={styles.achievementsContainer}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>Achievements</Text>
          <View style={styles.achievementsList}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.achievementCard} backgroundColor= {colors.card}>
                <View style={styles.achievementIcon}>
                  <Ionicons name="ribbon" size={24} color="#6b7280" />
                </View>
                <Text style={[styles.achievementTitle, {color: colors.text}]}>Achievement {i}</Text>
                <Text style={[styles.achievementDesc, {color: colors.text}]}>Locked</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e5e5e5',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  xpText: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  achievementsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  achievementDesc: {
    fontSize: 14,
    marginLeft: 'auto',
  },
});

export default GamifiedTaskmanager;