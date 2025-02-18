import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Welcome, Login, Register, Home, Chat, Medication, CalendarScreen, FullCalendarScreen, SelectionScreen, GoalSettingScreen, HabitSettingScreen, GamifiedTaskmanager } from '../screens'
import { NavigationContainer } from '@react-navigation/native'
import BottomTabNavigation from './BottomTabNavigation'

const Stack = createNativeStackNavigator()

const AppNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{
                            headerShown: false,
                        }}
                    />
                {/*
                <Stack.Screen
                    name="Welcome"
                    component={Welcome}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Register"
                    component={Register}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{
                        headerShown: false,
                    }}
                />
                */}
                <Stack.Screen
                    name="BottomTabNavigation"
                    component={BottomTabNavigation}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="CalendarScreen"
                    component={CalendarScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="FullCalendarScreen"
                    component={FullCalendarScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Medication"
                    component={Medication}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Chat"
                    component={Chat}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Selection"
                    component={SelectionScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="GoalSetting"
                    component={GoalSettingScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="HabitSetting"
                    component={HabitSettingScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="GamifiedTaskmanager"
                    component={GamifiedTaskmanager}
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigation
