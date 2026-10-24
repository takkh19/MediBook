
import { useCallback, useEffect, useMemo, useState } from "react";
import { getDoctors } from "../services/doctorsServices";

export function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [isDemoData, setIsDemoData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadDoctors() {
      const result = await getDoctors();

      if (isActive) {
        setDoctors(result.doctors);
        setIsDemoData(result.isDemoData);
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

  // Recalculate the filtered list only when the source list or query changes.
  const filteredDoctors = useMemo(() => {
    if (!query) return doctors;

    return doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialty.toLowerCase().includes(query)
    );
  }, [doctors, query]);

  const addDoctor = useCallback((doctorData) => {
    const newDoctor = {
      ...doctorData,
      id: Date.now(),
    };

    setDoctors((currentDoctors) => [...currentDoctors, newDoctor]);
  }, []);

  const updateDoctor = useCallback((updatedDoctor) => {
    setDoctors((currentDoctors) =>
      currentDoctors.map((doctor) =>
        doctor.id === updatedDoctor.id ? updatedDoctor : doctor
      )
    );
  }, []);

  const deleteDoctor = useCallback((doctorId) => {
    setDoctors((currentDoctors) =>
      currentDoctors.filter((doctor) => doctor.id !== doctorId)
    );
  }, []);

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
