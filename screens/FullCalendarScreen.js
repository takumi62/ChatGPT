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

const sampleMarkedDates = {
  '2025-02-01': { dots: [{ key: 'exercise', color: '#4CAF50' }] },
  '2025-02-02': { dots: [{ key: 'reading', color: '#2196F3' }, { key: 'diary', color: '#FF9800' }] },
  '2025-02-03': { dots: [{ key: 'vitamin', color: '#FF5733' }, { key: 'yoga', color: '#FFD700' }] },
  '2025-02-04': { dots: [{ key: 'exercise', color: '#4CAF50' }, { key: 'reading', color: '#2196F3' }] }
};

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

  const handleDatePress = (day) => {
    setSelectedDate(day.dateString);
  };

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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* react-native-calendars にテーマを適用 */}
        <Calendar
          style={styles.calendar}
          markingType="multi-dot"
          markedDates={sampleMarkedDates}
          // カレンダーの色を theme prop で設定
          theme={{
            calendarBackground: colors.background,
            textSectionTitleColor: colors.text,
            dayTextColor: colors.text,
            monthTextColor: colors.text,
            arrowColor: colors.text,
            // 以下は必要に応じて設定
            textDisabledColor: '#808080',
            todayTextColor: colors.text,
          }}
          onDayPress={handleDatePress}
          dayComponent={({ date, state, marking }) => {
            const isToday = date.dateString === today;
            const isDisabled = state === 'disabled';
            return (
              <TouchableOpacity
                style={[
                  styles.dayContainer,
                  isToday && { backgroundColor: colors.primary },
                ]}
                onLongPress={() => handleDateLongPress({ dateString: date.dateString })}
                onPress={() => handleDatePress({ dateString: date.dateString })}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: colors.text },
                    isToday && { color: colors.text, fontWeight: 'bold' },
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

        {/* カレンダー下部のアクティビティ表示部分 */}
        <ScrollView style={styles.detailContainer}>
          <Text style={[styles.detailDateText, { color: colors.text }]}>
            {selectedDate || "Select a date"}
          </Text>
          {activitiesForSelectedDay.length > 0 ? (
            activitiesForSelectedDay.map((activity, idx) => (
              <View
                key={idx}
                style={[
                  styles.habitItem,
                  { backgroundColor: activity.color + '15' }
                ]}
              >
                <View style={styles.habitLeft}>
                  <View style={[styles.habitColorDot, { backgroundColor: activity.color }]} />
                  <View style={styles.habitTextContainer}>
                    <Text style={[styles.habitTitle, { color: colors.text }]}>
                      {activity.title}
                    </Text>
                    <Text style={[styles.habitTime, { color: colors.textSecondary || '#666' }]}>
                      {activity.description}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={[styles.noActivityText, { color: colors.textSecondary || '#666' }]}>
              no date
            </Text>
          )}
        </ScrollView>
      </View>

      {/* Bottom Sheet（長押しで開くモーダル） */}
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
          <View style={[styles.bottomSheetContainer, { backgroundColor: colors.background}]}>
            <Text style={[styles.bottomSheetDateText, { color: colors.text }]}>
              {selectedDate}
            </Text>
            {activitiesForSelectedDay.length > 0 ? (
              activitiesForSelectedDay.map((activity, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.habitItem,
                    { backgroundColor: activity.color + '15' }
                  ]}
                >
                  <View style={styles.habitLeft}>
                    <View style={[styles.habitColorDot, { backgroundColor: activity.color }]} />
                    <View style={styles.habitTextContainer}>
                      <Text style={[styles.habitTitle, { color: colors.text }]}>
                        {activity.title}
                      </Text>
                      <Text style={[styles.habitTime, { color: colors.textSecondary || '#666' }]}>
                        {activity.description}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={[styles.noActivityText, { color: colors.textSecondary || '#666' }]}>
                no date
              </Text>
            )}
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: 'tomato' }]}
              onPress={() => setBottomSheetVisible(false)}
            >
              <Text style={[styles.closeButtonText, { color: '#fff' }]}>Close</Text>
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
  dayText: {
    fontSize: 16
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
  noActivityText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  bottomSheetContainer: {
    height: height * 0.5,
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
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  closeButtonText: {
    color: '#fff'
  }
});

export default FullCalendarScreen;
