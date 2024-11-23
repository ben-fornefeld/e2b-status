import { useEditor, MilkdownProvider, Milkdown } from "@milkdown/react";
import { defaultValueCtx, Editor, rootCtx } from "@milkdown/core";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { nord } from "@milkdown/theme-nord";
import { commonmark } from "@milkdown/preset-commonmark";
import { FC } from "react";

interface MilkdownEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MilkdownEditorCore: FC<MilkdownEditorProps> = ({
  initialValue,
  onChange,
}) => {
  const { get } = useEditor((root) =>
    Editor.make()
      .config(nord)
      .config((ctx) => {
        ctx.set(rootCtx, root);
      })
      .use(commonmark)
      .config((ctx) => {
        ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
          if (markdown !== prevMarkdown) {
            onChange(markdown);
          }
        });
        /*         ctx.set(defaultValueCtx, initialValue); */
      })
      .use(listener),
  );

  return <Milkdown />;
};

export const MilkdownEditor: FC<MilkdownEditorProps> = (props) => {
  return (
    <MilkdownProvider>
      <MilkdownEditorCore {...props} />
    </MilkdownProvider>
  );
};
