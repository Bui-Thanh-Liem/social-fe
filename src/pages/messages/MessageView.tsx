import { LoaderCircle, Send } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useGetMultiMessages } from "~/apis/useFetchMessages";
import { useUploadMedia } from "~/apis/useFetchUpload";
import { EmojiSelector } from "~/components/EmojiPicker";
import { ArrowLeftIcon } from "~/components/icons/arrow-left";
import { CloseIcon } from "~/components/icons/close";
import { ImageIcon } from "~/components/icons/image";
import { Logo } from "~/components/Logo";
import { AvatarMain, GroupAvatarMain } from "~/components/ui/avatar";
import { ButtonMain } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import { CircularProgress } from "~/components/ui/circular-progress";
import { WrapIcon } from "~/components/WrapIcon";
import { useEmojiInsertion } from "~/hooks/useEmojiInsertion";
import { useMediaPreviewMulti } from "~/hooks/useMediaPreviewMulti";
import { useTextareaAutoResize } from "~/hooks/useTextareaAutoResize";
import { cn } from "~/lib/utils";
import { CONSTANT_MAX_LENGTH_TEXT } from "~/shared/constants";
import { EConversationType } from "~/shared/enums/type.enum";
import type {
  IMedia,
  PreviewMediaProps,
} from "~/shared/interfaces/schemas/media.interface";
import type { IConversation } from "~/shared/interfaces/schemas/conversation.interface";
import type { IMessage } from "~/shared/interfaces/schemas/message.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useChatSocket } from "~/socket/hooks/useChatSocket";
import { useConversationActiveStore } from "~/store/useConversationActiveStore";
import { useDetailAttachment } from "~/store/useDetailAttachment";
import { useUserStore } from "~/store/useUserStore";
import { handleResponse, toastSimple } from "~/utils/toast";
import { AddParticipants } from "./AddParticipants";
import { CreateConversation } from "./CreateConversation";
import { ParticipantList } from "./ParticipantList";
import { useOnlStore } from "~/store/useOnlStore";
import { checkOnl } from "~/utils/checkOnl.util";

