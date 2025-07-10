import { NextRequest, NextResponse } from 'next/server';

const FINMIND_API_URL = 'https://api.finmindtrade.com/api/v4/data';
const token = process.env.NEXT_PUBLIC_FINMIND_TOKEN;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dataset = searchParams.get('dataset');
    const dataId = searchParams.get('data_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // 调试信息
    console.log('API Route - Received params:', {
      dataset,
      dataId,
      startDate,
      endDate,
      allParams: Object.fromEntries(searchParams.entries())
    });

    // 验证必需参数
    if (!dataset) {
      console.log('API Route - Missing dataset parameter');
      return NextResponse.json(
        { error: 'dataset parameter is required' },
        { status: 400 }
      );
    }

    // 构建请求 URL
    const url = new URL(FINMIND_API_URL);
    url.searchParams.set('dataset', dataset);
    if (dataId) url.searchParams.set('data_id', dataId);
    if (startDate) url.searchParams.set('start_date', startDate);
    if (endDate) url.searchParams.set('end_date', endDate);

    // 发起请求到 FinMind API
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`FinMind API error: ${response.status}`);
    }

    const data = await response.json();

    // 返回数据，设置 CORS 头
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

// 处理 OPTIONS 请求（预检请求）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 