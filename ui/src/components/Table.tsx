import React from 'react';

interface TableProps {
  header: string[];
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ header, children }) => {
  return (
    <table className="min-w-full text-left text-sm font-light">
      <thead className="border-b font-medium dark:border-b-slate-500/30">
        <tr>
          {header.map((item, index) => (
            <th key={`header_${index}`} className="px-6 py-3 text-white">
              {item}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
  );
}

export default Table;
