// src/features/shared/components/ui/toaster.tsx
"use client"

import * as ToastPrimitive from "@radix-ui/react-toast"
import { cva } from "class-variance-authority"
import { useState, useEffect } from "react"

const ToastProvider = ToastPrimitive.Provider
const ToastViewport = ToastPrimitive.Viewport
const ToastRoot = ToastPrimitive.Root
const ToastTitle = ToastPrimitive.Title
const ToastDescription = ToastPrimitive.Description
const ToastClose = ToastPrimitive.Close

const toastVariants = cva(
  "bg-white shadow-lg rounded-lg p-4 border border-gray-200",
)

export function Toaster() {
  const [toasts, setToasts] = useState<Array<{
    id: string
    title?: string
    description?: string
    duration?: number
  }>>([])

  useEffect(() => {
    // Função global para adicionar toasts
    window.showToast = (options: { title?: string; description?: string; duration?: number }) => {
      const id = Math.random().toString(36).substr(2, 9)
      setToasts(prev => [...prev, { ...options, id }])
      
      // Auto-remove após duração
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
      }, options.duration || 3000)
    }
  }, [])

  return (
    <ToastProvider swipeDirection="right">
      <ToastViewport className="fixed bottom-0 right-0 m-4 flex flex-col gap-2 w-96 z-50" />
      {toasts.map(toast => (
        <ToastRoot key={toast.id} className={toastVariants()} duration={toast.duration || 3000}>
          {toast.title && <ToastTitle className="font-bold text-gray-900">{toast.title}</ToastTitle>}
          {toast.description && <ToastDescription className="text-gray-600 mt-1">{toast.description}</ToastDescription>}
          <ToastClose className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" />
        </ToastRoot>
      ))}
    </ToastProvider>
  )
}

// Função utilitária para criar um toast
export function toast(options: { title?: string; description?: string; duration?: number }) {
  if (window.showToast) {
    window.showToast(options)
  }
}

// Declaração global para TypeScript
declare global {
  interface Window {
    showToast: (options: { title?: string; description?: string; duration?: number }) => void
  }
}
