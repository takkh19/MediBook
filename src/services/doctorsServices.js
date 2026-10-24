
const doctors = [
  {
    id: 1,
    name: "ნინო ბერიძე",
    specialty: "კარდიოლოგი",
    experience: "10 წლის გამოცდილება",
    initials: "ნბ",
  },
  {
    id: 2,
    name: "გიორგი მაისურაძე",
    specialty: "დერმატოლოგი",
    experience: "8 წლის გამოცდილება",
    initials: "გმ",
  },
  {
    id: 3,
    name: "ანა ლომიძე",
    specialty: "ნევროლოგი",
    experience: "7 წლის გამოცდილება",
    initials: "ალ",
  },
  {
    id: 4,
    name: "დავით კაპანაძე",
    specialty: "ოჯახის ექიმი",
    experience: "12 წლის გამოცდილება",
    initials: "დკ",
  },
  {
    id: 5,
    name: "მარიამ ჯაფარიძე",
    specialty: "პედიატრი",
    experience: "9 წლის გამოცდილება",
    initials: "მჯ",
  },
  {
    id: 6,
    name: "ლევან გელაშვილი",
    specialty: "ორთოპედი",
    experience: "11 წლის გამოცდილება",
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
    
const response = await fetch("/api/doctors");

if (!response.ok) {
  throw new Error(`API error: ${response.status}`);
}

const contentType = response.headers.get("content-type") || "";

if (!contentType.includes("application/json")) {
  throw new Error("API returned a non-JSON response");
}

const data = await response.json();


    if (!Array.isArray(data)) {
      throw new Error("Invalid doctors data");
    }

    return {
      doctors: data,
      isDemoData: false,
    };
  } catch (error) {
    console.warn(
      "API unavailable. Using local demo doctors instead.",
      error
    );

    return {
      doctors: getLocalDoctors(),
      isDemoData: true,
    };
  }
}
