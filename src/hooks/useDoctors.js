
import { useCallback, useEffect, useMemo, useState } from "react";
import { getDoctors } from "../services/doctorsServices";

const STORAGE_KEY = "medibook_doctors";

export function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [isDemoData, setIsDemoData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadDoctors() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
          try {
            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed)) {
              if (isActive) {
                setDoctors(parsed);
                setIsDemoData(true);
              }
              return;
            }
          } catch {
            // Invalid saved data: fall back to the service.
          }
        }

        const result = await getDoctors();

        if (isActive) {
          setDoctors(result.doctors);
          setIsDemoData(result.isDemoData);
        }
      } catch (error) {
        console.error("Failed to load doctors:", error);
      }
    }

    loadDoctors();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const query = debouncedSearchTerm.trim().toLowerCase();

  const filteredDoctors = useMemo(() => {
    if (!query) return doctors;

    return doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialty.toLowerCase().includes(query)
    );
  }, [doctors, query]);

  const saveDoctors = useCallback((updatedDoctors) => {
    setDoctors(updatedDoctors);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedDoctors)
      );
    } catch (error) {
      console.error("Failed to save doctors:", error);
    }
  }, []);

  const addDoctor = useCallback((doctorData) => {
    const newDoctor = {
      ...doctorData,
      id: crypto.randomUUID(),
    };

    const updatedDoctors = [...doctors, newDoctor];
    saveDoctors(updatedDoctors);
  }, [doctors, saveDoctors]);

  const updateDoctor = useCallback((updatedDoctor) => {
    const updatedDoctors = doctors.map((doctor) =>
      doctor.id === updatedDoctor.id ? updatedDoctor : doctor
    );

    saveDoctors(updatedDoctors);
  }, [doctors, saveDoctors]);

  const deleteDoctor = useCallback((doctorId) => {
    const updatedDoctors = doctors.filter(
      (doctor) => doctor.id !== doctorId
    );

    saveDoctors(updatedDoctors);
  }, [doctors, saveDoctors]);

  return {
    doctors: filteredDoctors,
    isDemoData,
    searchTerm,
    setSearchTerm,
    addDoctor,
    updateDoctor,
    deleteDoctor,
  };
}
