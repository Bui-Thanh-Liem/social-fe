import { useNavigate } from "react-router-dom";
import { ConversationsList } from "./conversations-list";

export function MessagePage() {
  const navigate = useNavigate();

  return (
    <div className="mt-4">
      <ConversationsList
        onclick={(c) => {
          navigate(`/messages/${c?.name}`);
        }}
      />
    </div>
  );
}
