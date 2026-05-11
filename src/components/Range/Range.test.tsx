import { render, screen, fireEvent } from "@testing-library/react";
import { Range } from "./Range";
import { RangeMode } from "@/types/range";

// Gives the track a measurable width so getValueFromPosition works
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

// ─── Normal mode ──────────────────────────────────────────────────────────────

describe("Range — Normal mode", () => {
  const props = { mode: RangeMode.Normal, values: [1, 100] as [number, number] };

  it("renders two slider handles", () => {
    render(<Range {...props} />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });

  it("renders initial min and max labels", () => {
    render(<Range {...props} />);
    expect(screen.getByText("1€")).toBeInTheDocument();
    expect(screen.getByText("100€")).toBeInTheDocument();
  });

  it("min handle has correct initial ARIA attributes", () => {
    render(<Range {...props} />);
    const [minHandle] = screen.getAllByRole("slider");
    expect(minHandle).toHaveAttribute("aria-valuenow", "1");
    expect(minHandle).toHaveAttribute("aria-valuemin", "1");
    expect(minHandle).toHaveAttribute("aria-valuemax", "100");
  });

  it("max handle has correct initial ARIA attributes", () => {
    render(<Range {...props} />);
    const [, maxHandle] = screen.getAllByRole("slider");
    expect(maxHandle).toHaveAttribute("aria-valuenow", "100");
    expect(maxHandle).toHaveAttribute("aria-valuemin", "1");
    expect(maxHandle).toHaveAttribute("aria-valuemax", "100");
  });

  // ── Label editing ────────────────────────────────────────────────────────

  it("clicking min label opens an input", () => {
    render(<Range {...props} />);
    fireEvent.click(screen.getByText("1€"));
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("clicking max label opens an input", () => {
    render(<Range {...props} />);
    fireEvent.click(screen.getByText("100€"));
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("Enter confirms and updates the min label", () => {
    render(<Range {...props} />);
    fireEvent.click(screen.getByText("1€"));
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "30" },
    });
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "Enter" });
    expect(screen.getByText("30€")).toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });

  it("blur confirms and updates the min label", () => {
    render(<Range {...props} />);
    fireEvent.click(screen.getByText("1€"));
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "20" },
    });
    fireEvent.blur(screen.getByRole("spinbutton"));
    expect(screen.getByText("20€")).toBeInTheDocument();
  });

  it("Escape closes the input without updating the value", () => {
    render(<Range {...props} />);
    fireEvent.click(screen.getByText("1€"));
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "99" },
    });
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "Escape" });
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
    expect(screen.getByText("1€")).toBeInTheDocument();
  });

  // ── Clamping via labels ──────────────────────────────────────────────────

  it("clamps min below initialMin", () => {
    render(<Range {...props} />);
    fireEvent.click(screen.getByText("1€"));
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "-50" },
    });
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "Enter" });
    const [minHandle] = screen.getAllByRole("slider");
    expect(minHandle).toHaveAttribute("aria-valuenow", "1");
  });

  it("clamps min above currentMax", () => {
    render(<Range {...props} />);
    fireEvent.click(screen.getByText("1€"));
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "200" },
    });
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "Enter" });
    const [minHandle] = screen.getAllByRole("slider");
    expect(minHandle).toHaveAttribute("aria-valuenow", "100");
  });

  it("clamps max above initialMax", () => {
    render(<Range {...props} />);
    fireEvent.click(screen.getByText("100€"));
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "999" },
    });
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "Enter" });
    const [, maxHandle] = screen.getAllByRole("slider");
    expect(maxHandle).toHaveAttribute("aria-valuenow", "100");
  });

  it("clamps max below currentMin", () => {
    render(<Range {...props} />);
    fireEvent.click(screen.getByText("100€"));
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "-10" },
    });
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "Enter" });
    const [, maxHandle] = screen.getAllByRole("slider");
    expect(maxHandle).toHaveAttribute("aria-valuenow", "1");
  });

  // ── Drag ────────────────────────────────────────────────────────────────

  it("dragging min handle updates its aria-valuenow", () => {
    mockTrackRect();
    render(<Range {...props} />);
    const [minHandle] = screen.getAllByRole("slider");

    fireEvent.mouseDown(minHandle, { clientX: 0 });
    fireEvent.mouseMove(document, { clientX: 50 });
    fireEvent.mouseUp(document);

    // track[left=0, width=100], clientX=50 → 50% → Math.round(1 + 0.5*99) = 51
    expect(minHandle).toHaveAttribute("aria-valuenow", "51");
  });

  it("dragging max handle updates its aria-valuenow", () => {
    mockTrackRect();
    render(<Range {...props} />);
    const [, maxHandle] = screen.getAllByRole("slider");

    fireEvent.mouseDown(maxHandle, { clientX: 100 });
    fireEvent.mouseMove(document, { clientX: 25 });
    fireEvent.mouseUp(document);

    // clientX=25 → 25% → Math.round(1 + 0.25*99) = Math.round(25.75) = 26
    expect(maxHandle).toHaveAttribute("aria-valuenow", "26");
  });

  it("min handle cannot drag past max handle", () => {
    mockTrackRect();
    render(<Range {...props} />);
    const [minHandle] = screen.getAllByRole("slider");

    fireEvent.mouseDown(minHandle, { clientX: 0 });
    fireEvent.mouseMove(document, { clientX: 100 }); // try to reach 100%
    fireEvent.mouseUp(document);

    // clamped to currentMax (100)
    expect(minHandle).toHaveAttribute("aria-valuenow", "100");
  });

  it("max handle cannot drag below min handle", () => {
    mockTrackRect();
    render(<Range {...props} />);
    const [, maxHandle] = screen.getAllByRole("slider");

    fireEvent.mouseDown(maxHandle, { clientX: 100 });
    fireEvent.mouseMove(document, { clientX: 0 }); // try to reach 0%
    fireEvent.mouseUp(document);

    // clamped to currentMin (1)
    expect(maxHandle).toHaveAttribute("aria-valuenow", "1");
  });

  it("calls onChange when a handle is dragged", () => {
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
    fireEvent.mouseMove(document, { clientX: 80 }); // after release

    expect(minHandle).toHaveAttribute("aria-valuenow", "51"); // unchanged after mouseUp
  });
});

