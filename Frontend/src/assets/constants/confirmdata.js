import { MdLogout, MdDelete } from "react-icons/md";

export const logoutModalData = {
  title: "Confirm Logout",
  message: "Are you sure you want to log out?",
  buttonText: "Logout",
  Icon: MdLogout,
  buttonColor: "#4f46e5", // Indigo-600
  iconBgColor: "#eef2ff", // Indigo-50
  iconColor: "#4f46e5", // Indigo-600
};

export const deleteCategoryData = {
  title: "Delete Category",
  message: "Are you sure you want to delete?",
  buttonText: "Delete",
  Icon: MdDelete,
  buttonColor: "#dc2626", // Red-600
  iconBgColor: "#fef2f2", // Red-50
  iconColor: "#dc2626", // Red-600
};
