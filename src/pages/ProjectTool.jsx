import { useParams } from 'react-router-dom'

export default function ProjectTool() {
  const { id } = useParams()
  return (
    <div className="min-h-screen bg-bg-2 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-text3 mb-4">Project Tool</div>
        <h1 className="text-[28px] font-extrabold text-navy mb-3">Coming Soon</h1>
        <p className="text-[14px] text-text2 mb-8">This project tool is under construction.</p>
        <a href="/" className="text-[13px] font-semibold text-navy hover:underline">← Back to portfolio</a>
      </div>
    </div>
  )
}
