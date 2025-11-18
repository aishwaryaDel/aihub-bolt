import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db';

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Eingabefehler abfangen
    if (!email || !password) {
      return res.status(400).json({ error: 'Email und Passwort sind erforderlich' });
    }

    // Nutzer aus DB holen
    const result = await query(
      'SELECT id, email, password_hash, role, name FROM users WHERE email = $1 LIMIT 1',
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Ungültige Zugangsdaten' });
    }

    const user = result.rows[0];

    // Passwort prüfen
    const pwOK = await bcrypt.compare(password, user.password_hash);
    if (!pwOK) {
      return res.status(401).json({ error: 'Ungültige Zugangsdaten' });
    }

    // JWT erzeugen
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET fehlt in den Environment Variables');
      return res.status(500).json({ error: 'Server-Konfiguration unvollständig' });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      secret,
      { expiresIn: '7d' }
    );

    // Erfolg: Token + ein paar User-Infos zurückgeben
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login Fehler:', err);
    return res.status(500).json({ error: 'Interner Fehler beim Login' });
  }
}
