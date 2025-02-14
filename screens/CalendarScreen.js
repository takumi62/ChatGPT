import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../themes/ThemeProvider';
import { COLORS } from '../constants';

// カレンダー日本語化
LocaleConfig.locales['ja'] = {
  monthNames: [
    '1月','2月','3月','4月','5月','6月','7月',
    '8月','9月','10月','11月','12月'
  ],
  monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
  dayNames: ['日','月','火','水','木','金','土'],
  dayNamesShort: ['日','月','火','水','木','金','土'],
  today: '今日'
};
LocaleConfig.defaultLocale = 'ja';

// マークされた日付のサンプルデータ
const sampleMarkedDates = {
  '2023-09-01': { dots: [{ key: 'exercise', color: 'green' }] },
  '2023-09-02': { dots: [{ key: 'reading', color: 'blue' }, { key: 'diary', color: 'orange' }] },
  '2023-09-03': { dots: [{ key: 'vitamin', color: 'red' }, { key: 'yoga', color: 'yellow' }] },
  '2023-09-05': { dots: [{ key: 'exercise', color: 'green' }, { key: 'reading', color: 'blue' }] },
  // ...その他必要分追加
};

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  
  // 今日の日付を取得
  const today = new Date().toISOString().split('T')[0];

  // 長押し時に呼ばれる関数
  const handleDayLongPress = (day) => {
    setSelectedDate(day.dateString);
    setBottomSheetVisible(true);
  };

  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        {/* カレンダー */}
        <Calendar
          style={styles.calendar}
          markedDates={sampleMarkedDates}
          markingType={'multi-dot'}
          // 通常のタップ
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
          }}
          // 日付セルのカスタマイズ（長押し対応＋現在日付のハイライト）
          dayComponent={({ date, state, marking }) => {
            const isToday = date.dateString === today; // 今日の日付か判定
            const dayTextColor = state === 'disabled' ? '#ccc' : '#000';

            return (
              <TouchableOpacity
                style={[
                  styles.dayContainer,
                  isToday && styles.todayHighlight, // 今日ならハイライト
                ]}
                onLongPress={() => handleDayLongPress({ dateString: date.dateString })}
              >
                <Text
                  style={[
                    styles.dayText,
                    isToday && styles.todayText, // 今日なら白文字
                    state === 'disabled' && { color: '#ccc' }, // 無効な日付はグレー
                  ]}
                >
                  {date.day}
                </Text>
                {/* マルチドット表示 */}
                {marking?.dots && (
                  <View style={{ flexDirection: 'row', marginTop: 2 }}>
                    {marking.dots.map((dot, index) => (
                      <View
                        key={index}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: dot.color,
                          marginHorizontal: 1,
                        }}
                      />
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />

        {/* 選択した日付を画面中央に表示 */}
        <View style={styles.detailContainer}>
          {selectedDate ? (
            <Text style={styles.detailText}>
              {selectedDate} の詳細画面（通常タップの結果表示）
            </Text>
          ) : (
            <Text style={styles.detailText}>日付を選択してください</Text>
          )}
        </View>
      </View>

      {/* Bottom Sheet用モーダル */}
      <Modal
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
          {/* 下半分のコンテンツ領域 */}
          <View style={styles.bottomSheetContainer}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
              {selectedDate} の詳細（長押しで開くBottom Sheet）
            </Text>
            <Text>ここにチェックインしたアクティビティなどの詳細を表示</Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setBottomSheetVisible(false)}
            >
              <Text style={{ color: '#fff' }}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// スクリーン高さ取得
const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  calendar: {
    marginBottom: 10,
  },
  detailContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
  dayContainer: {
    width: 45,  // 日付セルの横幅
    height: 45, // 日付セルの高さ
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8, 
  },
  todayHighlight: {
    backgroundColor: "gray"
  },
  todayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dayText: {
    fontSize: 16,
  },
  // モーダル外側の半透明背景
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end', // 下寄せ
  },
  // 下から50%程度を埋めるコンテナ
  bottomSheetContainer: {
    height: height * 0.5, // 画面の50%
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'flex-end',
    backgroundColor: 'tomato',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
