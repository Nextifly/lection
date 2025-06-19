import { NextResponse } from 'next/server'
import {prisma} from '@/prisma/prisma'

export async function GET() {
  const title = await prisma.moduleTitle.findMany()
  const module = await prisma.module.findMany()
  return NextResponse.json({ title, module })
}