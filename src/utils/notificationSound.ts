const sound = new Audio("/sounds/notification.mp3");

export function playNotificationSound() {
  sound.currentTime = 0; // reset nếu đang phát
  sound.play().catch(() => {
    // console.log("User chưa tương tác => không phát được âm thanh:", err);
  });
}
