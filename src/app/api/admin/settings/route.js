import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import SystemSetting from '@/models/systemSetting';

// GET: Fetch system settings
export async function GET() {
  await connectToDatabase();

  try {
    let settings = await SystemSetting.findOne();

    // If no settings found, create with defaults
    if (!settings) {
      settings = new SystemSetting(); // this applies all defaults
      await settings.save();          // make sure it's saved
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('GET /admin/settings error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings.' }, { status: 500 });
  }
}


// PUT: Update system settings
export async function PUT(request) {
  await connectToDatabase();

  try {
    const updates = await request.json();

    let settings = await SystemSetting.findOne();

    if (!settings) {
      settings = new SystemSetting({});
    }

    // Update each setting area if provided
    if (updates.systemConfig) {
      settings.systemConfig = { ...settings.systemConfig, ...updates.systemConfig };
    }

    if (updates.rolePermissions) {
      settings.rolePermissions = { ...settings.rolePermissions, ...updates.rolePermissions };
    }

    if (updates.financialSettings) {
      settings.financialSettings = { ...settings.financialSettings, ...updates.financialSettings };
    }

    settings.updatedAt = new Date();

    await settings.save();

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('PUT /admin/settings error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings.' }, { status: 500 });
  }
}

