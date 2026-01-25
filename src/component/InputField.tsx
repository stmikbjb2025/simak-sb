import { FieldError } from "react-hook-form";

interface InputFieldProps {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  required?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
  required,
}: InputFieldProps) => {
  return (
    <>
      <label className={required ? "text-xs text-gray-500 after:content-['_(*)'] after:text-red-400" : "text-xs text-gray-500"}>{label}</label>
      <input
        type={type}
        {...register(name)}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full disabled:text-gray-800 disabled:ring-gray-500 disabled:bg-gray-200"
        {...inputProps}
        defaultValue={defaultValue}
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </>
  )
}

export default InputField;