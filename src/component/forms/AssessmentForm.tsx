"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import InputField from "../InputField";
import { AssessmentInputs, assessmentSchema } from "@/lib/formValidationSchema";
import { createAssessment, updateAssessment } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputSelect from "../InputSelect";
import { FormProps } from "@/lib/types/formtype";


const AssessmentForm = ({ setOpen, type, data, relatedData }: FormProps) => {
  const { allGradeComponent } = relatedData;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AssessmentInputs>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      name: data?.name || "",
      gradeComponents: data?.gradeComponents || [{ id: "", percentage: 0 }]
    }
  })
  const { fields, remove, append } = useFieldArray({
    control,
    name: "gradeComponents",
  })

  const action = type === "create" ? createAssessment : updateAssessment;
  const [state, formAction] = useActionState(action, { success: false, error: false, message: "" });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data))
  })

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(state?.message.toString());
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type])

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data penilaian baru" : "Ubah data penilaian"}</h1>

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
          </div>
        )}
        <div className="flex flex-col gap-2 w-full">
          <InputField
            label="Penilaian"
            name="name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
          />
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Komponen Nilai
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-wrap items-center justify-start md:justify-between gap-4">
              <div className="w-full md:w-5/12">
                <InputSelect
                  label="Komponen Nilai"
                  name={`gradeComponents.${index}.id`}
                  options={allGradeComponent.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  control={control}
                  error={errors?.gradeComponents?.[index]?.id}
                  required
                />
              </div>
              <div className="w-3/12">
                <InputField
                  label="Persentase"
                  name={`gradeComponents.${index}.percentage`}
                  register={register}
                  error={errors?.gradeComponents?.[index]?.percentage}
                  required
                />
              </div>
              <div className="w-3/12 self-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-slate-100 text-sm bg-red-500 py-2 w-full rounded-md"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => append({ id: "", percentage: 0 })}
          className="text-slate-100 text-sm bg-blue-500 py-2 px-4 rounded-md"
        >
          + Tambah Komponen
        </button>
      </div>
      {state?.error && (<span className="text-xs text-red-400">{state?.message}</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default AssessmentForm;