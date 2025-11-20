import { Dispatch, SetStateAction } from "react";

export interface FormModalProps {
  table: "permission"
  | "role"
  | "operator"
  | "position"
  | "lecturer"
  | "lecturerUser"
  | "operatorUser"
  | "studentUser"
  | "student"
  | "course"
  | "major"
  | "room"
  | "period"
  | "reregistration"
  | "reregistrationCreateAll"
  | "reregistrationDetail"
  | "reregistrationStudent"
  | "curriculum"
  | "curriculumDetail"
  | "grade"
  | "assessment"
  | "krsOverride"
  | "krsDetail"
  | "krsRules"
  | "khsGrade"
  | "khsRevision"
  | "rpl"
  | "class"
  | "classDetail"
  | "time"
  | "schedule"
  | "scheduleDetail"
  | "presence"
  | "presenceDetail"
  | "presenceAll";

  type: "create" | "update" | "delete" | "createUser" | "updateUser" | "createMany" | "presenceActive" | "presenceNon" | "revision";
  label?: string,
  data?: any;
  id?: string | number;
}

export interface FormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update" | "createUser" | "updateUser" | "createMany" | "presenceActive" | "presenceNon" | "revision";
  data?: any;
  relatedData?: any;
}