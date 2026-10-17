
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

/**
 * Returns the list of doctors.
 * @returns {import("../types/doctorTypes").Doctor[]}
 */

export function getDoctors() {
  return doctors;
}
