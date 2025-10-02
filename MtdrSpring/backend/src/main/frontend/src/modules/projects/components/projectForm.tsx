"use client"

import { useState } from "react"
import type React from "react"

type ProjectStatus = "planning" | "in-progress" | "on-hold" | "completed" | "cancelled"

interface ProjectFormData {
  name: string
  description: string
  status: ProjectStatus
  startDate: string
  deliveryDate: string
  endDate: string
  createdAt: string
  updatedAt: string
}

interface ApiError {
  message: string
  status?: number
}

export default function ProjectForm() {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    status: "planning",
    startDate: "",
    deliveryDate: "",
    endDate: "",
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const API_BASE_URL = "http://localhost:8080"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        startDate: formData.startDate,
        deliveryDate: formData.deliveryDate || null,
        endDate: formData.endDate || null,
      }

      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw {
          message: errorData.message || `Server error: ${response.status}`,
          status: response.status,
        } as ApiError
      }

      const createdProject = await response.json()
      
      setSubmitStatus({
        type: "success",
        message: `Project "${createdProject.name}" created successfully!`,
      })

      // Reset form after successful submission
      setTimeout(() => {
        resetForm()
        setSubmitStatus({ type: null, message: "" })
      }, 3000)

    } catch (error) {
      console.error("Error creating project:", error)
      
      const apiError = error as ApiError
      setSubmitStatus({
        type: "error",
        message: apiError.message || "Failed to create project. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      updatedAt: new Date().toISOString().split("T")[0],
    }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "planning",
      startDate: "",
      deliveryDate: "",
      endDate: "",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    })
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 p-8">
        <div>
          <h2 className="text-xl font-semibold text-white">Project Information</h2>
          <p className="text-sm text-gray-400">Fill in the project details below.</p>
        </div>

        {/* Status Message */}
        {submitStatus.type && (
          <div
            className={`p-4 rounded-md ${
              submitStatus.type === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
          {/* Project Name */}
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-white">
              Project Name <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white placeholder:text-gray-500 outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter project name"
              />
            </div>
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-white">
              Description <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="Describe the project..."
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white placeholder:text-gray-500 outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Status */}
          <div className="sm:col-span-2">
            <label htmlFor="status" className="block text-sm font-medium text-white">
              Status <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 -outline-offset-1 outline-white/10 *:bg-gray-800 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-white">
              Start Date <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label htmlFor="deliveryDate" className="block text-sm font-medium text-white">
              Delivery Date
            </label>
            <div className="mt-2">
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                disabled={isSubmitting}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

        </div>

        {/* Metadata */}
        <div>
          <h3 className="text-lg font-semibold text-white">Metadata</h3>
          <p className="text-xs text-gray-500 mt-1">Auto-generated by the system</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="createdAt" className="block text-sm font-medium text-gray-400">
              Created At
            </label>
            <input
              type="date"
              id="createdAt"
              name="createdAt"
              value={formData.createdAt}
              disabled
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-gray-400 cursor-not-allowed outline-1 -outline-offset-1 outline-white/10"
            />
          </div>
          <div>
            <label htmlFor="updatedAt" className="block text-sm font-medium text-gray-400">
              Updated At
            </label>
            <input
              type="date"
              id="updatedAt"
              name="updatedAt"
              value={formData.updatedAt}
              disabled
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-gray-400 cursor-not-allowed outline-1 -outline-offset-1 outline-white/10"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            onClick={resetForm}
            disabled={isSubmitting}
            className="text-sm font-semibold text-white hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              "Save Project"
            )}
          </button>
        </div>
      </form>
    </section>
  )
}