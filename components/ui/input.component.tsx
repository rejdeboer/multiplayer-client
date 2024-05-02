'use client'

import clsx from "clsx";
import { forwardRef } from "react";

type InputTypeAttribute = Extract<
	React.HTMLInputTypeAttribute,
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

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {

	return (
		<input {...props} className={clsx(defaultClasses, props.className)} ref={ref} />
	)
})


