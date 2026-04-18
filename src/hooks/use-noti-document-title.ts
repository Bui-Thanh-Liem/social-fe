import { useEffect } from "react";

export function useNotiDocumentTitle(title: string, notificationCount = 0) {
  useEffect(() => {
    if (notificationCount > 0) {
      document.title = `(${notificationCount}) ${title}`;
    } else {
      document.title = title;
    }
  }, [title, notificationCount]);
}
