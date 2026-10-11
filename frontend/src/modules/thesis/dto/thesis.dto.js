export function validateThesis(data) {
  const errors = [];

  const id = String(data?.id ?? "").trim();
  const title = String(data?.title ?? "").trim();
  const instructor = String(data?.instructor ?? "").trim();
  const maxStudents = Number(data?.maxStudents);

  if (!id) {
    errors.push("Vui lòng nhập mã đề tài (ví dụ: DT01).");
  }
  if (!title) {
    errors.push("Vui lòng nhập tên đề tài.");
  }
  if (!instructor) {
    errors.push("Vui lòng nhập tên giảng viên hướng dẫn.");
  }
  if (isNaN(maxStudents) || maxStudents < 1) {
    errors.push("Số lượng sinh viên tối đa phải từ 1 trở lên.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function toThesisPayload(data) {
  return {
    id: String(data?.id ?? "")
      .trim()
      .toUpperCase(),
    title: String(data?.title ?? "").trim(),
    instructor: String(data?.instructor ?? "").trim(),
    maxStudents: Math.max(1, parseInt(data?.maxStudents, 10) || 1),
    currentStudents: Number(data?.currentStudents ?? 0),
  };
}

export function fromThesisResponse(raw) {
  if (!raw || typeof raw !== "object") return null;

  return {
    id: String(raw.id || "").trim(),
    title: String(raw.title || "").trim(),
    instructor: String(raw.instructor || "").trim(),
    maxStudents: Number(raw.maxStudents ?? 1),
    currentStudents: Number(raw.currentStudents ?? 0),
  };
}

export function isThesisAvailable(thesis) {
  if (!thesis) return false;
  const current = Number(thesis.currentStudents ?? 0);
  const max = Number(thesis.maxStudents ?? 1);
  return current < max;
}

export function getRemainingSlots(thesis) {
  if (!thesis) return 0;
  const current = Number(thesis.currentStudents ?? 0);
  const max = Number(thesis.maxStudents ?? 1);
  return Math.max(0, max - current);
}
