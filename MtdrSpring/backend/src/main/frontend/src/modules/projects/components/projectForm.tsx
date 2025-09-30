"use client"

import { useState } from "react"
import type React from "react"
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid"

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
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

  return (
<section className="min-h-screen flex items-center justify-center">
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-12">
      <div className=" p-8 ">
        <h2 className="text-xl font-semibold text-white">Project Information</h2>
        <p className="mt-1 text-sm text-gray-400">Fill in the project details below.</p>

        <div className="mt-6 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
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
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white placeholder:text-gray-500 outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
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
                placeholder="Describe the project..."
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white placeholder:text-gray-500 outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 resize-none"
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
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 -outline-offset-1 outline-white/10 *:bg-gray-800 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
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
              Start Date
            </label>
            <div className="mt-2">
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
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
                required
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-white">
              End Date
            </label>
            <div className="mt-2">
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
              />
            </div>
          </div>
        </div>



      {/* Metadata */}
        <h3 className="mt-10 text-lg font-semibold text-white">Metadata</h3>
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
          onClick={() =>
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
          className="text-sm font-semibold text-white"
        >
          Reset
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Save Project
        </button>
      </div>
      </div>


    </form>
</section>

  )
}
