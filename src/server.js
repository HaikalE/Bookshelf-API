import Hapi from '@hapi/hapi';
import { nanoid } from 'nanoid';

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
  });

  server.route({
    method: 'POST',
    path: '/books',
    handler: (request, h) => {
      const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

      if (!name) {
        return h.response({ status: 'fail', message: 'Gagal menambahkan buku. Mohon isi nama buku' }).code(400);
      }

      if (readPage > pageCount) {
        return h.response({ status: 'fail', message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount' }).code(400);
      }

      const book = {
        id: nanoid(),
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished: readPage === pageCount,
        reading,
        insertedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      books.push(book);

      return h.response({ status: 'success', message: 'Buku berhasil ditambahkan', data: { bookId: book.id } }).code(201);
    },
  });

  server.route({
    method: 'GET',
    path: '/books',
    handler: (request, h) => {
      const simplifiedBooks = books.map(({ id, name, publisher }) => ({ id, name, publisher }));
      return h.response({ status: 'success', data: { books: simplifiedBooks } }).code(200);
    },
  });
  

  server.route({
    method: 'GET',
    path: '/books/{bookId}',
    handler: (request, h) => {
      const { bookId } = request.params;
      const book = books.find((b) => b.id === bookId);
  
      if (!book) {
        return h.response({ status: 'fail', message: 'Buku tidak ditemukan' }).code(404);
      }
  
      return h.response({ status: 'success', data: { book } }).code(200);
    },
  });
  

  server.route({
    method: 'PUT',
    path: '/books/{bookId}',
    handler: (request, h) => {
      const { bookId } = request.params;
      const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

      if (!name) {
        return h.response({ status: 'fail', message: 'Gagal memperbarui buku. Mohon isi nama buku' }).code(400);
      }

      if (readPage > pageCount) {
        return h.response({ status: 'fail', message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount' }).code(400);
      }

      const bookIndex = books.findIndex((b) => b.id === bookId);

      if (bookIndex === -1) {
        return h.response({ status: 'fail', message: 'Gagal memperbarui buku. Id tidak ditemukan' }).code(404);
      }

      const updatedBook = {
        ...books[bookIndex],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished: readPage === pageCount,
        reading,
        updatedAt: new Date().toISOString(),
      };

      books[bookIndex] = updatedBook;

      return h.response({ status: 'success', message: 'Buku berhasil diperbarui' }).code(200);
    },
  });

  server.route({
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: (request, h) => {
      const { bookId } = request.params;
      const bookIndex = books.findIndex((b) => b.id === bookId);

      if (bookIndex === -1) {
        return h.response({ status: 'fail', message: 'Buku gagal dihapus. Id tidak ditemukan' }).code(404);
      }

      books.splice(bookIndex, 1);

      return h.response({ status: 'success', message: 'Buku berhasil dihapus' }).code(200);
    },
  });

  await server.start();
  console.log(`Server is running on port ${server.info.port}`);
};

const books = []; // In-memory storage for books (replace with a database in a production environment)

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
