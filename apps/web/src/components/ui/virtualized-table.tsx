import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { forwardRef, useRef } from "react";

interface VirtualizedTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    header: string;
    width?: number;
    render?: (value: any, item: T) => React.ReactNode;
  }[];
  rowHeight?: number;
  className?: string;
  onRowClick?: (item: T) => void;
}

export const VirtualizedTable = forwardRef<
  HTMLDivElement,
  VirtualizedTableProps<any>
>(({ data, columns, rowHeight = 48, className, onRowClick }, ref) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
  });

  return (
    <div
      ref={ref || parentRef}
      className={cn("overflow-hidden rounded-md border", className)}
      style={{ height: "400px" }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-muted">
        <div className="flex">
          {columns.map((column) => (
            <div
              key={column.key as string}
              className="border-r px-4 py-2 font-medium text-sm last:border-r-0"
              style={{
                width: column.width || "auto",
                minWidth: column.width || 120,
              }}
            >
              {column.header}
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = data[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              className={cn(
                "flex cursor-pointer border-b hover:bg-muted/50",
                onRowClick && "cursor-pointer",
              )}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <div
                  key={column.key as string}
                  className="flex items-center border-r px-4 py-2 text-sm last:border-r-0"
                  style={{
                    width: column.width || "auto",
                    minWidth: column.width || 120,
                  }}
                >
                  {column.render
                    ? column.render(item[column.key], item)
                    : String(item[column.key] || "")}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
});

VirtualizedTable.displayName = "VirtualizedTable";
