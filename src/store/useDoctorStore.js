
import { create } from "zustand";
import { getDoctors } from "../services/doctorsServices";
import { getToken } from "../utils/auth";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

async function doctorRequest(path, options = {}) {
  const token = getToken();

  if (!token) {
    throw new Error("ავტორიზაცია აუცილებელია.");
  }

  const response = await fetch(`${API_URL}/api/doctors${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("სესია ამოიწურა. შედი ხელახლა.");
    }

    if (response.status === 403) {
      throw new Error("ეს მოქმედება მხოლოდ ადმინისტრატორს შეუძლია.");
    }

    if (response.status === 409) {
      throw new Error(
        "ექიმს დაკავშირებული ჩანაწერები აქვს და მისი წაშლა შეუძლებელია."
      );
    }

    throw new Error(
      data.message || "მოთხოვნის შესრულება ვერ მოხერხდა."
    );
  }

  return data;
}

export const useDoctorStore = create((set, get) => ({
  doctors: [],
  isDemoData: false,
  isLoaded: false,
  isLoading: false,
  isSaving: false,
  error: null,

  searchTerm: "",

  loadDoctors: async () => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });

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
      set({
        doctors: [],
        isDemoData: false,
        isLoaded: true,
        isLoading: false,
        error:
          error.message || "ექიმების ჩატვირთვა ვერ მოხერხდა.",
      });
    }
  },

  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
  },

  addDoctor: async (doctor) => {
    if (get().isSaving) return;

    set({ isSaving: true, error: null });

    try {
      const createdDoctor = await doctorRequest("", {
        method: "POST",
        body: JSON.stringify({
          name: doctor.name.trim(),
          specialty: doctor.specialty.trim(),
          clinic: doctor.clinic.trim(),
          experience: Number(doctor.experience ?? 0),
        }),
      });

      set((state) => ({
        doctors: [createdDoctor, ...state.doctors],
      }));

      return createdDoctor;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  updateDoctor: async (updatedDoctor) => {
    if (get().isSaving) return;

    set({ isSaving: true, error: null });

    try {
      const savedDoctor = await doctorRequest(
        `/${updatedDoctor.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: updatedDoctor.name.trim(),
            specialty: updatedDoctor.specialty.trim(),
            clinic: updatedDoctor.clinic.trim(),
            experience: Number(updatedDoctor.experience ?? 0),
          }),
        }
      );

      set((state) => ({
        doctors: state.doctors.map((doctor) =>
          Number(doctor.id) === Number(savedDoctor.id)
            ? savedDoctor
            : doctor
        ),
      }));

      return savedDoctor;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  deleteDoctor: async (doctorId) => {
    if (get().isSaving) return;

    set({ isSaving: true, error: null });

    try {
      await doctorRequest(`/${doctorId}`, {
        method: "DELETE",
      });

      set((state) => ({
        doctors: state.doctors.filter(
          (doctor) => Number(doctor.id) !== Number(doctorId)
        ),
      }));

      return true;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
