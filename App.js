import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import HomeScreen from "./src/screens/Home";
import StudySessionScreen from "./src/screens/StudySession";
import QUTEventsScreen from "./src/screens/QUTEvents";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => {
          return {
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === "Home") {
                iconName = "home";
              } else if (route.name === "QUTEvents") {
                iconName = "book";
              }
              return <FontAwesome5 name={iconName} size={size} color={color} />;
            },
          };
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="QUTEvents" component={QUTEventsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}