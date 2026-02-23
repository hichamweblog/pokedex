const LIMIT = 20;

export default function Pagination({
  next,
  previous,
  total,
  currentOffset,
}: {
  next: string | null;
  previous: string | null;
  total: number;
  currentOffset: number;
}) {
  const totalPages = Math.ceil(total / LIMIT);
  const currentPage = Math.floor(currentOffset / LIMIT) + 1;
  const prevOffset = currentOffset - LIMIT;
  const nextOffset = currentOffset + LIMIT;

  return (
    <div className="flex justify-between items-center mt-8">
      {previous ? (
        <a
          href={`/?offset=${prevOffset}`}
          className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">
          Previous
        </a>
      ) : (
        <span className="px-4 py-2 rounded-md bg-gray-300 text-gray-500 cursor-not-allowed">
          Previous
        </span>
      )}

      <span className="text-gray-200">
        Page {currentPage} of {totalPages}
      </span>

      {next ? (
        <a
          href={`/?offset=${nextOffset}`}
          className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">
          Next
        </a>
      ) : (
        <span className="px-4 py-2 rounded-md bg-gray-300 text-gray-500 cursor-not-allowed">
          Next
        </span>
      )}
    </div>
  );
}
