import { NextResponse } from 'next/server'
import {prisma} from '@/prisma/prisma'

export async function GET(
  request: Request,
  { params }: { params: { moduleName: string } }
) {
  try {

    // Извлекаем name из параметров URL
    const moduleName = params.moduleName

    // Ищем пользователя в базе данных
    const module = await prisma.module.findUnique({
      where: { moduleName },
      select: {
        moduleName: true,
				moduleTitle: true,
        type: true,
				file: true,
      }
    })

    if (!module) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(module, { status: 200 })

  } catch (error) {
    console.error('Failed to fetch material:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request, { params }: { params: { moduleName: string } }) {
	try {
		const body = await request.json()
		const { moduleName, moduleTitle, type, file } = body

    // Извлекаем name из параметров URL
    const name = params.moduleName

		await prisma.module.update({
			where: {
        moduleName: name
			}, 
      data: {
        moduleName,
        moduleTitle,
        type,
        file
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