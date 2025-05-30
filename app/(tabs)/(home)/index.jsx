import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Keyboard,
  RefreshControl,
  Platform,
} from "react-native";
import {
  Text,
  TextInput,
  SegmentedButtons,
  Button,
  Snackbar,
  useTheme,
} from "react-native-paper";
import StudySessionCard from "@components/StudySessionCard";
import { useUser } from "@hooks/useUser";
import { baseUrl } from "@constants/api";


const PAGE_SIZE = 5;

function HomeScreen() {
  const { colors } = useTheme();
  const { token, user } = useUser();
  const listRef = useRef(null);

  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnack = (message, severity = "success") => {
    setSnack({ open: true, message, severity });
  };

  const hideSnack = () => setSnack((prev) => ({ ...prev, open: false }));

  const fetchSessions = useCallback(
    async (pageNum = 1) => {
      setLoading(true);
      try {
        const res = await fetch(
          `${baseUrl}/api/sessions?page=${pageNum}&limit=${PAGE_SIZE}` +
            `&search=${encodeURIComponent(search)}&sort=${sort}`
        );
        const result = await res.json();
        if (res.ok) {
          setSessions(result.data);
          setPage(result.page || 1);
          setTotalPages(result.totalPages || 1);
          setError(null);
        } else {
          setError(result.message || "Failed to fetch study sessions.");
        }
      } catch {
        setError("Something went wrong while fetching sessions.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [search, sort]
  );

  useEffect(() => {
    fetchSessions(page);
  }, [page]);

  useEffect(() => {
    fetchSessions(1);
  }, [search, sort]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSessions(page);
  };

  const goToPage = (newPage) => {
    setPage(newPage);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!token && (
        <View style={styles.loginPrompt}>
          <Text variant="titleMedium" style={{ color: colors.onSurface }}>
            Please log in to join sessions.
          </Text>
        </View>
      )}
      <FlatList
        ref={listRef}
        ListHeaderComponent={
          <View style={styles.controls}>
            <TextInput
              mode="outlined"
              placeholder="Search sessions…"
              value={search}
              onChangeText={setSearch}
              left={<TextInput.Icon icon="magnify" />}
              returnKeyType="search"
              onSubmitEditing={Keyboard.dismiss}
            />
            <SegmentedButtons
              value={sort}
              onValueChange={setSort}
              buttons={[
                { label: "Soonest", value: "asc" },
                { label: "Latest", value: "desc" },
              ]}
              style={styles.segment}
            />
          </View>
        }
        data={sessions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <StudySessionCard
            {...item}
            user={user}
            token={token}
            onJoinSuccess={() => fetchSessions(page)}
            showSnack={showSnack}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          !loading && (
            <Text style={[styles.empty, { color: colors.onSurfaceVariant }]}>
              No Sessions Found
            </Text>
          )
        }
        contentContainerStyle={{ backgroundColor: colors.background }}
        ListFooterComponent={
          totalPages > 1 && (
            <View style={styles.pager}>
              <Button
                mode="text"
                onPress={() => goToPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Text style={{ color: colors.onSurface }}>
                {page} / {totalPages}
              </Text>
              <Button
                mode="text"
                onPress={() => goToPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </View>
          )
        }
      />
      <Snackbar
        visible={snack.open}
        onDismiss={hideSnack}
        duration={2500}
        style={{
          position: "absolute",
          bottom: Platform.OS === "android" ? 0 : 32,
          left: 16,
          right: 16,
          backgroundColor:
            snack.severity === "error" ? colors.errorContainer : "green",
        }}
        action={{
          label: "Close",
          onPress: () => setError(null),
          labelStyle: {
            color:
              snack.severity === "error" ? colors.onErrorContainer : "white",
          },
        }}
      >
        <Text
          style={{
            color:
              snack.severity === "error" ? colors.onErrorContainer : "white",
          }}
        >
          {snack.message}
        </Text>
      </Snackbar>
      {error && (
        <Snackbar
          visible={true}
          onDismiss={() => setError(null)}
          duration={2500}
          style={{ backgroundColor: colors.errorContainer }}
          action={{
            label: "Close",
            onPress: () => setError(null),
            labelStyle: { color: colors.onErrorContainer },
          }}
        >
          <Text style={{ color: colors.onErrorContainer }}>{error}</Text>
        </Snackbar>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loginPrompt: { paddingHorizontal: 24, paddingTop: 12 },
  controls: { paddingHorizontal: 16, gap: 8, marginVertical: 8 },
  segment: { alignSelf: "flex-start" },
  empty: { alignSelf: "center", marginTop: 40 },
  pager: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
});

export default HomeScreen;
