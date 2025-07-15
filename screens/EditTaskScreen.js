import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ToastAndroid,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditTaskScreen = ({ tasks, setTasks, theme }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { task } = route.params;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(new Date(task.dueDate));
  const [showPicker, setShowPicker] = useState(false);

  const handleUpdate = () => {
    if (!title || !dueDate) {
      Alert.alert('Error', 'Title and Due Date are required!');
      return;
    }

    const updatedTask = {
      ...task,
      title,
      description,
      dueDate: dueDate.toISOString().split('T')[0],
    };

    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? updatedTask : t
    );

    setTasks(updatedTasks);
    showToast('Task updated successfully!');
    navigation.goBack();
  };

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>🖊️ Edit Task</Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBg,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        placeholder="Title"
        placeholderTextColor={theme.placeholder}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBg,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        placeholder="Description (optional)"
        placeholderTextColor={theme.placeholder}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={[
          styles.dateInput,
          {
            backgroundColor: theme.inputBg,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons name="calendar-outline" size={20} color={theme.text} />
        <Text style={{ color: theme.text, marginLeft: 10 }}>
          {dueDate.toISOString().split('T')[0]}
        </Text>
      </TouchableOpacity>

      {showPicker && (
  <DateTimePicker
    value={dueDate}
    mode="date"
    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
    minimumDate={new Date()} // ✅ Prevent selecting past dates
    onChange={onChangeDate}
  />
)}


      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.accent }]}
        onPress={handleUpdate}
      >
        <MaterialIcons name="save" size={24} color="#fff" />
        <Text style={styles.buttonText}>Update Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1.5,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1.5,
  },
  button: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
