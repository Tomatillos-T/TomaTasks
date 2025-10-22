interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  className = "",
  onClick,
}) => {
  return (
    <tr
      className={`border-b border-background-contrast transition-colors hover:bg-background-subtle data-[state=selected]:bg-background-subtle ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};
