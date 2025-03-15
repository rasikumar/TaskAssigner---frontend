import DeleteDialog from "@/components/DeleteDialog";
import CreateDocuments from "./CreateDocuments";
import AdminDocumentHook from "@/hooks/document/AdminDocumentHook";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { useNavigate } from "react-router";

function Documents() {
  const { getAllDocumentsAdmin, deleteDocuments, getDocumentAdminById } =
    AdminDocumentHook();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteDocument = (documentId) => {
    deleteDocuments.mutate(documentId);
  };

  const handleDocumentClick = (fileUrl) => {
    getDocumentAdminById.mutate(fileUrl, {
      onSuccess: (file) => {
        if (file) {
          const blob = new Blob([file], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
          setIsOpen(true); // Open modal
        }
      },
    });
  };
  console.log(pdfUrl);


  return (
    <div>
      <div className="mb-5">
        <CreateDocuments />
      </div>
      {getAllDocumentsAdmin?.files?.length === 0 ? (
        <p>No documents available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {getAllDocumentsAdmin?.files?.map((doc) => (
            <div
              key={doc._id}
              className="p-4 bg-white border border-gray-300 rounded shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div
              // onClick={() => handleDocumentClick(doc?.attachments?.file_url)}
              >
                <div className="flex justify-between items-center">
                  <h3
                    className="text-xl font-semibold text-gray-800"
                  >
                    {doc.title}
                  </h3>
                  <DeleteDialog
                    onConfirm={() => handleDeleteDocument(doc._id)}
                  />
                </div>
                <p className="my-2 text-gray-600">{doc.description}</p>
              </div>
              <button
                onClick={() => handleDocumentClick(doc.attachments?.file_name)}
                className="text-blue-500 hover:underline"
              >
                View Document
              </button>

              {/* </>
              ) : (
                <p className="text-gray-500">No document available</p>
              )} */}
            </div>
          ))}
        </div>
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>View Document</DialogTitle>
          </DialogHeader>
          {pdfUrl && (
            <embed
              src={pdfUrl}
              type="application/pdf"
              className="w-full h-[500px] border rounded-md"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Documents;
