const TableLoader = () => {
  const rows = Array(5).fill(null); // Number of fake rows

  return (
    <div className="w-full max-w-6xl mx-auto my-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
          Loading Payment History...
        </h2>

        <div className="overflow-x-auto animate-pulse">
          <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100">
                {[
                  'Parcel ID',
                  'Amount',
                  'Method',
                  'Transaction ID',
                  'Paid At',
                ].map((heading, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 px-3 py-2 min-w-[120px] text-left font-medium text-gray-700"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((_, idx) => (
                <tr key={idx} className="border-t border-gray-200">
                  {Array(5)
                    .fill()
                    .map((_, col) => (
                      <td
                        key={col}
                        className="px-3 py-3 border border-gray-300"
                      >
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default TableLoader;
