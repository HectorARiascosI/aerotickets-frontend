export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  )
}

export const THead = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-50 text-gray-700">{children}</thead>
)

export const TBody = ({ children }: { children: React.ReactNode }) => <tbody className="divide-y">{children}</tbody>

export const TR = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <tr className={className || "hover:bg-gray-50"}>{children}</tr>
)

export const TH = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <th className={`font-semibold px-4 py-3 ${className || "text-left"}`}>{children}</th>
)

export const TD = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-4 py-3 ${className || ""}`}>{children}</td>
)