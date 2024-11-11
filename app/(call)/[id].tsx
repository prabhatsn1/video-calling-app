import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Call,
  CallingState,
  StreamCall,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useLocalSearchParams } from "expo-router";

const CallScreen = () => {
  const [call, setCall] = useState<Call | null>(null);
  const { id } = useLocalSearchParams();
  const client = useStreamVideoClient(); // this is the client we created in the layout

  useEffect(() => {
    let slug: string;
    if (id && id !== "(call)") {
      // joining existing call
    } else {
      // creating new call
    }
  }, [id, client]);

  useEffect(() => {
    // cleanup fns run when component unmounts
    if (call?.state.callingState !== CallingState.LEFT) {
      call?.leave();
    }
  }, [call]);
  return (
    <StreamCall call={call}>
      <Text>CallScreen</Text>
    </StreamCall>
  );
};

export default CallScreen;
