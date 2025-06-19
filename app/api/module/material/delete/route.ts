import { NextResponse } from 'next/server'
import {prisma} from '@/prisma/prisma'

export async function POST(request: Request) {
		const body = await request.json()
		const { moduleName } = body

		// Валидация входных данных
		if (!moduleName) {
			return NextResponse.json(
				{ error: 'Все поля обязательны для заполнения' },
				{ status: 400 }
			)
		}

		await prisma.module.delete({
			where: {
				moduleName,
			}
		})

		return NextResponse.json(
			{ 
				message: 'Успешно удалено!'
			},
			{ status: 200 }
		)
}