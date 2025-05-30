import * as Notifications from 'expo-notifications';

export const scheduleSessionReminder = async (session) => {
  try {
    const { title, date, startTime, _id } = session;

    // Combine session date and time into a Date object
    const sessionDateTime = new Date(`${date}T${startTime}`);
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
  } catch (error) {
    console.error("Failed to schedule notification:", error);
  }
};
