import { render, screen, fireEvent } from "@testing-library/react";
import { Range } from "./Range";
import { RangeMode, RangeProps } from "@/types/range";

const mockTrackRect = () =>
  jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    left: 0,
    width: 100,
    right: 100,
    top: 0,
    bottom: 10,
    height: 10,
    x: 0,
    y: 0,
    toJSON: () => {},
  } as DOMRect);

afterEach(() => jest.restoreAllMocks());

describe("Range — Normal mode", () => {
  const props = { mode: RangeMode.Normal, values: [1, 100] as [number, number] };

  it("renders handles and labels with correct initial state", () => {
    render(<Range {...props} />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
    expect(screen.getByText("1€")).toBeInTheDocument();
    expect(screen.getByText("100€")).toBeInTheDocument();
  });

  it("handles have correct initial ARIA attributes", () => {
    render(<Range {...props} />);
    const [minHandle, maxHandle] = screen.getAllByRole("slider");
    
    expect(minHandle).toHaveAttribute("aria-valuenow", "1");
    expect(minHandle).toHaveAttribute("aria-valuemin", "1");
    expect(minHandle).toHaveAttribute("aria-valuemax", "100");
    
    expect(maxHandle).toHaveAttribute("aria-valuenow", "100");
    expect(maxHandle).toHaveAttribute("aria-valuemin", "1");
    expect(maxHandle).toHaveAttribute("aria-valuemax", "100");
  });

  describe("label editing", () => {
    it("clicking label opens input and Enter/blur confirms", () => {
      render(<Range {...props} />);
      fireEvent.click(screen.getByText("1€"));
      expect(screen.getByRole("spinbutton")).toBeInTheDocument();
      
      fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "30" } });
      fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "Enter" });
      expect(screen.getByText("30€")).toBeInTheDocument();

      fireEvent.click(screen.getByText("100€"));
      fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "50" } });
      fireEvent.blur(screen.getByRole("spinbutton"));
      expect(screen.getByText("50€")).toBeInTheDocument();
    });

    it("Escape closes input without updating value", () => {
      render(<Range {...props} />);
      fireEvent.click(screen.getByText("1€"));
      fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "99" } });
      fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "Escape" });
      expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
      expect(screen.getByText("1€")).toBeInTheDocument();
    });
  });

  describe("label clamping", () => {
    it("clamps values to valid range when editing", () => {
      render(<Range {...props} />);
      
      fireEvent.click(screen.getByText("1€"));
      fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "-50" } });
      fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "Enter" });
      const [minHandle] = screen.getAllByRole("slider");
      expect(minHandle).toHaveAttribute("aria-valuenow", "1");

      fireEvent.click(screen.getByText("100€"));
      fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "999" } });
      fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "Enter" });
      const [, maxHandle] = screen.getAllByRole("slider");
      expect(maxHandle).toHaveAttribute("aria-valuenow", "100");
    });
  });

  describe("dragging", () => {
    it("dragging handles updates their values", () => {
      mockTrackRect();
      const { rerender } = render(<Range {...props} />);
      const [minHandle] = screen.getAllByRole("slider");

      fireEvent.mouseDown(minHandle, { clientX: 0 });
      fireEvent.mouseMove(document, { clientX: 50 });
      fireEvent.mouseUp(document);
      expect(minHandle).toHaveAttribute("aria-valuenow", "51");
    });

    it("max handle drag updates correctly", () => {
      mockTrackRect();
      render(<Range {...props} />);
      const [, maxHandle] = screen.getAllByRole("slider");

      fireEvent.mouseDown(maxHandle, { clientX: 100 });
      fireEvent.mouseMove(document, { clientX: 50 });
      fireEvent.mouseUp(document);
      expect(maxHandle).toHaveAttribute("aria-valuenow", "51");
    });

    it("handles cannot cross each other during drag", () => {
      mockTrackRect();
      render(<Range {...props} />);
      const [minHandle] = screen.getAllByRole("slider");

      fireEvent.mouseDown(minHandle, { clientX: 0 });
      fireEvent.mouseMove(document, { clientX: 100 });
      fireEvent.mouseUp(document);
      expect(minHandle).toHaveAttribute("aria-valuenow", "100");
    });

    it("max handle cannot drag below min", () => {
      mockTrackRect();
      render(<Range {...props} />);
      const [, maxHandle] = screen.getAllByRole("slider");

      fireEvent.mouseDown(maxHandle, { clientX: 100 });
      fireEvent.mouseMove(document, { clientX: 0 });
      fireEvent.mouseUp(document);
      expect(maxHandle).toHaveAttribute("aria-valuenow", "1");
    });

    it("calls onChange callback during drag", () => {
      mockTrackRect();
      const onChange = jest.fn();
      render(<Range {...props} onChange={onChange} />);
      const [minHandle] = screen.getAllByRole("slider");

      fireEvent.mouseDown(minHandle, { clientX: 0 });
      fireEvent.mouseMove(document, { clientX: 50 });
      fireEvent.mouseUp(document);

      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith(51, 100);
    });

    it("stops updating after mouseUp", () => {
      mockTrackRect();
      render(<Range {...props} />);
      const [minHandle] = screen.getAllByRole("slider");

      fireEvent.mouseDown(minHandle, { clientX: 0 });
      fireEvent.mouseMove(document, { clientX: 50 });
      fireEvent.mouseUp(document);
      fireEvent.mouseMove(document, { clientX: 80 });

      expect(minHandle).toHaveAttribute("aria-valuenow", "51");
    });
  });

  describe("keyboard navigation", () => {
    it("arrow keys increment/decrement by 1", () => {
      render(<Range {...props} />);
      const [minHandle] = screen.getAllByRole("slider");

      fireEvent.keyDown(minHandle, { key: "ArrowRight" });
      expect(minHandle).toHaveAttribute("aria-valuenow", "2");

      fireEvent.keyDown(minHandle, { key: "ArrowLeft" });
      expect(minHandle).toHaveAttribute("aria-valuenow", "1");
    });
  });
});

