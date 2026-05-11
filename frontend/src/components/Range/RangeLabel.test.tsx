import { render, screen, fireEvent } from "@testing-library/react";
import { RangeLabel } from "./RangeLabel";
import { RangeMode } from "@/types/range";

const baseProps = {
  value: 50,
  isEditable: true,
  isEditing: false,
  inputValue: "50",
  onInputChange: jest.fn(),
  onConfirm: jest.fn(),
  onCancel: jest.fn(),
  onEditStart: jest.fn(),
};

afterEach(() => jest.clearAllMocks());

describe("RangeLabel — display (not editing)", () => {
  it("shows value with € suffix in Normal mode", () => {
    render(<RangeLabel {...baseProps} mode={RangeMode.Normal} />);
    expect(screen.getByText("50€")).toBeInTheDocument();
  });

  it("shows formatted currency in Fixed mode", () => {
    render(
      <RangeLabel {...baseProps} mode={RangeMode.Fixed} value={1.99} />
    );
    expect(screen.getByText("1,99 €")).toBeInTheDocument();
  });

  it("calls onEditStart when clicking an editable label", () => {
    render(<RangeLabel {...baseProps} mode={RangeMode.Normal} />);
    fireEvent.click(screen.getByText("50€"));
    expect(baseProps.onEditStart).toHaveBeenCalledTimes(1);
  });

  it("does NOT call onEditStart when clicking a non-editable label", () => {
    render(
      <RangeLabel
        {...baseProps}
        mode={RangeMode.Fixed}
        isEditable={false}
        value={50.99}
      />
    );
    fireEvent.click(screen.getByText("50,99 €"));
    expect(baseProps.onEditStart).not.toHaveBeenCalled();
  });

  it("does not render an input when not editing", () => {
    render(<RangeLabel {...baseProps} mode={RangeMode.Normal} />);
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });
});

describe("RangeLabel — editing", () => {
  const editingProps = {
    ...baseProps,
    mode: RangeMode.Normal,
    isEditing: true,
  };

  it("shows input when isEditing and isEditable", () => {
    render(<RangeLabel {...editingProps} />);
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("input reflects the current inputValue", () => {
    render(<RangeLabel {...editingProps} inputValue="42" />);
    expect(screen.getByRole("spinbutton")).toHaveValue(42);
  });

  it("does NOT show input when isEditing but isEditable is false", () => {
    render(
      <RangeLabel
        {...editingProps}
        isEditable={false}
        mode={RangeMode.Fixed}
        value={50.99}
      />
    );
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });

  it("calls onConfirm on Enter key", () => {
    render(<RangeLabel {...editingProps} />);
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "Enter" });
    expect(editingProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel on Escape key", () => {
    render(<RangeLabel {...editingProps} />);
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "Escape" });
    expect(editingProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm on blur", () => {
    render(<RangeLabel {...editingProps} />);
    fireEvent.blur(screen.getByRole("spinbutton"));
    expect(editingProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onInputChange when typing", () => {
    render(<RangeLabel {...editingProps} />);
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "75" },
    });
    expect(editingProps.onInputChange).toHaveBeenCalledTimes(1);
  });
});
