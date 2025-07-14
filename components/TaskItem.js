import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import moment from 'moment';

const TaskItem = ({ task, onDelete, onToggleComplete, onEdit, theme }) => {
  const due = moment(task.dueDate);
  const today = moment().startOf('day');
  const daysLeft = due.diff(today, 'days');

  let countdownText = '';
  if (task.completed) {
    countdownText = '✅ Completed';
  } else if (daysLeft === 0) {
    countdownText = '🕔 Due today';
  } else if (daysLeft < 0) {
    countdownText = `⛔ Overdue by ${Math.abs(daysLeft)} day(s)`;
  } else {
    countdownText = `⏳ ${daysLeft} day(s) left`;
  }

  return (
    <View
      style={[
        styles.item,
        {
          backgroundColor: theme.card,
          borderLeftColor: theme.accent,
          shadowColor: theme.accent,
        },
      ]}
    >
      <Pressable
        onPress={() => onToggleComplete(task.id)}
        style={styles.checkbox}
      >
        {task.completed ? (
          <AntDesign name="checkcircle" size={24} color="#10B981" />
        ) : (
          <AntDesign name="checkcircleo" size={24} color={theme.border} />
        )}
      </Pressable>

      <View style={styles.details}>
        <Text
          style={[
            styles.title,
            {
              color: task.completed ? '#10B981' : theme.text,
              textDecorationLine: task.completed ? 'line-through' : 'none',
            },
          ]}
        >
          {task.title}
        </Text>

        {task.description ? (
          <Text style={[styles.description, { color: theme.text }]}>
            {task.description}
          </Text>
        ) : null}

        <Text style={[styles.date, { color: theme.text }]}>
          📅 {task.dueDate}
        </Text>
        <Text style={[styles.countdown, { color: theme.accent }]}>
          {countdownText}
        </Text>
      </View>

      <TouchableOpacity onPress={onEdit} style={styles.action}>
        <Feather name="edit" size={20} color={theme.accent} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.action}>
        <AntDesign name="delete" size={20} color="#DC2626" />
      </TouchableOpacity>
    </View>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 6,
    elevation: 3,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  checkbox: {
    marginRight: 12,
    marginTop: 6,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    marginTop: 4,
  },
  countdown: {
    fontSize: 13,
    marginTop: 2,
  },
  action: {
    marginLeft: 10,
    marginTop: 4,
  },
});
