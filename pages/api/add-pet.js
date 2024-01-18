import { sql } from '@vercel/postgres';
 
export default async function handler(request, response) {
  try {
    const petName = 'Ryan';
    const ownerName = 'Bagus';
    if (!petName || !ownerName) throw new Error('Pet and owner names required');
    await sql`INSERT INTO Pets (Name, Owner) VALUES (${petName}, ${ownerName});`;
  } catch (error) {
    return response.status(500).json({ error });
  }
 
  const pets = await sql`SELECT * FROM Pets;`;
  return response.status(200).json({ pets });
}