import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";

import { type Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div
      onClick={column.getToggleSortingHandler()}
      className={cn(
        column.columnDef.enableSorting === true
          ? "-mx-2 inline-flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1 hover:bg-[#F14A16] hover:dark:bg-gray-900"
          : "",
      )}
    >
      <span>{title}</span>
      {column.getCanSort() ? (
        <div className="-space-y-2">
          <RiArrowUpSLine
            className={cn(
              "size-3.5 text-white dark:text-gray-50",
              column.getIsSorted() === "desc" ? "opacity-30" : "",
            )}
            aria-hidden="true"
          />
          <RiArrowDownSLine
            className={cn(
              "size-3.5 text-white dark:text-gray-50",
              column.getIsSorted() === "asc" ? "opacity-30" : "",
            )}
            aria-hidden="true"
          />
        </div>
      ) : null}
    </div>
  );
}
