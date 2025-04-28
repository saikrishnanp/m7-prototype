import React, { useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import chevron from "src/assets/chevronIcon.svg";
import styles from "./TestPlanEditor.module.scss";

interface ComboboxComponentProps {
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
}

export const ComboboxComponent: React.FC<ComboboxComponentProps> = ({
  value,
  options,
  placeholder = "",
  onChange,
}) => {
  const [filter, setFilter] = useState<string>("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Combobox value={value} onChange={onChange} onClose={() => setFilter("")}>
      <ComboboxButton className="flex flex-row">
        <ComboboxInput
          displayValue={(value: string) => value}
          className={clsx(styles.textField, "border-none")}
          placeholder={placeholder}
          onChange={(event) => setFilter(event.target.value)}
        />
        <img className={styles.chevIcon} src={chevron} alt="chevron" />
      </ComboboxButton>
      <ComboboxOptions
        anchor="bottom"
        className="border border-gray-400 bg-amber-50"
      >
        {filteredOptions.map((option) => (
          <ComboboxOption
            key={option}
            value={option}
            className="data-[focus]:bg-blue-100"
          >
            {option}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
};
