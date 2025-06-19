import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import {prisma} from '@/prisma/prisma'
import jwt from 'jsonwebtoken'

interface JwtPayload {
	userId: number
	login: string
	name: string
	admin: boolean
}

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const { login, password } = body

		// Валидация входных данных
		if (!login || !password) {
			return NextResponse.json(
				{ error: 'Все поля обязательны для заполнения' },
				{ status: 400 }
			)
		}

		// Получение пользователя
		const existingUser = await prisma.user.findUnique({
			where: { login }
		})

		if (!existingUser) {
			return NextResponse.json(
			{ error: 'Пользователь не найден.' },
			{ status: 400 }
		)
		}

		const comparePassword = await bcrypt.compare(password, existingUser.password)
		if (!comparePassword) {
			return NextResponse.json(
			{ error: 'Неверные данные.' },
			{ status: 400 })
		}

		const jwtSecret = process.env.JWT_SECRET
		if (!jwtSecret) {
			throw new Error('JWT_SECRET is not defined in environment variables')
		}

		// Полезная нагрузка токена
		const payload: JwtPayload = {
			userId: existingUser.id,
			login: existingUser.login,
			name: existingUser.name,
			admin: existingUser.admin
		}

		// Генерация токена
		const token = jwt.sign(payload, jwtSecret, {
			expiresIn: '7d'
		})

		return NextResponse.json(
			{ 
				token
			},
			{ status: 201 }
		)

	} catch (error) {
		console.error('Signup error:', error)
		return NextResponse.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}