//
export function MessageView({
  conversation,
  onBack,
}: {
  conversation: IConversation | null;
  onBack: () => void;
}) {
  //
  const uploadId = useId();
  const { user } = useUserStore();
  const { onlUserIds } = useOnlStore();
  const { activeId } = useConversationActiveStore();
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<IMessage[]>([]);

  //
  const [page, setPage] = useState(1);
  const total_page_ref = useRef(0);

  //
  const participantIds = (
    conversation?.participants as unknown as IUser[]
  )?.map((u) => u._id);

  //
  const { sendMessage } = useChatSocket((newDataMessage) => {
    console.log("new message socket:::");
    setMessages((prev) => {
      return [...prev, newDataMessage];
    });
  });
  const apiUploadMedia = useUploadMedia();

  //
  const { mediaItems, handleFileChange, removeMedia } = useMediaPreviewMulti();

  //
  const { data, isLoading } = useGetMultiMessages(conversation?._id || "", {
    page: page.toString(),
    limit: "50",
  });

  // Mỗi lần fetch API xong thì merge vào state (loại bỏ duplicate)
  useEffect(() => {
    const items = data?.metadata?.items || [];
    const total_page = data?.metadata?.total_page;
    total_page_ref.current = total_page || 0;

    if (page === 1) {
      setMessages(items);
    } else {
      setMessages((prev) => {
        const existIds = new Set(prev.map((c) => c._id.toString()));
        const newItems = items.filter(
          (item) => !existIds.has(item._id.toString()),
        );
        return [...prev, ...newItems];
      });
    }
  }, [data, page]);

  //
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("handleFileSelect - e:::", e);

      handleFileChange(e);
    },
    [handleFileChange],
  );

  //
  useEffect(() => {
    return () => {
      setPage(1);
      setMessages([]);
    };
  }, []);

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

  //
  function onSeeMore() {
    setPage((prev) => prev + 1);
  }

  //
  const onSubmit = useCallback(
    async (data: { text: string }) => {
      startTransition(async () => {
        let medias: IMedia[] = [];
        const selectedFiles = mediaItems.map((file) => file.file);

        try {
          //
          if (selectedFiles.length > 0) {
            const resUploadMedia =
              await apiUploadMedia.mutateAsync(selectedFiles);

            if (resUploadMedia.statusCode !== 200 || !resUploadMedia.metadata) {
              handleResponse(resUploadMedia);
              return;
            }

            medias = resUploadMedia.metadata;
          }
        } catch (uploadError) {
          toastSimple((uploadError as { message: string }).message);
        }

        sendMessage({
          content: data.text,
          sender: user?._id || "",
          conversation: conversation?._id || "",
          attachments:
            medias.map((m) => ({
              s3_key: m.s3_key || "",
              url: m?.url || "",
            })) || undefined,
        });

        removeMedia();
        reset();
      });
    },
    [
      reset,
      user?._id,
      mediaItems,
      removeMedia,
      sendMessage,
      apiUploadMedia,
      conversation?._id,
    ],
  );

  //
  if (isLoading && conversation) {
    return <MessageSkeleton />;
  }

  //
  if (!conversation || !activeId)
    return (
      <div className="h-[100vh] col-span-8 flex gap-5 flex-col items-center justify-center">
        <div className="flex items-center gap-x-2">
          <p className="text-2xl font-bold">Chào mừng đến với</p>
          <Logo size={40} />
        </div>
        <p className="w-2/3 text-gray-400">
          Trò chuyện cùng người thân, bạn bè được tối ưu hoá cho máy tính của
          bạn. Nhắn tin nhiều hơn, soạn thảo ít hơn.
        </p>
        <img className="w-1/2" src="./message-view.png" alt="" />
      </div>
    );

  //
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 flex items-center justify-between bg-blue-50">
        <div className="flex items-center gap-3">
          <WrapIcon
            className="md:hidden lg:hidden"
            onClick={() => {
              onBack();
            }}
          >
            <ArrowLeftIcon color="#000" />
          </WrapIcon>
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
            <p>{conversation?.name}</p>
            <p
              className={cn(
                "text-gray-400 text-[12px]",
                checkOnl(onlUserIds, participantIds) ? "text-green-500" : "",
              )}
            >
              {!checkOnl(onlUserIds, participantIds) ? "Không" : "Đang"} hoạt
              động
            </p>
          </div>
        </div>

        {/*  */}
        <div className="mt-1 space-x-3">
          {conversation.type === EConversationType.Group ? (
            <>
              <AddParticipants conversation={conversation} />
              <ParticipantList conversation={conversation} />
            </>
          ) : (
            <CreateConversation
              initialUserIds={(conversation?.participants as any).map(
                (user: { _id: any }) => user._id,
              )}
            />
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="px-4 pt-2 h-[calc(100vh-300px)] lg:h-[calc(100vh-260px)] overflow-y-auto overflow-x-hidden">
          {/* Loading khi load thêm */}
          {isLoading ? (
            <div className="p-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <MessageSkeleton key={`more-${i}`} />
              ))}
            </div>
          ) : (
            !!messages.length && (
              <div className="px-4 p-2 flex">
                <p
                  className={cn(
                    "m-auto inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer",
                    total_page_ref.current <= page ? "hidden" : "",
                  )}
                  onClick={onSeeMore}
                >
                  cũ hơn
                </p>
              </div>
            )
          )}

          {/*  */}
          <div className="flex flex-col gap-3">
            {messages.map((msg) => {
              return (
                <MessageItem key={msg._id} msg={msg} user={user as IUser} />
              );
            })}
            <div ref={endOfMessagesRef} />
          </div>

          {/* Chưa có tin nhắn */}
          {!messages.length && (
            <Logo
              size={180}
              className="text-gray-100 translate-y-48 translate-x-54"
            />
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="relative border-t px-3">
            <div className="absolute top-[108px] right-4">
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
                    htmlFor={uploadId}
                    className={cn(
                      "cursor-pointer",
                      isPending ? "pointer-events-none" : "",
                    )}
                    title="Thêm ảnh hoặc video"
                  >
                    <ImageIcon />
                    <input
                      multiple
                      type="file"
                      className="hidden"
                      id={uploadId}
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
                disabled={isPending}
              >
                {isPending ? (
                  <LoaderCircle color="#1d9bf0" className="animate-spin" />
                ) : (
                  <Send color="#1d9bf0" />
                )}
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
                if (e.key === "Enter" && !e.shiftKey && contentValue.trim()) {
                  e.preventDefault(); // chặn xuống dòng mặc định
                  handleSubmit(onSubmit)(); // gọi submit form
                }
              }}
              onPaste={handlePaste}
              disabled={isPending}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

