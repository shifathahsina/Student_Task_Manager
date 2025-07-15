// 👇 MUST BE AT THE VERY TOP
import 'react-native-gesture-handler';

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // ✅ NEW

import HomeScreen from './screens/HomeScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import EditTaskScreen from './screens/EditTaskScreen';

import { loadTasksFromStorage, saveTasksToStorage } from './utils/storage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [isDark, setIsDark] = useState(false);

  const lightTheme = {
    background: '#FAFBFC',
    secondaryBackground: '#FFFFFF',
    text: '#1A202C',
    secondaryText: '#4A5568',
    tertiaryText: '#718096',
    card: '#FFFFFF',
    border: '#E2E8F0',
    accent: '#667EEA',
    accentLight: '#F0F4FF',
    success: '#48BB78',
    successLight: '#F0FFF4',
    danger: '#F56565',
    dangerLight: '#FED7D7',
    warning: '#ED8936',
    warningLight: '#FEFCF3',
    inputBg: '#FFFFFF',
    placeholder: '#A0AEC0',
    shadow: '#000000',
  };

  const darkTheme = {
    background: '#0D1117',
    secondaryBackground: '#161B22',
    text: '#F0F6FC',
    secondaryText: '#8B949E',
    tertiaryText: '#6E7681',
    card: '#21262D',
    border: '#30363D',
    accent: '#58A6FF',
    accentLight: '#0D1117',
    success: '#3FB950',
    successLight: '#0D1117',
    danger: '#F85149',
    dangerLight: '#0D1117',
    warning: '#D29922',
    warningLight: '#0D1117',
    inputBg: '#21262D',
    placeholder: '#6E7681',
    shadow: '#000000',
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
      <SafeAreaProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{
            headerStyle: {
              backgroundColor: theme.background,
              shadowColor: 'transparent',
              elevation: 0,
            },
            headerTintColor: theme.text,
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 18,
            },
            headerBackTitleVisible: false,
            headerShadowVisible: false,
          }}>
            <Stack.Screen name="Home" options={{ headerShown: false }}>
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
            <Stack.Screen name="AddTask" options={{ title: 'Create Task' }}>
              {(props) => (
                <AddTaskScreen
                  {...props}
                  tasks={tasks}
                  setTasks={setTasks}
                  theme={theme}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="EditTask" options={{ title: 'Edit Task' }}>
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
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
