import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useModal } from "./useModal";
import { MODAL_COMPONENTS } from "./modal.config";
import { X } from "lucide-react";

function Modal() {
  const { isOpen, modalType, closeModal } = useModal();
  const modalRef = useRef(null);

  // Prevention of body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  // Click outside to close helper
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  if (!isOpen || !modalType) return null;

  const ActiveComponent = MODAL_COMPONENTS[modalType];
  if (!ActiveComponent) {
    console.warn(`No component configured for modal type: ${modalType}`);
    return null;
  }

  return ReactDOM.createPortal(
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(12px) scale(0.97); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .modal-backdrop {
          animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .modal-card {
          animation: slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
      <div
        className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm modal-backdrop"
        onClick={handleBackdropClick}
      >
        <div
          ref={modalRef}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100/50 overflow-hidden modal-card focus:outline-none"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-150 active:scale-90 z-50"
            aria-label="Close modal"
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          {/* Suspense wrapper for lazy-loaded component */}
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            }
          >
            <ActiveComponent />
          </React.Suspense>
        </div>
      </div>
    </>,
    document.body
  );
}

export default Modal;
