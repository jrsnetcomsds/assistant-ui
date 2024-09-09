import { create } from "zustand";
import { ReadonlyStore } from "../ReadonlyStore";

export type EditComposerState = Readonly<{
  // TODO
  /** @deprecated Use `text` instead. */
  value: string;
  /** @deprecated Use `setText` instead. */
  setValue: (value: string) => void;

  text: string;
  setText: (value: string) => void;

  canCancel: boolean;
  isEditing: boolean;
  isEmpty: boolean;

  edit: () => void;
  send: () => void;
  cancel: () => void;
}>;

export const makeEditComposerStore = ({
  onEdit,
  onSend,
}: {
  onEdit: () => string;
  onSend: (text: string) => void;
}): ReadonlyStore<EditComposerState> =>
  create<EditComposerState>()((set, get) => ({
    get value() {
      return get().text;
    },
    setValue(value) {
      get().setText(value);
    },

    text: "",
    setText: (text) => {
      set({ text, isEmpty: text.trim().length === 0 });
    },

    canCancel: false,
    isEditing: false,
    isEmpty: true,

    edit: () => {
      const text = onEdit();
      set({
        isEditing: true,
        canCancel: true,
        isEmpty: text.trim().length === 0,
        text,
      });
    },
    send: () => {
      const text = get().text;
      set({ isEditing: false, canCancel: false });
      onSend(text);
    },
    cancel: () => {
      set({ isEditing: false, canCancel: false });
    },
  }));
