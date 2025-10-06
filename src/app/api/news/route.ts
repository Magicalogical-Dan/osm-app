import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const league = searchParams.get('league')
    const club = searchParams.get('club')
    const competition = searchParams.get('competition')
    const source = searchParams.get('source')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    let query = supabase
      .from('news_articles')
      .select('*')
      .eq('sport', 'rugby_league')
      .order('published_at', { ascending: false })

    // Apply filters
    if (league) {
      query = query.eq('league', league)
    }

    if (club) {
      query = query.eq('club', club)
    }

    if (competition) {
      query = query.eq('competition', competition)
    }

    if (source) {
      query = query.eq('source', source)
    }

    if (tag) {
      query = query.contains('tags', [tag])
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: articles, error } = await query
      .range(from, to)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ articles })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
