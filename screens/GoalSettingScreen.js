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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, MaterialCommunityIcons  } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants';
import { useTheme } from '../themes/ThemeProvider';

const GoalSettingScreen = ({ navigation }) => {
  const { colors } = useTheme();

  // 目標データの管理
  const [goal, setGoal] = useState('');
  const [difficulty, setDifficulty] = useState(0);
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // カラー選択用
  const colorOptions = [
    '#4CAF50', // 緑
    '#FFD700', // ゴールド
    '#FF5733', // 赤
    '#2196F3', // 青
    '#9C27B0', // 紫
    '#FF9800', // オレンジ
  ];
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

  // 期限変更処理
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deadline;
    setShowDatePicker(Platform.OS === 'ios');
    setDeadline(currentDate);
  };

  // 星評価
  const renderStars = () => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity key={i} onPress={() => setDifficulty(i)}>
            <Ionicons
              name={i <= difficulty ? 'star' : 'star-outline'}
              size={32}
              color={COLORS.primary}
              style={styles.starIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

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
  

  return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={[styles.scrollContainer, { backgroundColor: colors.background }]}
          >   
          {/* 画面タイトル */}
          <Text style={[styles.title, { color: colors.text }]}>New Goal</Text>

          {/* アクティビティ名入力 */}
          <TextInput
            style={[
              styles.activityInput, 
              { color: colors.text, backgroundColor: selectedColor } // 選択した色を背景色に適用
            ]}
            placeholder="New goal writing"
            placeholderTextColor={colors.text}
            value={goal}
            onChangeText={setGoal}
          />

          {/* Colors */}
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Colors</Text>
          {renderColorOptions()}

          {/* 難易度 */}
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Difficulty level</Text>
          {renderStars()}

          {/* 期限 */}
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Target date</Text>
          <TouchableOpacity style={[styles.input, styles.dateInput, { borderColor: colors.text }]} onPress={() => setShowDatePicker(true)}>
            <Text style={{ color: colors.text }}>{deadline.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && <DateTimePicker value={deadline} mode="date" display="default" onChange={onDateChange} />}
        </ScrollView>

        {/* 保存ボタン */}
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
    paddingBottom: 60,
  },
  fixedSaveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: COLORS.background,
    paddingVertical: 40,
    alignItems: 'center',
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
  sectionLabel: {
    ...FONTS.body2,
    paddingVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    marginBottom: 20,
  },
  dateInput: {
    justifyContent: 'center',
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  starIcon: {
    marginHorizontal: 4,
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
});

export default GoalSettingScreen;
