import { RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AvatarGroup } from "~/components/ui/avatar";
import { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useNewsFeedSocket } from "~/socket/hooks/news-feed-socket";
import { useReloadStore } from "~/storage/use-reload.storage";
import { cn } from "~/utils/cn.util";

type NewsFeedProps = Pick<IUser, "_id" | "name" | "avatar" | "username">;
export function NewsFeed() {
  const navigate = useNavigate();
  const { triggerReload } = useReloadStore();

  const kols = useRef<NewsFeedProps[]>([]);
  const [kol, setKol] = useState<NewsFeedProps | null>(null);

  useNewsFeedSocket(({ kol }: { kol: NewsFeedProps }) => {
    setKol(kol);

    const newKol = Array.from(new Set([...kols.current, kol])); // Loại bỏ trùng lặp
    kols.current.unshift(newKol.find((k) => k._id === kol._id)!); // Đưa kol mới lên đầu
  });

  function handleClick() {
    setKol(null);
    navigate(`/#following`);
    triggerReload();
  }

  return (
    <div
      className={cn(
        " fixed top-12 right-1/2 translate-x-1/2 z-10 opacity-0",
        kol ? "top-18 opacity-100 transition-all duration-300" : "",
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between gap-x-2 h-8 rounded-full bg-sky-100 border-2 border-sky-200 cursor-pointer">
        <AvatarGroup users={kols.current} max={5} className="w-7 h-7" />
        <RotateCcw size={20} color="#00BCFF" />
      </div>
    </div>
  );
}
