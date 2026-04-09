const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Method not allowed' }) };
  }
  try {
    const { company, name, email, phone, message } = JSON.parse(event.body);
    if (!company || !name || !email || !message) {
      return { statusCode: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ message: '必須項目を入力してください。' }) };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ message: '正しいメールアドレスを入力してください。' }) };
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

    if (!RESEND_API_KEY) {
      console.log('DEV MODE:', { company, name, email, phone, message, timestamp });
      return { statusCode: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ message: '送信完了（開発モード）' }) };
    }

    const htmlBody = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)"><div style="background:linear-gradient(135deg,#1A5FBF,#0F2A5E);padding:28px 32px"><h1 style="color:#fff;font-size:20px;margin:0">ショキ<span style="color:#F97316">ゼロ</span> お問い合わせ</h1></div><div style="padding:28px 32px"><table style="width:100%;border-collapse:collapse;font-size:14px"><tr><td style="padding:10px;border-bottom:1px solid #eee;color:#666;width:120px;font-weight:bold">貴社名</td><td style="padding:10px;border-bottom:1px solid #eee">${company}</td></tr><tr><td style="padding:10px;border-bottom:1px solid #eee;color:#666;font-weight:bold">担当者名</td><td style="padding:10px;border-bottom:1px solid #eee">${name}</td></tr><tr><td style="padding:10px;border-bottom:1px solid #eee;color:#666;font-weight:bold">メール</td><td style="padding:10px;border-bottom:1px solid #eee">${email}</td></tr><tr><td style="padding:10px;border-bottom:1px solid #eee;color:#666;font-weight:bold">電話番号</td><td style="padding:10px;border-bottom:1px solid #eee">${phone || '未入力'}</td></tr><tr><td style="padding:10px;border-bottom:1px solid #eee;color:#666;font-weight:bold">内容</td><td style="padding:10px;border-bottom:1px solid #eee;white-space:pre-wrap">${message}</td></tr></table><p style="margin-top:20px;padding:12px 16px;background:#FFF7ED;border-left:4px solid #F97316;border-radius:4px;font-size:13px;color:#666">※ 返信は ${email} 宛に送信されます。2営業日以内にご返信ください。</p><p style="font-size:12px;color:#999;margin-top:16px">受信: ${timestamp}</p></div></div>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'ショキゼロ お問い合わせ <onboarding@resend.dev>',
        to: ['info@shoki-zero.com'],
        subject: `【ショキゼロ】${company} ${name}様からお問い合わせ`,
        html: htmlBody,
        reply_to: email,
      }),
    });

    if (!res.ok) {
      console.error('Resend error:', await res.json());
      return { statusCode: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'メール送信に失敗しました。' }) };
    }

    return { statusCode: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ message: '送信が完了しました。' }) };
  } catch (error) {
    console.error('Contact error:', error);
    return { statusCode: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'サーバーエラーが発生しました。' }) };
  }
};
