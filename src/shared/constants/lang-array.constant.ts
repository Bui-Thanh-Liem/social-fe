import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { go } from "@codemirror/lang-go";
import { php } from "@codemirror/lang-php";
import { sql } from "@codemirror/lang-sql";
import { markdown } from "@codemirror/lang-markdown";
import { yaml } from "@codemirror/lang-yaml";

//
export const LANG_ARR = [
  { key: "javascript", label: "JavaScript", ext: "js", cm: javascript() },
  {
    key: "typescript",
    label: "TypeScript",
    ext: "ts",
    cm: javascript({ typescript: true }),
  },
  { key: "json", label: "JSON", ext: "json", cm: json() },
  { key: "html", label: "HTML", ext: "html", cm: html() },
  { key: "css", label: "CSS", ext: "css", cm: css() },

  { key: "python", label: "Python", ext: "py", cm: python() },
  { key: "java", label: "Java", ext: "java", cm: java() },
  { key: "go", label: "Go", ext: "go", cm: go() },
  { key: "php", label: "PHP", ext: "php", cm: php() },
  { key: "sql", label: "SQL", ext: "sql", cm: sql() },

  { key: "yaml", label: "YAML", ext: "yml", cm: yaml() },
  { key: "markdown", label: "Markdown", ext: "md", cm: markdown() },
];