describe("Range — Fixed mode", () => {
  const fixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
  const props = { mode: RangeMode.Fixed, values: fixedValues };

  it("renders handles and formats labels as currency", () => {
    render(<Range {...props as RangeProps} />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
    expect(screen.getByText("1,99 €")).toBeInTheDocument();
    expect(screen.getByText("70,99 €")).toBeInTheDocument();
  });

  it("labels are not editable", () => {
    render(<Range {...props as RangeProps} />);
    fireEvent.click(screen.getByText("1,99 €"));
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });

  it("handles snap to fixed values when dragging", () => {
    mockTrackRect();
    render(<Range {...props as RangeProps} />);
    const [minHandle, maxHandle] = screen.getAllByRole("slider");

    fireEvent.mouseDown(minHandle, { clientX: 0 });
    fireEvent.mouseMove(document, { clientX: 20 });
    fireEvent.mouseUp(document);
    expect(minHandle).toHaveAttribute("aria-valuenow", "5.99");

    fireEvent.mouseDown(maxHandle, { clientX: 100 });
    fireEvent.mouseMove(document, { clientX: 60 });
    fireEvent.mouseUp(document);
    expect(maxHandle).toHaveAttribute("aria-valuenow", "30.99");
  });

  it("handles cannot snap past each other", () => {
    mockTrackRect();
    render(<Range {...props as RangeProps} />);
    const [minHandle] = screen.getAllByRole("slider");

    fireEvent.mouseDown(minHandle, { clientX: 0 });
    fireEvent.mouseMove(document, { clientX: 100 });
    fireEvent.mouseUp(document);
    expect(minHandle).toHaveAttribute("aria-valuenow", "70.99");
  });

  describe("keyboard navigation", () => {
    it("arrow keys move between fixed values", () => {
      render(<Range {...props as RangeProps} />);
      const [minHandle, maxHandle] = screen.getAllByRole("slider");

      fireEvent.keyDown(minHandle, { key: "ArrowRight" });
      expect(minHandle).toHaveAttribute("aria-valuenow", "5.99");

      fireEvent.keyDown(minHandle, { key: "ArrowLeft" });
      expect(minHandle).toHaveAttribute("aria-valuenow", "1.99");

      fireEvent.keyDown(maxHandle, { key: "ArrowLeft" });
      expect(maxHandle).toHaveAttribute("aria-valuenow", "50.99");

      fireEvent.keyDown(maxHandle, { key: "ArrowRight" });
      expect(maxHandle).toHaveAttribute("aria-valuenow", "70.99");
    });
  });
});
