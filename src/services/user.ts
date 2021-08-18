import axios from 'axios';
import config from 'config';

import { KYCData } from '../models/user';

export interface SendCodeRes {
  message: string;
  status: number;
  error?: {};
}

export async function sendVerificationCode(
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

interface CheckKYCDataResponse {
  message: string;
  status: number;
}

export async function checkKYCData(
  data: KYCData
): Promise<CheckKYCDataResponse> {
  try {
    const res = await axios.post('https://api.paystack.co/bvn/match', data, {
      headers: { Authorization: 'Bearer <SecKey>' },
    });

    return { message: '', status: 0 };
  } catch (e) {
    return { message: '', status: 1 };
  }
}
