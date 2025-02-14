//FIXME DataPickerが表示されないされない

// Medication.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Modal,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import { Card, TextInput, Button, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import images from '../constants/images';
import { COLORS } from '../constants';
import { useTheme } from '../themes/ThemeProvider';

/* ---------------------------------------
   ヘルパー関数
---------------------------------------- */

// 午前8時のDateを返す
const getDefaultReminderTime = () => {
  const d = new Date();
  d.setHours(8);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
};

// Date → "HH:MM" の文字列
const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
};

// "HH:MM" の文字列 → Date
const parseTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(hours);
  d.setMinutes(minutes);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
};

const STORAGE_KEY = 'medications';

const Medication = () => {
  /* ----------------
   state管理
  ----------------- */
  const [medications, setMedications] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);

  const [medicationNameInput, setMedicationNameInput] = useState('');
  const [frequencyInput, setFrequencyInput] = useState('');

  // リマインダーは Date型で保持
  const [reminderTimeDate, setReminderTimeDate] = useState(getDefaultReminderTime());

  // iOS/Android共通で使うフラグ
  const [showTimePicker, setShowTimePicker] = useState(false);

  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // 薬画像のサイクル表示
  const medicationImages = [
    images.ImagePill1,
    images.ImagePill2,
    images.ImagePill3,
  ];

  /* ---------------------------------------
     初期ロード：AsyncStorageから薬情報を読み込み
  ---------------------------------------- */
  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const storedMedications = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedMedications) {
        const meds = JSON.parse(storedMedications).map((med) => ({
          ...med,
          reminderTime: med.reminderTime, // "HH:MM"形式の文字列
        }));
        setMedications(meds);
      }
    } catch (error) {
      console.error('Error loading medications:', error);
    }
  };

  const saveMedications = async (newList) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (error) {
      console.error('Error saving medications:', error);
    }
  };

  /* ---------------------------------------
     薬データ 保存系
  ---------------------------------------- */
  // 新規 & 編集共通：reminderTime 文字列を保存
  const saveMedication = (medication) => {
    let updatedMedications = [];
    const medToSave = {
      ...medication,
      reminderTime: formatTime(reminderTimeDate),
    };

    if (editingMedication) {
      // 編集
      updatedMedications = medications.map((med) =>
        med.id === medication.id ? medToSave : med
      );
    } else {
      // 新規追加
      updatedMedications = [...medications, medToSave];
    }
    setMedications(updatedMedications);
    saveMedications(updatedMedications);
  };

  /* ----------------------------
     新規追加
  ----------------------------- */
  const handleAddMedication = () => {
    if (!medicationNameInput.trim()) {
      Alert.alert('Input Error', 'Please enter the medication name');
      return;
    }
    const frequencyNum = parseInt(frequencyInput);
    if (isNaN(frequencyNum) || frequencyNum <= 0) {
      Alert.alert('Input Error', 'Frequency must be a number greater than 0');
      return;
    }
    const newMedication = {
      id: Date.now().toString(),
      medication_name: medicationNameInput,
      prescription: { frequency: frequencyNum },
      takenRecords: [],
    };
    saveMedication(newMedication);
    setAddModalVisible(false);
    resetInputFields();
  };

  /* ----------------------------
     編集保存
  ----------------------------- */
  const handleEditMedication = () => {
    if (!medicationNameInput.trim()) {
      Alert.alert('Input Error', 'Please enter the medication name');
      return;
    }
    const frequencyNum = parseInt(frequencyInput);
    if (isNaN(frequencyNum) || frequencyNum <= 0) {
      Alert.alert('Input Error', 'Frequency must be a number greater than 0');
      return;
    }
    const updatedMedication = {
      ...editingMedication,
      medication_name: medicationNameInput,
      prescription: { frequency: frequencyNum },
    };
    saveMedication(updatedMedication);
    setDetailModalVisible(false);
    setEditingMedication(null);
    resetInputFields();
  };

  /* ----------------------------
     薬削除
  ----------------------------- */
  const handleDeleteMedication = () => {
    Alert.alert('Delete Medication', 'Are you sure you want to delete this medication?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => {
          const updatedMedications = medications.filter(
            (med) => med.id !== editingMedication.id
          );
          setMedications(updatedMedications);
          saveMedications(updatedMedications);
          setDetailModalVisible(false);
          setEditingMedication(null);
          resetInputFields();
        },
        style: 'destructive',
      },
    ]);
  };

  /* ----------------------------
     リセット
  ----------------------------- */
  const resetInputFields = () => {
    setMedicationNameInput('');
    setFrequencyInput('');
    setReminderTimeDate(getDefaultReminderTime());
  };

  /* ----------------------------
     「飲んだ」ボタン：服薬回数を+1
  ----------------------------- */
  const markAsTaken = (medicationId) => {
    const updatedMedications = medications.map((med) => {
      if (med.id === medicationId) {
        const takenToday = getTodayTakenCount(med.takenRecords);
        if (takenToday < med.prescription.frequency) {
          return {
            ...med,
            takenRecords: [...med.takenRecords, new Date().toISOString()],
          };
        } else {
          Alert.alert('Already Taken', 'You have already marked all doses for today.');
        }
      }
      return med;
    });
    setMedications(updatedMedications);
    saveMedications(updatedMedications);
  };

  /* ----------------------------
     表示用関数
  ----------------------------- */
  const formatFrequency = (frequency) => {
    switch (frequency) {
      case 1:
        return 'Once a day';
      case 2:
        return 'Twice a day';
      case 3:
        return 'Three times a day';
      default:
        return `${frequency} times a day`;
    }
  };

  const formatTimeOfDay = (frequency) => {
    switch (frequency) {
      case 1:
        return 'Evening';
      case 2:
        return 'Morning, Evening';
      case 3:
        return 'Morning, Noon, Evening';
      default:
        return 'Unknown';
    }
  };

  const getTodayTakenCount = (takenRecords) => {
    const today = new Date().toDateString();
    return takenRecords.filter(
      (record) => new Date(record).toDateString() === today
    ).length;
  };

  const getAllTakenRecordsMarked = () => {
    const marked = {};
    medications.forEach((med) => {
      med.takenRecords.forEach((record) => {
        const dateKey = record.split('T')[0];
        marked[dateKey] = { marked: true };
      });
    });
    return marked;
  };

  /* ----------------------------
     プラットフォーム別の時間選択
  ----------------------------- */
  const handleTimeSelection = () => {
    // ボタンを押したらDateTimePickerが開かれる
    setShowTimePicker(true);
  };

  const onTimeChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedDate) {
      setReminderTimeDate(selectedDate);
    }
  };

  /* ----------------------------
     薬カードの描画
  ----------------------------- */
  const renderMedication = ({ item, index }) => {
    const takenToday = getTodayTakenCount(item.takenRecords);
    const expected = item.prescription.frequency;
    const pillImage = medicationImages[index % medicationImages.length];
    return (
      <TouchableOpacity
        onPress={() => {
          setEditingMedication(item);
          setMedicationNameInput(item.medication_name);
          setFrequencyInput(item.prescription.frequency.toString());
          setReminderTimeDate(parseTime(item.reminderTime || '08:00'));
          setDetailModalVisible(true);
        }}
      >
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <Image source={pillImage} style={styles.medicationImage} />
            <View style={styles.medicationInfo}>
              <Text style={styles.text}>Medication: {item.medication_name}</Text>
              <Text style={styles.text}>
                Frequency: {formatFrequency(item.prescription.frequency)}
              </Text>
              <Text style={styles.text}>
                Time of Day: {formatTimeOfDay(item.prescription.frequency)}
              </Text>
              <Text style={styles.text}>Reminder at: {item.reminderTime}</Text>
              <Text style={styles.text}>
                Taken Today: {takenToday} / {expected}
              </Text>
            </View>
            <View style={styles.actionButtons}>
              <IconButton
                icon="check-circle-outline"
                size={30}
                onPress={() => markAsTaken(item.id)}
              />
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  /* ----------------------------
     コンポーネント描画
  ----------------------------- */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title}>Current Medications</Text>
          <IconButton
            icon="plus"
            size={28}
            onPress={() => {
              resetInputFields();
              setAddModalVisible(true);
            }}
          />
        </View>

        {medications.length === 0 ? (
          <View style={styles.center}>
            <Image source={images.logo} style={{ height: 120, width: 120, marginBottom: 22 }} />
            <Text style={styles.noMedicationText}>No medications currently.</Text>
            <Button
              mode="contained"
              onPress={() => setAddModalVisible(true)}
              style={styles.addMedicationButton}
            >
              Add Medication
            </Button>
          </View>
        ) : (
          <>
            <Calendar 
              markedDates={{ ...getAllTakenRecordsMarked() }}
              style={styles.calendar}
            />
            <FlatList
              data={medications}
              keyExtractor={(item) => item.id}
              renderItem={renderMedication}
              contentContainerStyle={styles.medicationList}
            />
          </>
        )}

        {/* --- 新規追加モーダル --- */}
        <Modal
          visible={addModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setAddModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Add Medication</Text>
                <TextInput
                  label="Medication Name"
                  value={medicationNameInput}
                  onChangeText={setMedicationNameInput}
                  style={styles.input}
                  theme={inputTheme}
                />
                <TextInput
                  label="Frequency (times per day)"
                  value={frequencyInput}
                  onChangeText={setFrequencyInput}
                  keyboardType="numeric"
                  style={styles.input}
                  theme={inputTheme}
                />

                {/* ▼▼ 修正部分: ボタンを押したらPickerを開く形へ変更 ▼▼ */}
                <TouchableOpacity
                  onPress={handleTimeSelection}
                  style={styles.timeSelectButton}
                >
                  <Text style={styles.timeSelectButtonText}>
                    Select Reminder Time: {formatTime(reminderTimeDate)}
                  </Text>
                </TouchableOpacity>
                {/* ▲▲ 修正部分ここまで ▲▲ */}

                <View style={styles.modalButtons}>
                  <Button mode="contained" onPress={handleAddMedication} style={styles.modalButtonSub}>
                    Add
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => setAddModalVisible(false)}
                    style={styles.modalButtonCansel}
                    labelStyle={styles.modalButtonText}
                  >
                    Cancel
                  </Button>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* --- 詳細/編集モーダル --- */}
        <Modal
          visible={detailModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setDetailModalVisible(false);
            setEditingMedication(null);
          }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Medication Details</Text>
                <TextInput
                  label="Medication Name"
                  value={medicationNameInput}
                  onChangeText={setMedicationNameInput}
                  style={styles.input}
                  theme={inputTheme}
                />
                <TextInput
                  label="Frequency (times per day)"
                  value={frequencyInput}
                  onChangeText={setFrequencyInput}
                  keyboardType="numeric"
                  style={styles.input}
                  theme={inputTheme}
                />

                {/* ▼▼ 修正部分: ボタンを押したらPickerを開く形へ変更 ▼▼ */}
                <TouchableOpacity
                  onPress={handleTimeSelection}
                  style={styles.timeSelectButton}
                >
                  <Text style={styles.timeSelectButtonText}>
                    Select Reminder Time: {formatTime(reminderTimeDate)}
                  </Text>
                </TouchableOpacity>
                {/* ▲▲ 修正部分ここまで ▲▲ */}

                <Button
                  mode="contained"
                  onPress={handleDeleteMedication}
                  style={styles.deleteButton}
                  labelStyle={styles.deleteButtonText}
                >
                  Delete Medication
                </Button>
                <View style={styles.modalButtons}>
                  <Button mode="contained" onPress={handleEditMedication} style={styles.modalButtonSub}>
                    Save
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setDetailModalVisible(false);
                      setEditingMedication(null);
                    }}
                    style={styles.modalButtonCansel}
                    labelStyle={styles.modalButtonText}
                  >
                    Cancel
                  </Button>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* ----------------------------
            iOS / Android での時間Picker
        ----------------------------- */}
        {showTimePicker && (
          Platform.OS === 'ios' ? (
            // iOS → モーダルでラップ
            <Modal
              transparent={true}
              animationType="slide"
              visible={showTimePicker}
              onRequestClose={() => setShowTimePicker(false)}
            >
              <TouchableWithoutFeedback onPress={() => setShowTimePicker(false)}>
                <View style={styles.timePickerModalOverlay}>
                  <View style={styles.timePickerModalContainer}>
                    <DateTimePicker
                      value={reminderTimeDate}
                      mode="time"
                      display="default"
                      onChange={(event, selectedDate) => {
                        // iOSの場合は実行タイミングに注意
                        if (selectedDate) {
                          setReminderTimeDate(selectedDate);
                        }
                      }}
                      style={{width: 320, backgroundColor: "white"}}
                    />
                    {/* Doneボタン */}
                    <Button
                      mode="outlined"
                      onPress={() => setShowTimePicker(false)}
                      style={styles.modalButtonCansel}
                    >
                      Done
                    </Button>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          ) : (
            // Android → DateTimePicker を直接表示
            <DateTimePicker
              value={reminderTimeDate}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onTimeChange}
            />
          )
        )}
      </View>
    </SafeAreaView>
  );
};