// ─── Fixed mode ───────────────────────────────────────────────────────────────

describe("Range — Fixed mode", () => {
  const fixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
  const props = { mode: RangeMode.Fixed, values: fixedValues };

  it("renders two slider handles", () => {
    render(<Range {...props} />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });

  it("renders min and max labels with currency format", () => {
    render(<Range {...props} />);
    expect(screen.getByText("1,99 €")).toBeInTheDocument();
    expect(screen.getByText("70,99 €")).toBeInTheDocument();
  });

  it("labels are NOT editable — clicking does not open an input", () => {
    render(<Range {...props} />);
    fireEvent.click(screen.getByText("1,99 €"));
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });

  it("min handle has correct initial ARIA attributes", () => {
    render(<Range {...props} />);
    const [minHandle] = screen.getAllByRole("slider");
    expect(minHandle).toHaveAttribute("aria-valuenow", "1.99");
    expect(minHandle).toHaveAttribute("aria-valuemin", "1.99");
    expect(minHandle).toHaveAttribute("aria-valuemax", "70.99");
  });

  it("drag min handle snaps to nearest fixed value", () => {
    mockTrackRect();
    render(<Range {...props} />);
    const [minHandle] = screen.getAllByRole("slider");

    // 6 values → positions at 0%, 20%, 40%, 60%, 80%, 100%
    // clientX=20 → 20% → index = Math.round(0.2 * 5) = 1 → values[1] = 5.99
    fireEvent.mouseDown(minHandle, { clientX: 0 });
    fireEvent.mouseMove(document, { clientX: 20 });
    fireEvent.mouseUp(document);

    expect(minHandle).toHaveAttribute("aria-valuenow", "5.99");
  });

  it("drag max handle snaps to nearest fixed value", () => {
    mockTrackRect();
    render(<Range {...props} />);
    const [, maxHandle] = screen.getAllByRole("slider");

    // clientX=60 → 60% → index = Math.round(0.6 * 5) = 3 → values[3] = 30.99
    fireEvent.mouseDown(maxHandle, { clientX: 100 });
    fireEvent.mouseMove(document, { clientX: 60 });
    fireEvent.mouseUp(document);

    expect(maxHandle).toHaveAttribute("aria-valuenow", "30.99");
  });

  it("min handle cannot snap past max handle position", () => {
    mockTrackRect();
    render(<Range {...props} />);
    const [minHandle] = screen.getAllByRole("slider");

    // drag min to 100% — should clamp to currentMax (70.99)
    fireEvent.mouseDown(minHandle, { clientX: 0 });
    fireEvent.mouseMove(document, { clientX: 100 });
    fireEvent.mouseUp(document);

    expect(minHandle).toHaveAttribute("aria-valuenow", "70.99");
  });
});
