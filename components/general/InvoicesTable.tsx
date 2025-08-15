"use client";

import React from "react";
import Link from "next/link";
import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type Table as ReactTableType,
} from "@tanstack/react-table";

import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@clerk/nextjs";
import { useInvoices } from "@/hooks/useInvoice";
import { InvoiceInterface } from "@/types";
import { toast } from "sonner";
import { getInvoices } from "@/lib/utils";
import { formatAmount } from "../../lib/utils";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

type Props = { initialData?: InvoiceInterface[] };

const InvoicesDataTable: React.FC<Props> = ({ initialData }) => {
  const { userId } = useAuth();
  const InvoiceAPI = useInvoices();

  const [invoices, setInvoices] = React.useState<InvoiceInterface[]>(
    initialData ?? []
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      poNumber: false,
      rep: false,
      email: false,
      address: false,
      items: false,
      invoiceDate: false,
      qty: false,
      subTotal: false,
      shipping: false,
      discount: false,
      tax: false,
      isPublished: false,
      downloadCount: false,
      printCount: false,
      isArchive: false,
      createdAt: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    if (InvoiceAPI && userId) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const data = await InvoiceAPI.getInvoices(userId);
          setInvoices(data);
        } catch {
          toast.error("Something went wrong while fetching invoice data");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      setInvoices(getInvoices());
    }
  }, [userId, InvoiceAPI]);

  const columns = React.useMemo<ColumnDef<InvoiceInterface>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "invoiceNumber",
        accessorFn: (row) => row.invoiceDetails?.invoiceNumber ?? "—",
        header: "Invoice #",
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("invoiceNumber")}</div>
        ),
        enableHiding: false,
      },
      {
        id: "poNumber",
        accessorFn: (row) => row.invoiceDetails?.poNumber ?? "—",
        header: "Purchase Order #",
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("poNumber")}</div>
        ),
        enableHiding: false,
      },
      {
        id: "companyName",
        accessorFn: (row) => row.recipientInfo?.billTo?.companyName ?? "—",
        header: "Client",
        cell: ({ row }) => (
          <div className="font-semibold">{row.getValue("companyName")}</div>
        ),
        enableHiding: false,
      },
      {
        id: "rep",
        accessorFn: (row) => row.recipientInfo?.billTo?.rep ?? "—",
        header: "Representative",
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("rep")}</div>
        ),
      },
      {
        id: "email",
        accessorFn: (row) => row.recipientInfo?.billTo?.email ?? "",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const isAsc = column.getIsSorted() === "asc";
              column.toggleSorting(isAsc); // if currently asc, go desc; if desc or unsorted, go asc
            }}
            className="px-0 font-semibold"
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <a
            className="text-blue-600 hover:underline"
            href={`mailto:${row.getValue("email")}`}
          >
            {row.getValue("email") || "—"}
          </a>
        ),
      },
      {
        id: "phone",
        accessorFn: (row) => row.recipientInfo?.billTo?.phone ?? "",
        header: "Phone",
        cell: ({ row }) => (
          <a
            className="text-blue-600 hover:underline"
            href={`tel:${row.getValue("phone")}`}
          >
            {row.getValue("phone") || "—"}
          </a>
        ),
      },
      {
        id: "address",
        accessorFn: (row) => row.recipientInfo?.billTo?.address ?? "—",
        header: "Address",
        cell: ({ row }) => <span>{row.getValue("address")}</span>,
      },
      {
        id: "items",
        accessorFn: (row) => row.invoiceItemsList?.items?.length ?? "-",
        header: "Items",
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("items")}</div>
        ),
      },
      {
        id: "invoiceDate",
        accessorFn: (row) => row.invoiceDetails?.invoiceDate ?? 0,
        header: "Invoice Date",
        cell: ({ row }) =>
          new Date(row.getValue("invoiceDate")).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
      },
      {
        id: "dueDate",
        accessorFn: (row) => row.invoiceDetails?.dueDate ?? 0,
        header: "Due Date",
        cell: ({ row }) =>
          new Date(row.getValue("dueDate")).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
      },
      {
        id: "preparedBy",
        accessorFn: (row) => row.invoiceDetails?.preparedBy ?? "-",
        header: "Prepared By",
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("preparedBy")}</div>
        ),
      },
      {
        id: "qty",
        // total the qty of each item
        accessorFn: (row) => {
          let totalQty = 0;
          row.invoiceItemsList.items.forEach((item) => {
            totalQty += item.qty;
          });
          return totalQty;
        },
        // accessorFn: (row) => row.invoiceItemsList?.items?.length ?? "-",
        header: "Quantity",
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("qty")}</div>
        ),
      },
      {
        id: "subTotal",
        accessorFn: (row) => row.invoiceItemsList?.subTotal ?? 0,
        header: () => <div className="text-right font-semibold">Subtotal</div>,
        cell: ({ row }) => (
          <div className="text-right">
            {row.original.invoiceDetails?.currency}{" "}
            {formatAmount(row.getValue("subTotal"))}
          </div>
        ),
      },
      {
        id: "total",
        accessorFn: (row) => row.additionalCharges?.total ?? 0,
        header: () => <div className="text-right font-semibold">Total</div>,
        cell: ({ row }) => (
          <div className="text-right">
            {row.original.invoiceDetails?.currency}{" "}
            {formatAmount(row.getValue("total"))}
          </div>
        ),
      },
      {
        id: "amountPaid",
        accessorFn: (row) => row.additionalCharges?.amountPaid ?? 0,
        header: () => (
          <div className="text-right font-semibold">Amount Paid</div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            {row.original.invoiceDetails?.currency}{" "}
            {formatAmount(row.getValue("amountPaid"))}
          </div>
        ),
      },
      {
        id: "payable",
        accessorFn: (row) => row.additionalCharges?.balanceDue ?? 0,
        header: () => <div className="text-right font-semibold">Payable</div>,
        cell: ({ row }) => (
          <div className="text-right">
            {row.original.invoiceDetails?.currency}{" "}
            {formatAmount(row.getValue("payable"))}
          </div>
        ),
      },
      {
        id: "shipping",
        accessorFn: (row) => row.additionalCharges?.shipping ?? 0,
        header: () => <div className="text-right font-semibold">Shipping</div>,
        cell: ({ row }) => (
          <div className="text-right">
            {row.original.invoiceDetails.currency}{" "}
            {formatAmount(row.getValue("shipping"))}
          </div>
        ),
      },
      {
        id: "discount",
        accessorFn: (row) => row.additionalCharges.discount.amount ?? 0,
        header: () => <div className="text-right font-semibold">Discount</div>,
        cell: ({ row }) => (
          <div className="text-right">
            {row.original.additionalCharges.discount.isAmount &&
              row.original.invoiceDetails?.currency}{" "}
            {formatAmount(row.getValue("discount"))}
            {!row.original.additionalCharges.discount.isAmount && " %"}
          </div>
        ),
      },
      {
        id: "tax",
        accessorFn: (row) => row.additionalCharges.tax.amount ?? 0,
        header: () => <div className="text-right font-semibold">Tax</div>,
        cell: ({ row }) => (
          <div className="text-right">
            {row.original.additionalCharges.tax.isAmount &&
              row.original.invoiceDetails?.currency}{" "}
            {formatAmount(row.getValue("tax"))}
            {!row.original.additionalCharges.tax.isAmount && " %"}
          </div>
        ),
      },
      {
        id: "status",
        accessorFn: (row) => (row.isPaid ? "Paid" : "Unpaid"),
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={
              row.getValue("status") === "Unpaid"
                ? "bg-red-100 text-red-500 rounded"
                : "bg-green-100 text-green-500 rounded"
            }
          >
            {row.getValue("status")}
          </Badge>
        ),
      },
      {
        id: "isPublished",
        accessorFn: (row) => (row.isPublished ? "Yes" : "No"),
        header: "Published",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={
              row.getValue("isPublished") === "No"
                ? "bg-gray-100 text-gray-500 rounded"
                : "bg-green-100 text-green-500 rounded"
            }
          >
            {row.getValue("isPublished")}
          </Badge>
        ),
      },
      {
        id: "downloadCount",
        accessorFn: (row) => row.downloadCount ?? 0,
        header: "Downloads",
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("downloadCount")}</div>
        ),
      },
      {
        id: "printCount",
        accessorFn: (row) => row.printCount ?? 0,
        header: "Prints",
        cell: ({ row }) => (
          <div className="text-center">{row.getValue("printCount")}</div>
        ),
      },
      {
        id: "isArchive",
        accessorFn: (row) => (row.isArchive ? "Yes" : "No"),
        header: "Archived",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={
              row.getValue("isArchive") === "No"
                ? "bg-yellow-50 text-yellow-500 rounded"
                : "bg-green-100 text-green-500 rounded"
            }
          >
            {row.getValue("isArchive")}
          </Badge>
        ),
      },
      {
        id: "createdAt",
        accessorFn: (row) => row.createdAt,
        header: "Created On",
        cell: ({ row }) =>
          new Date(row.getValue("createdAt")).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
      },
      {
        id: "updatedAt",
        accessorFn: (row) => row.updatedAt,
        header: "Last Modified",
        cell: ({ row }) =>
          new Date(row.getValue("updatedAt")).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
      },
      {
        id: "actions",
        enableHiding: false,
        header: "Action",
        cell: ({ row }) => {
          const invoice = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`/invoices/${invoice.id}/preview`}>Preview</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(invoice.id);
                    toast.success("Invoice ID copied");
                  }}
                >
                  Copy invoice ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: isLoading ? [] : invoices,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="py-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight">Invoices</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by email..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("email")?.setFilterValue(e.target.value)
            }
            className="max-w-xs"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50 dark:bg-neutral-800">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="border-muted">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="uppercase text-xs font-bold tracking-wider text-neutral-500"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <SkeletonTableRows key={`skeleton-${i}`} table={table} />
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-muted">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-neutral-500"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-neutral-500">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} selected
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoicesDataTable;

const SkeletonTableRows = <TData,>({
  table,
}: {
  table: ReactTableType<TData>;
}) => {
  return (
    <TableRow>
      {table.getVisibleFlatColumns().map((column) => (
        <TableCell key={`skeleton-${column.id}`}>
          <Skeleton className="h-[20px] rounded" />
        </TableCell>
      ))}
    </TableRow>
  );
};
