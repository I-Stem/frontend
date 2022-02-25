import React from "react";
import { toast } from "react-toastify";

export const EditorNotificationManager = {
  notifySuccess: (message: string) => {
    toast.success(message, {
      autoClose: 7000,
    });
  },
  notifyError: (message: string) => {
    toast.error(message, {
      autoClose: false,
    });
  },
  notifyWarning: (message: string) => {
    toast.warning(message, {
      autoClose: 10000,
    });
  },
};
