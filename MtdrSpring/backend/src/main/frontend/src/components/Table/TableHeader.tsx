interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className = "",
}) => {
  return (
    <thead
      className={`bg-background-subtle border-b border-background-contrast ${className}`}
    >
      {children}
    </thead>
  );
};
