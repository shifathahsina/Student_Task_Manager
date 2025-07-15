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
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddTaskScreen = ({ tasks, setTasks, theme }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);

  const navigation = useNavigation();

  const handleAddTask = () => {
    if (!title.trim()) {
      Alert.alert('Missing Information', 'Please enter a task title');
      return;
    }

    const newTask = {
      id: uuid.v4(),
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate.toISOString().split('T')[0],
      completed: false,
    };

    setTasks([...tasks, newTask]);
    showToast('Task created successfully!');
    navigation.goBack();
  };

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', message);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const getDateDisplayText = () => {
    if (isToday(dueDate)) return 'Today';
    if (isTomorrow(dueDate)) return 'Tomorrow';
    return formatDate(dueDate);
  };

  return (
  <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        {/* Scrollable Form Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: 160 }} // extra bottom padding for action bar
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <MaterialIcons name="add-task" size={32} color={theme.accent} />
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                  Create New Task
                </Text>
                <Text style={[styles.headerSubtitle, { color: theme.secondaryText }]}>
                  Add a new task to your list
                </Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                {/* Title Input */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.text }]}>Task Title *</Text>
                  <View style={[
                    styles.inputContainer,
                    {
                      backgroundColor: theme.inputBg,
                      borderColor: titleFocused ? theme.accent : theme.border,
                    }
                  ]}>
                    <MaterialIcons
                      name="title"
                      size={20}
                      color={titleFocused ? theme.accent : theme.placeholder}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.text }]}
                      placeholder="Enter task title"
                      placeholderTextColor={theme.placeholder}
                      value={title}
                      onChangeText={setTitle}
                      onFocus={() => setTitleFocused(true)}
                      onBlur={() => setTitleFocused(false)}
                      maxLength={100}
                    />
                  </View>
                </View>

                {/* Description Input */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.text }]}>Description</Text>
                  <View style={[
                    styles.inputContainer,
                    styles.textAreaContainer,
                    {
                      backgroundColor: theme.inputBg,
                      borderColor: descriptionFocused ? theme.accent : theme.border,
                    }
                  ]}>
                    <MaterialIcons
                      name="description"
                      size={20}
                      color={descriptionFocused ? theme.accent : theme.placeholder}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, styles.textArea, { color: theme.text }]}
                      placeholder="Add task description (optional)"
                      placeholderTextColor={theme.placeholder}
                      value={description}
                      onChangeText={setDescription}
                      onFocus={() => setDescriptionFocused(true)}
                      onBlur={() => setDescriptionFocused(false)}
                      multiline
                      numberOfLines={4}
                      maxLength={500}
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                {/* Due Date */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.text }]}>Due Date</Text>
                  <TouchableOpacity
                    onPress={() => setShowPicker(true)}
                    style={[
                      styles.inputContainer,
                      styles.dateButton,
                      {
                        backgroundColor: theme.inputBg,
                        borderColor: theme.border,
                      }
                    ]}
                  >
                    <MaterialIcons
                      name="event"
                      size={20}
                      color={theme.accent}
                      style={styles.inputIcon}
                    />
                    <View style={styles.dateContent}>
                      <Text style={[styles.dateText, { color: theme.text }]}>
                        {getDateDisplayText()}
                      </Text>
                      <Text style={[styles.dateSubtext, { color: theme.secondaryText }]}>
                        {dueDate.toISOString().split('T')[0]}
                      </Text>
                    </View>
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={20}
                      color={theme.placeholder}
                    />
                  </TouchableOpacity>
                </View>

                {showPicker && (
                  <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    minimumDate={new Date()}
                    onChange={onChangeDate}
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* ✅ Fixed Bottom Action Bar */}
        <View
          style={[
            styles.actionBar,
            {
              backgroundColor: theme.background,
              borderColor: theme.border,
              borderTopWidth: 1,
              padding: 20,
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.cancelText, { color: theme.secondaryText }]}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.createButton,
              {
                backgroundColor: title.trim() ? theme.accent : theme.border,
                shadowColor: theme.shadow,
              },
            ]}
            onPress={handleAddTask}
            disabled={!title.trim()}
          >
            <MaterialIcons
              name="check"
              size={20}
              color={title.trim() ? '#FFFFFF' : theme.placeholder}
              style={styles.buttonIcon}
            />
            <Text
              style={[
                styles.createText,
                { color: title.trim() ? '#FFFFFF' : theme.placeholder },
              ]}
            >
              Create Task
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  </SafeAreaView>
);


};

export default AddTaskScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  flexGrow: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { padding: 20 },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  form: { gap: 24 },
  inputGroup: { gap: 8 },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 16,
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  textArea: {
    minHeight: 80,
  },
  dateButton: {
    paddingVertical: 16,
  },
  dateContent: { flex: 1 },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  dateSubtext: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionBar: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: { marginRight: 8 },
  createText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
  padding: 20,
  paddingBottom: 120, // Leave space for action bar
},


});
