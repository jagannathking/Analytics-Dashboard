import React from "react";
import "./Table.css";
import LoadingSpinner from "./LoadingSpinner.jsx";

const Table = ({
  columns,
  data,
  isLoading,
  onRowClick,
  keyExtractor,
  noDataMessage = "No data available.",
}) => {
  if (isLoading) {
    return <LoadingSpinner message="Loading table data..." />;
  }

  if (!data || data.length === 0) {
    return <div className="no-data-message card">{noDataMessage}</div>;
  }

  const defaultKeyExtractor = (item, index) => item._id || item.id || index;
  const getKey = keyExtractor || defaultKeyExtractor;

  return (
    <div className="table-responsive-wrapper card">
      {" "}
      {/* Added .card for consistent styling */}
      <table className="custom-data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={getKey(row, rowIndex)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? "clickable-row" : ""}
            >
              {columns.map((col) => (
                <td key={`${getKey(row, rowIndex)}-${col.key}`}>
                  {col.render
                    ? col.render(row[col.accessor], row)
                    : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
