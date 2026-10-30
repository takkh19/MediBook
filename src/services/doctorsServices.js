
const doctors = [
  {
    id: 1,
    name: "ნინო ბერიძე",
    specialty: "კარდიოლოგი",
    experience: "10 წლიანი გამოცდილება",
    initials: "ნბ",
  },
  {
    id: 2,
    name: "გიორგი მაისურაძე",
    specialty: "დერმატოლოგი",
    experience: "8 წლიანი გამოცდილება",
    initials: "გმ",
  },
  {
    id: 3,
    name: "ანა ლომიძე",
    specialty: "ნევროლოგი",
    experience: "7 წლიანი გამოცდილება",
    initials: "ალ",
  },
  {
    id: 4,
    name: "დავით კაპანაძე",
    specialty: "ოჯახის ექიმი",
    experience: "12 წლიანი გამოცდილება",
    initials: "დკ",
  },
  {
    id: 5,
    name: "მარიამ ჯაფარიძე",
    specialty: "პედიატრი",
    experience: "9 წლიანი გამოცდილება",
    initials: "მჯ",
  },
  {
    id: 6,
    name: "ლევან გელაშვილი",
    specialty: "ორთოპედი",
    experience: "11 წლიანი გამოცდილება",
    initials: "ლგ",
  },
];

// Returns local demo data if the API is unavailable.
export function getLocalDoctors() {
  return doctors;
}

// Attempts to load doctors from the API.
// If the request fails, local data is returned instead.

export async function getDoctors() {
  try {
    const API_URL =
      import.meta.env.VITE_API_URL || "http://localhost:3001";

    const response = await fetch(`${API_URL}/api/doctors`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    const doctors = Array.isArray(data) ? data : data.doctors;

    if (!Array.isArray(doctors)) {
      throw new Error("Invalid doctors data");
    }

    return {
      doctors: doctors.map((doctor) => ({
        ...doctor,
        initials: doctor.name
          .trim()
          .split(/\s+/)
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase(),
        experience:
  typeof doctor.experience === "number"
    ? `${doctor.experience} წლიანი გამოცდილება`
    : doctor.experience,
      })),
      isDemoData: false,
    };
  } catch (error) {
    console.warn("API unavailable. Using demo doctors.", error);

    return {
      doctors: getLocalDoctors(),
      isDemoData: true,
    };
  }
}

