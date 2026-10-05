import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import ThesisTable from "../ThesisTable.svelte";

describe("ThesisTable Component (Dumb Component Unit Tests)", () => {
  const sampleTheses = [
    {
      id: "DT01",
      title: "Hệ thống SOA Spring",
      instructor: "TS. Nguyễn Văn A",
      maxStudents: 3,
      currentStudents: 1,
    },
    {
      id: "DT02",
      title: "Kiến trúc Microservices",
      instructor: "ThS. Trần Thị B",
      maxStudents: 2,
      currentStudents: 2,
    },
  ];

  it("renders table headers and thesis data correctly", () => {
    render(ThesisTable, {
      props: {
        theses: sampleTheses,
      },
    });

    expect(screen.getByText("DT01")).toBeInTheDocument();
    expect(screen.getByText("Hệ thống SOA Spring")).toBeInTheDocument();
    expect(screen.getByText("TS. Nguyễn Văn A")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    expect(screen.getByText("Còn nhận")).toBeInTheDocument();

    expect(screen.getByText("DT02")).toBeInTheDocument();
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    expect(screen.getByText("Đã đủ")).toBeInTheDocument();
  });

  it("displays empty state message when theses list is empty", () => {
    render(ThesisTable, {
      props: {
        theses: [],
      },
    });

    expect(
      screen.getByText("Không có đề tài nào phù hợp."),
    ).toBeInTheDocument();
  });

  it("triggers onEdit callback when clicking edit button", async () => {
    const onEditMock = vi.fn();
    render(ThesisTable, {
      props: {
        theses: sampleTheses,
        onEdit: onEditMock,
      },
    });

    const editBtn = screen.getByRole("button", { name: /sửa đề tài DT01/i });
    await fireEvent.click(editBtn);

    expect(onEditMock).toHaveBeenCalledTimes(1);
    expect(onEditMock).toHaveBeenCalledWith(sampleTheses[0]);
  });

  it("triggers onDelete callback when clicking delete button", async () => {
    const onDeleteMock = vi.fn();
    render(ThesisTable, {
      props: {
        theses: sampleTheses,
        onDelete: onDeleteMock,
      },
    });

    const deleteBtn = screen.getByRole("button", { name: /xóa đề tài DT02/i });
    await fireEvent.click(deleteBtn);

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledWith(sampleTheses[1]);
  });

  it("filters rows based on search input", async () => {
    render(ThesisTable, {
      props: {
        theses: sampleTheses,
      },
    });

    const searchInput = screen.getByRole("searchbox", {
      name: /tìm kiếm đề tài/i,
    });
    await fireEvent.input(searchInput, { target: { value: "Microservices" } });

    expect(screen.queryByText("Hệ thống SOA Spring")).not.toBeInTheDocument();
    expect(screen.getByText("Kiến trúc Microservices")).toBeInTheDocument();
  });
});
