"use client";
import {useEffect, useState} from "react";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "./label";

type MultipleSelectProps = {
  onChanges?: (values: string[]) => void;
  option: string[];
  defaultValue?: string[]
};

const MultiValueSelection = ({onChanges, option,defaultValue = []}: MultipleSelectProps) => {
  const [selected, setSelected] = useState<string[]>(defaultValue);

  const random = Math.random();

  useEffect(() => {
    onChanges?.(selected);
  }, [onChanges, selected]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {option.map((item, index) => {
          return (
            <Label
              key={`${random}-${index}`}
              className="flex items-center gap-2"
            >
              <Checkbox
                checked={selected.includes(item)}
                onCheckedChange={(e) => {
                  if (e) {
                    setSelected([...selected, item]);
                  } else {
                    setSelected(selected.filter((i) => i !== item));
                  }
                }}
              />
              <span>{item}</span>
            </Label>
          );
        })}
      </div>
    </>
  );
};

export default MultiValueSelection;
