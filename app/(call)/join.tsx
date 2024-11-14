import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { useRouter } from "expo-router";
import { inverseFormatSlug } from "@/lib/Slugs";
import Toast from "react-native-root-toast";

export default function JoinPage() {
  const [roomId, setRoomId] = React.useState("");
  const client = useStreamVideoClient(); // this is the client we created in the layout
  const router = useRouter();

  const handleJoinRoom = async () => {
    if (!roomId) return;

    const slug = inverseFormatSlug(roomId);

    const call = client?.call("default", slug);

    call
      ?.get()
      .then((callResponse) => {
        console.log(callResponse);
        router.push(`/(call)/${slug}`);
      })
      .catch((reason) => {
        console.log(reason);
        Toast.show("Whoops! Room not found", {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          shadow: true,
        });
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ padding: 20, fontWeight: "bold" }}>
        Enter the Room Name
      </Text>
      <TextInput
        placeholder="e.g. Black Purple Tiger"
        value={roomId}
        onChangeText={setRoomId}
        style={{ padding: 20, width: "100%", backgroundColor: "white" }}
      />
      <TouchableOpacity
        onPress={handleJoinRoom}
        style={{
          padding: 20,
          backgroundColor: "blue",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Join Room</Text>
      </TouchableOpacity>
    </View>
  );
}
