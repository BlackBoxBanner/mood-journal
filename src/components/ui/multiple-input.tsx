"use client";
import {useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {Cross1Icon} from "@radix-ui/react-icons";
import {cn} from "@/lib/utils";

type MultipleInputProps = {
  onChanges?: (values: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  className?: string;
  repeatable?: boolean;
};

const MultiValueInput = ({
                           repeatable = true,
                           className,
                           placeholder,
                           onChanges,
                           defaultValue = [],
                         }: MultipleInputProps) => {
  const [selected, setSelected] = useState<string[]>(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const random = Math.random();

  useEffect(() => {
    onChanges?.(selected);
  }, [onChanges, selected]);

  return (
    <>
      <Input
        placeholder={placeholder}
        className={className}
        onKeyDownCapture={(e) => {
          if (!inputRef.current) return;

          const inputValue = inputRef.current.value;

          console.log(e.code)

          if (e.code === "Tab" && inputValue === "") return

          if (e.code === "Tab" || e.code === "Space" || e.code === "Enter" && inputValue.trim() !== "") {
            e.preventDefault();
            if(inputValue === "") return
            if (!repeatable && selected.includes(inputValue.trim())) {
              return (inputRef.current.value = "");
            }
            setSelected([...selected, inputRef.current.value.trim()]);
            return (inputRef.current.value = "");
          }

          if (e.key === "Backspace" && inputValue.trim() === "") {
            setSelected(selected.slice(0, -1));
          }
        }}
        ref={inputRef}
      />
      <div
        className={cn(
          "flex gap-2 max-h-[4rem] overflow-auto flex-wrap",
          selected.length === 0 && "hidden"
        )}
      >
        {selected.map((item, index) => {
          return (
            <div
              key={`${random}-${index}`}
              className="flex items-center justify-start gap-2 bg-primary-foreground rounded px-1"
            >
              <p>{item}</p>
              <button
                type="button"
                onClick={() => {
                  setSelected(selected.filter((_, i) => i !== index));
                }}
                tabIndex={-1}
              >
                <Cross1Icon/>
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MultiValueInput;
