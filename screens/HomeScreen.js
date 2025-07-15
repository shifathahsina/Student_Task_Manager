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
import { AntDesign } from '@expo/vector-icons';
import TaskItem from '../components/TaskItem';

const lightTheme = {
  background: '#F3F4F6',
  text: '#1E3A8A',
  card: '#FFFFFF',
  border: '#D1D5DB',
  accent: '#1E3A8A',
  inputBg: '#FFFFFF',
  placeholder: '#9CA3AF',
};

const darkTheme = {
  background: '#111827',
  text: '#FFFFFF',
  card: '#1F2937',
  border: '#374151',
  accent: '#10B981',
  inputBg: '#1F2937',
  placeholder: '#9CA3AF',
};

const HomeScreen = ({ navigation, tasks, setTasks }) => {
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('all'); // all | completed | pending
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    showToast('Task deleted.');
  };

  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      // Show pending tasks first
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          📘 Student Task Manager
        </Text>
      </View>

      {/* Theme Toggle */}
      <TouchableOpacity
        onPress={() => setIsDark(!isDark)}
        style={[styles.toggleButton, { borderColor: theme.accent }]}
      >
        <Text style={[styles.toggleText, { color: theme.accent }]}>
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </Text>
      </TouchableOpacity>

      {/* Search Bar */}
      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: theme.inputBg,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        placeholder="Search tasks..."
        placeholderTextColor={theme.placeholder}
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {['all', 'completed', 'pending'].map((key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  filter === key ? theme.accent : theme.card,
                borderColor: theme.accent,
              },
            ]}
            onPress={() => setFilter(key)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    filter === key ? theme.card : theme.accent,
                },
              ]}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
            onEdit={() => navigation.navigate('EditTask', { task: item })}
            theme={theme}
            filter={filter}
          />
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.placeholder }]}>
            No matching tasks found.
          </Text>
        }
      />

      {/* Add Button */}
      <TouchableOpacity
        style={[styles.addButton, { shadowColor: theme.accent }]}
        onPress={() => navigation.navigate('AddTask')}
      >
        <AntDesign name="pluscircle" size={50} color={theme.accent} />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  toggleButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  toggleText: {
    fontWeight: '600',
    fontSize: 14,
  },
  searchInput: {
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  filterText: {
    fontWeight: '600',
  },
  empty: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
});
