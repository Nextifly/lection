import { NextResponse } from 'next/server'
import {prisma} from '@/prisma/prisma'

export async function POST(request: Request) {
		const body = await request.json()
		const { moduleName, moduleTitle, type, file } = body

		// Валидация входных данных
		if (!moduleName || !moduleTitle || !type || !file) {
			return NextResponse.json(
				{ error: 'Все поля обязательны для заполнения' },
				{ status: 400 }
			)
		}

		// Проверка существующего материала

		const materal = await prisma.module.findUnique({
			where: {
				moduleName
			}
		})

		if (materal) {
			return NextResponse.json(
				{ error: 'Материал с таким названием уже создан.' },
				{ status: 409 }
			)
		}

		const newMaterial = await prisma.module.create({
			data: {
				moduleName,
				moduleTitle,
				type,
				file
			}
		})

		return NextResponse.json(
			{ 
				newMaterial
			},
			{ status: 201 }
		)
}