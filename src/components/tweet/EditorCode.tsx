import { EditorView } from "@codemirror/view";
import ReactCodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Expand, Minus, X } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { LANG_ARR } from "~/shared/constants/lang-array.constant";
import type { ICodesTweet } from "~/shared/interfaces/schemas/tweet.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { WrapIcon } from "../WrapIcon";

/* ---------------------------------- */
/* Animation preset (mượt, tự nhiên) */
/* ---------------------------------- */
const spring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 24,
};

/* ---------------------------------- */
/* Copy Button */
/* ---------------------------------- */
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <WrapIcon
      onClick={handleCopy}
      className="rounded bg-zinc-800 hover:bg-zinc-700"
    >
      {copied ? (
        <Check size={12} className="text-green-400" />
      ) : (
        <Copy size={12} className="text-white" />
      )}
    </WrapIcon>
  );
}

/* ---------------------------------- */
/* Editor Item */
/* ---------------------------------- */
export function EditorCodeItem({
  code,
  onClose,
  langKey: _langKey,
  onChangeCode,
  readonly = false,
}: {
  code: string;
  langKey?: string;
  readonly?: boolean;
  onClose: () => void;
  onChangeCode(value: string, langKey: string, viewUpdate: ViewUpdate): void;
}) {
  //
  const LANG_MAP = Object.fromEntries(LANG_ARR.map((l) => [l.key, l.cm]));

  //
  const [isCompact, setIsCompact] = useState(false);
  const [langKey, setLangKey] = useState(_langKey ?? LANG_ARR[0].key);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={spring}
      className={`
        rounded-xl overflow-hidden bg-zinc-900
        ${isCompact ? "w-60" : "w-full"}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-1 bg-black select-none">
        <div
          className="w-3.5 h-3.5 rounded-full bg-red-400 cursor-pointer group/code"
          onClick={onClose}
        >
          <X size={14} color="#fff" className="hidden group-hover/code:block" />
        </div>

        <div
          className="w-3.5 h-3.5 rounded-full bg-yellow-300 cursor-pointer group/code"
          onClick={() => setIsCompact(true)}
        >
          <Minus
            size={14}
            color="#fff"
            className="hidden group-hover/code:block"
          />
        </div>

        <div
          className="w-3.5 h-3.5 rounded-full bg-green-400 cursor-pointer group/code"
          onClick={() => setIsCompact(false)}
        >
          <Expand
            size={14}
            color="#fff"
            className="hidden group-hover/code:block"
          />
        </div>

        <div className="ml-auto">
          <Select onValueChange={(value) => setLangKey(value)} value={langKey}>
            <SelectTrigger
              id="editor-lang"
              disabled={readonly}
              className="w-full h-7 px-2 text-sm rounded-2xl bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANG_ARR.map((option) => (
                <SelectItem key={option.key} value={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <CopyButton code={code} />
      </div>

      {/* Body */}
      <motion.div
        layout
        initial={false}
        animate={{
          height: isCompact ? 0 : "auto",
          opacity: isCompact ? 0 : 1,
        }}
        transition={spring}
        className="overflow-hidden"
      >
        <ReactCodeMirror
          value={code}
          theme="dark"
          minHeight="80px"
          maxHeight="400px"
          readOnly={readonly}
          onChange={(value, viewUpdate) =>
            onChangeCode(value, langKey, viewUpdate)
          }
          extensions={[
            LANG_MAP[langKey],
            EditorView.lineWrapping, // 🔥 QUAN TRỌNG
          ]}
        />
      </motion.div>
    </motion.div>
  );
}

/* ---------------------------------- */
/* Editor List */
/* ---------------------------------- */
export function EditorCode({
  codes,
  onChangeCode,
}: {
  codes: ICodesTweet[];
  onChangeCode: Dispatch<SetStateAction<ICodesTweet[]>>;
}) {
  function onClose(index: number) {
    onChangeCode(codes.filter((_, i) => i !== index));
  }

  function onChangeCodeItem(index: number, value: string, langKey: string) {
    onChangeCode(
      codes.map((item, i) =>
        i === index ? { ...item, code: value, langKey } : item,
      ),
    );
  }

  return (
    <motion.div layout className="flex gap-2 flex-wrap">
      <AnimatePresence mode="popLayout">
        {codes.map((item, index) => (
          <EditorCodeItem
            key={item._id ?? index} // nếu có id thì dùng id
            code={item.code}
            onChangeCode={(value, langKey) =>
              onChangeCodeItem(index, value, langKey)
            }
            onClose={() => onClose(index)}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
