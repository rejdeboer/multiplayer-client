import { Dialog as HeadlessDialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { type Dispatch, type SetStateAction } from 'react'

export type DialogProps = {
	title: string,
	isOpen: boolean,
	setIsOpen: Dispatch<SetStateAction<boolean>>
	children: React.ReactNode
}

export function Dialog({
	title,
	isOpen,
	setIsOpen,
	children,
}: DialogProps) {
	return (
		<HeadlessDialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
			<div className="fixed inset-0 flex w-screen items-center justify-center p-4">
				<DialogPanel className="max-w-lg space-y-4 border border-gray-700 rounded bg-gray-800 p-12">
					<DialogTitle className="font-bold">{title}</DialogTitle>
					{children}
				</DialogPanel>
			</div>
		</HeadlessDialog>
	)
}
