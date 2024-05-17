import { DocumentList, CreateDocument } from "@/components/document";

export default async function Documents() {
  return (
    <div className="bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="bg-gray-900 py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-white">My documents</h1>
                <p className="mt-2 text-sm text-gray-300">
                  A list of all the documents in your account.
                </p>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <CreateDocument />
              </div>
            </div>
            <DocumentList />
          </div>
        </div>
      </div>
    </div>
  )
}
