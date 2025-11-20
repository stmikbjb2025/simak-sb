"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { AcademicClassDetailInputs, academicClassDetailSchema } from "@/lib/formValidationSchema";
import { createClassDetail } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputSelect from "../InputSelect";
import { FormProps } from "@/lib/types/formtype";


const ClassDetailForm = ({ setOpen, type, data, relatedData }: FormProps) => {
  const { students } = relatedData;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<AcademicClassDetailInputs>({
    resolver: zodResolver(academicClassDetailSchema)
  })
  const [state, formAction] = useActionState(createClassDetail, { success: false, error: false, message: "" });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data))
  })

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message.toString());
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type])

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold w-[95%]">Tambah data mahasiswa di kelas {data.name}</h1>

      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <div className="hidden">
            <InputField
              label="classId"
              name="classId"
              defaultValue={data?.id}
              register={register}
              error={errors?.classId}
            />
          </div>
        )}
        <div className="flex flex-col gap-2 w-full">
          <InputSelect
            control={control}
            name="students"
            defaultValue={data?.students}
            placeholder="Pilih Mahasiswa"
            error={Array.isArray(errors.students) ? errors.students[0] : errors.students}
            options={students.map((student: any) => ({
              value: `${student.id}`,
              label: `${student.nim} ${student.name}`,
            }))}
            isMulti={true}
            label="Mahasiswa"
            required={true}
          />
        </div>
      </div>
      {state?.error && (<span className="text-xs text-red-400">{state.message.toString()}</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default ClassDetailForm;