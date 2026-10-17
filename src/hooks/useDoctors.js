
import { useEffect, useState } from "react";
import { getDoctors } from "../services/doctorsServices";

export function useDoctors() {
  const [doctors] = useState(() => getDoctors());
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filteredDoctors = doctors.filter((doctor) => {
    const query = debouncedSearchTerm.trim().toLowerCase();

    return (
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialty.toLowerCase().includes(query)
    );
  });

  return {
    doctors: filteredDoctors,
    searchTerm,
    setSearchTerm,
  };
}
