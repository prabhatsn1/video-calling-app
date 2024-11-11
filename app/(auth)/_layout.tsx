import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import { Text, SafeAreaView } from "react-native";

const AuthRoutesLayout = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/(call)"} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{ title: "Sign in to get started", headerShown: false }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            title: "Create a Account",
            headerBackTitle: "Sign up",
            headerStyle: { backgroundColor: "purple" },
            headerTintColor: "white",
          }}
        />
      </Stack>
    </SafeAreaView>
  );
};

export default AuthRoutesLayout;
