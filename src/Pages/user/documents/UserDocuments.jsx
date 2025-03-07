import RoleChecker from "@/lib/RoleChecker";
import CreateDocuments from "./UserCreateDocuments";
import DocumentHook from "@/hooks/document/documentHook";
import DeleteDialog from "@/components/DeleteDialog";
import { Link } from "react-router";

function UserDocuments() {
  const { getAllDocuments, deleteDocuments } = DocumentHook();

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
            >
              <div className="flex justify-between items-center">
                <Link
                  to={`http://192.168.20.11:4001${doc.attachments?.file_url}`}
                  className="text-xl font-semibold text-gray-800"
                >
                  {doc.title}
                </Link>
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
              {Array.isArray(doc.attachments) && doc.attachments.length > 0 ? (
                <>
                  {console.log("File URL:", doc.attachments[0]?.file_url)}
                  <a
                    href={`${doc.attachments[0]?.file_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Document
                  </a>
                </>
              ) : (
                <p className="text-gray-500">No document available</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserDocuments;
