export default function Modal({
  open, onClose, title, children
}: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl my-8 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white rounded-t-xl z-10">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">✕</button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}