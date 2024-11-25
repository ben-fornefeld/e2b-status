import React, { forwardRef, InputHTMLAttributes } from "react";

const baseStyles =
  "bg-transparent border-none outline-none p-0 m-0 focus:outline-none placeholder:text-muted-foreground";

interface SlateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const SlateInput = forwardRef<HTMLInputElement, SlateInputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input ref={ref} className={`${baseStyles} ${className}`} {...props} />
    );
  },
);

SlateInput.displayName = "SlateInput";

interface SlateTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const SlateTextarea = forwardRef<HTMLTextAreaElement, SlateTextareaProps>(
  ({ className = "", ...props }, ref) => {
    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      const textarea = e.currentTarget;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      props.onInput?.(e);
    };

    return (
      <textarea
        ref={ref}
        className={`${baseStyles} ${className} resize-none overflow-hidden`}
        onInput={handleInput}
        rows={1}
        {...props}
      />
    );
  },
);

SlateTextarea.displayName = "SlateTextarea";

export { SlateInput, SlateTextarea };
