import { NextResponse } from 'next/server'
import {prisma} from '@/prisma/prisma'

export async function GET() {
	const title = await prisma.moduleTitle.findMany()
	return NextResponse.json({ list: title })
}

export async function POST(request: Request) {
		const body = await request.json()
		const { name } = body

		// Валидация входных данных
		if (!name) {
			return NextResponse.json(
				{ error: 'Все поля обязательны для заполнения' },
				{ status: 400 }
			)
		}

		// Проверка существующего материала

		const module = await prisma.moduleTitle.findUnique({
			where: {
				name
			}
		})

		if (module) {
			return NextResponse.json(
        { error: 'Модуль с таким названием уже создан.' },
        { status: 409 }
      )
		}

		const newModule = await prisma.moduleTitle.create({
			data: {
				name
			}
		})

		return NextResponse.json(
      { 
        newModule
      },
      { status: 201 }
    )
}