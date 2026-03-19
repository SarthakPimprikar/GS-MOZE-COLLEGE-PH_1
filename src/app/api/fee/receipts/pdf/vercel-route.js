import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { FeeReceipt } from "@/models/feeReceipt";
import Student from "@/app/models/studentSchema";
import FeeStructure from "@/app/models/feeStructureSchema";
import { generateFeeReceiptPDFVercel } from "@/utils/generateFeeReceiptPdfVercel";

export async function POST(req) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { receipt } = body;

    if (!receipt) {
      return new Response(JSON.stringify({ error: "Receipt data is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log('Generating VERCEL PDF for receipt data:', receipt);

    // For Vercel deployment, we have multiple options:
    // Option 1: Return HTML for client-side PDF generation
    // Option 2: Use a PDF service API
    // Option 3: Use simplified PDF generation

    try {
      // Try to generate HTML content
      const pdfData = await generateFeeReceiptPDFVercel(receipt);
      
      // Return HTML content that can be converted to PDF on client side
      return new Response(JSON.stringify({ 
        success: true,
        html: pdfData.html,
        filename: pdfData.filename,
        message: 'HTML generated successfully. Use client-side PDF generation.'
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
      });

    } catch (htmlError) {
      console.error('HTML generation failed, trying fallback:', htmlError);
      
      // Fallback: Return basic receipt data for client-side processing
      return new Response(JSON.stringify({ 
        success: false,
        error: 'PDF generation not available on this deployment',
        receiptData: receipt,
        message: 'Please use client-side PDF generation or contact support.'
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
      });
    }

  } catch (error) {
    console.error('Error in VERCEL PDF POST route:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate PDF: ' + error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Alternative approach using external PDF service
export async function PUT(req) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { receipt } = body;

    if (!receipt) {
      return new Response(JSON.stringify({ error: "Receipt data is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log('Generating PDF using external service for receipt data:', receipt);

    // Generate HTML content
    const pdfData = await generateFeeReceiptPDFVercel(receipt);
    
    // Use external PDF service (like HTMLtoPDF API)
    // This is a placeholder - you would need to integrate with a real service
    const pdfServiceUrl = 'https://api.html2pdf.app/v1/generate';
    
    try {
      const pdfResponse = await fetch(pdfServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: pdfData.html,
          fileName: pdfData.filename.replace('.html', '.pdf'),
          format: 'A5',
          margin: '8mm'
        })
      });

      if (pdfResponse.ok) {
        const pdfBuffer = await pdfResponse.arrayBuffer();
        return new Response(pdfBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${pdfData.filename.replace('.html', '.pdf')}"`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
        });
      } else {
        throw new Error('PDF service failed');
      }
    } catch (serviceError) {
      console.error('PDF service failed:', serviceError);
      
      // Return HTML as fallback
      return new Response(JSON.stringify({ 
        success: true,
        html: pdfData.html,
        filename: pdfData.filename,
        message: 'PDF service unavailable. HTML provided as fallback.'
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
      });
    }

  } catch (error) {
    console.error('Error in external PDF service route:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate PDF: ' + error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
