"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useCallback, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import InputField from "../InputField";
import { createReregisterDetail, updateReregisterDetail } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Select from "react-select";
import { ReregistrationDetailInputs, reregistrationDetailSchema } from "@/lib/formValidationSchema";
import moment from "moment";
import { status } from "@/lib/setting";
import InputSelect from "../InputSelect";
import { FormProps } from "@/lib/types/formtype";

const ReregiterCreateOneForm = ({ setOpen, type, data, relatedData }: FormProps) => {
  const { students, lecturers, role } = relatedData;
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<ReregistrationDetailInputs>({
    resolver: zodResolver(reregistrationDetailSchema.omit({ paymentReceiptFile: true }))
  })

  const action = type === "create" ? createReregisterDetail : updateReregisterDetail;
  const [state, formAction] = useActionState(action, { success: false, error: false, message: "" });

  const onValid = useCallback(() => {
    formRef.current?.requestSubmit()
  }, [])

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message.toString());
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type])

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data herregistrasi mahasiswa baru" : "Ubah data herregister mahasiswa"}</h1>
      <span className="text-xs text-gray-400 font-medium">
        Informasi Mahasiswa
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <div className="hidden">
            <InputField
              label="reregisterId"
              name="reregisterId"
              defaultValue={data?.reregisterId || data?.idReregister}
              register={register}
              error={errors?.reregisterId}
            />
            <InputField
              label="studentId"
              name="studentId"
              defaultValue={data?.studentId}
              inputProps={{ disabled: type === 'create' && true }}
              register={register}
              error={errors?.studentId}
            />
            <InputField
              label="lecturerId"
              name="lecturerId"
              defaultValue={data?.student?.lecturerId}
              inputProps={{ disabled: type === 'create' && true }}
              register={register}
              error={errors?.lecturerId}
            />
          </div>
        )}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Mahasiswa</label>
          <Controller
            name="studentId"
            control={control}
            defaultValue={data?.studentId || ""}
            render={({ field }) => (
              <Select
                {...field}
                options={students.map((student: any) => ({
                  value: student.id,
                  label: `${student.nim} - ${student.name}`,
                }))}
                isClearable
                isDisabled={type === "update" && true}
                placeholder="-- Pilih Mahasiswa"
                classNamePrefix="react-select"
                className="text-sm rounded-md"
                onChange={(selected: any) => {
                  const selectedStudent = students.find((s: any) => s.id === selected?.value);
                  field.onChange(selected ? selected.value : "");
                  if (selectedStudent) {
                    const studentYear: number = selectedStudent?.year;
                    const currentReregisterYear: number = data?.year;
                    const currentReregisterSemesterType: number = data?.semesterType === "GANJIL" ? 1 : 0;
                    const semesterInt = (currentReregisterYear - studentYear) * 2 + currentReregisterSemesterType;
                    setValue("year", studentYear);
                    setValue('semester', semesterInt.toString());
                    setValue("major", selectedStudent.major?.name?.toString());
                    setValue("lecturerId", selectedStudent?.lecturerId.toString());
                    setValue("placeOfBirth", selectedStudent?.placeOfBirth || "");
                    setValue("birthday", moment(selectedStudent?.birthday).format("YYYY-MM-DD"));
                    setValue("hp", selectedStudent?.hp || "");
                    setValue("email", selectedStudent?.email || "");
                    setValue("domicile", selectedStudent?.domicile || "");
                    setValue("address", selectedStudent?.address || "");
                  } else {
                    setValue("year", 0);
                    setValue("semester", "");
                    setValue("major", "")
                    setValue("lecturerId", "")
                    setValue("placeOfBirth", "")
                    setValue("hp", "")
                    setValue("email", "")
                    setValue("domicile", "")
                    setValue("address", "")
                    setValue("birthday", moment(Date.now()).format("YYYY-MM-DD"))
                  }
                }}
                value={
                  students
                    .map((student: any) => ({
                      value: student.id,
                      label: `${student.nim} - ${student.name}`,
                    }))
                    .find((option: any) => option.value === field.value) || null
                }
              />
            )}
          />
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">
              {errors.studentId?.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Program Studi"
            name="major"
            defaultValue={data?.student?.major?.name}
            register={register}
            inputProps={{ readOnly: true }}
            error={errors?.major}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Angkatan"
            name="year"
            defaultValue={data?.student?.year}
            register={register}
            inputProps={{ readOnly: true }}
            error={errors?.year}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Semester"
            name="semester"
            defaultValue={data?.semester}
            register={register}
            inputProps={{ readOnly: true }}
            error={errors?.semester}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputSelect
            label="Dosen Wali"
            name="lecturerId"
            defaultValue={data?.student?.lecturerId}
            control={control}
            error={errors?.lecturerId}
            options={lecturers.map((lecturer: any) => ({
              value: lecturer.id,
              label: `${lecturer.name}`,
            }))}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputSelect
            label="Status Herregistrasi"
            name="semesterStatus"
            defaultValue={data?.semesterStatus}
            control={control}
            placeholder="--pilih Status"
            error={errors.semesterStatus}
            options={status.map((status: string) => ({
              value: status,
              label: status,
            }))}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputSelect
            label="Tipe Perkuliahan"
            name="campusType"
            defaultValue={data?.campusType}
            control={control}
            placeholder="--pilih Status"
            error={errors.campusType}
            options={[
              { value: "BJB", label: "Banjarbaru" },
              { value: "BJM", label: "Banjarmasin" },
              { value: "ONLINE", label: "Online" },
              { value: "SORE", label: "Sore" },
            ]}
          />
        </div>
      </div>

      <span className="text-xs text-gray-400 font-medium">
        Informasi Pembayaran Herregistrasi
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Nominal"
            name="nominal"
            defaultValue={data?.nominal}
            register={register}
            error={errors?.nominal}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="paymentReceiptFile"
          >
            <span>Upload Bukti Pembayaran</span>
          </label>
          <input type="file" id="paymentReceiptFile" name="paymentReceiptFile"
            className="file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-600 dark:file:text-violet-100 dark:hover:file:bg-violet-500"
            accept="image/jpeg, image/jpg, image/png"
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Unduh Bukti pembayaran</label>
          {data.paymentReceiptFile && (
          <a
            href={`/api/payment?file=${data.paymentReceiptFile}&download=true`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-blue-50 w-fit p-2 px-3 inline rounded-full text-center text-xs font-semibold"
          >
            Unduh File
          </a>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Status Pembayaran</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            size={2}
            {...register("paymentStatus")}
            defaultValue={data?.paymentStatus}
          >
            <option
              value={"BELUM_LUNAS"} key={"BELUM_LUNAS"}
              className="text-sm py-0.5 capitalize"
            >
              BELUM LUNAS
            </option>
            <option
              value={"LUNAS"} key={"LUNAS"}
              className="text-sm py-0.5 capitalize"
            >
              LUNAS
            </option>
          </select>
          {errors.paymentStatus?.message && (
            <p className="text-xs text-red-400">
              {errors.paymentStatus.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-4/6">
          <label className="text-xs text-gray-500">Keterangan Pembayaran Herregistrasi</label>
          <textarea
            {...register("paymentDescription")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            placeholder="keterangan..."
            defaultValue={data?.paymentDescription}
          ></textarea>
          {errors.paymentDescription?.message && (
            <p className="text-xs text-red-400">
              {errors.paymentDescription.message.toString()}
            </p>
          )}
        </div>
      </div>

      {role === "admin" && (
        <>
          <div className="text-xs text-gray-400 font-medium">
            Informasi Form Herregistrasi
            <span className={data?.isStatusForm ? "after:content-['*'] after:text-emerald-400 after:text-sm after:ml-1 px-1 text-emerald-400" : "after:content-['*'] after:text-red-400 after:text-sm after:ml-1 px-1 text-red-400"}>
              {data?.isStatusForm ? `(Data sudah diisi oleh mahasiswa)` : `(Data belum diisi oleh mahasiswa)`}
            </span>
          </div>
          <div className="flex justify-between flex-wrap gap-4">
            <div className="flex flex-col gap-2 w-full md:w-5/12">
              <InputField
                label="Tempat Lahir"
                name="placeOfBirth"
                defaultValue={data?.student?.placeOfBirth}
                register={register}
                inputProps={{ readOnly: true }}
                error={errors?.placeOfBirth}
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-5/12">
              <InputField
                label="Tanggal Lahir"
                name="birthday"
                type="date"
                defaultValue={moment(data?.student?.birthday).format("YYYY-MM-DD")}
                register={register}
                inputProps={{ readOnly: true }}
                error={errors?.birthday}
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-5/12">
              <InputField
                label="No. Telp/HP"
                name="hp"
                defaultValue={data?.student?.hp}
                register={register}
                inputProps={{ readOnly: true }}
                error={errors?.hp}
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-5/12">
              <InputField
                label="Email"
                name="email"
                defaultValue={data?.student?.email}
                register={register}
                inputProps={{ readOnly: true }}
                error={errors?.email}
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-11/12">
              <label className="text-xs text-gray-500">Alamat Asal/Domisili</label>
              <textarea
                {...register("domicile")}
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                placeholder="Alamat asal/domisili"
                defaultValue={data?.student?.domicile}
                readOnly={true}
              ></textarea>
              {errors.domicile?.message && (
                <p className="text-xs text-red-400">
                  {errors.domicile.message.toString()}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full md:w-11/12">
              <label className="text-xs text-gray-500">Alamat Sekarang</label>
              <textarea
                {...register("address")}
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                placeholder="Isi dengan alamat asal jika sama dengan alamat asal"
                defaultValue={data?.student?.address}
                readOnly={true}
              ></textarea>
              {errors.address?.message && (
                <p className="text-xs text-red-400">
                  {errors.address.message.toString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-between flex-wrap gap-4">
            <div className="flex flex-col gap-2 w-full md:w-5/12">
              <InputField
                label="Nama Orang Tua/Wali"
                name="guardianName"
                defaultValue={data?.student?.guardianName}
                register={register}
                inputProps={{ readOnly: true }}
                error={errors?.guardianName}
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-5/12">
              <InputField
                label="NIK Orang Tua/Wali"
                name="guardianNIK"
                defaultValue={data?.student?.guardianNIK}
                register={register}
                inputProps={{ readOnly: true }}
                error={errors?.guardianNIK}
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-5/12">
              <InputField
                label="Pekerjaan Orang Tua/Wali"
                name="guardianJob"
                defaultValue={data?.student?.guardianJob}
                register={register}
                inputProps={{ readOnly: true }}
                error={errors?.guardianJob}
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-5/12">
              <InputField
                label="No. Telp/HP Orang Tua/Wali"
                name="guardianHp"
                defaultValue={data?.student?.guardianHp}
                register={register}
                inputProps={{ readOnly: true }}
                error={errors?.guardianHp}
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-11/12">
              <label className="text-xs text-gray-500">Alamat Orang Tua/Wali</label>
              <textarea
                {...register("guardianAddress")}
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                placeholder="Alamat orang tua/wali"
                defaultValue={data?.student?.guardianAddress}
                readOnly={true}
              ></textarea>
              {errors.guardianAddress?.message && (
                <p className="text-xs text-red-400">
                  {errors.guardianAddress.message.toString()}
                </p>
              )}
            </div>

          </div>
          <span className="text-xs text-gray-400 font-medium">
            Informasi Ibu Kandung
          </span>
          <div className="flex justify-between flex-wrap gap-4">
            <div className="flex flex-col gap-2 w-full md:w-2/5">
              <InputField
                label="Nama Ibu Kandung"
                name="motherName"
                defaultValue={data?.student?.motherName}
                register={register}
                inputProps={{ readOnly: true }}
                error={errors?.motherName}
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-2/5">
              <InputField
                label="NIK Ibu Kandung"
                name="motherNIK"
                defaultValue={data?.student?.motherNIK}
                register={register}
                inputProps={{ readOnly: true }}
                error={errors?.motherNIK}
              />
            </div>
          </div>
        </>
      )}
      {state?.error && (
        <span className="text-xs text-red-400">{state.message.toString()}</span>
      )}
      <button
        className="bg-blue-400 text-white p-2 rounded-md"
        onClick={handleSubmit(onValid)}
      >
        {type === "create" ? "Tambah" : "Simpan"}
      </button>
    </form >
  )
}

export default ReregiterCreateOneForm;