"use client"
import React from "react"
import { Calendar as CalendarIcon, Clock, Tag, Repeat, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEvents } from "./event-context"
import { format, parse } from "date-fns"
import { motion } from "framer-motion"

export function EventDetailsModal({ isOpen, onClose, event, onEdit }) {
  const { dispatch } = useEvents()

  if (!event) return null

  const handleDelete = () => {
    dispatch({ type: "DELETE_EVENT", id: event.id })
    onClose()
  }

  const handleEdit = () => {
    onEdit(event)
    onClose()
  }

  const getRecurrenceText = () => {
    if (!event.recurrence || event.recurrence.type === "none") return "No repeat"
    const { type, interval = 1 } = event.recurrence
    const intervalText = interval > 1 ? ` every ${interval}` : ""
    return `Repeats ${intervalText} ${type.slice(0,-2)}${interval > 1 ? "s" : ""}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/95 backdrop-blur-md border-blue-100 text-blue-900 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
            Event Details
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">{event.title}</h3>
              {event.description && <p className="text-blue-700/90 text-sm">{event.description}</p>}
            </div>
            <div className="w-4 h-4 rounded-full ml-4" style={{ backgroundColor: event.color }} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-blue-800">
              <CalendarIcon className="h-5 w-5 mr-3 text-blue-500" />
              <span>{format(parse(event.date, "dd-MM-yyyy", new Date()), "EEEE, MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center text-blue-800">
              <Clock className="h-5 w-5 mr-3 text-blue-500" />
              <span>{event.time}</span>
            </div>
             {event.category && <div className="flex items-center text-blue-800">
              <Tag className="h-5 w-5 mr-3 text-blue-500" />
              <span>{event.category}</span>
            </div>}
            <div className="flex items-center text-blue-800">
              <Repeat className="h-5 w-5 mr-3 text-blue-500" />
              <span>{getRecurrenceText()}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-blue-100">
            <Button onClick={handleEdit} variant="ghost" className="text-blue-800 hover:bg-blue-100">
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button onClick={handleDelete} variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-100/50">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
} 