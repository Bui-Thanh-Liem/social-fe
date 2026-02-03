import { Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { EmojiSelector } from "~/components/EmojiPicker";
import { ImageIcon } from "~/components/icons/image";
import { Logo } from "~/components/Logo";
import { AvatarMain, GroupAvatarMain } from "~/components/ui/avatar";
import { ButtonMain } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { CircularProgress } from "~/components/ui/circular-progress";
import { ScrollArea } from "~/components/ui/scroll-area";
import { WrapIcon } from "~/components/WrapIcon";
import { useEmojiInsertion } from "~/hooks/useEmojiInsertion";
import { useGetMultiMessages } from "~/apis/useFetchMessages";
import { useMediaPreviewMulti } from "~/hooks/useMediaPreviewMulti";
import { useTextareaAutoResize } from "~/hooks/useTextareaAutoResize";
import { cn } from "~/lib/utils";
import { CONSTANT_MAX_LENGTH_TEXT } from "~/shared/constants";
import type { IMessage } from "~/shared/interfaces/schemas/message.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useChatSocket } from "~/socket/hooks/useChatSocket";
import { useConversationSocket } from "~/socket/hooks/useConversationSocket";
import { useStatusSocket } from "~/socket/hooks/useStatusSocket";
import { useChatBoxStore } from "~/store/useChatBoxStore";
import { useUserStore } from "~/store/useUserStore";
import { CreateConversation } from "./CreateConversation";
import { MessageItem, PreviewMediaMulti } from "./MessageView";
import { useOnlStore } from "~/store/useOnlStore";
import { checkOnl } from "~/utils/checkOnl.util";

export default function ChatBox() {
  //
  const { leaveConversation, joinConversation } = useConversationSocket(
    () => {},
    () => {},
    () => {},
  );
  const { pathname } = useLocation();
  const { close, conversation } = useChatBoxStore();
  const { user } = useUserStore();
  const { onlUserIds, setOnlUserIds } = useOnlStore();

  //
  const participantIds = (
    conversation?.participants as unknown as IUser[]
  )?.map((u) => u._id);

  //
  useEffect(() => {
    if (conversation?._id) {
      console.log("joinConversation:::", conversation?._id);
      joinConversation([conversation?._id]);
    }

    return () => {
      if (conversation?._id) {
        console.log("leaveConversation:::", conversation?._id);
        leaveConversation([conversation?._id]);
      }
    };
  }, [conversation?._id]);

  // Online status socket
  useStatusSocket((val) => {
    if (val.hasOnline === false) {
      const userOlIds = onlUserIds.filter((id) => id !== val._id);
      setOnlUserIds(userOlIds);
    } else {
      setOnlUserIds([...onlUserIds, val._id]);
    }
  });

  //
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { sendMessage } = useChatSocket((newDataMessage) => {
    console.log("new message socket");
    setMessages((prev) => {
      return [newDataMessage, ...prev];
    });
  });

  //
  const { mediaItems, handleFileChange, removeMedia } = useMediaPreviewMulti();

  //
  const { data } = useGetMultiMessages(conversation?._id || "", {
    page: "1",
    limit: "200",
  });

  //
  useEffect(() => {
    const _messages = data?.metadata?.items || [];
    console.log("co set lai messages khong ");
    setMessages(_messages);
  }, [data?.metadata?.items]);

  //
  const { register, reset, handleSubmit, setValue, watch } = useForm<{
    text: string;
  }>({
    defaultValues: { text: "" },
  });

  //
  const { textareaRef, autoResize } = useTextareaAutoResize();
  const { insertEmoji } = useEmojiInsertion(textareaRef);

  // Watch content for real-time updates
  const contentValue = watch("text");

  //
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileChange(e);
    },
    [handleFileChange],
  );

  //
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const files = [];
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.includes("image")) {
          const file = item.getAsFile();
          files.push(file);
        }
      }

      //
      handleFileSelect({ target: { files } } as any);
    },
    [],
  );

  // Memoized handlers
  const handleEmojiClick = useCallback(
    (emoji: string) => {
      const newContent = insertEmoji(emoji, contentValue);
      setValue("text", newContent);
    },
    [contentValue, insertEmoji, setValue],
  );

  //
  const handleTextareaInput = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => {
      const newValue = autoResize(e.currentTarget, 1);
      if (newValue !== contentValue) {
        setValue("text", newValue);
      }
    },
    [autoResize, setValue, contentValue],
  );

  //
  const onSubmit = useCallback(
    (data: { text: string }) => {
      sendMessage({
        content: data.text,
        sender: user?._id || "",
        conversation: conversation?._id || "",
      });

      reset();
    },
    [conversation?._id, reset, sendMessage, user?._id],
  );

  //
  function closeChatBox() {
    close();
  }

  if (!conversation || pathname === "/messages") return null;

  return (
    <div className="fixed bottom-8 right-8 bg-white z-50">
      <Card className="w-[420px] h-[580px] gap-2 rounded-2xl shadow-lg overflow-hidden">
        {/*  */}
        <CardHeader className="px-4">
          <div className="flex gap-x-4 items-center">
            {!Array.isArray(conversation.avatar) ? (
              <AvatarMain
                src={conversation.avatar?.url}
                alt={conversation.name || ""}
              />
            ) : (
              <GroupAvatarMain
                srcs={conversation.avatar.map((a) => a.url) as string[]}
              />
            )}
            <div>
              <CardTitle>{conversation?.name}</CardTitle>
              <CardDescription
                className={cn(
                  "text-gray-300 text-xs mt-1",
                  checkOnl(onlUserIds, participantIds) ? "text-green-400" : "",
                )}
              >
                {!checkOnl(onlUserIds, participantIds) ? "Không" : "Đang"} hoạt
                động
              </CardDescription>
            </div>
          </div>

          {/*  */}
          <CardAction className="flex items-center gap-2">
            <CreateConversation
              initialUserIds={(
                conversation.participants as unknown as IUser[]
              ).map((user) => user._id)}
            />
            <WrapIcon onClick={closeChatBox}>
              <X className="h-[18px] w-[18px]" />
            </WrapIcon>
          </CardAction>
        </CardHeader>

        {/*  */}
        <CardContent className="flex-1 flex flex-col border-t px-0">
          {/* View message */}
          <ScrollArea className="px-4 pt-2 h-[340px] max-h-[340px]">
            <div className="flex flex-col gap-3">
              {messages
                .slice()
                .reverse()
                .map((msg) => (
                  <MessageItem msg={msg} user={user as IUser} />
                ))}

              <div ref={endOfMessagesRef} />
            </div>
            {!messages.length && (
              <Logo
                size={100}
                className="text-gray-100 translate-y-28 translate-x-32"
              />
            )}
          </ScrollArea>

          {/* Action message */}
          <form onSubmit={handleSubmit(onSubmit)} className="px-4">
            <div className="relative border-t">
              <div className="absolute top-[108px] right-1">
                <CircularProgress
                  value={isNaN(contentValue?.length) ? 0 : contentValue?.length}
                  max={CONSTANT_MAX_LENGTH_TEXT}
                  size={20}
                />
              </div>
              <div className="flex justify-between items-center relative">
                <div className="flex items-center gap-2 py-1">
                  <WrapIcon className="hover:bg-blue-100/60">
                    <EmojiSelector onEmojiClick={handleEmojiClick} />
                  </WrapIcon>
                  <WrapIcon className="hover:bg-blue-100/60">
                    <label
                      htmlFor="image-upload-in-chat"
                      className="cursor-pointer"
                      title="Thêm ảnh hoặc video"
                    >
                      <ImageIcon />
                      <input
                        multiple
                        type="file"
                        className="hidden"
                        id="image-upload-in-chat"
                        onChange={handleFileSelect}
                        accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/mov,video/avi,video/quicktime"
                      />
                    </label>
                  </WrapIcon>

                  <PreviewMediaMulti
                    mediaItems={mediaItems}
                    removeMedia={removeMedia}
                  />
                </div>
                <ButtonMain
                  size="sm"
                  type="submit"
                  className="bg-transparent hover:bg-gray-50"
                >
                  <Send color="#1d9bf0" />
                </ButtonMain>
              </div>
              <textarea
                {...register("text")}
                ref={textareaRef}
                autoComplete="off"
                value={contentValue}
                autoCorrect="off"
                spellCheck="false"
                className="outline-0 w-full text-md placeholder:text-gray-500 bg-gray-100 rounded-xl resize-none p-2"
                placeholder="Nhập văn bản"
                onInput={handleTextareaInput}
                rows={3}
                maxLength={CONSTANT_MAX_LENGTH_TEXT}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // chặn xuống dòng mặc định
                    handleSubmit(onSubmit)(); // gọi submit form
                  }
                }}
                onPaste={handlePaste}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
