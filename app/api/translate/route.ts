import { NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

export async function POST(req: Request) {
    try {
        const { text } = await req.json();
        
        // 环境变量校验
        const APP_ID = process.env.BAIDU_TRANSLATE_APPID?.trim(); // 去除两端空格
        const APP_KEY = process.env.BAIDU_TRANSLATE_KEY?.trim();  // 必须与百度控制台完全一致
        
        if (!APP_ID || !APP_KEY) {
            console.error('[TRANSLATE] 环境变量未配置');
            return NextResponse.json({ error: '翻译服务未配置' }, { status: 500 });
        }

        // 调试日志（脱敏）
        console.log('EnvCheck:', {
            APP_ID: `${APP_ID.slice(0, 3)}...${APP_ID.slice(-3)}`,
            APP_KEY: `${APP_KEY.slice(0, 3)}...${APP_KEY.slice(-3)}`,
            keyLength: APP_KEY.length
        });

        // 签名生成（严格遵循官方示例）
        const salt = Date.now().toString();
        const rawText = text; // 仅过滤控制字符
        const signStr = APP_ID + rawText + salt + APP_KEY; // 使用原始文本
        
        console.log('SignDebug:', {
            rawText,
            signStr: `${APP_ID}${rawText}${salt}${APP_KEY}`,
            salt
        });

        const sign = CryptoJS.MD5(signStr).toString().toLowerCase();

        // 构建请求参数（GET方式）
        const params = new URLSearchParams({
            q: rawText,  
            from: 'zh',
            to: 'en',
            appid: APP_ID,
            salt,
            sign
        });

        // 调用API（必须使用GET）
        const apiUrl = `https://fanyi-api.baidu.com/api/trans/vip/translate?${params}`;
        console.log('Request URL:', apiUrl); // 脱敏日志

        const response = await fetch(apiUrl, {
            headers: { 'User-Agent': 'Node.js/18' }
        });
        if (!response.ok) {
            console.error(`[TRANSLATE] 百度API请求失败 ${response.status}`);
            return NextResponse.json(
                { error: `翻译服务暂时不可用 (${response.status})` },
                { status: 502 }
            );
        }

        const data = await response.json();

        // 增加百度API响应日志
        if (data.error_code) {
            console.error('BaiduAPI Response:', JSON.stringify(data));
            throw new Error(`[${data.error_code}] ${data.error_msg}`);
        }

        return NextResponse.json({
            result: data.trans_result?.[0]?.dst || text
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('[TRANSLATE_ERROR]', error);
            return NextResponse.json(
                { error: error.message || '翻译服务暂时不可用' },
                { status: 500 }
            );
        } else {
            console.error('[TRANSLATE_ERROR]', error);
            return NextResponse.json(
                { error: '翻译服务暂时不可用' },
                { status: 500 }
            );
        }
    }
}