import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Utility function to handle instructor data that can be either a single object or an array
 * @param {Object|Array} instructorData - Instructor data (single object or array of objects)
 * @returns {Object|null} - First instructor object or null if no instructor data
 */
export function getInstructor(instructorData) {
  if (!instructorData) return null

  // If instructor is an array, return the first instructor
  if (Array.isArray(instructorData)) {
    return instructorData.length > 0 ? instructorData[0] : null
  }

  // If instructor is a single object, return it
  return instructorData
}

/**
 * Utility function to get all instructors as an array
 * @param {Object|Array} instructorData - Instructor data (single object or array of objects)
 * @returns {Array} - Array of instructor objects
 */
export function getAllInstructors(instructorData) {
  if (!instructorData) return []

  // If instructor is an array, return all instructors
  if (Array.isArray(instructorData)) {
    return instructorData
  }

  // If instructor is a single object, return it as an array
  return [instructorData]
}

/**
 * Utility function to get instructor name safely
 * @param {Object|Array} instructorData - Instructor data (single object or array of objects)
 * @returns {string} - Instructor name or empty string
 */
export function getInstructorName(instructorData) {
  const instructor = getInstructor(instructorData)
  return instructor?.name || ""
}

/**
 * Utility function to get instructor designation safely
 * @param {Object|Array} instructorData - Instructor data (single object or array of objects)
 * @returns {string} - Instructor designation or empty string
 */
export function getInstructorDesignation(instructorData) {
  const instructor = getInstructor(instructorData)
  return instructor?.designation || ""
}
