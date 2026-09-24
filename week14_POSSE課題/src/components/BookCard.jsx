function BookCard({ title, author, rating, comment }) {
  return (
    <article className="rounded-lg border border-gray-200 p-4 shadow-sm transition duration-200 hover:scale-105 hover:shadow-md">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-gray-500">{author}</p>
      <p className="mt-1 text-yellow-500" aria-label={`評価 ${rating} / 5`}>
        {'★'.repeat(rating)}
        {'☆'.repeat(5 - rating)}
      </p>
      <p className="mt-2 text-gray-700">{comment}</p>
    </article>
  );
}

export default BookCard;
