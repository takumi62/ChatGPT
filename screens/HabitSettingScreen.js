import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Keyboard, 
  Platform, 
  Switch, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants';
import { useTheme } from '../themes/ThemeProvider';

// ダミーの目標リスト（実際はサーバーやコンテキストから取得）
const availableGoals = [
  { id: 'goal1', label: 'No tags' },
];

// 使用可能な色（タスクごとの色分け用）
const colorOptions = [
  '#4CAF50', // 緑
  '#FFD700', // ゴールド
  '#FF5733', // 赤
  '#2196F3', // 青
  '#9C27B0', // 紫
  '#FF9800', // オレンジ
];


const HabitSettingScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [habit, setHabit] = useState('');
  const [color, setColor] = useState(colorOptions[0]); // 初期値は赤
  const [difficulty, setDifficulty] = useState(0); // 難易度（星評価）
  const [selectedDays, setSelectedDays] = useState([]); // Paceで選択された曜日
  const [selectedTag, setSelectedTag] = useState(availableGoals[0].id);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  
  // 通知設定
  const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT'];
  const [notificationDays, setNotificationDays] = useState([]);　//Notificationの曜日
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);


  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // 星評価レンダリング
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setDifficulty(i)}>
          <Ionicons
            name={i <= difficulty ? 'star' : 'star-outline'}
            size={32}
            style={styles.starIcon}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  // タグ選択用（チップ形式）
  const renderTagChips = () => (
    <View style={styles.tagContainer}>
      {availableGoals.map(goalItem => (
        <TouchableOpacity
          key={goalItem.id}
          onPress={() => setSelectedTag(goalItem.id)}
          style={[
            styles.tagChip,
            selectedTag === goalItem.id && styles.selectedTagChip,
          ]}
        >
          <Text
            style={[
              styles.tagText,
              selectedTag === goalItem.id && styles.selectedTagText,
            ]}
          >
            {goalItem.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // カラー選択
  const renderColorOptions = () => (
    <View style={styles.colorGrid}>
      {colorOptions.map((c, idx) => (
        <TouchableOpacity
          key={idx}
          style={[styles.colorCircle, { backgroundColor: c }]}
          onPress={() => setSelectedColor(c)}
        >
          {/* 選択中の色にはチェックマークを表示 */}
          {selectedColor === c && (
            <MaterialCommunityIcons name="check" size={32} color="white" style={styles.checkMark} />
          )}
        </TouchableOpacity>
      ))}
      {/* カラーホイールボタン（全色選択） */}
      <TouchableOpacity style={styles.colorWheelButton}>
        <Ionicons name="color-palette-outline" size={28} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
  // 通知設定
  const toggleNotificationDay = (day) => {
    setNotificationDays(
      notificationDays.includes(day) ? notificationDays.filter((d) => d !== day) : [...notificationDays, day]
    );
  };

  const renderNotificationDays = () => (
    <View style={styles.notificationRow}>
      {DAYS.map((day, idx) => (
        <TouchableOpacity
          key={idx}
          style={[
            styles.notificationDayButton,
            { backgroundColor: notificationDays.includes(day) ? COLORS.primary : 'transparent', borderColor: colors.text },
          ]}
          onPress={() => toggleNotificationDay(day)}
        >
          <Text style={{ color: notificationDays.includes(day) ? 'white' : colors.text }}>{day}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContainer, 
            { 
              backgroundColor: colors.background,
            }
          ]}
        >
          {/* 画面タイトル */}
          <Text style={[styles.title, { color: colors.text }]}>New Habit</Text>
          {/* アクティビティ名入力 */}
          <TextInput
            style={[
              styles.activityInput, 
              { color: colors.text, backgroundColor: selectedColor } // 選択した色を背景色に適用
            ]}
            placeholder="Diary writing"
            placeholderTextColor={colors.text}
            value={habit}
            onChangeText={setHabit}
          />

          {/* Colors */}
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Colors</Text>
          {renderColorOptions()}
          
          {/* 難易度 */}
          <Text style={[styles.label, { color: colors.text }]}>Difficulty level</Text>
          <View style={styles.starContainer}>{renderStars()}</View>
          
          {/* 習慣化のペース */}
          <Text style={[styles.label, { color: colors.text }]}>Pace</Text>
          <View style={styles.row}>
            {DAYS.map((day, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.dayButton,
                  {
                    backgroundColor: selectedDays.includes(day) ? COLORS.primary : 'transparent',
                    borderColor: colors.text,
                  },
                ]}
                onPress={() => toggleDay(day)}
              >
                <Text style={{ color: selectedDays.includes(day) ? 'white' : colors.text }}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* 通知設定 */}
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Notifications</Text>
          {renderNotificationDays()}
          <View style={styles.notificationToggleContainer}>
            <Text style={{ color: colors.text, marginRight: 8 }}>Notifications</Text>
            <Switch 
              value={notificationsEnabled} 
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: COLORS.primary }}
              thumbColor={notificationsEnabled ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
          
          {/* 目標とのタグ付け */}
          <Text style={[styles.label, { color: colors.text }]}>Tagging goals</Text>
          {renderTagChips()}
        </ScrollView>

        <View style={styles.fixedSaveButtonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={() => navigation.goBack()}>
            <Text style={[styles.saveButtonText, { color: COLORS.white }]}>Save</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
  title: {
    ...FONTS.h2,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  activityInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    fontSize: 18,
  },
  label: {
    ...FONTS.body2,
    paddingVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    position: 'absolute',
  },
  colorWheelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 6,
    borderWidth: 1,
    borderColor: COLORS.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  starIcon: {
    marginHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    ...FONTS.body2,
    paddingVertical: 10,
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  notificationDayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationToggleContainer: {
    marginBottom: 20,
  },
  fixedSaveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: COLORS.background,
    paddingVertical: 40,
    alignItems: 'center',
  },
  saveButton: {
    width: '60%',
    paddingVertical: SIZES.padding * 1.5,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    ...FONTS.h3,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTagChip: {
    backgroundColor: COLORS.primary,
  },
  tagText: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
  selectedTagText: {
    color: COLORS.white,
  },
});

export default HabitSettingScreen;
