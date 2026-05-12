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
  it("formats value based on mode", () => {
    render(<RangeLabel {...baseProps} mode={RangeMode.Normal} />);
    expect(screen.getByText("50€")).toBeInTheDocument();

    render(<RangeLabel {...baseProps} mode={RangeMode.Fixed} value={1.99} />);
    expect(screen.getByText("1,99 €")).toBeInTheDocument();
  });

  it("calls onEditStart only when label is editable", () => {
    render(<RangeLabel {...baseProps} mode={RangeMode.Normal} />);
    fireEvent.click(screen.getByText("50€"));
    expect(baseProps.onEditStart).toHaveBeenCalledTimes(1);

    render(
      <RangeLabel
        {...baseProps}
        mode={RangeMode.Fixed}
        isEditable={false}
        value={50.99}
      />
    );
    fireEvent.click(screen.getByText("50,99 €"));
    expect(baseProps.onEditStart).toHaveBeenCalledTimes(1);
  });

  it("does not render input when not editing", () => {
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

  it("shows input when editing and editable", () => {
    render(<RangeLabel {...editingProps} />);
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toHaveValue(50);
  });

  it("does not show input when editing but not editable", () => {
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

  it("handles keyboard and blur events correctly", () => {
    render(<RangeLabel {...editingProps} />);
    
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "Enter" });
    expect(editingProps.onConfirm).toHaveBeenCalled();

    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "Escape" });
    expect(editingProps.onCancel).toHaveBeenCalled();

    fireEvent.blur(screen.getByRole("spinbutton"));
    expect(editingProps.onConfirm).toHaveBeenCalledTimes(2);
  });

  it("calls onInputChange when typing", () => {
    render(<RangeLabel {...editingProps} />);
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "75" } });
    expect(editingProps.onInputChange).toHaveBeenCalled();
  });
});
