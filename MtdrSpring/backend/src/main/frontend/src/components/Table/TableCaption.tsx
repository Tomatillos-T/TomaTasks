interface TableCaptionProps {
  children: React.ReactNode;
  className?: string;
}

export const TableCaption: React.FC<TableCaptionProps> = ({
  children,
  className = "",
}) => {
  return (
    <caption className={`mt-4 text-sm text-text-secondary ${className}`}>
      {children}
    </caption>
  );
};
