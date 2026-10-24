
import { useEffect, useState } from "react";
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

  const filteredDoctors = doctors.filter((doctor) => {
    return (
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialty.toLowerCase().includes(query)
    );
  });

  function addDoctor(doctorData) {
    const newDoctor = {
      ...doctorData,
      id: Date.now(),
    };

    setDoctors((currentDoctors) => [...currentDoctors, newDoctor]);
  }

  function updateDoctor(updatedDoctor) {
    setDoctors((currentDoctors) =>
      currentDoctors.map((doctor) =>
        doctor.id === updatedDoctor.id ? updatedDoctor : doctor
      )
    );
  }

  function deleteDoctor(doctorId) {
    setDoctors((currentDoctors) =>
      currentDoctors.filter((doctor) => doctor.id !== doctorId)
    );
  }

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
