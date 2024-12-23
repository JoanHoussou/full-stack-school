const Table = ({
  columns,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  data: any[];
}) => {
  return (
    <table className="w-full mt-4">
      <thead>
        <tr className="text-left text-gray-500 text-sm">
          {columns.map((col) => (
            <th key={col.accessor} className={col.className}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={item.id}
            className="border-b border-gray-200 hover:bg-gray-50"
          >
            {columns.map((col) => (
              <td
                key={`${item.id}-${col.accessor}`}
                className={`p-4 ${col.className || ""}`}
              >
                {item[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
