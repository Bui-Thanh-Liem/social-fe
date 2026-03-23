import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Terminal, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateTweet } from "~/apis/useFetchTweet";
import { useUploadMedia } from "~/apis/useFetchUpload";
import { EmojiSelector } from "~/components/EmojiPicker";
import { TweetAudience } from "~/components/tweet/TweetAudience";
import { WrapIcon } from "~/components/WrapIcon";
import { useEmojiInsertion } from "~/hooks/useEmojiInsertion";
import { useMediaPreviewMulti } from "~/hooks/useMediaPreviewMulti";
import { useTextareaAutoResize } from "~/hooks/useTextareaAutoResize";
import { cn } from "~/lib/utils";
import { CONSTANT_MAX_LENGTH_CONTENT } from "~/shared/constants";
import { LANG_ARR } from "~/shared/constants/lang-array.constant";
import {
  CreateTweetDtoSchema,
  type CreateTweetDto,
} from "~/shared/dtos/req/tweet.dto";
import type { ResCreateTweet } from "~/shared/dtos/res/tweet.dto";
import { ETweetAudience } from "~/shared/enums/common.enum";
import { ETweetType } from "~/shared/enums/type.enum";
import type {
  IMedia,
  PreviewMediaProps,
} from "~/shared/interfaces/schemas/media.interface";
import type {
  ICodesTweet,
  ITweet,
} from "~/shared/interfaces/schemas/tweet.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useReloadStore } from "~/store/useReloadStore";
import { useUserStore } from "~/store/useUserStore";
import { handleResponse, toastSimple } from "~/utils/toast";
import { BgColorTweet } from "./BgColorTweet";
import { TweetItem } from "../list-tweets/ItemTweet";
import { TextColorTweet } from "./TextColorTweet";
import { AvatarMain } from "../ui/avatar";
import { ButtonMain } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { CircularProgress } from "../ui/circular-progress";
import { EditorCode } from "./EditorCode";
import { HashtagSuggest } from "./HashtagSuggest";
import { Mentions } from "./Mentions";
import { TweetCommunity } from "./TweetCommunity";
import { Embed } from "./Embed";
import { MediaEmbed } from "../embed/MediaEmbed";

// Constants
const DEFAULT_VALUES: CreateTweetDto = {
  content: "",
  embed_code: "",
  type: ETweetType.Tweet,
  audience: ETweetAudience.Everyone,
};

