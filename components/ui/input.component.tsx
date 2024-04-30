'use client'

import type { HTMLInputTypeAttribute } from "react";
import clsx from "clsx";

type InputTypeAttribute = Extract<
	HTMLInputTypeAttribute,
	"text" | "email" | "search" | "url" | "tel" | "password"
>;

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	type: InputTypeAttribute;
	className?: string;
};

const defaultClasses = clsx(
	"rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6",
	"ring-1 ring-inset ring-white/10",
	"focus:ring-2 focus:ring-inset focus:ring-indigo-500",
)

export function Input({
	className,
	...props
}: InputProps) {
	return (
		<input className={clsx(defaultClasses, className)} {...props} />
	)
}

