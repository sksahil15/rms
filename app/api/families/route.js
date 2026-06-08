import connectDB from '@/lib/db';
import Family from '@/lib/models/Family';

export async function GET(request) {
  try {
    await connectDB();
    const families = await Family.find().sort({ createdAt: -1 });
    return Response.json({ success: true, data: families }, { status: 200 });
  } catch (error) {
    console.error('Error fetching families:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    console.log('Received form data:', JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.familyId || !body.headName || !body.phone) {
      console.error('Missing required fields');
      return Response.json(
        { success: false, error: 'Missing required fields: familyId, headName, phone' },
        { status: 400 }
      );
    }

    // Check if family already exists
    const existingFamily = await Family.findOne({ familyId: body.familyId });
    if (existingFamily) {
      console.error('Family ID already exists:', body.familyId);
      return Response.json(
        { success: false, error: `Family ID '${body.familyId}' already exists. Please use a different Family ID.` },
        { status: 400 }
      );
    }

    // Clean data - only keep fields that are in the schema
    const cleanData = {
      familyId: body.familyId,
      headName: body.headName,
      phone: body.phone,
      category: body.category,
      memberCount: body.memberCount || 0,
      members: body.members && Array.isArray(body.members) ? body.members.map((member) => ({
        name: member.name || '',
        cardNumber: member.cardNumber && member.cardNumber !== '' ? Number(member.cardNumber) : null,
      })) : [],
      status: body.status || 'pending',
      lifted: body.lifted || null,
      notes: body.notes || '',
    };

    console.log('Clean data to save:', JSON.stringify(cleanData, null, 2));

    const family = await Family.create(cleanData);
    console.log('Family created successfully:', JSON.stringify(family, null, 2));
    
    return Response.json(
      { success: true, message: 'Family added successfully', data: family },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating family:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
 export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();

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