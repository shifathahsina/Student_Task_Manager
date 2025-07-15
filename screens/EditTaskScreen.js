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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';


const EditTaskScreen = ({ tasks, setTasks, theme }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { task } = route.params;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(new Date(task.dueDate));
  const [showPicker, setShowPicker] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);

  const handleUpdate = () => {
    if (!title.trim()) {
      Alert.alert('Missing Information', 'Please enter a task title');
      return;
    }

    const updatedTask = {
      ...task,
      title: title.trim(),
      description: description.trim(),
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

  const hasChanges = () => {
    return (
      title.trim() !== task.title ||
      description.trim() !== (task.description || '') ||
      dueDate.toISOString().split('T')[0] !== task.dueDate
    );
  };

  return (
  <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{ padding: 20, paddingBottom: 160 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <MaterialIcons name="edit" size={32} color={theme.accent} />
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                  Edit Task
                </Text>
                <Text style={[styles.headerSubtitle, { color: theme.secondaryText }]}>
                  Update your task details
                </Text>
              </View>

              {/* Task Status Badge */}
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusBadge,
                  {
                    backgroundColor: task.completed ? theme.successLight : theme.warningLight,
                    borderColor: task.completed ? theme.success : theme.warning,
                  }
                ]}>
                  <MaterialIcons
                    name={task.completed ? 'check-circle' : 'schedule'}
                    size={16}
                    color={task.completed ? theme.success : theme.warning}
                  />
                  <Text style={[
                    styles.statusText,
                    { color: task.completed ? theme.success : theme.warning }
                  ]}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </Text>
                </View>
              </View>

              {/* Form Fields */}
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

                {/* Date Picker */}
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
            { backgroundColor: theme.background, borderColor: theme.border, borderTopWidth: 1 },
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
              styles.updateButton,
              {
                backgroundColor: title.trim() && hasChanges() ? theme.accent : theme.border,
                shadowColor: theme.shadow,
              },
            ]}
            onPress={handleUpdate}
            disabled={!title.trim() || !hasChanges()}
          >
            <MaterialIcons
              name="save"
              size={20}
              color={title.trim() && hasChanges() ? '#FFFFFF' : theme.placeholder}
              style={styles.buttonIcon}
            />
            <Text
              style={[
                styles.updateText,
                { color: title.trim() && hasChanges() ? '#FFFFFF' : theme.placeholder },
              ]}
            >
              Update Task
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  </SafeAreaView>
);

};

export default EditTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
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
  statusContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
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
  inputIcon: {
    marginRight: 12,
  },
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
  dateContent: {
    flex: 1,
  },
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
  updateButton: {
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
  buttonIcon: {
    marginRight: 8,
  },
  updateText: {
    fontSize: 16,
    fontWeight: '600',
  },
});