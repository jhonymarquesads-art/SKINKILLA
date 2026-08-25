import { NextResponse } from 'next/server';

// Mock payment service - in real app, integrate with Mercado Pago or Asaas
class MockPaymentService {
  static async createPixPayment(amount: number, description: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate mock payment data
    const transactionId = Math.random().toString(36).substr(2, 9);
    const qrCodeUrl = `https://mock-pix.qrcode/${transactionId}.png`;
    const copyPasteCode = `00020126580014BR.GOV.BCB.PIX0136${transactionId}5204000053039865405${amount.toFixed(2)}5802BR5920Mock Merchant6009CIDADE6105${amount.toFixed(2).replace('.', '')}62070503***6304${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    return {
      transactionId,
      qrCodeUrl,
      copyPasteCode,
      status: 'pending'
    };
  }
  
  static async checkPaymentStatus(transactionId: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would check with the payment gateway
    // For mock, we'll return approved after a certain condition
    // For demo, we'll make it randomly approved after first check
    // But to keep it simple, we'll return pending until we decide otherwise
    // In a real scenario, the frontend would poll until it changes
    
    // For mock purposes, we'll simulate that after 3 seconds it becomes approved
    // But since we can't track time easily, we'll make it random for demo
    const isApproved = Math.random() > 0.7; // 30% chance of approval
    
    return {
      status: isApproved ? 'approved' : 'pending'
    };
  }
}

export async function POST(request: Request) {
  try {
    const { amount, evaluationId } = await request.json();
    
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      );
    }
    
    // Create Pix payment
    const paymentData = await MockPaymentService.createPixPayment(
      amount,
      `Análise de Pele - Avaliação ${evaluationId || 'Gerada'}`
    );
    
    // In a real app, we would save the payment to database here
    // For now, we just return the payment data
    
    return NextResponse.json({
      transactionId: paymentData.transactionId,
      qrCodeUrl: paymentData.qrCodeUrl,
      copyPasteCode: paymentData.copyPasteCode,
      status: paymentData.status
    });
  } catch (error) {
    console.error('Error in checkout route:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}

// We'll also add a GET endpoint for checking payment status (used by PaymentModal)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');
    
    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }
    
    const statusData = await MockPaymentService.checkPaymentStatus(transactionId);
    
    return NextResponse.json(statusData);
  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}
