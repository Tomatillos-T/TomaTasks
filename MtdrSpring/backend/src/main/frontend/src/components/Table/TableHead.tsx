interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TableHead: React.FC<TableHeadProps> = ({
  children,
  className = "",
  onClick,
}) => {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-medium text-text-secondary uppercase tracking-wider text-xs ${
        onClick ? "cursor-pointer select-none hover:text-text-primary" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </th>
  );
};
