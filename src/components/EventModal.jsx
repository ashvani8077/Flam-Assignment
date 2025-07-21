"use client"
import React, { useState, useEffect } from "react"
import { Calendar as CalendarIcon, Clock, Repeat, Palette, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEvents } from "./event-context"
import { format, parse } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

const EVENT_COLORS = ["#8B5CF6", "#EC4899", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#6366F1", "#84CC16"]
const CATEGORIES = ["Work", "Personal", "Health", "Education", "Social", "Travel", "Other"]

export function EventModal({ isOpen, onClose, onSave, editingEvent, error }) {
  const { state } = useEvents()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: format(state.selectedDate, "dd-MM-yyyy"),
    time: "09:00",
    color: EVENT_COLORS[0],
    category: "Personal",
    recurrence: {
      type: "none",
      interval: 1,
      unit: 'days'
    },
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        ...editingEvent,
        recurrence: editingEvent.recurrence || { type: "none", interval: 1, unit: 'days' }
      })
    } else {
      setFormData({
        title: "",
        description: "",
        date: format(state.selectedDate, "dd-MM-yyyy"),
        time: "09:00",
        color: EVENT_COLORS[0],
        category: "Personal",
        recurrence: {
          type: "none",
          interval: 1,
          unit: 'days'
        },
      })
    }
    setErrors({})
  }, [editingEvent, state.selectedDate, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: editingEvent?.id || `event-${Date.now()}`
    })
  }

  const inputDateValue = formData.date && /^\d{2}-\d{2}-\d{4}$/.test(formData.date)
    ? format(parse(formData.date, 'dd-MM-yyyy', new Date()), 'yyyy-MM-dd')
    : formData.date;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/95 backdrop-blur-md border-blue-100 text-blue-900 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-blue-900 bg-clip-text text-transparent">
            {editingEvent ? "Edit Event" : "Create New Event"}
          </DialogTitle>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-blue-900">
              Event Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-blue-50 border-blue-200 text-blue-900 placeholder-blue-400"
              placeholder="Enter event title..."
            />
          </div>
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-blue-900">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-blue-50 border-blue-200 text-blue-900 placeholder-blue-400"
              placeholder="Enter event description..."
              rows={3}
            />
          </div>
          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-blue-900 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" /> Date
              </Label>
              <Input
                id="date"
                type="date"
                value={inputDateValue}
                onChange={(e) => setFormData({ ...formData, date: format(parse(e.target.value, 'yyyy-MM-dd', new Date()), 'dd-MM-yyyy') })}
                className="bg-blue-50 border-blue-200 text-blue-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-blue-900 flex items-center">
                <Clock className="h-4 w-4 mr-2" /> Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="bg-blue-50 border-blue-200 text-blue-900"
              />
            </div>
          </div>
          {/* Category and Color */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-blue-900 flex items-center">
                <Tag className="h-4 w-4 mr-2" /> Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-blue-50 border-blue-200 text-blue-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-blue-200">
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category} className="text-blue-900 hover:bg-blue-100">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-blue-900 flex items-center">
                <Palette className="h-4 w-4 mr-2" /> Color
              </Label>
              <div className="flex flex-wrap gap-2">
                {EVENT_COLORS.map((color) => (
                  <motion.button
                    key={color}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color ? "border-blue-500 scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Recurrence */}
          <div className="space-y-4">
            <Label className="text-blue-900 flex items-center">
              <Repeat className="h-4 w-4 mr-2" /> Recurrence
            </Label>
            <Select
              value={formData.recurrence.type}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  recurrence: { ...formData.recurrence, type: value },
                })
              }
            >
              <SelectTrigger className="bg-blue-50 border-blue-200 text-blue-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-blue-200">
                <SelectItem value="none" className="text-blue-900 hover:bg-blue-100">
                  No Repeat
                </SelectItem>
                <SelectItem value="daily" className="text-blue-900 hover:bg-blue-100">
                  Daily
                </SelectItem>
                <SelectItem value="weekly" className="text-blue-900 hover:bg-blue-100">
                  Weekly
                </SelectItem>
                <SelectItem value="monthly" className="text-blue-900 hover:bg-blue-100">
                  Monthly
                </SelectItem>
                 <SelectItem value="custom" className="text-blue-900 hover:bg-blue-100">
                  Custom
                </SelectItem>
              </SelectContent>
            </Select>
             <AnimatePresence>
              {formData.recurrence.type !== "none" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-blue-900">Repeat every</Label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.recurrence.interval}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            recurrence: { ...formData.recurrence, interval: Number.parseInt(e.target.value) || 1 },
                          })
                        }
                        className="bg-blue-50 border-blue-200 text-blue-900"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Error message */}
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm">
              {error}
            </motion.p>
          )}
          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-blue-900 hover:bg-blue-100"
            >
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-400 text-white"
              >
                {editingEvent ? "Update Event" : "Create Event"}
              </Button>
            </motion.div>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
} 