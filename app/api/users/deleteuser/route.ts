import { NextResponse } from 'next/server'
import {prisma} from '@/prisma/prisma'

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const { login } = body

		// Валидация входных данных
		if (!login) {
			return NextResponse.json(
				{ error: 'Все поля обязательны для заполнения' },
				{ status: 400 }
			)
		}

		await prisma.user.delete({
			where: {
				login
			}
		})

		return NextResponse.json(
			{ 
				message: 'Успешно!'
			},
			{ status: 200 }
		)

	} catch (error) {
		console.error('Signup error:', error)
		return NextResponse.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}