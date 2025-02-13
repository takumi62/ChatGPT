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
  TouchableOpacity,
} from 'react-native';
import { Card, TextInput, Button, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import images from '../constants/images';
import { COLORS } from '../constants';
import { useTheme } from '../themes/ThemeProvider';

const STORAGE_KEY = 'medications';

const Medication = () => {
  const [medications, setMedications] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // 編集中の薬を保持
  const [editingMedication, setEditingMedication] = useState(null);

  // 入力用ステート（追加・編集共通）
  const [medicationNameInput, setMedicationNameInput] = useState('');
  const [frequencyInput, setFrequencyInput] = useState('');
  const [reminderTimeInput, setReminderTimeInput] = useState('08:00'); // 今回は使用しません

  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // サイクル表示用の薬画像
  const medicationImages = [
    images.ImagePill1,
    images.ImagePill2,
    images.ImagePill3,
  ];

  useEffect(() => {
    loadMedications();
  }, []);

  // --- ストレージ読み書き ---
  const loadMedications = async () => {
    try {
      const storedMedications = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedMedications) {
        setMedications(JSON.parse(storedMedications));
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

  // --- 追加／編集共通の保存 ---
  const saveMedication = (medication) => {
    let updatedMedications = [];
    if (editingMedication) {
      // 編集
      updatedMedications = medications.map((med) =>
        med.id === medication.id ? medication : med
      );
    } else {
      // 追加
      updatedMedications = [...medications, medication];
    }
    setMedications(updatedMedications);
    saveMedications(updatedMedications);
  };

  // --- 新規追加処理 ---
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
      reminderTime: reminderTimeInput, // 今回は使用しない
      takenRecords: [],
    };
    saveMedication(newMedication);
    setAddModalVisible(false);
    resetInputFields();
  };

  // --- 編集保存処理 ---
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
      reminderTime: reminderTimeInput,
    };
    saveMedication(updatedMedication);
    setDetailModalVisible(false);
    setEditingMedication(null);
    resetInputFields();
  };

  // --- 薬削除処理 ---
  const handleDeleteMedication = () => {
    Alert.alert('Delete Medication', 'Are you sure you want to delete this medication?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
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

  // --- 入力欄のリセット ---
  const resetInputFields = () => {
    setMedicationNameInput('');
    setFrequencyInput('');
    setReminderTimeInput('08:00');
  };

  // --- 「飲んだ」ボタン：上限を服薬頻度にする ---
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

  // --- 服薬回数と表示 ---
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

  // 今日の服薬実績数
  const getTodayTakenCount = (takenRecords) => {
    const today = new Date().toDateString();
    return takenRecords.filter(
      (record) => new Date(record).toDateString() === today
    ).length;
  };

  // --- カレンダー用のマーク情報を作成（登録済みのすべての薬の takenRecords） ---
  const getAllTakenRecordsMarked = () => {
    const marked = {};
    medications.forEach((med) => {
      med.takenRecords.forEach((record) => {
        const dateKey = record.split('T')[0]; // YYYY-MM-DD
        marked[dateKey] = { marked: true };
      });
    });
    return marked;
  };

  // --- 薬カードの描画 ---
  const renderMedication = ({ item, index }) => {
    const takenToday = getTodayTakenCount(item.takenRecords);
    const expected = item.prescription.frequency;
    const pillImage = medicationImages[index % medicationImages.length];
    return (
      <TouchableOpacity
        onPress={() => {
          // 編集モーダルを開く
          setEditingMedication(item);
          setMedicationNameInput(item.medication_name);
          setFrequencyInput(item.prescription.frequency.toString());
          setReminderTimeInput(item.reminderTime || '08:00');
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
              {/* 従来のカレンダー表示用モーダルは不要なら削除してOK */}
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
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
          /* 未登録時の画面はそのまま（変更前と同じレイアウト） */
          <View style={styles.center}>
            <Image
              source={images.logo}
              style={{
                height: 120,
                width: 120,
                marginBottom: 22,
              }}
            />
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
          /* 登録がある場合は、上部にカレンダー、下部にカード一覧を表示 */
          <>
            {/* カレンダー表示（全ての薬のtakenRecordsをマーキング） */}
            <Calendar
              markedDates={{
                ...getAllTakenRecordsMarked(),
              }}
              // 必要に応じて onDayPress などを追加
            />

            {/* 従来のカード一覧 */}
            <FlatList
              data={medications}
              keyExtractor={(item) => item.id}
              renderItem={renderMedication}
            />
          </>
        )}

        {/* ========== 新規追加用モーダル ========== */}
        <Modal
          visible={addModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setAddModalVisible(false)}
        >
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
              <TextInput
                label="Reminder Time (HH:MM)"
                value={reminderTimeInput}
                onChangeText={setReminderTimeInput}
                style={styles.input}
                theme={inputTheme}
              />
              <View style={styles.modalButtons}>
                <Button
                  mode="contained"
                  onPress={handleAddMedication}
                  style={styles.modalButtonSub}
                >
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
        </Modal>

        {/* ========== 詳細・編集モーダル ========== */}
        <Modal
          visible={detailModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setDetailModalVisible(false);
            setEditingMedication(null);
          }}
        >
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
              <TextInput
                label="Reminder Time (HH:MM)"
                value={reminderTimeInput}
                onChangeText={setReminderTimeInput}
                style={styles.input}
                theme={inputTheme}
              />
              {/* 削除ボタン */}
              <Button
                mode="contained"
                onPress={handleDeleteMedication}
                style={styles.deleteButton}
                labelStyle={styles.deleteButtonText}
              >
                Delete Medication
              </Button>
              <View style={styles.modalButtons}>
                <Button
                  mode="contained"
                  onPress={handleEditMedication}
                  style={styles.modalButtonSub}
                >
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
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const inputTheme = {
  colors: {
    primary: COLORS.primary,
  },
};

// スタイル
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
  // カード表示
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
  // 未登録時のレイアウト
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
  // モーダル関係
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
    borderBlockColor: COLORS.primary,
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
});

export default Medication;
