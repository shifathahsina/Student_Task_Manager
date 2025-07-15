import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
    FlatList, 
  Alert,
  Platform,
  ToastAndroid,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import DateTimePicker from '@react-native-community/datetimepicker';



const AddTaskScreen = ({ tasks, setTasks, theme }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const navigation = useNavigation();

  const handleAddTask = () => {
    if (!title || !dueDate) {
      Alert.alert('Error', 'Title and Due Date are required!');
      return;
    }
    
    const newTask = {
      id: uuid.v4(),
      title,
      description,
      dueDate: dueDate.toISOString().split('T')[0],
      completed: false,
    };

    setTasks([...tasks, newTask]);
    showToast('Task added successfully!');
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
      <Text style={[styles.heading, { color: theme.text }]}>➕ Add New Task</Text>

      {/* Title Input */}
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

      {/* Description Input */}
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

      {/* Date Picker */}
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
    minimumDate={new Date()} // ✅ No past dates
    onChange={onChangeDate}
  />
)}


      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.accent }]}
        onPress={handleAddTask}
      >
        <Ionicons name="add-circle" size={24} color="white" />
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddTaskScreen;

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
