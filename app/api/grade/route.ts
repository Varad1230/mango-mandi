import { NextRequest } from 'next/server'

// Maps FastAPI label strings to our four product grades.
// Update these keys once the real model label strings are confirmed.
const GRADE_MAP: Record<string, string> = {
  unripe:  'Unripe',
  grade_a: 'A',
  grade_b: 'B',
  grade_c: 'B',
  premium: 'Premium',
}

export async function POST(req: NextRequest) {
  const mlUrl = process.env.MANGO_ML_URL
  if (!mlUrl) {
    return Response.json({ error: 'ML service not configured' }, { status: 503 })
  }

  const body = await req.formData()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10_000)

  try {
    const upstream = await fetch(`${mlUrl}/grade`, {
      method: 'POST',
      body,
      signal: controller.signal,
    })
    clearTimeout(timer)

    if (!upstream.ok) {
      return Response.json({ error: await upstream.text() }, { status: upstream.status })
    }

    const data = await upstream.json()
    // Expected FastAPI response shape: { grade: "grade_a", confidence: 0.87, ... }
    const rawGrade = (data.grade as string).toLowerCase().replace(/[\s-]/g, '_')
    const grade = GRADE_MAP[rawGrade] ?? data.grade
    return Response.json({ grade, confidence: data.confidence, raw: data })
  } catch (err: unknown) {
    clearTimeout(timer)
    const isTimeout = err instanceof Error && err.name === 'AbortError'
    return Response.json(
      { error: isTimeout ? 'ML service timed out' : 'ML service unavailable' },
      { status: 503 }
    )
  }
}
