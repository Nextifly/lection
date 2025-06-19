'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const SignIn = () => {
	const router = useRouter()
	const [login, setLogin] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	useEffect(() => {
		window.localStorage.getItem('token') && router.push('/')
	},[])

	const handleClick = async () => {
		if (!login)
			return toast.error('Введите логин', {
				duration: 2500,
				position: 'top-left',
			})
		if (!password)
			return toast.error('Введите пароль', {
				duration: 2500,
				position: 'top-left',
			})
		if (password.length < 6)
			return toast.error('Пароль должен быть не меньше 6 символов', {
				duration: 2500,
				position: 'top-left',
			})
		const user = {
			login,
			password,
		}

		try {
			const response = await fetch('/api/users/signin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Неверные даные')
			}
			window.localStorage.setItem('token', data.token)
			toast.success('Успешный вход!', {
				duration: 2500,
				position: 'top-left',
			})
			setTimeout(() => {
				router.push('/')
			}, 2500)
		} catch (err: any) {
			toast.error('Неверные данные', {
				duration: 2500,
				position: 'top-left'
			})
		}
	}

	return (
		<>
			<section className='size-full bg-[#00000055] flex justify-center items-center px-5'>
				<div className='max-w-[500px] w-full h-auto bg-white rounded-[12px] p-10 text-center max-[430px]:p-5'>
					<h1 className='text-4xl mb-12 max-[430px]:text-3xl'>Войти</h1>
					<input
						type='text'
						placeholder='Логин'
						name='login'
						className='bg-[#00000033] block w-full h-[46px] mb-3 px-5 rounded-2xl text-[18px]'
						maxLength={25}
						onChange={(e) => setLogin(e.target.value)}
					/>
					<input
						type='text'
						placeholder='Пароль'
						name='password'
						className='bg-[#00000033] block w-full h-[46px] mb-3 px-5 rounded-2xl text-[18px]'
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button
						className='mt-5 w-full h-[46px] bg-[#1a73e8] text-[18px] text-white rounded-2xl cursor-pointer'
						onClick={handleClick}
					>
						Войти
					</button>
					<h2 className='mt-10'>
						Нет аккаунта?{' '}
						<Link href='/auth/signup' className='text-[#1a73e8] underline'>
							Зарегистрировать
						</Link>
					</h2>
				</div>
			</section>
		</>
	)
}

export default SignIn
