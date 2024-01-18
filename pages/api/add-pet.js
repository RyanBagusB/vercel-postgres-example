import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { petName, ownerName } = req.body;
      if (!petName || !ownerName) {
        return res.status(400).json({ error: 'Pet and owner names are required' });
      }

      await sql`INSERT INTO Pets (Name, Owner) VALUES (${petName}, ${ownerName});`;
      return res.status(201).json({ message: 'Pet created successfully' });
    }

    if (req.method === 'GET') {
      const pets = await sql`SELECT * FROM Pets;`;
      return res.status(200).json({ pets });
    }

    // Handle other HTTP methods if needed

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
