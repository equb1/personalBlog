import { PreviewThemes } from "md-editor-rt";

export type ThemeConfig = {
  editor: 'light' | 'dark';
  preview: PreviewThemes;
  code: string;
};