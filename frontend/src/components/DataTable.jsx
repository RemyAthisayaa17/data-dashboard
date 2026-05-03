import { RiArrowUpSLine, RiArrowDownSLine } from "react-icons/ri";

export default function DataTable({ rows, sortKey, sortDir, onSort }) {
  if (!rows || rows.length === 0) {
    return <div className="table-empty">No data to display</div>;
  }

  const columns = Object.keys(rows[0]);

  function handleSort(col) {
    if (sortKey === col) {
      onSort(col, sortDir === "asc" ? "desc" : "asc");
    } else {
      onSort(col, "asc");
    }
  }

  return (
    // This wrapper enables horizontal scroll — critical fix
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} onClick={() => handleSort(col)}>
                <span className="th-inner">
                  {col}
                  {sortKey === col ? (
                    sortDir === "asc" ? (
                      <RiArrowUpSLine className="sort-icon active" />
                    ) : (
                      <RiArrowDownSLine className="sort-icon active" />
                    )
                  ) : (
                    <RiArrowUpSLine className="sort-icon" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col} title={String(row[col] ?? "")}>
                  {String(row[col] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}