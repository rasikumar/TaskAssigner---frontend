import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RoleChecker from "@/lib/RoleChecker";
import CreateDocuments from "./UserCreateDocuments";
import DocumentHook from "@/hooks/document/documentHook";
import DeleteDialog from "@/components/DeleteDialog";

function UserDocuments() {
  const { getAllDocuments, deleteDocuments, getDocumentById } = DocumentHook();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteDocument = (documentId) => {
    deleteDocuments.mutate(documentId);
  };

  const handleDocumentClick = (fileUrl) => {
    getDocumentById.mutate(fileUrl, {
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

  // console.log(pdfUrl)

  return (
    <div>
      <div className="mb-5">
        <RoleChecker
          allowedRoles={["manager"]}
          allowedDepartments={["human-resource"]}
        >
          <CreateDocuments />
        </RoleChecker>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {getAllDocuments?.files?.length === 0 ? (
          <p className="text-black">No documents available.</p>
        ) : (
          getAllDocuments?.files?.map((doc) => (
            <div
              key={doc._id}
              className="p-4 bg-white border border-gray-300 rounded shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  {doc.title}
                </h3>
                <RoleChecker
                  allowedRoles={["manager"]}
                  allowedDepartments={["human-resource"]}
                >
                  <DeleteDialog
                    onConfirm={() => handleDeleteDocument(doc._id)}
                  />
                </RoleChecker>
              </div>
              <p className="my-2 text-gray-600">{doc.description}</p>
              <button
                onClick={() => handleDocumentClick(doc.attachments?.file_name)}
                className="text-blue-500 hover:underline"
              >
                View Document
              </button>
            </div>
          ))
        )}
      </div>

      {/* ShadCN Dialog for PDF View */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>View Document</DialogTitle>
          </DialogHeader>
          {pdfUrl && (
            <object
              data={pdfUrl}
              type="application/pdf"
              className="w-full h-[500px] border rounded-md"
            >
              <p>
                PDF cannot be displayed. <a href={pdfUrl}>Download here</a>
              </p>
            </object>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserDocuments;
