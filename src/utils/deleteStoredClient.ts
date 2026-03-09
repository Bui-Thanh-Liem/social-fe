export function deleteStoredClient() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_storage");
  localStorage.removeItem("unread_noti");
  localStorage.removeItem("onl_user_ids");
  localStorage.removeItem("notifications");
  localStorage.removeItem("chatBox_storage");
  localStorage.removeItem("trending_storage");
}
