import { formatSlug } from "@/lib/Slugs";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Call, useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import Dialog from "react-native-dialog";
import { FlatList } from "react-native-gesture-handler";

export default function HomeScreen() {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMyCalls, setIsMyCalls] = useState(false);
  const [calls, setCalls] = useState<Call[]>([]);
  const [dialogeOpen, setDialogeOpen] = useState(false);
  const { signOut } = useAuth();

  const fetchCalls = async () => {
    if (!client || !user) return;

    const { calls } = await client.queryCalls({
      filter_conditions: isMyCalls
        ? {
            // filter calls created by the user or calls where the user is a member
            $or: [
              { created_by_userid: user.id },
              { members: { $in: [user.id] } },
            ],
          }
        : {},
      sort: [{ field: "created_at", direction: -1 }],
      watch: true,
    });
    // sort calls by participants count
    const sortedCalls = calls.sort((a, b) => {
      return a.state.participantCount - b.state.participantCount;
    });

    setCalls(sortedCalls);
  };

  useEffect(() => {
    fetchCalls();
  }, [isMyCalls]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCalls();
    setIsRefreshing(false);
  };

  const handleJoinRoom = async (callId: string) => {
    router.push(`/(call)/${callId}`);
  };

  return (
    <View style={{ paddingVertical: 10 }}>
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          gap: 10,
        }}
      >
        <Text style={{ color: isMyCalls ? "black" : "purple" }}>All Calls</Text>
        <Switch
          trackColor={{ false: "purple", true: "purple" }}
          thumbColor="white"
          ios_backgroundColor="purple"
          value={isMyCalls}
          onValueChange={() => setIsMyCalls(!isMyCalls)}
        />
        <Text style={{ color: !isMyCalls ? "black" : "purple" }}>My Calls</Text>
      </View>

      <FlatList
        data={calls}
        keyExtractor={(item) => item.id}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              handleJoinRoom(item.id);
            }}
            disabled={item.state.participantCount === 0}
            style={{
              padding: 20,
              backgroundColor:
                item.state.participantCount === 0 ? "gray" : "white",
              opacity: item.state.participantCount === 0 ? 0.5 : 1,
              borderBottomWidth: 1,
              borderBottomColor:
                item.state.participantCount === 0 ? "white" : "gray",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            {item.state.participantCount === 0 ? (
              <Feather name="phone-off" size={24} color="gray" />
            ) : (
              <Feather name="phone-call" size={20} color="gray" />
            )}
            <Image
              source={{ uri: item.state.createdBy?.image }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {item.state.createdBy?.name ||
                      item.state.createdBy?.custom.email.split("@")[0]}
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    {item.state.createdBy?.custom.email}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 50 }}>
                  <Text
                    style={{ fontSize: 10, textAlign: "right", width: 100 }}
                  >
                    {formatSlug(item.id)}
                  </Text>
                  {/*  */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {item.state.participantCount === 0 ? (
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "bold",
                          color: "purple",
                        }}
                      >
                        Call Ended
                      </Text>
                    ) : (
                      <View
                        style={{
                          borderRadius: 5,
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "gray",
                          padding: 10,
                        }}
                      >
                        <Entypo
                          name="users"
                          size={14}
                          color="purple"
                          style={{ marginRight: 5 }}
                        />
                        <Text style={{ fontWeight: "bold", color: "purple" }}>
                          {item.state.participantCount}
                        </Text>
                      </View>
                    )}
                  </View>
                  {/*  */}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
