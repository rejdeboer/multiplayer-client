import { CreateDocumentForm } from "@/components/forms";
import { DocumentList } from "@/components/document";
import { DialogButton } from "@/components/ui";
import { getServerSessionOrRedirect } from "@/lib/auth/get-token-or-redirect";

export default async function Documents() {
  const server = getServerSessionOrRedirect();
  const documents = await server.documents.list();

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
                <DialogButton buttonTitle="Create document" dialogTitle="Name your document">
                  <CreateDocumentForm server={server} />
                </DialogButton>
              </div>
            </div>
            <DocumentList documents={documents} />
          </div>
        </div>
      </div>
    </div>
  )
}
