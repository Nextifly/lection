'use client'

import Logo from '@/public/group.png'
import User from '@/public/user.png'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface IToken {
	userId: number
	admin: boolean
	login: string
	name: string
}

const Header = ({ setSelect }: { setSelect?: (select: string) => void }) => {
	const [userModal, setUserModal] = useState<boolean>(false)
	const [title, setTitle] = useState<string[]>([])
	const [isAdmin, setIsAdmin] = useState<boolean>(false)
	const router = useRouter()

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

	useEffect(() => {
		try {
			const token: IToken = jwtDecode<JwtPayload>(
			window.localStorage.getItem('token')!
		) as IToken
		if (token.admin) {
			setIsAdmin(true)
		}
		} catch {
			router.push('/auth/signin')
		}
	}, [])

	const handleClick = () => {
		window.localStorage.removeItem('token')
		toast.success('Успешный выход!', {
			duration: 2500,
			position: 'top-left',
		})
		setTimeout(() => {
			router.push('/auth/signin')
		}, 2500)
	}

	return (
		<>
			<nav
				className={`py-5 bg-[#f8fafd] flex justify-around items-center w-full ${
					!isAdmin && 'hidden'
				}`}
			>
				<Link
					href='/'
					className='hover:text-[#1a73e8] hover:underline text-[18px]'
				>
					Задания
				</Link>
				<Link
					href='/users'
					className='text-[18px] hover:text-[#1a73e8] hover:underline'
				>
					Пользователи
				</Link>
			</nav>
			<header className='my-10 flex flex-row justify-between items-center px-15 max-[1000px]:px-5 max-[400px]:px-3'>
				<Link
					href='/'
					className='flex flex-row justify-start items-center gap-5'
				>
					<Image src={Logo} alt='logo' className='size-12 max-[420px]:size-8' />
					<h2 className='text-[24px] max-[900px]:hidden'>
						Осведомленность в области ИБ
					</h2>
				</Link>
				{setSelect && (
					<select
						className='w-[340px] h-14 rounded-[5px] border-[1px] border-[#00000066] px-3 cursor-pointer max-[526px]:w-[240px] max-[526px]:h-12'
						onChange={e => setSelect(e.target.value)}
					>
						<option className=' cursor-pointer' defaultChecked>
							Все темы
						</option>
						{title.length > 0 &&
							title.map(value => (
								<option className='cursor-pointer' key={value}>
									{value}
								</option>
							))}
					</select>
				)}
				<div className='relative'>
					<Image
						src={User}
						alt='...'
						className={`size-12 cursor-pointer max-[420px]:size-8`}
						onClick={() => setUserModal(!userModal)}
					/>
					<div
						className={`absolute top-[58px] right-0 mt-2 bg-[#e0e0e0] w-[180px] px-2 py-3 h-auto rounded-[6px] ${
							!userModal && 'hidden'
						}`}
					>
						<button
							onClick={handleClick}
							className='cursor-pointer text-[18px]'
						>
							Выйти из аккаунта
						</button>
					</div>
				</div>
			</header>
		</>
	)
}

export default Header
