import { useState } from "react";
import VtuberLive2D from "@/modules/AURORA/components/VtuberLive2D";
import { FiX, FiMessageSquare } from "react-icons/fi";

export default function ChatWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  return (
    <>
      {/* Wrapper del chat */}
      {isOpen && (
        <div className="fixed bottom-4 right-4  shadow-xl rounded-xl overflow-hidden flex flex-col z-50 max-h-[90vh] max-w-[95vw]">
          {/* Barra superior con X */}
          <div className="cabecera flex justify-between items-center bg-red-600 text-white px-3 py-1 flex-shrink-0">
            <span>Chat Vtuber</span>
            <button onClick={handleClose}>
              <FiX size={20} />
            </button>
          </div>

          {/* Contenedor del Vtuber, se adapta automáticamente */}
          <div className="flex-1 overflow-auto">
            <VtuberLive2D client:only="react" />
          </div>
        </div>
      )}

      {/* Icono flotante cuando está minimizado */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="icono fixed bottom-4 right-4 text-white p-3 rounded-full shadow-lg z-50"
        >
          <FiMessageSquare size={24} />
        </button>
      )}
    </>
  );
}
