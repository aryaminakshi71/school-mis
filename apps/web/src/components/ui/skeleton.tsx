import { cn } from "../../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

function Skeleton({
  className,
  variant = "text",
  width,
  height,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200",
        {
          rounded: variant === "text",
          "rounded-full": variant === "circular",
          "rounded-lg": variant === "rectangular",
        },
        className,
      )}
      style={{
        width: width || (variant === "text" ? "100%" : undefined),
        height: height || (variant === "text" ? "1em" : undefined),
      }}
      {...props}
    />
  );
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white rounded-lg border p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton width={60} height={24} />
      </div>
      <Skeleton width={120} height={16} className="mb-2" />
      <Skeleton width={80} height={32} />
    </div>
  );
}

function SkeletonTable({
  rows = 5,
  columns = 5,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border overflow-hidden shadow-sm",
        className,
      )}
    >
      <div className="border-b p-4">
        <Skeleton width={250} height={40} />
      </div>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <Skeleton width={100} height={20} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <Skeleton width={colIndex === 0 ? 120 : 80} height={16} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Skeleton variant="circular" width={48} height={48} />
            <Skeleton width={60} height={20} />
          </div>
          <Skeleton width={100} height={14} className="mb-2" />
          <Skeleton width={80} height={32} />
        </div>
      ))}
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonStats };
