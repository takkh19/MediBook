import { useState } from "react";
import { getDoctors } from "../services/doctorsServices";

export function useDoctors() {
  const [doctors] = useState(() => getDoctors());

  return { doctors };
}