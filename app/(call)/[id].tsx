import { View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Call,
  CallingState,
  StreamCall,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useLocalSearchParams } from "expo-router";
import Room from "@/components/Room";
import { generateSlug } from "random-word-slugs";
import Toast from "react-native-root-toast";
import { CopySlug } from "@/lib/Slugs";

const CallScreen = () => {
  const [call, setCall] = useState<Call | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const { id } = useLocalSearchParams();
  const client = useStreamVideoClient(); // this is the client we created in the layout

  useEffect(() => {
    let slug: string;
    if (id && id !== "(call)") {
      // joining existing call
      slug = id.toString();
      const _call = client?.call("default", slug);
      _call?.join().then(() => {
        setCall(_call);
      });
    } else {
      // creating new call
      slug = generateSlug(3, {
        categories: {
          adjective: ["color", "personality"],
          noun: ["animals", "food"],
        },
      });

      const _call = client?.call("default", slug);
      _call?.join({ create: true }).then(() => {
        //have a toast popup
        Toast.show(
          "Call Created Successfully \n Tap here to COPY the call ID to share!",
          {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
            shadow: true,
            onPress: () => {
              CopySlug(slug);
            },
          }
        );
        setCall(_call);
      });
    }
    setSlug(slug);
  }, [id, client]);

  useEffect(() => {
    // cleanup fns run when component unmounts
    if (call?.state.callingState !== CallingState.LEFT) {
      call?.leave();
    }
  }, [call]);

  if (!call || !slug) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <Room slug={slug} />
    </StreamCall>
  );
};

export default CallScreen;
