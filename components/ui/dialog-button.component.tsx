'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import { Button } from './button.component'

export type DialogButtonProps = {
	buttonTitle: string,
	dialogTitle: string,
	children: React.ReactNode
}

export function DialogButton({
	buttonTitle,
	dialogTitle,
	children,
}: DialogButtonProps) {
	let [isOpen, setIsOpen] = useState(false)

	return (
		<>
			<Button type="button" onClick={() => setIsOpen(true)}>{buttonTitle}</Button>
			<Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
				<div className="fixed inset-0 flex w-screen items-center justify-center p-4">
					<DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
						<DialogTitle className="font-bold">{dialogTitle}</DialogTitle>
						{children}
					</DialogPanel>
				</div>
			</Dialog>
		</>
	)
}
