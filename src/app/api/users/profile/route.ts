import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { authenticateToken } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  name: string;
  age: number;
  gender: string;
  photo: string | null;
  bio: string | null;
  interests: string;
  looking_for: string;
  location: string | null;
  is_admin: boolean;
}

export async function GET(req: Request) {
  try {
    const user = await authenticateToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [users] = await pool.execute<UserRow[]>(
      'SELECT id, email, name, age, gender, photo, bio, interests, looking_for, location, is_admin FROM users WHERE id = ?',
      [user.id]
    );

    if (!users[0]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = {
      ...users[0],
      interests: JSON.parse(users[0].interests),
      looking_for: JSON.parse(users[0].looking_for)
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await authenticateToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, age, gender, photo, bio, interests, looking_for, location } = body;

    await pool.execute<UserRow[]>(
      `UPDATE users 
       SET name = ?, age = ?, gender = ?, photo = ?, bio = ?, 
           interests = ?, looking_for = ?, location = ?
       WHERE id = ?`,
      [name, age, gender, photo, bio, JSON.stringify(interests), 
       JSON.stringify(looking_for), location, user.id]
    );

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 