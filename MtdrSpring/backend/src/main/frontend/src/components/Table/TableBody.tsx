interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const TableBody: React.FC<TableBodyProps> = ({
  children,
  className = "",
}) => {
  return (
    <tbody className={`divide-y divide-background-contrast ${className}`}>
      {children}
    </tbody>
  );
};
