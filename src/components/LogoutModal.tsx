"use client";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  logout: () => void;
}

export default function LogoutModal({
  isOpen,
  onClose,
  logout,
}: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-capriola text-black">
      <div className="absolute inset-0 " onClick={onClose} />
      <div className="w-full max-w-[420px] h-62 bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#B15A1A]/10 z-10 bg-gray-100 flex justify-center items-center">
        <div className="flex flex-col justify-between items-center gap-2 min-h-40">
          <p className="text-[#B15A1A] font-bold text-lg">Loging Out</p>
          <div className="flex flex-col items-center">
            <p>Are you sure you want to log out?</p>
          </div>
          <div className="space-x-8">
            <button
              onClick={logout}
              className="px-5 py-1 bg-[#B15A1A] text-white font-light rounded-lg hover:bg-[#B15A1A]"
            >
              Yes, Logout
            </button>
            <button
              onClick={onClose}
              className="border border-[#B15A1A] text-[#B15A1A] font-semibold rounded-lg px-5 py-1 hover:bg-[#B15A1A]/90 hover:text-white"
            >
              No, Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
