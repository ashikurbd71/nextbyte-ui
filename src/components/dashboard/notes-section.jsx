"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export function NotesSection() {
    const [noteTitle, setNoteTitle] = useState('')

    return (
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-white">Notes</h3>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                        <FileText className="w-4 h-4" />
                    </Button>
                </div>
                <div className="space-y-3 sm:space-y-4">
                    <input
                        type="text"
                        placeholder="Add a note title..."
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        className="w-full p-2 sm:p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm"
                    />
                    <textarea
                        placeholder="Write your notes here..."
                        className="w-full p-2 sm:p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 h-24 sm:h-32 resize-none text-sm"
                    />
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 sm:py-3">
                        Save Note
                    </Button>
                </div>
            </div>
        </Card>
    )
}
