import { Controller, FieldError } from "react-hook-form";
import Select from "react-select";

interface Option {
  value: string | number;
  label: string;
}

interface InputSelectProps {
  label: string;
  name: string;
  defaultValue?: string | number | string[] | number[];
  options: Option[];
  control: any;
  error?: FieldError;
  required?: boolean;
  placeholder?: string;
  isMulti?: boolean;
}

const InputSelect = (
  {
    label, name, defaultValue, options, control, error, required, placeholder, isMulti = false
  }: InputSelectProps) => {

  return (
    <>
      <label className={required ? "text-xs text-gray-500 after:content-['_(*)'] after:text-red-400" : "text-xs text-gray-500"}>{label}</label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Select
            {...field}
            isMulti={isMulti}
            options={options}
            isClearable={true}
            className="text-sm rounded-md"
            placeholder={placeholder || "Search"}
            classNamePrefix="react-select"
            onChange={(selected) => {
              if (isMulti) {
                field.onChange((selected as Option[]).map((opt) => opt.value));
              } else {
                field.onChange((selected as Option | null)?.value || "");
              }
            }}
            value={
              isMulti
                ? options.filter((opt) => (field.value || []).includes(opt.value))
                : options.find((opt) => opt.value === field.value)
            }
          />
        )}
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString() === "Expected number, received nan" ? `Pilih ${label}` : error.message.toString()}</p>
      )}
    </>
  )
}

export default InputSelect;