'use client'

import Link from "next/link";
import { DeleteDocument } from "./delete-document.component";
import { useDocumentList } from "@/hooks";

export function DocumentList() {
	const {
		documents,
		mutate,
	} = useDocumentList()

	return (
		<div className="mt-8 flow-root">
			<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
				<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
					{documents && <table className="min-w-full divide-y divide-gray-700">
						<thead>
							<tr>
								<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">
									Name
								</th>
								<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
									<span className="sr-only">Actions</span>
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-800">
							{documents.map((document) => (
								<tr key={document.id}>
									<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
										{document.name}
									</td>
									<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium space-x-4 sm:pr-0">
										<Link href={`/documents/${document.id}`} className="text-indigo-400 hover:text-indigo-300">
											Edit
										</Link>
										<DeleteDocument documentId={document.id} mutate={mutate} />
									</td>
								</tr>
							))}
						</tbody>
					</table>}
				</div>
			</div>
		</div>
	)
}
