// src/App.jsx
import Header from './components/Header';
import Footer from './components/Footer';
import BookCard from './components/BookCard';

const books = [
  {
    id: 1,
    title: 'ヴァイオレット・エヴァーガーデン',
    author: '暁 佳奈',
    rating: 5,
    comment: '「愛してる」の意味を知っていく過程に何度も泣かされた。',
  },
  {
    id: 2,
    title: '半沢直樹',
    author: '池井戸 潤',
    rating: 5,
    comment: '倍返しまでの展開が痛快で、一気読みしてしまった。',
  },
  {
    id: 3,
    title: 'そして、バトンは渡された',
    author: '瀬尾 まいこ',
    rating: 5,
    comment: '血のつながらない家族の温かさにじんわりきた。',
  },
  {
    id: 4,
    title: 'ベーシック流通論',
    author: '庄司 真人',
    rating: 5,
    comment: '流通の基礎をしっかり押さえられる一冊。授業の参考にした。',
  },
];

function App() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Header />
      <main className="space-y-4 py-4">
        {books.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            author={book.author}
            rating={book.rating}
            comment={book.comment}
          />
        ))}
      </main>
      <Footer />
    </div>
  );
}

export default App;
