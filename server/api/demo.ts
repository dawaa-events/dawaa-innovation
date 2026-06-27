import { Router, Request, Response } from 'express';
import { getDb } from '../db';
import axios from 'axios';

const router = Router();

// Create a demo booking
router.post('/demo-booking', async (req: Request, res: Response) => {
  try {
    const { name, phone, location, groom, bride } = req.body;

    // Validate input
    if (!name || !phone || !location || !groom || !bride) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create booking in database
    const db = await getDb();
    const bookingResult = await db.query(
      `INSERT INTO bookings (name, phone, location, groom_name, bride_name, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [name, phone, location, groom, bride, 'demo']
    );

    const bookingId = (bookingResult as any).insertId;

    // Send WhatsApp message
    try {
      const whatsappMessage = `
مرحباً ${name}،

تم إنشاء مناسبتك التجريبية بنجاح! ✅

📋 تفاصيل المناسبة:
• المكان: ${location}
• العريس: ${groom}
• العروس: ${bride}

الآن يمكنك:
1. إضافة قائمة الضيوف
2. إرسال الدعوات عبر واتساب
3. متابعة الردود مباشرة
4. إصدار بطاقات QR للدخول

دعوة - منصة إدارة الدعوات المتكاملة
      `;

      // Send via WhatsApp (using N8N webhook or Meta API)
      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      if (webhookUrl) {
        await axios.post(webhookUrl, {
          phone: phone,
          message: whatsappMessage,
          type: 'demo_booking',
        });
      }
    } catch (whatsappError) {
      console.error('WhatsApp send error:', whatsappError);
      // Don't fail the request if WhatsApp fails
    }

    res.json({
      success: true,
      bookingId,
      message: 'Demo booking created successfully',
      data: {
        name,
        phone,
        location,
        groom,
        bride,
      },
    });
  } catch (error) {
    console.error('Demo booking error:', error);
    res.status(500).json({ error: 'Failed to create demo booking' });
  }
});

// Get demo booking details
router.get('/demo-booking/:bookingId', async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const db = await getDb();

    const result = await db.query(
      'SELECT * FROM bookings WHERE id = ? AND status = ?',
      [bookingId, 'demo']
    );

    if ((result as any).length === 0) {
      return res.status(404).json({ error: 'Demo booking not found' });
    }

    res.json((result as any)[0]);
  } catch (error) {
    console.error('Get demo booking error:', error);
    res.status(500).json({ error: 'Failed to get demo booking' });
  }
});

export default router;