/* ---------------------------------------
   テーマ設定
---------------------------------------- */
const inputTheme = {
  colors: {
    primary: COLORS.primary,
  },
};

/* ---------------------------------------
   スタイル
---------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  card: {
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  medicationImage: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  medicationInfo: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    color: COLORS.text,
  },
  actionButtons: {
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMedicationText: {
    fontSize: 16,
    color: COLORS.text,
  },
  addMedicationButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    marginVertical: 16,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.primary,
  },
  input: {
    marginBottom: 12,
    backgroundColor: COLORS.background,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonSub: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: COLORS.primary,
  },
  modalButtonCansel: {
    flex: 1,
    marginHorizontal: 4,
    borderColor: COLORS.primary,
  },
  modalButtonText: {
    color: COLORS.primary,
  },
  deleteButton: {
    marginVertical: 16,
    backgroundColor: 'red',
    alignSelf: 'stretch',
  },
  deleteButtonText: {
    color: COLORS.white,
  },
  calendar: {
    marginBottom: 16,
  },
  medicationList: {
    paddingBottom: 20, 
    paddingTop: 10,
  },

  /* ▼▼ 追加したボタン用スタイル ▼▼ */
  timeSelectButton: {
    backgroundColor: '#EFEFEF',
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  timeSelectButtonText: {
    color: '#333',
    fontSize: 16,
  },
  /* ▲▲ ここまで ▲▲ */

  /* --- iOS時間Picker用モーダル --- */
  timePickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  timePickerModalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});

export default Medication;
