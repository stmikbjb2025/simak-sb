export type type = "reregister"
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
  | "schedule" 
  | "studentsTakingInternship";

export interface GeneratePdfProps {
  data?: any,
  img?: Buffer | string,
};

export interface ButtonPdfDownloadProps {
  id: string;
  fileType?: "pdf" | "excel";
  type: type;
  children: React.ReactNode;
};

export interface RenderPdfProps {
  type: type;
  data: any;
}