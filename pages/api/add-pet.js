import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { Name, Prize } = req.body;
      if (!Name || !Prize) {
        return res.status(400).json({ error: 'Name and Prize are required' });
      }

      await sql`INSERT INTO books (Name, Prize) VALUES (${Name}, ${Prize});`;
      return res.status(201).json({ message: 'Book created successfully' });
    }

    if (req.method === 'GET') {
      const books = await sql`SELECT Book_id, Name, Prize FROM books;`;
      return res.status(200).json({ books });
    }

    if (req.method === 'PUT') {
      const { Book_id, Name, Prize } = req.body;
      if (!Book_id || !Name || !Prize) {
        return res.status(400).json({ error: 'Book_id, Name, and Prize are required for update' });
      }

      const updateResult = await sql`UPDATE books SET Name = ${Name}, Prize = ${Prize} WHERE Book_id = ${Book_id};`;
      if (updateResult.rowCount === 0) {
        return res.status(404).json({ error: 'Book not found for update' });
      }

      return res.status(200).json({ message: 'Book updated successfully' });
    }

    if (req.method === 'DELETE') {
      const { Book_id } = req.body;
      if (!Book_id) {
        return res.status(400).json({ error: 'Book_id is required for deletion' });
      }

      const deleteResult = await sql`DELETE FROM books WHERE Book_id = ${Book_id};`;
      if (deleteResult.rowCount === 0) {
        return res.status(404).json({ error: 'Book not found for deletion' });
      }

      return res.status(200).json({ message: 'Book deleted successfully' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
