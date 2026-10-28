
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getDoctors } from "../services/doctorsServices";

const STORAGE_KEY = "medibook_doctors";

export const useDoctorStore = create(
  persist(
    (set, get) => ({
      doctors: [],
      isDemoData: false,
      searchTerm: "",
      isLoaded: false,

      loadDoctors: async () => {
        if (get().isLoaded) return;

        try {
          const result = await getDoctors();

          if (!get().isLoaded) {
            set({
              doctors: result.doctors,
              isDemoData: result.isDemoData,
              isLoaded: true,
            });
          }
        } catch (error) {
          console.error("Failed to load doctors:", error);
        }
      },

      setSearchTerm: (searchTerm) => set({ searchTerm }),

      addDoctor: (doctorData) =>
        set((state) => ({
          doctors: [
            ...state.doctors,
            { ...doctorData, id: crypto.randomUUID() },
          ],
          isLoaded: true,
        })),

      updateDoctor: (updatedDoctor) =>
        set((state) => ({
          doctors: state.doctors.map((doctor) =>
            doctor.id === updatedDoctor.id
              ? updatedDoctor
              : doctor
          ),
          isLoaded: true,
        })),

      deleteDoctor: (doctorId) =>
        set((state) => ({
          doctors: state.doctors.filter(
            (doctor) => doctor.id !== doctorId
          ),
          isLoaded: true,
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),

      migrate: (persistedState) => {
        if (Array.isArray(persistedState)) {
          return {
            doctors: persistedState,
            isDemoData: true,
            isLoaded: true,
          };
        }

        return persistedState;
      },

      version: 1,

      partialize: (state) => ({
        doctors: state.doctors,
        isDemoData: state.isDemoData,
        isLoaded: state.isLoaded,
      }),
    }
  )
);
