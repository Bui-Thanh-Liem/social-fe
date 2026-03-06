// Format date to Vietnamese date string
export function formatDateToDateVN(date: Date) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Format time ago from a date string
export const formatTimeAgo = (dateString: string) => {
  if (!dateString) return "Vừa xong";

  const now = new Date();
  const createdDate = new Date(dateString);

  const diffInMinutes = Math.floor(
    (now.getTime() - createdDate.getTime()) / (1000 * 60)
  );
  const diffInHours = Math.floor(diffInMinutes / 60);

  // Calendar day difference (không phụ thuộc đủ 24h hay chưa)
  const diffInDays = Math.floor(
    (new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
      new Date(
        createdDate.getFullYear(),
        createdDate.getMonth(),
        createdDate.getDate()
      ).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) {
    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút`;
    return `${diffInHours} giờ`;
  }

  if (diffInDays === 1) return "Hôm qua";
  if (diffInDays < 7) return `${diffInDays} ngày`;
  return createdDate.toLocaleDateString("vi-VN");
};

// Format time until a future date string
export const formatTimeUntil = (futureDateString: string) => {
  if (!futureDateString) return "";

  const now = new Date();
  const futureDate = new Date(futureDateString);

  // Nếu ngày đã qua hoặc bằng hiện tại
  if (futureDate <= now) return "đã đến hạn";

  const diffInMinutes = Math.floor(
    (futureDate.getTime() - now.getTime()) / (1000 * 60)
  );
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "sắp tới";
  if (diffInMinutes < 60) return `còn ${diffInMinutes} phút`;
  if (diffInHours < 24) return `còn ${diffInHours} giờ`;
  if (diffInDays < 7) return `còn ${diffInDays} ngày`;

  // Nếu còn lâu hơn 7 ngày, hiển thị ngày cụ thể
  return `còn đến ngày ${futureDate.toLocaleDateString("vi-VN")}`;
};
