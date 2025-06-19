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
    const { login, password, name } = body

    // Валидация входных данных
    if (!login || !password || !name) {
      return NextResponse.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      )
    }

    // Проверка длины пароля
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен содержать минимум 6 символов' },
        { status: 400 }
      )
    }

    // Проверка существующего пользователя по логину
    const existingUser = await prisma.user.findUnique({
      where: { login }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким логином уже существует' },
        { status: 409 }
      )
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10)

    // Создание нового пользователя
    const newUser = await prisma.user.create({
      data: {
        login,
        name,
        password: hashedPassword
      }
    })

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables')
    }

    // Полезная нагрузка токена
    const payload: JwtPayload = {
      userId: newUser.id,
      login: newUser.login,
      name: newUser.name,
			admin: newUser.admin
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