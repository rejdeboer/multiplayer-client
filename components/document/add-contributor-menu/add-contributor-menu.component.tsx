'use client'

import { SearchProvider } from "@/components/search"
import { SearchBar } from "@/components/search/search-bar.component";
import { UserSearchList } from "./user-search-list.component";
import { AddContributorProvider } from "./add-contributor.context";

export function AddContributorMenu() {
	return (
		<AddContributorProvider>
			<SearchProvider type="users">
				<div className="py-2 px-4 border-bottom-1">
					<SearchBar />
				</div>
				<UserSearchList />
			</SearchProvider>
		</AddContributorProvider>
	)
}
