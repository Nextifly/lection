'use client'

import Close from '@/public/close.png'
import EditImg from '@/public/edit.png'
import LinkImg from '@/public/link.png'
import DeleteImg from '@/public/remove.png'
import { jwtDecode } from 'jwt-decode'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface IModule {
	moduleList: IModuleList[]
}

interface IModuleList {
	type: IType
	moduleName: string
	moduleTitle: string
	file: string
}

type IType = 'TEST' | 'MATERIAL'

const ModuleUI = ({ moduleList }: IModule) => {
	const [isAdmin, setIsAdmin] = useState<boolean>(false)
	const [isMaterial, setIsMaterial] = useState<boolean>(false)
	const [title, setTitle] = useState<string[]>([])
	const [materialModuleName, setMaterialModuleName] = useState<string>('')
	const [type, setType] = useState<IType>()
	const [name, setName] = useState<string>('')
	const [file, setFile] = useState<string>('')
	const [material, setMaterial] = useState<IModuleList | undefined>(undefined)

	const router = useRouter()
	useEffect(() => {
		try {
			const decoded: { admin: boolean } = jwtDecode(
				window.localStorage.getItem('token')!
			)
			if (decoded.admin) {
				setIsAdmin(true)
			}
		} catch {
			router.push('/auth/signin')
		}
	}, [])

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

	const handleDelete = async (name: string) => {
		try {
			const response = await fetch('/api/module/material/delete', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ moduleName: name }),
			})
			if (response.status == 200) {
				toast.success('Успешно удалено!', {
					duration: 2500,
					position: 'top-left',
				})
				setTimeout(() => {
					window.location.reload()
				}, 2500)
			} else {
				toast.error('Ошибка при удалении', {
					duration: 2500,
					position: 'top-left',
				})
			}
		} catch {
			toast.error('Ошибка сервера', {
				duration: 2500,
				position: 'top-left',
			})
		}
	}

	const getMaterialFunc = useCallback(
		async (name: string) => {
			setMaterial(undefined)
			try {
				const response = await fetch(`/api/module/material/${name}`)
				if (response.status === 400) {
					toast.error('Ошибка сервера', {
						duration: 2500,
						position: 'top-left',
					})
					setIsMaterial(false)
					return
				}
				if (response.status === 404) {
					toast.error('Материал не найден', {
						duration: 2500,
						position: 'top-left',
					})
					setIsMaterial(false)
					return
				}
				const data = await response.json()
				setIsMaterial(true)
				setMaterial(data)
			} catch {
				setIsMaterial(false)
			}
		},
		[isMaterial, material]
	)

	const updateMaterial = async (modelName: string) => {
		let materialData = material
		if (name) {
			materialData!.moduleName = name
		}
		if (materialModuleName) {
			materialData!.moduleTitle = materialModuleName
		}
		if (type) {
			materialData!.type = type
		}
		if (file) {
			materialData!.file = file
		}
		try {
			const response = await fetch(`/api/module/material/${modelName}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(materialData),
			})
			if (response.status === 200) {
				toast.success('Изменение сохранено!', {
					duration: 2500,
					position: 'top-left',
				})
				setTimeout(() => {
					window.location.reload()
				}, 2500)
			} else {
				toast.error('Изменение не сохранено', {
					duration: 2500,
					position: 'top-left',
				})
			}
		} catch {
			toast.error('Ошибка сервера', {
				duration: 2500,
				position: 'top-left',
			})
		}
	}

	return (
		<>
			<section className='my-5'>
				{moduleList.map(module => (
					<div key={module.moduleName + module.file}>
						<span className='w-full h-[1px] bg-[#dadce0] block' />
						<div
							key={module.moduleName}
							className='w-full h-[56px] flex justify-between items-center hover:bg-[#f8f9fa] px-10 py-8 rounded-b-[5px] max-[520px]:px-0'
						>
							<div className='flex justify-start items-center gap-3'>
								{module.type === 'MATERIAL' ? (
									<div className='size-10 rounded-full bg-[#bdbdbe] flex justify-center items-center'>
										<svg
											focusable='false'
											width='24'
											height='24'
											viewBox='0 0 24 24'
											fill='#ffffff'
										>
											<path d='M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H6V4h2v8l2.5-1.5L13 12V4h5v16z'></path>
										</svg>
									</div>
								) : (
									<div className='size-10 rounded-full bg-[#5f6368] flex justify-center items-center'>
										<svg
											focusable='false'
											width='24'
											height='24'
											viewBox='0 0 24 24'
											fill='#ffffff'
										>
											<path d='M7 15h7v2H7zm0-4h10v2H7zm0-4h10v2H7z'></path>
											<path d='M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-.14 0-.27.01-.4.04a2.008 2.008 0 0 0-1.44 1.19c-.1.23-.16.49-.16.77v14c0 .27.06.54.16.78s.25.45.43.64c.27.27.62.47 1.01.55.13.02.26.03.4.03h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 19H5V5h14v14z'></path>
										</svg>
									</div>
								)}
								<h2 className='max-[520px]:text-[14px]'>{module.moduleName}</h2>
							</div>
							<div className='flex justify-end items-center gap-5'>
								<Link href={module.file} target='_blank'>
									<Image
										src={LinkImg}
										alt='...'
										className='size-6 max-[520px]:size-4'
									/>
								</Link>
								{isAdmin && (
									<>
										<Image
											src={EditImg}
											alt='...'
											className='size-6 max-[520px]:size-4 cursor-pointer'
											onClick={() => getMaterialFunc(module.moduleName)}
										/>
										<Image
											src={DeleteImg}
											alt='...'
											className='size-6 max-[520px]:size-4 cursor-pointer'
											onClick={() => handleDelete(module.moduleName)}
										/>
									</>
								)}
							</div>
						</div>
					</div>
				))}
			</section>
			{isMaterial && material !== undefined && (
				<div className='fixed w-full h-full top-0 left-0 bg-[#00000055] z-10 flex justify-center items-center px-5'>
					<div className='max-w-[500px] h-auto w-full bg-white rounded-2xl p-5 text-center relative'>
						<Image
							src={Close}
							alt='...'
							className='size-4 absolute top-5 right-5 cursor-pointer'
							onClick={() => setIsMaterial(false)}
						/>
						<h2 className='text-2xl mb-8  max-[400px]:mt-5'>
							Изменение материала
						</h2>
						<select
							className='w-full h-[46px] rounded-[5px] border-[1px] border-[#00000066] px-3 cursor-pointer'
							onChange={e => setMaterialModuleName(e.target.value)}
						>
							{title.length > 0 &&
								title.map(value => (
									<option
										className='cursor-pointer'
										key={value}
										selected={value === material.moduleTitle}
									>
										{value}
									</option>
								))}
						</select>
						<input
							type='text'
							placeholder='Название'
							onChange={e => setName(e.target.value)}
							className='w-full h-[46px] rounded-[5px] px-3 mt-3 border-[1px] border-[#00000066]'
							defaultValue={material.moduleName}
						/>
						<select
							className='w-full h-[46px] rounded-[5px] border-[1px] border-[#00000066] px-3 cursor-pointer mt-3'
							onChange={e =>
								setType(e.target.value === 'Материал' ? 'MATERIAL' : 'TEST')
							}
						>
							<option selected={material.type === 'MATERIAL'}>Материал</option>
							<option selected={material.type === 'TEST'}>Тест</option>
						</select>
						<input
							type='text'
							placeholder='Файл'
							onChange={e => setFile(e.target.value)}
							className='w-full h-[46px] rounded-[5px] px-3 mt-3 border-[1px] border-[#00000066]'
							defaultValue={material.file}
						/>
						<button
							className='mt-5 w-full h-[46px] bg-[#1a73e8] text-[18px] text-white rounded-[5px] cursor-pointer'
							onClick={() => updateMaterial(material.moduleName)}
						>
							Обновить
						</button>
					</div>
				</div>
			)}
		</>
	)
}

export default ModuleUI
