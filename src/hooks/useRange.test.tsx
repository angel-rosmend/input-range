import { renderHook, act } from "@testing-library/react";
import { useRange } from "./useRange";
import { RangeMode } from "@/types/range";

describe("useRange — Normal mode", () => {
  const values: [number, number] = [1, 100];
  const mode = RangeMode.Normal;

  it("initializes with correct values", () => {
    const { result } = renderHook(() => useRange(values, mode));
    expect(result.current.currentMin).toBe(1);
    expect(result.current.currentMax).toBe(100);
    expect(result.current.initialMin).toBe(1);
    expect(result.current.initialMax).toBe(100);
  });

  it("initializes isDragging and editActive as null", () => {
    const { result } = renderHook(() => useRange(values, mode));
    expect(result.current.isDragging).toBeNull();
    expect(result.current.editActive).toBeNull();
  });

  it("initializes percentages at 0 and 100", () => {
    const { result } = renderHook(() => useRange(values, mode));
    expect(result.current.minPercent).toBe(0);
    expect(result.current.maxPercent).toBe(100);
  });

  it("handleMinDragStart sets isDragging to 'min'", () => {
    const { result } = renderHook(() => useRange(values, mode));
    act(() => {
      result.current.handleMinDragStart({
        preventDefault: jest.fn(),
      } as unknown as React.MouseEvent);
    });
    expect(result.current.isDragging).toBe("min");
  });

  it("handleMaxDragStart sets isDragging to 'max'", () => {
    const { result } = renderHook(() => useRange(values, mode));
    act(() => {
      result.current.handleMaxDragStart({
        preventDefault: jest.fn(),
      } as unknown as React.MouseEvent);
    });
    expect(result.current.isDragging).toBe("max");
  });

  it("setEditActive updates editActive state", () => {
    const { result } = renderHook(() => useRange(values, mode));
    act(() => { result.current.setEditActive("min"); });
    expect(result.current.editActive).toBe("min");
    act(() => { result.current.setEditActive(null); });
    expect(result.current.editActive).toBeNull();
  });

  describe("handleMinLabelConfirm", () => {
    it("updates currentMin with a valid value", () => {
      const { result } = renderHook(() => useRange(values, mode));
      act(() => { result.current.setMinInputValue("50"); });
      act(() => { result.current.handleMinLabelConfirm(); });
      expect(result.current.currentMin).toBe(50);
    });

    it("clamps value below initialMin", () => {
      const { result } = renderHook(() => useRange(values, mode));
      act(() => { result.current.setMinInputValue("-10"); });
      act(() => { result.current.handleMinLabelConfirm(); });
      expect(result.current.currentMin).toBe(1);
    });

    it("clamps value above currentMax", () => {
      const { result } = renderHook(() => useRange(values, mode));
      act(() => { result.current.setMinInputValue("200"); });
      act(() => { result.current.handleMinLabelConfirm(); });
      expect(result.current.currentMin).toBe(100);
    });

    it("ignores NaN and keeps currentMin unchanged", () => {
      const { result } = renderHook(() => useRange(values, mode));
      act(() => { result.current.setMinInputValue("abc"); });
      act(() => { result.current.handleMinLabelConfirm(); });
      expect(result.current.currentMin).toBe(1);
    });

    it("closes edit mode after confirm", () => {
      const { result } = renderHook(() => useRange(values, mode));
      act(() => { result.current.setEditActive("min"); });
      act(() => { result.current.handleMinLabelConfirm(); });
      expect(result.current.editActive).toBeNull();
    });
  });

  describe("handleMaxLabelConfirm", () => {
    it("updates currentMax with a valid value", () => {
      const { result } = renderHook(() => useRange(values, mode));
      act(() => { result.current.setMaxInputValue("75"); });
      act(() => { result.current.handleMaxLabelConfirm(); });
      expect(result.current.currentMax).toBe(75);
    });

    it("clamps value above initialMax", () => {
      const { result } = renderHook(() => useRange(values, mode));
      act(() => { result.current.setMaxInputValue("200"); });
      act(() => { result.current.handleMaxLabelConfirm(); });
      expect(result.current.currentMax).toBe(100);
    });

    it("clamps value below currentMin", () => {
      const { result } = renderHook(() => useRange(values, mode));
      act(() => { result.current.setMaxInputValue("0"); });
      act(() => { result.current.handleMaxLabelConfirm(); });
      expect(result.current.currentMax).toBe(1);
    });

    it("ignores NaN and keeps currentMax unchanged", () => {
      const { result } = renderHook(() => useRange(values, mode));
      act(() => { result.current.setMaxInputValue("abc"); });
      act(() => { result.current.handleMaxLabelConfirm(); });
      expect(result.current.currentMax).toBe(100);
    });

    it("closes edit mode after confirm", () => {
      const { result } = renderHook(() => useRange(values, mode));
      act(() => { result.current.setEditActive("max"); });
      act(() => { result.current.handleMaxLabelConfirm(); });
      expect(result.current.editActive).toBeNull();
    });
  });

  describe("input sync with current values", () => {
    it("minInputValue syncs with currentMin after drag (not editing)", () => {
      const { result } = renderHook(() => useRange(values, mode));
      act(() => { result.current.setMinInputValue("50"); });
      act(() => { result.current.handleMinLabelConfirm(); });
      expect(result.current.minInputValue).toBe("50");
    });

    it("minInputValue does NOT sync when editActive is 'min'", () => {
      const { result } = renderHook(() => useRange(values, mode));
      act(() => { result.current.setEditActive("min"); });
      act(() => { result.current.setMinInputValue("typing..."); });
      expect(result.current.minInputValue).toBe("typing...");
    });
  });
});

describe("useRange — Fixed mode", () => {
  const values = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
  const mode = RangeMode.Fixed;

  it("initializes with first and last values", () => {
    const { result } = renderHook(() => useRange(values, mode));
    expect(result.current.currentMin).toBe(1.99);
    expect(result.current.currentMax).toBe(70.99);
  });

  it("initializes percentages at 0 and 100", () => {
    const { result } = renderHook(() => useRange(values, mode));
    expect(result.current.minPercent).toBe(0);
    expect(result.current.maxPercent).toBe(100);
  });

  it("minPercent is 20% after setting currentMin to the second value", () => {
    const { result } = renderHook(() => useRange(values, mode));
    // confirm 5.99 as min (index 1 of 5 → 20%)
    act(() => { result.current.setMinInputValue("5.99"); });
    act(() => { result.current.handleMinLabelConfirm(); });
    expect(result.current.currentMin).toBe(5.99);
    expect(result.current.minPercent).toBe(20);
  });

  it("minPercent is 40% after setting currentMin to the third value", () => {
    const { result } = renderHook(() => useRange(values, mode));
    act(() => { result.current.setMinInputValue("10.99"); });
    act(() => { result.current.handleMinLabelConfirm(); });
    expect(result.current.minPercent).toBe(40);
  });

  it("clamps min below initialMin", () => {
    const { result } = renderHook(() => useRange(values, mode));
    act(() => { result.current.setMinInputValue("0"); });
    act(() => { result.current.handleMinLabelConfirm(); });
    expect(result.current.currentMin).toBe(1.99);
  });

  it("clamps max above initialMax", () => {
    const { result } = renderHook(() => useRange(values, mode));
    act(() => { result.current.setMaxInputValue("999"); });
    act(() => { result.current.handleMaxLabelConfirm(); });
    expect(result.current.currentMax).toBe(70.99);
  });
});
