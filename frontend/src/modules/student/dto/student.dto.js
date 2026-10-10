export function validateStudent(data) {
  const errors = [];

  const studentId = String(data?.studentId ?? "").trim();
  const fullName = String(data?.fullName ?? "").trim();
  const className = String(data?.className ?? "").trim();
  const gpa = Number(data?.gpa);

  if (!studentId) {
    errors.push("Vui lòng nhập Mã số sinh viên (MSSV).");
  }
  if (!fullName) {
    errors.push("Vui lòng nhập Họ và tên sinh viên.");
  }
  if (!className) {
    errors.push("Vui lòng nhập Lớp sinh hoạt.");
  }
  if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
    errors.push("Điểm GPA phải nằm trong khoảng từ 0.0 đến 4.0.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function toStudentPayload(data) {
  const cleanId = String(data?.studentId ?? "")
    .trim()
    .toUpperCase();
  const cleanEmail = data?.email ? String(data.email).trim() : "";
  const gpa = Number(data?.gpa ?? 3.0);
  const eligible =
    data?.eligible !== undefined ? Boolean(data.eligible) : gpa >= 2.5;

  return {
    studentId: cleanId,
    fullName: String(data?.fullName ?? "").trim(),
    className: String(data?.className ?? "").trim().toUpperCase(),
    email: cleanEmail || (cleanId ? `${cleanId.toLowerCase()}@soa.edu.vn` : ""),
    gpa: Number(gpa.toFixed(2)),
    eligible,
  };
}

export function fromStudentResponse(raw) {
  if (!raw || typeof raw !== "object") return null;

  const studentId = String(raw.studentId || raw.id || "").trim();
  const gpa =
    raw.gpa !== undefined && raw.gpa !== null ? Number(raw.gpa) : null;
  const eligible =
    raw.eligible !== undefined
      ? Boolean(raw.eligible)
      : gpa !== null
        ? gpa >= 2.5
        : true;

  return {
    studentId,
    id: studentId,
    fullName: String(raw.fullName || "").trim(),
    className: String(raw.className || "").trim(),
    email: String(raw.email || "").trim(),
    gpa,
    eligible,
  };
}

export function isStudentEligible(student) {
  if (!student) return false;
  if (student.eligible !== undefined) return Boolean(student.eligible);
  if (student.gpa !== undefined && student.gpa !== null) {
    return Number(student.gpa) >= 2.5;
  }
  return true;
}
