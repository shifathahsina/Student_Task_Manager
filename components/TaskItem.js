import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

export default function TaskItem({ task, onToggleComplete, onDelete, onEdit, theme, filter }) {
  const showStrike = task.completed && filter === 'all';

  const handleToggleComplete = () => {
    if (!task.completed) {
      Alert.alert(
        'Confirm Completion',
        'Is this task completed?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes', onPress: () => onToggleComplete(task.id) },
        ],
        { cancelable: true }
      );
    } else {
      onToggleComplete(task.id);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(task.id) },
      ],
      { cancelable: true }
    );
  };

  // Swipe Left → Delete
  const renderLeftActions = () => (
    <TouchableOpacity style={styles.leftAction} onPress={handleDelete}>
      <MaterialIcons name="delete" size={24} color="white" />
      <Text style={styles.actionText}>Delete</Text>
    </TouchableOpacity>
  );

  // Swipe Right → Complete
  const renderRightActions = () => (
    <TouchableOpacity style={styles.rightAction} onPress={handleToggleComplete}>
      <MaterialIcons name="check-circle" size={24} color="white" />
      <Text style={styles.actionText}>Complete</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
    >
      <View style={[styles.card, task.completed && styles.completedCard]}>
        <View style={styles.left}>
          {/* ✅ Tap the icon to toggle complete */}
          <TouchableOpacity onPress={handleToggleComplete}>
            <MaterialIcons
              name={task.completed ? 'check-circle' : 'radio-button-unchecked'}
              size={24}
              color={task.completed ? '#28C76F' : '#B0B0B0'}
              style={styles.statusIcon}
            />
          </TouchableOpacity>

          <View style={styles.textBox}>
            <Text style={[styles.title, showStrike && styles.strikeText]} numberOfLines={1}>
              {task.title}
            </Text>
            <Text style={[styles.description, showStrike && styles.strikeText]} numberOfLines={2}>
              {task.description}
            </Text>
            <Text style={styles.dueText}>📅 {task.dueDate}</Text>

          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit} style={styles.actionIcon}>
            <Feather name="edit" size={20} color={theme.accent || '#4B7BE5'} />
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedCard: {
    backgroundColor: '#E9F9ED',
  },
  left: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  statusIcon: {
    marginRight: 10,
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  description: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
  },
  dueText: {
    fontSize: 13,
    color: '#495057',
    marginTop: 6,
    fontStyle: 'italic',
  },
  strikeText: {
    textDecorationLine: 'line-through',
    color: '#A0A0A0',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  actionIcon: {
    marginLeft: 12,
    padding: 4,
  },
  leftAction: {
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: 20,
    marginBottom: 16,
  },
  rightAction: {
    backgroundColor: '#28C76F',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: 20,
    marginBottom: 16,
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
    marginTop: 4,
  },
});