//
export function Tweet({
  tweet,
  community,
  onSuccess,
  contentBtn = "Đăng Bài",
  tweetType = ETweetType.Tweet,
  placeholder = "Có chuyện gì thế ? @liemdev, #developer",
}: {
  tweet?: ITweet;
  placeholder?: string;
  contentBtn?: string;
  community?: string;
  tweetType?: ETweetType;
  onSuccess?: (res?: ResCreateTweet) => void;
}) {
  const { user } = useUserStore();
  const apiCreateTweet = useCreateTweet();
  const apiUploadMedia = useUploadMedia();

  //
  const { triggerReload } = useReloadStore();

  // Hashtag
  const [openHashtag, setOpenHashtag] = useState(false);
  const [searchHashtag, setSearchHashtag] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [codes, setCodes] = useState<ICodesTweet[]>([]);

  // Mentions
  const [mentionIds, setMentionIds] = useState<string[]>([]);
  const [openMentions, setOpenMentions] = useState(false);
  const [searchMentions, setSearchMentions] = useState("");

  //
  const [embedCode, setEmbedCode] = useState("");

  const { textareaRef, autoResize } = useTextareaAutoResize();
  const [audience, setAudience] = useState<ETweetAudience>(
    ETweetAudience.Everyone,
  );
  const [communityId, setCommunityId] = useState(community || "");

  const { insertEmoji } = useEmojiInsertion(textareaRef);

  const { mediaItems, handleFileChange, removeMedia } = useMediaPreviewMulti();

  const [isUploading, setIsUploading] = useState(false);

  //
  const {
    watch,
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateTweetDto>({
    resolver: zodResolver(CreateTweetDtoSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange", // Enable real-time validation
  });

  // Watch content for real-time updates
  const contentValue = watch("content");

  // Memoized handlers
  const handleEmojiClick = useCallback(
    (emoji: string) => {
      const newContent = insertEmoji(emoji, contentValue);
      setValue("content", newContent);
    },
    [insertEmoji, contentValue, setValue],
  );

  //
  function onChoseBackground(bg: string) {
    setBgColor(bg);
  }

  function onChoseTextColor(text: string) {
    setTextColor(text);
  }

  //
  const handleTextareaInput = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => {
      const textarea = e.currentTarget;
      const newValue = autoResize(textarea, 30);
      if (newValue !== contentValue) {
        setValue("content", newValue);
      }

      // 🔎 Lấy caret position
      const cursorPos = textarea.selectionStart ?? 0;
      // Lấy phần text trước caret
      const beforeCaret = textarea.value.slice(0, cursorPos);
      // Cắt thành các từ theo khoảng trắng
      const words = beforeCaret.split(/\s/);
      // Lấy từ cuối cùng
      const currentWord = words[words.length - 1];

      // Nếu từ hiện tại bắt đầu bằng #/@
      if (currentWord.startsWith("#") && currentWord.length > 1) {
        setSearchHashtag(currentWord);
        setOpenHashtag(true);
      } else if (currentWord.startsWith("@") && currentWord.length > 1) {
        setSearchMentions(currentWord);
        setOpenMentions(true);
      } else {
        setOpenMentions(false);
        setOpenHashtag(false);
      }
    },
    [autoResize, setValue, contentValue],
  );

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

  // Thực hiện khi gọi api thành cong từ onSubmit
  const successForm = useCallback(
    (res: ResCreateTweet) => {
      reset(DEFAULT_VALUES);
      removeMedia(); // Clear media after successful submission
      setMentionIds([]);
      triggerReload();
      setTextColor("");
      setBgColor("");
      setCodes([]);

      // ⭐ Reset chiều cao textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      if (onSuccess) onSuccess(res); // Sử dụng cho bên ngoài component cha (VD: đống modal)
    },
    [removeMedia, reset, onSuccess, setTextColor, setBgColor],
  );

  // Select hashtag
  function handleSelectHashtag(name: string) {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart ?? 0;

    // Thay thế từ hashtag hiện tại bằng hashtag được chọn
    const newValue = contentValue.replace(searchHashtag, `#${name}`);
    setValue("content", newValue);

    // Focus lại textarea
    requestAnimationFrame(() => {
      textarea.focus();

      // Tính lại vị trí con trỏ sau khi thay hashtag
      const newCursorPos = cursorPos - searchHashtag.length + `#${name}`.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    });

    setSearchHashtag("");
    setOpenHashtag(false);
  }

  // Select mentions
  function handleSelectMentions(
    user: Pick<IUser, "_id" | "name" | "username">,
  ) {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart ?? 0;

    // Thay thế từ hashtag hiện tại bằng hashtag được chọn
    const newValue = contentValue.replace(searchMentions, user.username!);
    setValue("content", newValue);

    // Focus lại textarea
    requestAnimationFrame(() => {
      textarea.focus();

      // Tính lại vị trí con trỏ sau khi thay hashtag
      const newCursorPos =
        cursorPos - searchMentions.length + user.username!.length;

      textarea.setSelectionRange(newCursorPos, newCursorPos);
    });

    setSearchMentions("");
    setOpenMentions(false);
    setMentionIds((prev) => [...prev, user._id]);
  }

  // Add code block
  function onAddCode() {
    const newCode: ICodesTweet = {
      _id: Date.now().toString(),
      code: "",
      langKey: LANG_ARR[0].key,
    };
    setCodes((prev) => [...prev, newCode]);
  }

  // Handle change embed code
  function handleEmbedChange(value: string) {
    setEmbedCode(value);
  }

  // Thực hiện gọi api đăng bài
  const onSubmit = useCallback(
    async (data: CreateTweetDto) => {
      try {
        setIsUploading(true);
        let medias: IMedia[] = [];
        const selectedFiles = mediaItems.map((file) => file.file);

        // Upload media first if file is selected and not already uploaded
        if (selectedFiles.length > 0) {
          try {
            const resUploadMedia =
              await apiUploadMedia.mutateAsync(selectedFiles);

            if (resUploadMedia.statusCode !== 200 || !resUploadMedia.metadata) {
              handleResponse(resUploadMedia);
              return;
            }

            medias = resUploadMedia.metadata;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (err) {
            toastSimple((err as { message: string }).message, "error");
            return;
          }
        }

        // Lọc lấy hashtag
        const hashtags = data.content.match(/#[\w.]+/g) || [];

        // Nếu có community_id thì audience là mọi người

        //
        const tweetData: CreateTweetDto = {
          ...data,
          ...(tweet?._id && { parent_id: tweet?._id }), // Nếu có giá trị thì không phải tweet chính
          audience,
          hashtags,
          bgColor,
          textColor,
          type: tweetType,
          content: data.content,
          embed_code: embedCode,
          mentions: mentionIds,
          ...(communityId && {
            community_id: communityId,
            audience: ETweetAudience.Everyone,
          }),
          medias:
            medias.map((m) => ({
              s3_key: m.s3_key || "",
              url: m?.url || "",
            })) || undefined,
          codes: codes.length ? codes : undefined,
        };

        const resCreateTweet = await apiCreateTweet.mutateAsync(tweetData);

        handleResponse(resCreateTweet, () => {
          successForm(resCreateTweet.metadata!);
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        handleResponse({
          statusCode: 500,
          message: "Có lỗi xảy ra khi đăng bài",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [
      user?.verify,
      mediaItems,
      tweet?._id,
      audience,
      bgColor,
      textColor,
      tweetType,
      mentionIds,
      communityId,
      apiCreateTweet,
      apiUploadMedia,
      successForm,
    ],
  );

  // Computed values
  const isContentEmpty = !contentValue?.trim();
  const isFormDisabled = isContentEmpty || isSubmitting || isUploading;

  // Tạo id duy nhất dựa trên instance, ví dụ với nanoid hoặc Math.random()
  const [inputId] = useState(
    () => `image-upload-${tweetType}-${Math.random()}`,
  );

  const isTweetType = tweetType === ETweetType.Tweet;
  const isReQuoteType = tweetType === ETweetType.QuoteTweet;
  const isCommentType = tweetType === ETweetType.Comment;

  //
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex gap-4">
        <AvatarMain src={user?.avatar?.url} alt={user?.name} />
        <div className="flex-1 mt-2">
          <textarea
            {...register("content")}
            ref={textareaRef}
            autoComplete="off"
            value={contentValue}
            autoCorrect="off"
            spellCheck="false"
            className="w-full min-h-[40px] max-h-96 resize-none outline-none text-lg bg-transparent placeholder-gray-500 rounded-2xl px-3 py-1"
            style={{ color: textColor, background: bgColor }}
            placeholder={placeholder}
            maxLength={CONSTANT_MAX_LENGTH_CONTENT}
            onInput={handleTextareaInput}
            onPaste={handlePaste}
            onClick={(e) => e.stopPropagation()}
          />

          <EditorCode codes={codes} onChangeCode={setCodes} />

          {/* Embed Code */}
          {embedCode && <MediaEmbed url={embedCode} />}

          {/* Hashtag Suggest */}
          <HashtagSuggest
            open={openHashtag}
            setOpen={setOpenHashtag}
            valueSearch={searchHashtag}
            oncSelect={handleSelectHashtag}
          >
            <div />
          </HashtagSuggest>

          {/* Mentions */}
          <Mentions
            open={openMentions}
            setOpen={setOpenMentions}
            valueSearch={searchMentions}
            onSelect={handleSelectMentions}
          >
            <div />
          </Mentions>

          {/* Media preview */}
          <PreviewMediaMulti
            mediaItems={mediaItems}
            removeMedia={removeMedia}
          />

          <div
            className={cn(
              "my-3 flex justify-between md:items-center gap-2 flex-col md:flex-row",
              isCommentType ? "hidden" : "",
            )}
          >
            {/*  */}
            {(isTweetType || isReQuoteType) && (
              <TweetCommunity
                onchange={setCommunityId}
                communityId={communityId}
              />
            )}

            {/*  */}
            {((!communityId && isTweetType) ||
              (!communityId && isReQuoteType)) && (
              <TweetAudience onChangeAudience={setAudience} />
            )}
          </div>

          {/*  */}
          {isReQuoteType && tweet && (
            <div className="w-ful mt-1 rounded-3xl border overflow-hidden">
              <TweetItem
                isAction={false}
                tweet={tweet}
                onSuccessDel={() => {}}
              />
            </div>
          )}
          <div
            className={cn(
              "w-full border-b border-gray-200 mt-3",
              isCommentType && "mt-0",
            )}
          />

          <div
            className={cn(
              "flex flex-col lg:flex-row justify-between gap-y-2 lg:items-center -ml-2 my-2 bg-white",
              isReQuoteType ? "" : "",
            )}
          >
            <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
              <WrapIcon className="hover:bg-blue-100/60">
                <label
                  htmlFor={inputId}
                  className="cursor-pointer"
                  title="Thêm ảnh hoặc video"
                >
                  <ImagePlus color="#1d9bf0" size={20} />
                  <input
                    multiple
                    type="file"
                    id={inputId}
                    className="hidden"
                    disabled={isUploading}
                    onChange={handleFileSelect}
                    accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/mov,video/avi,video/quicktime"
                  />
                </label>
              </WrapIcon>

              <WrapIcon className="hover:bg-blue-100/60">
                <EmojiSelector onEmojiClick={handleEmojiClick} />
              </WrapIcon>

              <WrapIcon className="hover:bg-blue-100/60">
                <BgColorTweet onChose={onChoseBackground} />
              </WrapIcon>

              <WrapIcon className="hover:bg-blue-100/60">
                <TextColorTweet onChose={onChoseTextColor} />
              </WrapIcon>

              <WrapIcon className="hover:bg-blue-100/60" onClick={onAddCode}>
                <Terminal color="#1d9bf0" size={20} />
              </WrapIcon>

              <WrapIcon className="hover:bg-blue-100/60">
                <Embed onChange={handleEmbedChange} value={embedCode} />
              </WrapIcon>
            </div>

            <div className="flex items-center gap-3 ml-2 lg:ml-0">
              {/* Character count indicator */}

              <CircularProgress
                value={contentValue?.length || 0}
                max={CONSTANT_MAX_LENGTH_CONTENT}
                size={18}
                strokeWidth={2}
              />

              <ButtonMain
                type="submit"
                loading={isUploading}
                disabled={isFormDisabled}
              >
                {contentBtn}
              </ButtonMain>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

//
export function PreviewMediaMulti({
  mediaItems,
  removeMedia,
}: PreviewMediaProps) {
  if (!mediaItems.length) {
    return null;
  }

  return (
    <Carousel className="w-full mt-3">
      <CarouselContent className="h-80 cursor-grab">
        {mediaItems.map((item, i) => (
          <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/2">
            <Card className="relative w-full h-full overflow-hidden flex items-center justify-center border">
              <WrapIcon
                className="absolute top-0 right-0 bg-transparent cursor-pointer hover:bg-transparent"
                onClick={() => removeMedia(item.id)}
              >
                <X size={16} color="red" />
              </WrapIcon>
              <CardContent className="w-full h-full p-0 flex items-center justify-center">
                {item.file_type.includes("image/") ? (
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
  );
}
