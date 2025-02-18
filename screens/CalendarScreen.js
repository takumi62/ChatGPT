import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../themes/ThemeProvider';

const habits = [
  {
    id: '1',
    title: 'Eat Breakfast',
    color: '#FF4B4B',
    difficulty: 2,
    pace: 7,  // 週に7回 (毎日)
    time: '8:00 AM',
    isCompleted: false,
    progress: 3
  },
  {
    id: '2',
    title: 'Do stretching',
    color: '#FFB800',
    difficulty: 3,
    pace: 3, // 週に3回
    time: '8:22 AM',
    isCompleted: false,
    progress: 1
  },
  {
    id: '3',
    title: 'Drinking Water',
    color: '#4B9AFF',
    difficulty: 1,
    pace: 5, // 週に5回
    time: 'Anytime',
    isCompleted: false,
    progress: 2
  }
];

// サンプルデータ (Goal)
const goals = [
  {
    id: '1',
    title: 'Score 800 on TOEIC',
    color: '#2196F3',
    difficulty: 4,
    progress: 40
  },
  {
    id: '2',
    title: 'Lose 5kg',
    color: '#FF5733',
    difficulty: 3,
    progress: 20
  }
];

const getWeekDays = (date) => {
  const weekDays = [];
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - date.getDay());
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    weekDays.push(d);
  }
  return weekDays;
};

const CalendarScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const weekDays = getWeekDays(selectedDate);
  const headerMonth = selectedDate.toLocaleString('default', { month: 'short' });
  const headerDay = selectedDate.getDate();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ヘッダー */}
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Build Good Habits
        </Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity>
            <Feather name="plus" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 16 }}>
            <Feather name="more-horizontal" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 動的カレンダー・ストリップ */}
      <View style={styles.calendarStripContainer}>
        <TouchableOpacity
          style={styles.calendarHeader}
          onPress={() => navigation.navigate('FullCalendarScreen')}
        >
          <Feather name="calendar" size={22} color={colors.text} />
          <Text style={[styles.calendarDate, { color: colors.text }]}>
            {headerMonth} {headerDay}
          </Text>
        </TouchableOpacity>
        <View style={styles.calendarStrip}>
          {weekDays.map((day) => {
            const dayNumber = day.getDate();
            const isSelected = day.toDateString() === selectedDate.toDateString();
            return (
              <TouchableOpacity
                key={day.toISOString()}
                style={[
                  styles.dayItem,
                  { borderColor: colors.border },
                  isSelected && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary
                  }
                ]}
                onPress={() => setSelectedDate(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: colors.text },
                    isSelected && { color: colors.text, fontWeight: 'bold' }
                  ]}
                >
                  {dayNumber}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Active Habits */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Habits</Text>
        {habits.map((habit) => (
          <View
            key={habit.id}
            style={[
              styles.habitItem,
              // habit.color + '15' は習慣カラーの薄い背景用
              { backgroundColor: habit.color + '15' }
            ]}
          >
            <View style={styles.habitLeft}>
              <View style={[styles.habitColorDot, { backgroundColor: habit.color }]} />
              <View style={styles.habitTextContainer}>
                <Text style={[styles.habitTitle, { color: colors.text }]}>{habit.title}</Text>
                {habit.time ? (
                  <Text style={[styles.habitTime, { color: colors.textSecondary || colors.text }]}>
                    {habit.time}
                  </Text>
                ) : null}
              </View>
            </View>
            {habit.progress !== undefined && (
              <Text style={[styles.habitProgress, { color: colors.text }]}>
                {habit.progress} / {habit.pace}
              </Text>
            )}
          </View>
        ))}

        {/* Goals */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Goals</Text>
        {goals.map((goal) => (
          <View
            key={goal.id}
            style={[
              styles.goalItem,
              { backgroundColor: colors.card }
            ]}
          >
            <View style={styles.goalLeft}>
              <Text style={[styles.goalTitle, { color: colors.text }]}>
                {goal.title}
              </Text>
              <Text style={[styles.goalDifficulty, { color: colors.textSecondary || colors.text }]}>
                Difficulty: {goal.difficulty}★
              </Text>
            </View>
            <Text style={[styles.goalProgress, { color: colors.text }]}>
              {goal.progress}%
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  iconContainer: {
    flexDirection: 'row'
  },
  calendarStripContainer: {
    paddingHorizontal: 16,
    marginTop: 20
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  calendarDate: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 6
  },
  calendarStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dayItem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dayText: {
    fontSize: 16
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  habitColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8
  },
  habitTextContainer: {
    flexDirection: 'column'
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '500'
  },
  habitTime: {
    fontSize: 12
  },
  habitProgress: {
    fontSize: 14,
    fontWeight: '500',
    position: 'absolute',
    right: 10,
    bottom: 10
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8
  },
  goalLeft: {
    flexDirection: 'column'
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500'
  },
  goalDifficulty: {
    fontSize: 12,
    marginTop: 4
  },
  goalProgress: {
    fontSize: 14,
    fontWeight: '500'
  }
});

export default CalendarScreen;
