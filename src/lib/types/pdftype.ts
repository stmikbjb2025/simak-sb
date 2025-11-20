export type PdfType = "reregister"
  | "assessment"
  | "khs"
  | "krs"
  | "transcript"
  | "coursekrs"
  | "studentsRegularSore"
  | "studentActiveInactive"
  | "studentsRegisteredKrs"
  | "studentsUnregisteredKrs" 
  | "studentsTakingThesis" 
  | "studentsTakingInternship";

export interface GeneratePdfProps {
  data?: any,
  img?: Buffer | string,
};

export interface ButtonPdfDownloadProps {
  id: string;
  type: PdfType;
  children: React.ReactNode;
};

export interface RenderPdfProps {
  type: PdfType;
  data: any;
}