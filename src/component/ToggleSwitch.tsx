'use client';
import { createRolePermissions, deleteRolePermissions, getRolePermission } from "@/lib/action";
import { useEffect, useState } from "react";

const ToggleSwitch = ({ id }: { id: string }) => {

  const [isChecked, setIsChecked] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = e.target.id;
    if (!isChecked) {
      const rolepermission = await createRolePermissions(data);
      setIsChecked(rolepermission.success && !isChecked);
    } else {
      const rolepermission = await deleteRolePermissions(data);
      setIsChecked(rolepermission.success && !isChecked);
    }
  };

  useEffect(() => {
    const checkRolePermission = async () => {
      const rolePermissionCheck = await getRolePermission(id);
      setIsChecked(rolePermissionCheck.success);
    };
    checkRolePermission();
  }, [id, isChecked]);

  return (
    <form>
      <div className="flex items-center">
        <input type="checkbox" name={id} id={id} checked={isChecked} onChange={(e) => handleChange(e)} hidden />
        <label htmlFor={id}
          className={`${isChecked ? 'bg-primary' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 p-1
          cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none`}
        >
          <span
            className={`${isChecked && 'translate-x-5'} inline-block w-4 h-4 transform bg-white 
            rounded-full transition duration-200 ease-in-out`}
          >
          </span>
        </label>
      </div>
    </form>
  )
}

export default ToggleSwitch;