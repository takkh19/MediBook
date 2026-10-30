
import { create } from "zustand";
import { getDoctors } from "../services/doctorsServices";

export const useDoctorStore = create((set, get) => ({
  // Doctors data
  doctors: [],
  isDemoData: false,
  isLoaded: false,
  isLoading: false,
  error: null,

  // Search
  searchTerm: "",

  // Load doctors from Backend
  loadDoctors: async () => {
    if (get().isLoading) return;

    set({
      isLoading: true,
      error: null,
    });

    try {
      const result = await getDoctors();

      set({
        doctors: result.doctors,
        isDemoData: result.isDemoData,
        isLoaded: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Failed to load doctors:", error);

      set({
        doctors: [],
        isDemoData: false,
        isLoaded: true,
        isLoading: false,
        error: error.message || "ექიმების ჩატვირთვა ვერ მოხერხდა.",
      });
    }
  },

  // Update search term
  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
  },

  // Add doctor to current UI state
  addDoctor: (doctor) => {
    set((state) => ({
      doctors: [...state.doctors, doctor],
    }));
  },

  // Update doctor in current UI state
  updateDoctor: (updatedDoctor) => {
    set((state) => ({
      doctors: state.doctors.map((doctor) =>
        doctor.id === updatedDoctor.id
          ? updatedDoctor
          : doctor
      ),
    }));
  },

  // Remove doctor from current UI state
  deleteDoctor: (doctorId) => {
    set((state) => ({
      doctors: state.doctors.filter(
        (doctor) => doctor.id !== doctorId
      ),
    }));
  },

  // Clear errors
  clearError: () => {
    set({ error: null });
  },
}));
