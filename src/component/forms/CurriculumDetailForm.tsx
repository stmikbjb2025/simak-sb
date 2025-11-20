"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { FieldError, useForm } from "react-hook-form";
import InputField from "../InputField";
import { CurriculumDetailInputs, curriculumDetailSchema } from "@/lib/formValidationSchema";
import { createCurriculumDetail } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputSelect from "../InputSelect";
import { FormProps } from "@/lib/types/formtype";


const CurriculumDetailForm = ({ setOpen, type, data, relatedData }: FormProps) => {
  const { courses, semesterInt } = relatedData;

  const courseFilter = courses.filter((course: any) => course.majorId === data?.majorId);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CurriculumDetailInputs>({
    resolver: zodResolver(curriculumDetailSchema)
  })

  const [state, formAction] = useActionState(createCurriculumDetail, { success: false, error: false, message: "" });

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
      <h1 className="text-xl font-semibold w-11/12 flex-wrap">{type === "create" ? `Tambah data mata kuliah di ${data.name}` : "Ubah data kurikulum"}</h1>

      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <div className="hidden">
            <InputField
              label="id"
              name="id"
              defaultValue={data?.id}
              register={register}
              error={errors?.id}
            />
            <InputField
              label="curriculumId"
              name="curriculumId"
              defaultValue={data?.curriculumId}
              register={register}
              error={errors?.curriculumId}
            />
          </div>
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <InputSelect
            label="Semester"
            name="semester"
            control={control}
            error={errors?.semester}
            defaultValue={data?.semester || 0}
            required={true}
            options={semesterInt.map((item: any) => ({
              value: item,
              label: `Semester ${item}`,
            }))}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <InputSelect
            label="Mata Kuliah"
            name="courseId"
            control={control}
            error={errors?.courseId as FieldError}
            defaultValue={data?.courseId || []}
            isMulti={true}
            required={true}
            options={courseFilter.map((course: any) => ({
              value: course.id,
              label: `(${course.code})  ${course.name}`,
            }))}
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

export default CurriculumDetailForm;