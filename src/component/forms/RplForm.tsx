"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import InputField from "../InputField";
import { RplInputs, RplSchema } from "@/lib/formValidationSchema";
import { createRplTranscript, updateRplTranscript } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputSelect from "../InputSelect";
import { FormProps } from "@/lib/types/formtype";

const RplForm = ({ setOpen, type, data, relatedData }: FormProps) => {
  const { courses, period } = relatedData;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RplInputs>({
    resolver: zodResolver(RplSchema),
    defaultValues: {
      khsDetail: data?.khsDetail || [{ id: "", gradeLetter: "E", weight: 0 }]
    }
  })
  const { fields, remove, append } = useFieldArray({
    control,
    name: "khsDetail",
  })

  const action = type === "create" ? createRplTranscript : updateRplTranscript;
  const [state, formAction] = useActionState(action, { success: false, error: false, message: "" });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data))
  })

  const router = useRouter();
  useEffect(() => {
    if (period === null) {
      toast.error("Tidak ada data periode akademik yang aktif.");
      setOpen(false);
    }
    if (state?.success) {
      toast.success(state?.message.toString());
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type, period])

  return (
    <>
      {period && (
        <form onSubmit={onSubmit} className="flex flex-col gap-8">
          <h1 className="text-xl font-semibold">Form Mata Kuliah Rekognisi Pembelajaran Lampau</h1>

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
                  label="StudentId"
                  name="studentId"
                  defaultValue={type === "update" ? data?.student?.id : ""}
                  register={register}
                  error={errors?.studentId}
                />
                <InputField
                  label="PeriodId"
                  name="periodId"
                  defaultValue={type === "update" ? data?.period?.id : period.id}
                  register={register}
                  error={errors?.studentId}
                />
              </div>
            )}
            <div className="flex flex-col gap-2 w-full md:w-3/5">
              <InputField
                label="Nama Mahasiswa"
                name="name"
                inputProps={{ readOnly: true }}
                defaultValue={type === "update" ? data?.student.name : data?.name}
                register={register}
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-2/6">
              <InputField
                label="NIM"
                name="nim"
                inputProps={{ readOnly: true }}
                defaultValue={type === "update" ? data?.student.nim : data?.nim}
                register={register}
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-3/5">
              <InputField
                label="Jurusan"
                name="major"
                inputProps={{ readOnly: true }}
                defaultValue={type === "update" ? data?.student?.major?.name : data?.major?.name}
                register={register}
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-2/6">
              <InputField
                label="Periode Akademik"
                name="period"
                inputProps={{ readOnly: true }}
                defaultValue={data?.period?.name || period?.name}
                register={register}
              />
            </div>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            Mata Kuliah
          </span>
          <div className="flex justify-between flex-wrap gap-4">
            <div className="flex flex-col gap-6 w-full">
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-wrap items-center justify-start md:justify-between gap-x-4">
                  <div className="w-full">
                    <InputSelect
                      label="Mata Kuliah"
                      name={`khsDetail.${index}.id`}
                      options={courses.map((item: { course: any }) => ({
                        value: item.course.id,
                        label: `${item.course.code} | ${item.course.name} | ${item.course.sks} SKS`,
                      }))}
                      control={control}
                      error={errors?.khsDetail?.[index]?.id}
                      required
                    />
                  </div>
                  <div className="w-full md:w-1/4">
                    <InputField
                      label="Nilai"
                      name={`khsDetail.${index}.gradeLetter`}
                      register={register}
                      error={errors?.khsDetail?.[index]?.gradeLetter}
                      required
                    />
                  </div>
                  <div className="w-full md:w-1/4">
                    <InputField
                      label="Bobot"
                      name={`khsDetail.${index}.weight`}
                      inputProps={
                        {
                          inputMode: "decimal",
                          onInput: (e: FormEvent<HTMLInputElement>) => (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/[^0-9.]/g, '')
                        }}
                      register={register}
                      error={errors?.khsDetail?.[index]?.weight}
                      required
                    />
                  </div>
                  <div className="w-full md:w-1/4 self-end">
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
              onClick={() => append({ id: "", gradeLetter: "E", weight: 0 })}
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
      )}
    </>
  )
}

export default RplForm;