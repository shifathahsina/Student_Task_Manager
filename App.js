// 👇 MUST BE AT THE VERY TOP
import 'react-native-gesture-handler';

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from './screens/HomeScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import EditTaskScreen from './screens/EditTaskScreen';

import { loadTasksFromStorage, saveTasksToStorage } from './utils/storage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [isDark, setIsDark] = useState(false);

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

  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    const loadData = async () => {
      const storedTasks = await loadTasksFromStorage();
      setTasks(storedTasks);
    };
    loadData();
  }, []);

  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home">
            {(props) => (
              <HomeScreen
                {...props}
                tasks={tasks}
                setTasks={setTasks}
                theme={theme}
                isDark={isDark}
                setIsDark={setIsDark}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="AddTask">
            {(props) => (
              <AddTaskScreen
                {...props}
                tasks={tasks}
                setTasks={setTasks}
                theme={theme}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="EditTask">
            {(props) => (
              <EditTaskScreen
                {...props}
                tasks={tasks}
                setTasks={setTasks}
                theme={theme}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
