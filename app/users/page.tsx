'use client'

import Header from '@/components/header/Header'
import TitleUI from '@/components/ui/TitleUI'
import RemoveImg from '@/public/remove.png'
import User from '@/public/users.png'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface IRequest {
	users: IUser[]
}

interface IUser {
	id: number
	name: string
	login: string
	admin: boolean
}

interface IToken {
	userId: number
	admin: boolean
	login: string
	name: string
	exp: Date
}

const Users: NextPage = () => {
	const router = useRouter()
	const [users, setUsers] = useState<IUser[]>([])

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
				if (!(decoded as unknown as IToken).admin) {
					router.push('/auth/signin')
				}
			}
		} catch {
			router.push('/auth/signin')
		}
	}, [])

	useEffect(() => {
		async function getUsers() {
			const response: IRequest = await (
				await fetch('api/users/getusers')
			).json()
			if (response) {
				setUsers(response.users)
			}
		}
		getUsers()
	}, [])

	const deleteUser = async (login: string) => {
			try {
				const response = await fetch('/api/users/deleteuser', {
					method: 'POST',
					headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({login})
				})
				if (response.status == 200) {
					toast.success('Пользователь удалён!', {
						duration: 2500,
						position: 'top-left'
					})
					setTimeout(() => {
						window.location.reload()
					}, 2500)
				}
			} catch {
				toast.error('Ошибка сервера', {
					duration: 2500,
					position: 'top-left'
				})
			}
		}

	return (
		<section>
			<Header />
			<div className='px-15 max-[1000px]:px-5 max-[400px]:px-3 flex flex-col gap-12'>
				<div>
					<TitleUI title='Преподаватели' />
					{users &&
						users.map(
							user =>
								user.admin && (
									<div key={user.id + user.login}>
										<span className='w-full h-[1px] bg-[#dadce0] block my-5' />
										<div className='flex justify-between items-center'>
											<div className='flex justify-start items-center gap-5'>
												<Image
													src={User}
													alt='...'
													className='size-8 cursor-pointer'
												/>
												<h2 className='text-[20px]'>
													{user.name} ({user.login})
												</h2>
											</div>
										</div>
									</div>
								)
						)}
				</div>
				<div>
					<TitleUI title='Другие участники' />
					{users &&
						users.map(
							user =>
								!user.admin && (
									<div key={user.id + user.login}>
										<span className='w-full h-[1px] bg-[#dadce0] block my-5' />
										<div className='flex justify-between items-center'>
											<div className='flex justify-start items-center gap-5'>
												<Image src={User} alt='...' className='size-8' />
												<h2 className='text-[20px]'>
													{user.name} ({user.login})
												</h2>
											</div>
											<Image src={RemoveImg} alt='...' className='size-8' onClick={() => deleteUser(user.login)} />
										</div>
									</div>
								)
						)}
				</div>
			</div>
		</section>
	)
}

export default Users
