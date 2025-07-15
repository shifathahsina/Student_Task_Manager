import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

export default function TaskItem({ task, onToggleComplete, onDelete, onEdit, theme, filter }) {
  const showStrike = task.completed && filter === 'all';

  const handleToggleComplete = () => {
    if (!task.completed) {
      Alert.alert(
        'Mark as Complete',
        'Mark this task as completed?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Complete', onPress: () => onToggleComplete(task.id) },
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
      'This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(task.id) },
      ],
      { cancelable: true }
    );
  };

  const renderLeftActions = () => (
    <View style={styles.leftActionsContainer}>
      <TouchableOpacity 
        style={[styles.leftAction, { backgroundColor: theme.danger }]} 
        onPress={handleDelete}
      >
        <MaterialIcons name="delete-outline" size={22} color="white" />
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRightActions = () => (
    <View style={styles.rightActionsContainer}>
      <TouchableOpacity 
        style={[styles.rightAction, { backgroundColor: theme.success }]} 
        onPress={handleToggleComplete}
      >
        <MaterialIcons name="check-circle-outline" size={22} color="white" />
        <Text style={styles.actionText}>
          {task.completed ? 'Undo' : 'Complete'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      overshootLeft={false}
      overshootRight={false}
    >
      <View style={[
        styles.card, 
        { 
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.shadow,
        },
        task.completed && { 
          backgroundColor: theme.successLight,
          borderColor: theme.success,
        }
      ]}>
        <View style={styles.cardContent}>
          <TouchableOpacity 
            onPress={handleToggleComplete}
            style={styles.checkboxContainer}
          >
            <View style={[
              styles.checkbox,
              { borderColor: task.completed ? theme.success : theme.border },
              task.completed && { backgroundColor: theme.success }
            ]}>
              {task.completed && (
                <MaterialIcons name="check" size={16} color="white" />
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.contentContainer}>
            <Text style={[
              styles.title, 
              { color: theme.text },
              showStrike && { 
                textDecorationLine: 'line-through',
                color: theme.tertiaryText 
              }
            ]} numberOfLines={1}>
              {task.title}
            </Text>
            
            {task.description && (
              <Text style={[
                styles.description, 
                { color: theme.secondaryText },
                showStrike && { 
                  textDecorationLine: 'line-through',
                  color: theme.tertiaryText 
                }
              ]} numberOfLines={2}>
                {task.description}
              </Text>
            )}
            
            <View style={styles.dueDateContainer}>
              <MaterialIcons 
                name="schedule" 
                size={14} 
                color={theme.tertiaryText} 
                style={styles.dateIcon}
              />
              <Text style={[
                styles.dueText, 
                { color: theme.tertiaryText },
                showStrike && { textDecorationLine: 'line-through' }
              ]}>
                {task.dueDate}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            onPress={onEdit} 
            style={[styles.editButton, { backgroundColor: theme.accentLight }]}
          >
            <Feather name="edit-3" size={18} color={theme.accent} />
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  checkboxContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 4,
  },
  dueText: {
    fontSize: 13,
    fontWeight: '500',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftActionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 16,
  },
  rightActionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 16,
  },
  leftAction: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  rightAction: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
    marginTop: 4,
  },
});