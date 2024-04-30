'use client'

import clsx from "clsx";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	className?: string;
};

const defaultClasses = clsx(
	"rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400",
	"focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
)

export function Button({
	className,
	...props
}: ButtonProps) {
	return (
		<button className={clsx(defaultClasses, className)} {...props} />
	)
}

