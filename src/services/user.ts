import axios from 'axios';

export interface SendCodeRes {
  message: string;
  status: number;
  error?: {};
}

export default async function sendVerificationCode(
  phone: string,
  verificationCode: string
): Promise<SendCodeRes> {
  try {
    const res = await axios.post('https://termii.com/api/sms/send', {
      to: phone,
      from: 'SwiPay',
      sms:
        'Thanks for choosing SwiPay. To proceed, use this verification code. ' +
        verificationCode,
      type: 'plain',
      channel: 'generic',
      api_key: 'Your API Key',
    });

    console.log(res.data);
    return { message: 'Verification code sent successfully', status: 0 };
  } catch (e) {
    return { message: 'Error in sending verification code', status: 1 };
  }
}
