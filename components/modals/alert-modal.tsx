import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BsPatchQuestion } from "react-icons/bs";
import { Modal } from "@/components/ui/modal";
import { motion, AnimatePresence } from "framer-motion";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
  variant?: "warning" | "danger" | "success" | "info";
  confirmLabel?: string;
  cancelLabel?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = "Xác nhận",
  description = "Bạn có chắc chắn muốn thực hiện hành động này?",
  variant = "warning",
  confirmLabel = "Tiếp tục",
  cancelLabel = "Hủy",
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <XCircle className="w-8 h-8 text-red-500" />,
          confirmButtonClass: "bg-red-600 hover:bg-red-700 text-white",
          bgClass: "bg-red-50 dark:bg-red-900/10",
          ringClass: "ring-red-500/10",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
          confirmButtonClass: "bg-green-600 hover:bg-green-700 text-white",
          bgClass: "bg-green-50 dark:bg-green-900/10",
          ringClass: "ring-green-500/10",
        };
      case "info":
        return {
          icon: <BsPatchQuestion className="w-8 h-8 text-blue-500" />,
          confirmButtonClass: "bg-blue-600 hover:bg-blue-700 text-white",
          bgClass: "bg-blue-50 dark:bg-blue-900/10",
          ringClass: "ring-blue-500/10",
        };
      default:
        return {
          icon: <AlertCircle className="w-8 h-8 text-amber-500" />,
          confirmButtonClass: "bg-amber-600 hover:bg-amber-700 text-white",
          bgClass: "bg-amber-50 dark:bg-amber-900/10",
          ringClass: "ring-amber-500/10",
        };
    }
  };

  const { icon, confirmButtonClass, bgClass, ringClass } = getVariantStyles();

  return (
    <Modal title="" description="" isOpen={isOpen} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`flex flex-col items-center p-4 rounded-lg ${bgClass} ${ringClass} ring-1`}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-3"
        >
          {icon}
        </motion.div>
        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-medium text-gray-900 dark:text-gray-100"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center max-w-[250px]"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 w-full space-x-2 flex items-center justify-center"
        >
          <Button
            disabled={loading}
            variant="outline"
            onClick={onClose}
            className="min-w-[80px] text-sm px-3 py-1 h-8"
          >
            {cancelLabel}
          </Button>
          <Button
            disabled={loading}
            onClick={onConfirm}
            className={`min-w-[80px] text-sm px-3 py-1 h-8 ${confirmButtonClass}`}
          >
            {confirmLabel}
          </Button>
        </motion.div>
      </motion.div>
    </Modal>
  );
};

export default AlertModal;
