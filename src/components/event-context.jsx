"use client"

import React, { createContext, useContext, useReducer, useEffect } from "react"
import { format, parse, addDays, addWeeks, addMonths } from "date-fns"

// State and Action Types (JS only)
// Initial State
const initialState = {
  events: [],
  selectedDate: new Date(),
  currentMonth: new Date(),
}

// Reducer
function eventReducer(state, action) {
  switch (action.type) {
    case "ADD_EVENT":
      return { ...state, events: [...state.events, action.event] }
    case "UPDATE_EVENT":
      return {
        ...state,
        events: state.events.map((event) => (event.id === action.event.id ? action.event : event)),
      }
    case "DELETE_EVENT":
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.id),
      }
    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.date }
    case "SET_CURRENT_MONTH":
      return { ...state, currentMonth: action.date }
    case "LOAD_EVENTS":
      return { ...state, events: action.events }
    default:
      return state
  }
}

// Context
const EventContext = createContext(null)

// Provider
export function EventProvider({ children }) {
  const [state, dispatch] = useReducer(eventReducer, initialState)

  // Load from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("schedulo_events")
    if (savedEvents) {
      try {
        const events = JSON.parse(savedEvents)
        dispatch({ type: "LOAD_EVENTS", events })
      } catch (error) {
        console.error("Failed to load events:", error)
      }
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("schedulo_events", JSON.stringify(state.events))
  }, [state.events])

  return (
    <EventContext.Provider value={{ state, dispatch }}>
      {children}
    </EventContext.Provider>
  )
}

// Custom Hook
export function useEvents() {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider")
  }
  return context
} 