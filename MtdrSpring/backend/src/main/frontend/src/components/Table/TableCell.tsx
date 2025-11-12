interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  className = "",
  colSpan,
}) => {
  return (
    <td
      className={`p-4 align-middle text-text-primary ${className}`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};
