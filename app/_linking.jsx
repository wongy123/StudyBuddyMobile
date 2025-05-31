import { useEffect } from "react";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useUser } from "@hooks/useUser";

export default function LinkInterceptor() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    // 🔁 Shared handler
    const handleUrl = (url) => {
      if (!url) return;
      const parsed = Linking.parse(url);
      const fullPath = parsed.path || "";

      if (!fullPath.startsWith("StudyBuddy")) return;

      const route = fullPath.replace("StudyBuddy/", "");

      if (route === "login") {
        router.push("/login");
      } else if (route === "register") {
        router.push("/register");
      } else if (route === "create-session") {
        router.push("/create_session");
      } else if (route === "qut-events") {
        router.push("/qut_events");
      } else if (route.startsWith("session/")) {
        const sessionId = route.split("/")[1];
        router.push(`/study_session/${sessionId}`);
      } else if (route.startsWith("profile/")) {
        const profileId = route.split("/")[1];
        if (user?.id === profileId) {
          router.push("/my_profile");
        } else {
          router.push(`/profile/${profileId}`);
        }
      }
    };

    // ✅ Handle cold start
    Linking.getInitialURL().then((url) => {
      handleUrl(url);
    });

    // ✅ Handle backgrounded app
    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleUrl(url);
    });

    return () => subscription.remove();
  }, [user]);

  return null;
}
