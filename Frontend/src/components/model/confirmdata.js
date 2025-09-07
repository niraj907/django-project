import { MdLogout, MdDelete } from "react-icons/md";

export const logoutModalData = {
  title: "Confirm Logout",
  message: "Are you sure you want to logout?",
  buttonText: "Logout",
  Icon: MdLogout,
  buttonColor: "#66659F", // purple button
  iconBgColor: "#66659F73", // light purple background
  iconColor: "#66659F", // purple icon
};

export const deleteCategoryData = {
  title: "Delete Category",
  message: "Are you sure you want to delete this category?",
  buttonText: "Delete",
  Icon: MdDelete,
  buttonColor: "#E53E3E", // red button
  iconBgColor: "#FEE2E2", // light red background
  iconColor: "#E53E3E", // red icon
};
