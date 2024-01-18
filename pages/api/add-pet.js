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

    if (req.method === 'PUT') {
      const { petId, petName, ownerName } = req.body;
      if (!petId || !petName || !ownerName) {
        return res.status(400).json({ error: 'Pet ID, name, and owner are required for update' });
      }

      const updateResult = await sql`UPDATE Pets SET Name = ${petName}, Owner = ${ownerName} WHERE id = ${petId};`;
      if (updateResult.rowCount === 0) {
        return res.status(404).json({ error: 'Pet not found for update' });
      }

      return res.status(200).json({ message: 'Pet updated successfully' });
    }

    if (req.method === 'DELETE') {
      const { petName, ownerName } = req.body;

      await sql`DELETE FROM Pets`;
      // if (deleteResult.rowCount === 0) {
      //   return res.status(404).json({ error: 'Pet not found for deletion' });
      // }

      return res.status(200).json({ message: 'Pet deleted successfully' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