//
export function PreviewMediaMulti({
  mediaItems,
  removeMedia,
}: PreviewMediaProps) {
  const [openCarousel, setOpenCarousel] = useState(false);

  return (
    <>
      {mediaItems?.length > 0 &&
        mediaItems.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => setOpenCarousel(!openCarousel)}
              className="cursor-pointer h-9 w-12 overflow-hidden rounded shadow"
            >
              {item.file_type.startsWith("image/") ? (
                <img
                  src={item.previewUrl}
                  className="h-full w-full object-cover rounded"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-sky-100">
                  <p className="text-xs text-gray-400">Video</p>
                </div>
              )}
            </div>
          );
        })}

      {openCarousel && mediaItems?.length > 0 && (
        <Carousel className="w-[25vw] h-[240px] bg-sky-100 p-4 rounded-2xl absolute bottom-16 right-1/2 translate-x-1/2 hidden md:flex">
          <CarouselContent className="h-full">
            {mediaItems.map((item, i) => (
              <CarouselItem
                key={item.id}
                className="lg:basis-2/3 h-[208px] flex items-center justify-center cursor-grab"
              >
                <Card className="relative w-full h-full overflow-hidden flex items-center justify-center">
                  <WrapIcon
                    className="absolute top-0 left-0 bg-transparent cursor-pointer hover:bg-transparent"
                    onClick={() => removeMedia(item.id)}
                  >
                    <CloseIcon size={16} color="red" />
                  </WrapIcon>
                  <CardContent className="w-full h-full p-0 flex items-center justify-center">
                    {item.file_type.startsWith("image/") ? (
                      <img
                        src={item.previewUrl}
                        className="object-contain rounded"
                        alt={`media-${i}`}
                      />
                    ) : (
                      <video
                        src={item.previewUrl}
                        controls
                        className="object-contain rounded"
                      />
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </>
  );
}

//
export const MessageItem = ({ msg, user }: { msg: IMessage; user: IUser }) => {
  const { attachments } = msg;

  const { setMediaSelected, setMediaList } = useDetailAttachment();

  const navigate = useNavigate();

  const sender = msg.sender as unknown as IUser;
  const isMe = sender._id === user?._id;

  //
  function onPreviewProfile() {
    navigate(`/${sender?.username}`);
  }

  //
  function onClickMedia(media: IMedia) {
    setMediaSelected(media);
    setMediaList(attachments);
  }

  return (
    <div
      key={msg._id}
      className={`flex items-end gap-2 ${
        isMe ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar người khác */}
      {!isMe && (
        <span className="cursor-pointer" onClick={onPreviewProfile}>
          <AvatarMain
            className="w-8 h-8"
            src={sender.avatar?.url}
            alt={sender.name as string}
          />
        </span>
      )}

      <div
        className={cn(
          "flex flex-col w-full",
          isMe ? "items-end" : "items-start",
        )}
      >
        {/* Bong bóng text */}
        {msg.content && (
          <div
            className={cn(
              "px-2 py-1 rounded-xl text-[15px] leading-relaxed shadow-sm max-w-[70%]",
              isMe
                ? "bg-blue-500 text-white rounded-br-none"
                : "bg-gray-100 text-gray-800 rounded-bl-none",
            )}
          >
            <p className="whitespace-pre-line break-words overflow-hidden">
              {msg.content}
            </p>
          </div>
        )}

        {/* Media nằm ngoài box */}
        {attachments?.length > 0 && (
          <div
            className={cn(
              `mt-2 max-w-[70%] flex flex-col gap-y-2`,
              isMe ? "justify-end" : "justify-start",
            )}
          >
            {attachments.map((a, i) => {
              if (a.file_type.startsWith("image/")) {
                return (
                  <img
                    key={i}
                    src={a.url}
                    loading="lazy"
                    alt={a.file_name}
                    onClick={() => onClickMedia(a)}
                    className="w-full object-contain rounded-lg"
                  />
                );
              }

              if (a.file_type.startsWith("video/")) {
                return (
                  <div
                    key={i}
                    onClick={() => onClickMedia(a)}
                    className="overflow-hidden rounded-lg bg-black"
                  >
                    {/* <HLSPlayer src={a.url} /> */}
                    <video
                      src={a.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

//
export function MessageSkeleton() {
  return (
    <div className="col-span-8 h-full flex flex-col animate-pulse">
      {/* Header Skeleton */}
      <div className="p-3 flex items-center justify-between bg-blue-50 border-b">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gray-300 rounded-full" />

          {/* Name and Status */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-300 rounded" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full" />
          <div className="w-8 h-8 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col p-3">
        <div className="pr-4 h-[calc(100vh-250px)] space-y-3">
          {/* Message from other user */}
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0" />
            <div className="space-y-2">
              <div className="h-16 w-64 bg-gray-200 rounded-2xl" />
            </div>
          </div>

          {/* Message from current user */}
          <div className="flex items-start gap-2 justify-end">
            <div className="h-12 w-48 bg-blue-200 rounded-2xl ml-auto" />
          </div>

          {/* Message from other user */}
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0" />
            <div className="space-y-2">
              <div className="h-20 w-72 bg-gray-200 rounded-2xl" />
            </div>
          </div>

          {/* Message from current user */}
          <div className="flex items-start gap-2 justify-end">
            <div className="h-16 w-56 bg-blue-200 rounded-2xl ml-auto" />
          </div>

          {/* Message from other user */}
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0" />
            <div className="space-y-2">
              <div className="h-10 w-40 bg-gray-200 rounded-2xl" />
            </div>
          </div>

          {/* Message from current user */}
          <div className="flex items-start gap-2 justify-end">
            <div className="h-14 w-52 bg-blue-200 rounded-2xl ml-auto" />
          </div>

          {/* Message from other user */}
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0" />
            <div className="space-y-2">
              <div className="h-12 w-60 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Input Area Skeleton */}
        <div className="pt-4 border-t">
          <div className="flex gap-2 items-end">
            {/* Textarea skeleton */}
            <div className="flex-1 h-20 bg-blue-100 rounded-xl" />

            {/* Emoji button */}
            <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />

            {/* Send button */}
            <div className="w-16 h-10 bg-gray-300 rounded-full flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
