import RoleChecker from "@/lib/RoleChecker";
import CreateDocuments from "./UserCreateDocuments";
import DocumentHook from "@/hooks/document/documentHook";
import DeleteDialog from "@/components/DeleteDialog";

function UserDocuments() {
  const { getAllDocuments, deleteDocuments } = DocumentHook();
  console.log(getAllDocuments);
  // const [pdfUrl, setPdfUrl] = useState(null);

  const handleDocumentClick = (fileUrl) => {
    console.log(fileUrl);
    window.open(`http://192.168.20.11:4001${fileUrl}`);
  };
  const handleDeleteDocument = (documentId) => {
    deleteDocuments.mutate(documentId);
  };

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
          <p>No documents available.</p>
        ) : (
          getAllDocuments?.files?.map((doc) => (
            <div
              key={doc._id}
              className="p-4 bg-white border border-gray-300 rounded shadow hover:shadow-lg transition-shadow duration-300"
              onClick={() => Array.isArray(doc.attachments) && doc.attachments.length > 0 && handleDocumentClick(doc.attachments[0].file_url)}
            >
              <h3 className="text-xl font-semibold text-gray-800 inline-flex justify-between items-center w-full">
                {doc.title}
                <RoleChecker
                  allowedRoles={["manager"]}
                  allowedDepartments={["human-resource"]}
                >
                  <DeleteDialog
                    onConfirm={() => handleDeleteDocument(doc._id)}
                  />
                </RoleChecker>
              </h3>
              <p className="my-2 text-gray-600">{doc.description}</p>
              <RoleChecker
                allowedRoles={["manager"]}
                allowedDepartments={["human-resource"]}
              >
                {Array.isArray(doc.attachments) && doc.attachments.length > 0 && (
                  <a
                    className="text-blue-500 hover:underline"
                    href={`http://192.168.20.11:4001${doc.attachments[0].file_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                )}
              </RoleChecker>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserDocuments;
