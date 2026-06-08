import connectDB from '@/lib/db';

export async function GET(request) {
  try {
    await connectDB();
    
    return Response.json(
      {
        success: true,
        message: 'Database connected successfully',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database connection error:', error);
    
    return Response.json(
      {
        success: false,
        message: 'Failed to connect to database',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
