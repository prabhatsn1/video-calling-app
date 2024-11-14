import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { CallContent } from "@stream-io/video-react-native-sdk";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { CopySlug, formatSlug } from "@/lib/Slugs";

export default function CallRoom({ slug }: { slug: string }) {
  const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      <View style={{ top: 10, left: 10, zIndex: 100, position: "absolute" }}>
        <RoomId slug={slug} />
      </View>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <CallContent onHangupCallHandler={() => router.back()} />
      </GestureHandlerRootView>
    </View>
  );
}

const RoomId = ({ slug }: { slug: string | null }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        CopySlug(slug);
      }}
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 10,
        borderRadius: 5,
      }}
    >
      <Text style={{ color: "white" }}>Call Id {formatSlug(slug)}</Text>
    </TouchableOpacity>
  );
};
