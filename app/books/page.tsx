import { Book, PrismaClient } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Navbar from '@/components/navigation/Navbar';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic'; // 关闭静态优化

async function getBooks() {
  try {
    const prisma = new PrismaClient();
    return await prisma.book.findMany({
      include: { user: true, tags: true, category: true }
    });
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
}

export default async function BooksPage() {
  const books = await getBooks();
  
  return (
    <div className="bg-wood-pattern min-h-screen p-4">
      <Navbar />
      {books.length === 0 ? (
        <div className="text-center py-10">暂无书籍数据</div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
function BookCard({ book }: { book: Book }) {
    return (
        <div className="relative bg-white shadow-md rounded-lg overflow-hidden">
            <Link href={`/books/${book.id}`}>
                <Image
                    src={book.coverImage || '/default-book-cover.jpg'}
                    alt={book.title}
                    width={200}
                    height={300}
                    className="w-full h-auto"
                />
            </Link>
            <div className="p-4">
                <h2 className="text-lg font-bold">{book.title}</h2>
                <p className="text-sm text-gray-600">{book.author}</p>
                <div className="flex items-center">
                    <div className="w-1/4 bg-gray-200 h-2 rounded-full">
                        <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${book.readingProgress}%` }}
                        ></div>
                    </div>
                    <div className="ml-auto cursor-pointer">
                        <BsThreeDotsVertical size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
}