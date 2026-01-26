import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "~/components/icons/arrow-left";
import { WrapIcon } from "~/components/WrapIcon";
import type { IConversation } from "~/shared/interfaces/schemas/conversation.interface";
import { ConversationList } from "./ConversationList";
import { MessageView } from "./MessageView";

export function MessagePage() {
  const navigate = useNavigate();

  const [conversationActive, setConversationActive] =
    useState<IConversation | null>(null);

  return (
    <div>
      {/* Header */}
      <div className="px-3 flex items-center border border-gray-100">
        <div className="flex h-12 items-center gap-6 ">
          <WrapIcon
            onClick={() => navigate(-1)}
            aria-label="Quay lại"
            className="hidden lg:block"
          >
            <ArrowLeftIcon color="#000" />
          </WrapIcon>
          <p className="font-semibold text-[20px]">Tin nhắn</p>
        </div>
      </div>

      {/* Content - Desktop view */}
      <div className="grid-cols-12 hidden md:grid lg:grid">
        {/* Conversations */}
        <div className="col-span-4 h-full border-r">
          <div>
            <ConversationList
              onclick={(conversation) => setConversationActive(conversation)}
            />
          </div>
        </div>

        {/* Message view */}
        <div className="col-span-8">
          <MessageView conversation={conversationActive} onBack={() => {}} />
        </div>
      </div>

      {/* Content - Mobile view */}
      <div className="grid-cols-12 grid md:hidden lg:hidden">
        {/* Conversations */}
        {!conversationActive ? (
          <div className="col-span-full h-full border-r">
            <div>
              <ConversationList
                onclick={(conversation) => setConversationActive(conversation)}
              />
            </div>
          </div>
        ) : (
          <div className="col-span-full">
            <MessageView
              conversation={conversationActive}
              onBack={() => setConversationActive(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
