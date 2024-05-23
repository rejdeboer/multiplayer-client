import { Dialog as HeadlessDialog, DialogPanel, DialogTitle } from '@headlessui/react'
import clsx from 'clsx'
import { type Dispatch, type SetStateAction } from 'react'

export type DialogProps = {
	title: string,
	isOpen: boolean,
	setIsOpen: Dispatch<SetStateAction<boolean>>,
	children: React.ReactNode,
	className?: string,
}

const defaultClasses = clsx(
	"max-w-lg space-y-4 border border-gray-700 rounded bg-gray-900 p-8"
)

export function Dialog({
	title,
	isOpen,
	setIsOpen,
	children,
	className,
}: DialogProps) {
	return (
		<HeadlessDialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
			<div className="fixed inset-0 flex w-screen items-center justify-center">
				<DialogPanel className={clsx(defaultClasses, className)} >
					<DialogTitle className="font-bold">{title}</DialogTitle>
					{children}
				</DialogPanel>
			</div>
		</HeadlessDialog>
	)
}
