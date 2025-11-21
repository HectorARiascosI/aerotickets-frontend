import AIChatBot from './AIChatBot'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen app-gradient">
      {children}
      <AIChatBot />
    </div>
  )
}