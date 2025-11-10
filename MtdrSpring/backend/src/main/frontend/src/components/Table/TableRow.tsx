interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLTableRowElement>) => void;
  "data-state"?: string;
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  className = "",
  onClick,
  "data-state": dataState,
}) => {
  return (
    <tr
      className={`border-b border-background-contrast transition-colors hover:bg-background-subtle data-[state=selected]:bg-background-subtle ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
      data-state={dataState}
    >
      {children}
    </tr>
  );
};
