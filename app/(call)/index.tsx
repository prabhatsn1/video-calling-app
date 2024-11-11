import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import Dialog from "react-native-dialog";

export default function HomeScreen() {
  const [dialogeOpen, setDialogeOpen] = useState(false);
  const { signOut } = useAuth();
  return (
    <View>
      <TouchableOpacity
        style={{ position: "absolute", top: 20, right: 20, zIndex: 100 }}
        onPress={() => setDialogeOpen(true)}
      >
        <MaterialCommunityIcons name="exit-run" size={24} color="purple" />
      </TouchableOpacity>
      <Dialog.Container visible={dialogeOpen}>
        <Dialog.Title>Sign Out</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to sign out?
        </Dialog.Description>
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setDialogeOpen(false);
          }}
        />
        <Dialog.Button
          label="Sign Out"
          onPress={async () => {
            signOut();
            setDialogeOpen(false);
          }}
        />
      </Dialog.Container>
      <Text>Home Screen</Text>
      <SignedIn>
        <Text>Signed in</Text>
      </SignedIn>
      <SignedOut>
        <Text>Signed out</Text>
      </SignedOut>
    </View>
  );
}
