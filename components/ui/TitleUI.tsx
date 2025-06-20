'use client'

import DeleteImg from '@/public/remove.png'
import { jwtDecode } from 'jwt-decode'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const TitleUI = ({ title }: { title: string }) => {
	const [isAdmin, setIsAdmin] = useState<boolean>(false)
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

	const handleDelete = async () => {
		try {
			const response = await fetch('/api/module/title/delete', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ moduleName: title }),
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

	return (
		<div className='flex justify-between items-center'>
			<h2 className='text-3xl max-[520px]:text-2xl'>{title}</h2>
			{isAdmin && (
				<Image
					src={DeleteImg}
					alt='...'
					className='size-8 cursor-pointer'
					onClick={handleDelete}
				/>
			)}
		</div>
	)
}

export default TitleUI
