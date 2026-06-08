import connectDB from '@/lib/db';
import Family from '@/lib/models/Family';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json(
        { success: false, error: 'Invalid family ID' },
        { status: 400 }
      );
    }

    const family = await Family.findById(id);
    if (!family) {
      return Response.json(
        { success: false, error: 'Family not found' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, data: family },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching family:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    if (!ObjectId.isValid(id)) {
      return Response.json(
        { success: false, error: 'Invalid family ID' },
        { status: 400 }
      );
    }

    const family = await Family.findByIdAndUpdate(id, body, { new: true });
    if (!family) {
      return Response.json(
        { success: false, error: 'Family not found' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: 'Family updated successfully', data: family },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating family:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json(
        { success: false, error: 'Invalid family ID' },
        { status: 400 }
      );
    }

    const family = await Family.findByIdAndDelete(id);
    if (!family) {
      return Response.json(
        { success: false, error: 'Family not found' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: 'Family deleted successfully', data: family },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting family:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
