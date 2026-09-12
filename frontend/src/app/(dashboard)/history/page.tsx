"use client"

import axios from "axios"
import { useEffect, useState } from "react"

interface TranscriptEntry {
  role: "user" | "assistant"
  text: string
}

interface PoorAnswer {
  question: string
  candidateAnswer: string
  assessment: string
  improvement: string
}

interface InterviewSummary {
  overallScore: number
  technicalKnowledge: number
  problemSolving: number
  communication: number
  summary: string
  strengths: string[]
  weaknesses: string[]
  poorAnswers: PoorAnswer[]
  recommendations: string[]
}

interface InterviewRecord {
  id: number
  transcript: TranscriptEntry[] | null
  jobDescription: string
  summary: InterviewSummary | null
  createdAt: string
}

export default function History() {
  const [history, setHistory] = useState<InterviewRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<InterviewRecord | null>(null)
  const [tab, setTab] = useState<"summary" | "transcript">("summary")

  useEffect(() => {
    const getHistory = async () => {
      try {
        setLoading(true)
        const res = await axios.get<{ data: InterviewRecord[] }>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/history`,
          { withCredentials: true }
        )
        const list = res.data.data // <-- the actual fix
        const sorted = [...list].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setHistory(sorted)
      } catch (err) {
        console.error(err)
        setError("Couldn't load your interview history. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    getHistory()
  }, [])

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })

  const hasTranscript = (t: TranscriptEntry[] | null) => !!t && t.length > 0
  const hasSummary = (s: InterviewSummary | null) => !!s

  const scoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-50"
    if (score >= 5) return "text-amber-600 bg-amber-50"
    return "text-red-600 bg-red-50"
  }

  const openCard = (item: InterviewRecord) => {
    setSelected(item)
    setTab(hasSummary(item.summary) ? "summary" : "transcript")
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Past Interviews</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Past Interviews</h1>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Past Interviews</h1>
        <p className="text-gray-500">You haven't done any interviews yet.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Past Interviews</h1>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item) => {
          const canOpen = hasTranscript(item.transcript) || hasSummary(item.summary)
          return (
            <button
              key={item.id}
              onClick={() => canOpen && openCard(item)}
              disabled={!canOpen}
              className={`text-left border border-gray-200 rounded-xl p-4 bg-white shadow-sm transition ${
                canOpen ? "hover:shadow-md hover:border-gray-300 cursor-pointer" : "opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold capitalize">{item.jobDescription}</p>
                {hasSummary(item.summary) && (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${scoreColor(
                      item.summary!.overallScore
                    )}`}
                  >
                    {item.summary!.overallScore}/10
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{formatDate(item.createdAt)}</p>
              {item.summary?.summary && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.summary.summary}</p>
              )}
              {!canOpen && <p className="text-xs text-gray-400 mt-2">No data yet</p>}
            </button>
          )
        })}
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="p-4 border-b border-gray-100 flex items-start justify-between">
              <div>
                <p className="font-semibold capitalize text-lg">{selected.jobDescription}</p>
                <p className="text-sm text-gray-500">{formatDate(selected.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-700 text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* tabs */}
            <div className="flex gap-4 px-4 pt-3 border-b border-gray-100 text-sm">
              {hasSummary(selected.summary) && (
                <button
                  onClick={() => setTab("summary")}
                  className={`pb-2 ${
                    tab === "summary" ? "border-b-2 border-blue-600 text-blue-700 font-medium" : "text-gray-500"
                  }`}
                >
                  Summary
                </button>
              )}
              {hasTranscript(selected.transcript) && (
                <button
                  onClick={() => setTab("transcript")}
                  className={`pb-2 ${
                    tab === "transcript" ? "border-b-2 border-blue-600 text-blue-700 font-medium" : "text-gray-500"
                  }`}
                >
                  Transcript
                </button>
              )}
            </div>

            {/* body */}
            <div className="overflow-y-auto p-4">
              {tab === "summary" && selected.summary && (
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ["Technical", selected.summary.technicalKnowledge],
                      ["Problem Solving", selected.summary.problemSolving],
                      ["Communication", selected.summary.communication],
                    ].map(([label, score]) => (
                      <div key={label as string} className="text-center bg-gray-50 rounded-lg p-2 border border-gray-100">
                        <p className="text-gray-500 text-xs">{label}</p>
                        <p className={`font-semibold ${scoreColor(score as number).split(" ")[0]}`}>{score}/10</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-gray-700">{selected.summary.summary}</p>

                  {selected.summary.strengths.length > 0 && (
                    <div>
                      <p className="font-medium text-green-700 mb-1">Strengths</p>
                      <ul className="list-disc list-inside text-gray-700 space-y-0.5">
                        {selected.summary.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selected.summary.weaknesses.length > 0 && (
                    <div>
                      <p className="font-medium text-red-700 mb-1">Weaknesses</p>
                      <ul className="list-disc list-inside text-gray-700 space-y-0.5">
                        {selected.summary.weaknesses.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selected.summary.poorAnswers.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-800 mb-1">Areas to Improve</p>
                      <div className="space-y-2">
                        {selected.summary.poorAnswers.map((pa, i) => (
                          <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-2">
                            <p className="font-medium">Q: {pa.question}</p>
                            <p className="text-gray-600 mt-1">A: {pa.candidateAnswer}</p>
                            <p className="text-amber-700 mt-1">{pa.assessment}</p>
                            <p className="text-blue-700 mt-1">→ {pa.improvement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selected.summary.recommendations.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-800 mb-1">Recommendations</p>
                      <ul className="list-disc list-inside text-gray-700 space-y-0.5">
                        {selected.summary.recommendations.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {tab === "transcript" && hasTranscript(selected.transcript) && (
                <div className="space-y-2">
                  {selected.transcript!.map((entry, idx) => (
                    <div key={idx} className={`text-sm ${entry.role === "assistant" ? "text-blue-700" : "text-gray-800"}`}>
                      <span className="font-medium capitalize">{entry.role}: </span>
                      {entry.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}