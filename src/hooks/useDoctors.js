
import { useEffect, useMemo, useState } from "react";
import { useDoctorStore } from "../store/useDoctorStore";

export function useDoctors() {
  const doctors = useDoctorStore((state) => state.doctors);
  const isDemoData = useDoctorStore((state) => state.isDemoData);
  const searchTerm = useDoctorStore((state) => state.searchTerm);
  const setSearchTerm = useDoctorStore((state) => state.setSearchTerm);
  const addDoctor = useDoctorStore((state) => state.addDoctor);
  const updateDoctor = useDoctorStore((state) => state.updateDoctor);
  const deleteDoctor = useDoctorStore((state) => state.deleteDoctor);
  const loadDoctors = useDoctorStore((state) => state.loadDoctors);

  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState(searchTerm);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filteredDoctors = useMemo(() => {
    const query = debouncedSearchTerm.trim().toLowerCase();

    if (!query) return doctors;

    return doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query)
    );
  }, [doctors, debouncedSearchTerm]);

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
