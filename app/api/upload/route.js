import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directory:', error);
    }

    const savedFiles = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate a unique ID for the file
      const fileId = uuidv4();
      const fileName = file.name;
      const fileType = file.type;
      const filePath = join(uploadDir, fileId + '-' + fileName);
      
      // Save the file
      await writeFile(filePath, buffer);
      
      savedFiles.push({
        id: fileId,
        name: fileName,
        type: fileType,
        path: filePath,
        size: buffer.length,
      });
    }

    return NextResponse.json({ 
      message: 'Files uploaded successfully',
      files: savedFiles
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { error: 'Error uploading files' },
      { status: 500 }
    );
  }
} 