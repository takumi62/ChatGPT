import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../themes/ThemeProvider';

// カレンダー上のドット表示（色分け）サンプル
const sampleMarkedDates = {
  '2025-02-01': { dots: [{ key: 'exercise', color: '#4CAF50' }] },
  '2025-02-02': { dots: [{ key: 'reading', color: '#2196F3' }, { key: 'diary', color: '#FF9800' }] },
  '2025-02-03': { dots: [{ key: 'vitamin', color: '#FF5733' }, { key: 'yoga', color: '#FFD700' }] },
  '2025-02-04': { dots: [{ key: 'exercise', color: '#4CAF50' }, { key: 'reading', color: '#2196F3' }] }
};

// 日付に紐づくアクティビティのサンプル
const dailyActivities = {
  '2025-02-01': [
    { title: 'Exercise', description: 'Training at the gym', color: '#4CAF50' }
  ],
  '2025-02-02': [
    { title: 'Reading', description: 'Read for 30 minutes', color: '#2196F3' },
    { title: 'Diary', description: 'Reflect on today', color: '#FF9800' }
  ],
  '2025-02-03': [
    { title: 'Vitamin Intake', description: 'Take multivitamins', color: '#FF5733' },
    { title: 'Yoga', description: '30 minutes of yoga', color: '#FFD700' }
  ],
  '2025-02-04': [
    { title: 'Exercise', description: 'Running', color: '#4CAF50' },
    { title: 'Reading', description: 'Read a self-improvement book', color: '#2196F3' }
  ]
};

const FullCalendarScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const { colors } = useTheme();

  // タップ時の処理 - カレンダー下部の表示のみ更新
  const handleDatePress = (day) => {
    setSelectedDate(day.dateString);
  };

  // 長押し時の処理 - モーダル表示
  const handleDateLongPress = (day) => {
    setSelectedDate(day.dateString);
    setBottomSheetVisible(true);
  };

  const activitiesForSelectedDay =
    selectedDate && dailyActivities[selectedDate]
      ? dailyActivities[selectedDate]
      : [];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Calendar
          style={styles.calendar}
          markingType="multi-dot"
          markedDates={sampleMarkedDates}
          onDayPress={handleDatePress}
          dayComponent={({ date, state, marking }) => {
            const isToday = date.dateString === today;
            const isDisabled = state === 'disabled';
            return (
              <TouchableOpacity
                style={[styles.dayContainer, isToday && styles.todayHighlight]}
                onLongPress={() => handleDateLongPress({ dateString: date.dateString })}
                onPress={() => handleDatePress({ dateString: date.dateString })}
              >
                <Text
                  style={[
                    styles.dayText,
                    isToday && styles.todayText,
                    isDisabled && { color: '#ccc' }
                  ]}
                >
                  {date.day}
                </Text>
                {marking?.dots && (
                  <View style={styles.dotContainer}>
                    {marking.dots.map((dot, index) => (
                      <View key={index} style={[styles.dot, { backgroundColor: dot.color }]} />
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />

        {/* カレンダー下部のアクティビティ表示（Habit表示部分） */}
        <ScrollView style={styles.detailContainer}>
          <Text style={styles.detailDateText}>{selectedDate || "Select a date"}</Text>
          {activitiesForSelectedDay.length > 0 ? (
            activitiesForSelectedDay.map((activity, idx) => (
              <View key={idx} style={[styles.habitItem, { backgroundColor: activity.color + '15' }]}>
                <View style={styles.habitLeft}>
                  <View style={[styles.habitColorDot, { backgroundColor: activity.color }]} />
                  <View style={styles.habitTextContainer}>
                    <Text style={[styles.habitTitle, { color: activity.color }]}>
                      {activity.title}
                    </Text>
                    <Text style={styles.habitTime}>
                      {activity.description}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noActivityText}>no date</Text>
          )}
        </ScrollView>
      </View>

      {/* Bottom Sheet（長押しで開く） */}
      <Modal
        key={selectedDate}
        animationType="slide"
        transparent={true}
        visible={bottomSheetVisible}
        onRequestClose={() => setBottomSheetVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setBottomSheetVisible(false)}
        >
          <View style={styles.bottomSheetContainer}>
            <Text style={styles.bottomSheetDateText}>{selectedDate}</Text>
            {activitiesForSelectedDay.length > 0 ? (
              activitiesForSelectedDay.map((activity, idx) => (
                <View key={idx} style={[styles.habitItem, { backgroundColor: activity.color + '15' }]}>
                  <View style={styles.habitLeft}>
                    <View style={[styles.habitColorDot, { backgroundColor: activity.color }]} />
                    <View style={styles.habitTextContainer}>
                      <Text style={[styles.habitTitle, { color: activity.color }]}>
                        {activity.title}
                      </Text>
                      <Text style={styles.habitTime}>{activity.description}</Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noActivityText}>no date</Text>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setBottomSheetVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    flex: 1,
    paddingTop: 20
  },
  calendar: {
    marginBottom: 10
  },
  dayContainer: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  todayHighlight: {
    backgroundColor: 'gray'
  },
  dayText: {
    fontSize: 16
  },
  todayText: {
    color: 'white',
    fontWeight: 'bold'
  },
  dotContainer: {
    flexDirection: 'row',
    marginTop: 2
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1
  },
  detailContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 20
  },
  detailDateText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center'
  },
  // CalendarScreen の Habit 表示スタイルと同一にする
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
    fontWeight: '500',
    color: '#000'
  },
  habitTime: {
    fontSize: 12,
    color: '#666'
  },
  noActivityText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  bottomSheetContainer: {
    height: height * 0.5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16
  },
  bottomSheetDateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'flex-end',
    backgroundColor: 'tomato',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  closeButtonText: {
    color: '#fff'
  }
});

export default FullCalendarScreen;
