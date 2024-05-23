'use client'

import { SearchProvider } from "@/components/search"
import { SearchBar } from "@/components/search/search-bar.component";
import { UserSearchList } from "./user-search-list.component";
import { AddContributorSubmit } from "./add-contributor-submit.component";
import { SelectedUsers } from "./selected-users.component";

export function AddContributorMenu() {
	return (
		<SearchProvider type="users">
			<div className="space-y-4">
				<div className="border-bottom-1 space-y-4">
					<SearchBar />
					<SelectedUsers />
				</div>
				<UserSearchList />
				<AddContributorSubmit />
			</div>
		</SearchProvider >
	)
}
