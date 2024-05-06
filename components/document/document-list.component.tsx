import Link from "next/link";
import { Button } from "../ui";
import { Document } from "@/lib/server-client";

export function DocumentList(documents: Document[]) {
	return (

		<div className="bg-gray-900">
			<div className="mx-auto max-w-7xl">
				<div className="bg-gray-900 py-10">
					<div className="px-4 sm:px-6 lg:px-8">
						<div className="sm:flex sm:items-center">
							<div className="sm:flex-auto">
								<h1 className="text-base font-semibold leading-6 text-white">My documents</h1>
								<p className="mt-2 text-sm text-gray-300">
									A list of all the documents in your account including their name.
								</p>
							</div>
							<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
								<Button
									type="button"
								>
									Create document
								</Button>
							</div>
						</div>
						<div className="mt-8 flow-root">
							<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
								<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
									<table className="min-w-full divide-y divide-gray-700">
										<thead>
											<tr>
												<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">
													Name
												</th>
												<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
													<span className="sr-only">Edit</span>
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-800">
											{documents.map((document) => (
												<tr key={document.id}>
													<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
														{document.name}
													</td>
													<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
														<Link href={document.id} className="text-indigo-400 hover:text-indigo-300">
															Edit
														</Link>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
