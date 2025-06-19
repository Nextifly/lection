'use client'

import Header from '@/components/header/Header'
import Module from '@/components/Module/Module'
import Close from '@/public/close.png'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

interface IModule {
	title: string
	module: IModuleList[]
}

interface IRequestModule {
	title: { name: string; id: number }[]
	module: IModuleList[]
}

interface IModuleList {
	type: IType
	moduleName: string
	moduleTitle: string
	file: string
}

type IType = 'TEST' | 'MATERIAL'

interface IToken {
	userId: number
	admin: boolean
	login: string
	name: string
	exp: Date
}

const Home = () => {
	const router = useRouter()
	const [select, setSelect] = useState<string>('')
	const [list, setList] = useState<IModule[]>()
	const [filterList, setFilterList] = useState<IModule[]>()
	const [isAdmin, setIsAdmin] = useState<boolean>(false)
	const [isMaterial, setIsMaterial] = useState<boolean>(false)
	const [isModule, setIsModule] = useState<boolean>(false)
	const [title, setTitle] = useState<string[]>([])
	const [materialModuleName, setMaterialModuleName] = useState<string>('')
	const [type, setType] = useState<string>('')
	const [name, setName] = useState<string>('')
	const [file, setFile] = useState<string>('')
	const [moduleName, setModuleName] = useState<string>('')

	useEffect(() => {
		async function getInfo() {
			const list: IRequestModule = await (await fetch('api/module/all')).json()
			let newList: IModule[] = []
			list.title.map(value => {
				let moduleData: IModule = {
					title: value.name,
					module: list.module.filter(
						moduleOne => moduleOne.moduleTitle == value.name
					),
				}
				newList.push(moduleData)
			})
			setList(newList)
			setFilterList(newList)
		}
		getInfo()
	}, [])

	useEffect(() => {
		try {
			const decoded = jwtDecode<JwtPayload>(
				window.localStorage.getItem('token')!
			)
			const currentTimeMs = Date.now()
			const expMs = decoded.exp! * 1000
			if (currentTimeMs >= expMs) {
				window.localStorage.removeItem('token')
				router.push('/auth/signin')
			} else {
				if ((decoded as unknown as IToken).admin) {
					setIsAdmin(true)
				}
			}
		} catch {
			router.push('/auth/signin')
		}
	}, [])

	useMemo(() => {
		if (select == 'Все темы') {
			setFilterList(list)
			return
		}
		setFilterList(list?.filter(value => value.title == select))
	}, [select])

	useEffect(() => {
		async function getInfo() {
			const { list }: { list: { name: string; id: number }[] } = await (
				await fetch('api/module/title')
			).json()
			let newList: string[] = []
			list.map(value => {
				newList.push(value.name)
			})
			setTitle(newList)
		}
		getInfo()
	}, [])

	const createMaterial = async () => {
		if (!materialModuleName)
			return toast.error('Выберите модуль', {
				duration: 2500,
				position: 'top-left',
			})
		if (!name)
			return toast.error('Введите название', {
				duration: 2500,
				position: 'top-left',
			})
		if (!type)
			return toast.error('Выберите тип', {
				duration: 2500,
				position: 'top-left',
			})
		if (!file)
			return toast.error('Введите ссылку на файл', {
				duration: 2500,
				position: 'top-left',
			})
		const material = {
			moduleTitle: materialModuleName,
			moduleName: name,
			type,
			file,
		}

		try {
			const response = await fetch('/api/module/material', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(material),
			})

			const data = await response.json()
			if (data) {
				toast.success('Успешно создано!', {
					duration: 2500,
					position: 'top-left',
				})
				setTimeout(() => {
					window.location.reload()
				}, 2500)
			}

			if (!response.ok) {
				throw new Error(data.error || 'Ошибка создания')
			}
		} catch {
			toast.error('Ошибка сервера', {
				duration: 2500,
				position: 'top-left',
			})
		}
	}

	const createModule = async () => {
		if (!moduleName) {
			return toast.error('Введите название', {
				duration: 2500,
				position: 'top-left',
			})
		}
		try {
			const response = await fetch('api/module/title', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name: moduleName }),
			})

			const data = await response.json()

			if (data) {
				toast.success('Успешно создано!', {
					duration: 2500,
					position: 'top-left',
				})
				setTimeout(() => {
					window.location.reload()
				}, 2500)
			}

			if (!response.ok) {
				throw new Error(data.error || 'Ошибка создания')
			}
		} catch (e) {
			toast.error('Ошибка сервера', {
				duration: 2500,
				position: 'top-left',
			})
		}
	}

	return (
		<>
			<Header setSelect={setSelect} />
			{isAdmin && (
				<div className='w-full h-[66px] bg-[#00000066] flex justify-evenly items-center'>
					<button
						className='w-[188px] h-[46px] rounded-[12px] bg-white text-[18px] font-medium cursor-pointer'
						onClick={() => setIsModule(true)}
					>
						Добавить модуль
					</button>
					<button
						className='w-[188px] h-[46px] rounded-[12px] bg-white text-[18px] font-medium cursor-pointer'
						onClick={() => setIsMaterial(true)}
					>
						Добавить материал
					</button>
				</div>
			)}
			<div>
				{filterList &&
					filterList.map(value => (
						<Module
							title={value.title}
							moduleList={value.module}
							key={value.title + Math.random()}
						/>
					))}
			</div>
			{isMaterial && (
				<div className='fixed w-full h-full top-0 left-0 bg-[#00000055] z-10 flex justify-center items-center px-5'>
					<div className='max-w-[500px] h-auto w-full bg-white rounded-2xl p-5 text-center relative'>
						<Image
							src={Close}
							alt='...'
							className='size-4 absolute top-5 right-5 cursor-pointer'
							onClick={() => setIsMaterial(false)}
						/>
						<h2 className='text-2xl mb-8'>Добавление материала</h2>
						<select
							className='w-full h-[46px] rounded-[5px] border-[1px] border-[#00000066] px-3 cursor-pointer max-[526px]:w-[240px] max-[526px]:h-12'
							onChange={e =>
								setMaterialModuleName(
									e.target.value !== 'Выберите модуль' ? e.target.value : ''
								)
							}
						>
							<option className=' cursor-pointer' defaultChecked>
								Выберите модуль
							</option>
							{title.length > 0 &&
								title.map(value => (
									<option className='cursor-pointer' key={value}>
										{value}
									</option>
								))}
						</select>
						<input
							type='text'
							placeholder='Название'
							onChange={e => setName(e.target.value)}
							className='w-full h-[46px] rounded-[5px] px-3 mt-3 border-[1px] border-[#00000066]'
						/>
						<select
							className='w-full h-[46px] rounded-[5px] border-[1px] border-[#00000066] px-3 cursor-pointer max-[526px]:w-[240px] max-[526px]:h-12 mt-3'
							onChange={e =>
								setType(
									e.target.value !== 'Тип'
										? e.target.value === 'Материал'
											? 'MATERIAL'
											: 'TEST'
										: ''
								)
							}
						>
							<option className=' cursor-pointer' defaultChecked>
								Тип
							</option>
							<option>Материал</option>
							<option>Тест</option>
						</select>
						<input
							type='text'
							placeholder='Файл'
							onChange={e => setFile(e.target.value)}
							className='w-full h-[46px] rounded-[5px] px-3 mt-3 border-[1px] border-[#00000066]'
						/>
						<button
							className='mt-5 w-full h-[46px] bg-[#1a73e8] text-[18px] text-white rounded-[5px] cursor-pointer'
							onClick={createMaterial}
						>
							Создать
						</button>
					</div>
				</div>
			)}
			{isModule && (
				<div className='fixed w-full h-full top-0 left-0 bg-[#00000055] z-10 flex justify-center items-center px-5'>
					<div className='max-w-[500px] h-auto w-full bg-white rounded-2xl p-5 text-center relative'>
						<Image
							src={Close}
							alt='...'
							className='size-4 absolute top-5 right-5 cursor-pointer'
							onClick={() => setIsModule(false)}
						/>
						<h2 className='text-2xl mb-8'>Добавление модуля</h2>
						<input
							type='text'
							placeholder='Название'
							onChange={e => setModuleName(e.target.value)}
							className='w-full h-[46px] rounded-[5px] px-3 mt-3 border-[1px] border-[#00000066]'
						/>
						<button
							className='mt-5 w-full h-[46px] bg-[#1a73e8] text-[18px] text-white rounded-[5px] cursor-pointer'
							onClick={createModule}
						>
							Создать
						</button>
					</div>
				</div>
			)}
		</>
	)
}

export default Home
