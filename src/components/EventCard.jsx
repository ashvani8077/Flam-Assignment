"use client"

import React from "react"
import { motion } from "framer-motion"
import { Clock, Edit, Eye, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEvents } from "./event-context"

export function EventCard({ event, onEdit, onView, compact = false }) {
  const { dispatch } = useEvents()

  const handleDelete = (e) => {
    e.stopPropagation()
    dispatch({ type: "DELETE_EVENT", id: event.id })
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    onEdit(event)
  }

  const handleView = (e) => {
    e.stopPropagation()
    onView(event)
  }

  return (
    <motion.div
      className={`
        group relative rounded-lg border transition-all duration-300
        ${compact ? "p-1 text-xs" : "p-2 text-sm"}
        hover:shadow-lg hover:scale-105
      `}
      style={{
        backgroundColor: `${event.color}20`,
        borderColor: `${event.color}40`,
      }}
      whileHover={{ y: -2 }}
      onClick={handleView}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4
            className="font-semibold text-blue-900 truncate"
          >
            {event.title}
          </h4>
          <div className="flex items-center text-blue-700/80">
            <Clock className="h-3 w-3 mr-1" />
            <span className="text-xs">{event.time}</span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-blue-700 hover:text-blue-900 hover:bg-blue-200/50"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-md border-blue-100">
            <DropdownMenuItem onClick={handleView} className="text-blue-900 hover:bg-blue-100">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit} className="text-blue-900 hover:bg-blue-100">
              <Edit className="h-4 w-4 mr-2" />
              Edit Event
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-500 hover:text-red-600 hover:bg-red-100/50">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  )
} 