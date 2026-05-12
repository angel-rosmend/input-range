import { renderHook, act } from "@testing-library/react";
import { useRange } from "./useRange";
import { RangeMode } from "@/types/range";

describe("useRange — Normal mode", () => {
  const values: [number, number] = [1, 100];
  const mode = RangeMode.Normal;

  it("initializes with correct values and states", () => {
    const { result } = renderHook(() => useRange(values, mode));
    expect(result.current.currentMin).toBe(1);
    expect(result.current.currentMax).toBe(100);
    expect(result.current.initialMin).toBe(1);
    expect(result.current.initialMax).toBe(100);
    expect(result.current.isDragging).toBeNull();
    expect(result.current.editActive).toBeNull();
  });

  it("initializes percentages at 0 and 100", () => {
    const { result } = renderHook(() => useRange(values, mode));
    expect(result.current.minPercent).toBe(0);
    expect(result.current.maxPercent).toBe(100);
  });

  it("drag start handlers set isDragging correctly", () => {
    const { result } = renderHook(() => useRange(values, mode));
    act(() => {
      result.current.handleMinDragStart({
        preventDefault: jest.fn(),
      } as unknown as React.MouseEvent);
    });
    expect(result.current.isDragging).toBe("min");

    act(() => {
      result.current.handleMaxDragStart({
        preventDefault: jest.fn(),
      } as unknown as React.MouseEvent);
    });
    expect(result.current.isDragging).toBe("max");
  });

  it("setEditActive updates and clears editActive state", () => {
    const { result } = renderHook(() => useRange(values, mode));
    act(() => { result.current.setEditActive("min"); });
    expect(result.current.editActive).toBe("min");
    act(() => { result.current.setEditActive(null); });
    expect(result.current.editActive).toBeNull();
  });

  describe("arrow key navigation", () => {
    it("right arrow increments value by 1", () => {
      const { result } = renderHook(() => useRange(values, mode));
      act(() => {
        result.current.handleKeyDown("min", { key: "ArrowRight", preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
      });
      expect(result.current.currentMin).toBe(2);
    });
  });

  describe("handleMinLabelConfirm", () => {
    it("updates currentMin with valid value and closes edit mode", () => {
      const { result } = renderHook(() => useRange(values, mode));
      act(() => { result.current.setEditActive("min"); });
      act(() => { result.current.setMinInputValue("50"); });
      act(() => { result.current.handleMinLabelConfirm(); });
      expect(result.current.currentMin).toBe(50);
      expect(result.current.editActive).toBeNull();
    });

    it("clamps value to valid range and ignores NaN", () => {
      const { result } = renderHook(() => useRange(values, mode));
      
      act(() => { result.current.setMinInputValue("-10"); });
      act(() => { result.current.handleMinLabelConfirm(); });
      expect(result.current.currentMin).toBe(1);

      act(() => { result.current.setMinInputValue("200"); });
      act(() => { result.current.handleMinLabelConfirm(); });
      expect(result.current.currentMin).toBe(100);

      act(() => { result.current.setMinInputValue("abc"); });
      act(() => { result.current.handleMinLabelConfirm(); });
      expect(result.current.currentMin).toBe(100);
    });
  });

  describe("handleMaxLabelConfirm", () => {
    it("updates currentMax with valid value and closes edit mode", () => {
      const { result } = renderHook(() => useRange(values, mode));
      act(() => { result.current.setEditActive("max"); });
      act(() => { result.current.setMaxInputValue("75"); });
      act(() => { result.current.handleMaxLabelConfirm(); });
      expect(result.current.currentMax).toBe(75);
      expect(result.current.editActive).toBeNull();
    });

    it("clamps value to valid range and ignores NaN", () => {
      const { result } = renderHook(() => useRange(values, mode));
      
      act(() => { result.current.setMaxInputValue("200"); });
      act(() => { result.current.handleMaxLabelConfirm(); });
      expect(result.current.currentMax).toBe(100);

      act(() => { result.current.setMaxInputValue("0"); });
      act(() => { result.current.handleMaxLabelConfirm(); });
      expect(result.current.currentMax).toBe(1);

      act(() => { result.current.setMaxInputValue("abc"); });
      act(() => { result.current.handleMaxLabelConfirm(); });
      expect(result.current.currentMax).toBe(1);
    });
  });

  it("minInputValue syncs with currentMin but not while editing", () => {
    const { result } = renderHook(() => useRange(values, mode));
    
    act(() => { result.current.setMinInputValue("50"); });
    act(() => { result.current.handleMinLabelConfirm(); });
    expect(result.current.minInputValue).toBe("50");

    act(() => { result.current.setEditActive("min"); });
    act(() => { result.current.setMinInputValue("typing..."); });
    expect(result.current.minInputValue).toBe("typing...");
  });
});

describe("useRange — Fixed mode", () => {
  const values = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
  const mode = RangeMode.Fixed;

  it("initializes with first and last values, percentages at 0 and 100", () => {
    const { result } = renderHook(() => useRange(values, mode));
    expect(result.current.currentMin).toBe(1.99);
    expect(result.current.currentMax).toBe(70.99);
    expect(result.current.minPercent).toBe(0);
    expect(result.current.maxPercent).toBe(100);
  });

  it("minPercent adjusts to correct index positions", () => {
    const { result } = renderHook(() => useRange(values, mode));
    
    act(() => { result.current.setMinInputValue("5.99"); });
    act(() => { result.current.handleMinLabelConfirm(); });
    expect(result.current.minPercent).toBe(20);

    act(() => { result.current.setMinInputValue("10.99"); });
    act(() => { result.current.handleMinLabelConfirm(); });
    expect(result.current.minPercent).toBe(40);
  });

  it("clamps values to initialMin and initialMax", () => {
    const { result } = renderHook(() => useRange(values, mode));
    
    act(() => { result.current.setMinInputValue("0"); });
    act(() => { result.current.handleMinLabelConfirm(); });
    expect(result.current.currentMin).toBe(1.99);

    act(() => { result.current.setMaxInputValue("999"); });
    act(() => { result.current.handleMaxLabelConfirm(); });
    expect(result.current.currentMax).toBe(70.99);
  });

  describe("arrow key navigation", () => {
    it("right arrow moves to next value", () => {
      const { result } = renderHook(() => useRange(values, mode));
      act(() => {
        result.current.handleKeyDown("min", { key: "ArrowRight", preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
      });
      expect(result.current.currentMin).toBe(5.99);
    });

    it("left arrow moves to previous value", () => {
      const customValues = [1.99, 5.99, 10.99, 30.99];
      const { result } = renderHook(() => useRange(customValues, mode));
      
      // Navigate to 10.99 step by step
      act(() => {
        result.current.handleKeyDown("min", { key: "ArrowRight", preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
      });
      act(() => {
        result.current.handleKeyDown("min", { key: "ArrowRight", preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
      });
      expect(result.current.currentMin).toBe(10.99);
      
      // Now press left to go to previous
      act(() => {
        result.current.handleKeyDown("min", { key: "ArrowLeft", preventDefault: jest.fn() } as unknown as React.KeyboardEvent);
      });
      expect(result.current.currentMin).toBe(5.99);
    });
  });
});
