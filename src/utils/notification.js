import * as Notifications from 'expo-notifications';

export const scheduleSessionReminder = async (session) => {
  try {
    const { title, date, startTime, _id } = session;
        // Extract local date components
    const [year, month, day] = (date?.$date || date).slice(0, 10).split("-").map(Number);
    const [hour, minute] = startTime.split(":").map(Number);

    // ⚠️ Note: month in JS Date is 0-indexed
    const sessionDateTime = new Date(year, month - 1, day, hour, minute);
    console.log("Session title & id: ", title, _id);
    console.log("Local session time:", sessionDateTime.toLocaleString("en-AU", { timeZone: "Australia/Brisbane" }));
    const fireDate = new Date(sessionDateTime.getTime() - 24 * 60 * 60 * 1000); // 24 hours before
    if (fireDate <= new Date()) {
      console.log("Notification time is in the past. Skipping schedule.");
      return;
    }

    const trigger = fireDate;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Reminder: ${title}`,
        body: `You're attending a study session tomorrow at ${startTime}.`,
        data: { sessionId: _id },
      },
      trigger,
    });

    console.log("Scheduled notification ID:", id);
    console.log("Date and time for notification:", fireDate.toLocaleString("en-AU", { timeZone: "Australia/Brisbane" }));
  } catch (error) {
    console.error("Failed to schedule notification:", error);
  }
};
