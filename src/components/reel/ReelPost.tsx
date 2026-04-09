import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useMediaPreviewMulti } from "~/hooks/useMediaPreviewMulti";
import { useTextareaAutoResize } from "~/hooks/useTextareaAutoResize";
import { CONSTANT_MAX_LENGTH_CONTENT_REEL } from "~/shared/constants";
import {
  CreateReelDtoSchema,
  type CreateReelDto,
} from "~/shared/dtos/req/reel.dto";
import { EReelStatus } from "~/shared/enums/status.enum";
import { EReelType } from "~/shared/enums/type.enum";
import { HashtagSuggest } from "../tweet/HashtagSuggest";
import { Mentions } from "../tweet/Mentions";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import type { ResCreateReel } from "~/shared/dtos/res/reel.dto";
import { useUploadMedia } from "~/apis/useFetchUpload";
import { handleResponse, toastSimple } from "~/utils/toast";
import type { IMedia } from "~/shared/interfaces/schemas/media.interface";
import { useCreateReel } from "~/apis/useFetchReel";
import { AvatarMain } from "../ui/avatar";
import { useUserStore } from "~/store/useUserStore";
import { WrapIcon } from "../WrapIcon";
import { Plus, Volume2, VolumeX } from "lucide-react";
import { Card } from "../ui/card";
import { ButtonMain } from "../ui/button";

// Constants
const DEFAULT_VALUES: CreateReelDto = {
  content: "",
  type: EReelType.Story,
  status: EReelStatus.Ready,
};

export function ReelPost({
  onSuccess,
}: {
  onSuccess?: (res: ResCreateReel) => void;
}) {
  //
  const {
    watch,
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateReelDto>({
    resolver: zodResolver(CreateReelDtoSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange", // Enable real-time validation
  });

  //
  const { user } = useUserStore();

  //
  const apiUploadMedia = useUploadMedia();
  const apiCreateReel = useCreateReel();

  //
  const [isMuted, setIsMuted] = useState(true);

  //
  const [isUploading, setIsUploading] = useState(false);

  // Hashtag
  const [openHashtag, setOpenHashtag] = useState(false);
  const [searchHashtag, setSearchHashtag] = useState("");

  // Mentions
  const [mentionIds, setMentionIds] = useState<string[]>([]);
  const [openMentions, setOpenMentions] = useState(false);
  const [searchMentions, setSearchMentions] = useState("");

  //
  const { mediaItems, handleFileChange, removeMedia } = useMediaPreviewMulti();
  const { textareaRef, autoResize } = useTextareaAutoResize();

  // Watch content for real-time updates
  const contentValue = watch("content");

  // Tạo id duy nhất dựa trên instance, ví dụ với nanoid hoặc Math.random()
  const [inputId] = useState(() => `video-upload-reel-${Math.random()}`);

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

  // Thực hiện khi gọi api thành cong từ onSubmit
  const successForm = useCallback(
    (res: ResCreateReel) => {
      reset(DEFAULT_VALUES);
      removeMedia(); // Clear media after successful submission
      setMentionIds([]);

      // ⭐ Reset chiều cao textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      if (onSuccess) onSuccess(res); // Sử dụng cho bên ngoài component cha (VD: đống modal)
    },
    [removeMedia, reset, onSuccess],
  );

  //
  const isContentEmpty = !contentValue?.trim();
  const isFormDisabled = isContentEmpty || isSubmitting || isUploading;
  const mediaItem = mediaItems[mediaItems.length - 1] || null;

  // Thực hiện gọi api đăng bài
  const onSubmit = useCallback(
    async (data: CreateReelDto) => {
      try {
        setIsUploading(true);
        let medias: IMedia[] = [];

        // Upload media first if file is selected and not already uploaded
        if (mediaItem.file) {
          try {
            const resUploadMedia = await apiUploadMedia.mutateAsync([
              mediaItem.file,
            ]);

            if (resUploadMedia.statusCode !== 200 || !resUploadMedia.metadata) {
              handleResponse(resUploadMedia);
              return;
            }

            medias = resUploadMedia.metadata;
          } catch (err) {
            toastSimple((err as { message: string }).message, "error");
            return;
          }
        }

        // Lọc lấy hashtag
        const hashtags = data.content.match(/#[\w.]+/g) || [];

        // Chuẩn bị data để gửi lên API
        const reelData: CreateReelDto = {
          ...data,
          hashtags,
          type: EReelType.Reel,
          content: data.content,
          mentions: mentionIds,
          video:
            medias.map((m) => ({
              s3_key: m.s3_key || "",
              url: m?.url || "",
            })) || undefined,
        };

        const resCreateReel = await apiCreateReel.mutateAsync(reelData);

        handleResponse(resCreateReel, () => {
          successForm(resCreateReel.metadata!);
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        handleResponse({
          statusCode: 500,
          message: "Có lỗi xảy ra khi tạo tin",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [mediaItem, mentionIds, apiUploadMedia, successForm],
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex gap-x-4">
        <AvatarMain src={user?.avatar?.url} alt={user?.name} />
        <textarea
          {...register("content")}
          ref={textareaRef}
          autoComplete="off"
          value={contentValue}
          autoCorrect="off"
          spellCheck="false"
          className="w-full max-h-96 resize-none outline-none text-lg bg-transparent placeholder-gray-500 rounded-2xl px-3 py-1"
          placeholder={"Bạn đang nghĩ gì về điều gì đó?"}
          maxLength={CONSTANT_MAX_LENGTH_CONTENT_REEL}
          onInput={handleTextareaInput}
          onPaste={handlePaste}
          onClick={(e) => e.stopPropagation()}
        />
        <label htmlFor={inputId} className="cursor-pointer" title="Thêm video">
          {/*  */}
          <Card className="p-0 overflow-hidden border-none relative group rounded-xl h-62 w-40 flex bg-gray-100">
            {mediaItem ? (
              <>
                <video
                  autoPlay // Tự động phát
                  muted={isMuted} // Bắt buộc phải có để autoPlay hoạt động
                  loop // Lặp lại
                  playsInline
                  src={mediaItem?.previewUrl}
                  className="w-full h-full object-contain my-auto transition-all duration-500 ease-out scale-[1.05] loop cursor-pointer"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="absolute bottom-2 right-2 z-20 p-.5 bg-black/20 rounded-full text-white 
                   transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </>
            ) : (
              <div className="flex h-full">
                <WrapIcon className="m-auto">
                  <Plus size={20} />
                </WrapIcon>
              </div>
            )}
          </Card>

          <input
            multiple
            type="file"
            id={inputId}
            className="hidden"
            disabled={isUploading}
            onChange={handleFileSelect}
            accept="video/mp4,video/webm,video/mov,video/avi,video/quicktime"
          />
        </label>
      </div>

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

      <div className="flex justify-end mt-4">
        <ButtonMain
          type="submit"
          loading={isUploading}
          disabled={isFormDisabled}
        >
          Đăng tin
        </ButtonMain>
      </div>
    </form>
  );
}
