import { useNavigate } from "react-router-dom";
import { ConversationList } from "./ConversationList";

export function MessagePage() {
  const navigate = useNavigate();

  return (
    <div className="mt-4">
      <ConversationList
        onclick={(c) => {
          navigate(`/messages/${c?.name}`);
        }}
        className="max-h-[calc(100vh-150px)]"
      />
    </div>
  );
}
