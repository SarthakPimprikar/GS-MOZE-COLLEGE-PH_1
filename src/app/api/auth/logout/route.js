import { cookies } from 'next/headers';
import userSchema from '../../../models/userSchema';
import { connectToDatabase } from '../../../lib/mongodb';

export async function POST() {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('sessionToken')?.value;

    if (sessionToken) {
      await connectToDatabase();
      await userSchema.findOneAndUpdate(
        {
          sessionToken
        },
        {
          $unset: {
            sessionToken: 1
          }
        }
      );
    }

    // Clear the session cookie
    cookieStore.delete('sessionToken');

    return new Response(JSON.stringify({
      message: 'Logout successful'
    }), {
      status: 200
    });

  } catch (error) {
    console.error('Logout error:', error);
    return new Response(JSON.stringify({
      message: 'Logout failed'
    }), {
      status: 500
    });
  }
}