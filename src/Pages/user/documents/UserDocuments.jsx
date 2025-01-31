import RoleChecker from "@/lib/RoleChecker";
import CreateDocuments from "./UserCreateDocuments";
import DocumentHook from "@/hooks/document/documentHook";
// import { useNavigate } from "react-router";
// const filepathUrl = import.meta.env.VITE_FILE_PATH;

function UserDocuments() {
  const { getAllDocuments } = DocumentHook();

  const handleDocumentClick = (fileUrl) => {
    window.open(`http://192.168.20.11:4001${fileUrl}`, "_blank");
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
        {getAllDocuments?.length === 0 ? (
          <p>No documents available.</p>
        ) : (
          getAllDocuments?.map((doc) => (
            <div
              key={doc._id}
              className="p-4 bg-white border border-gray-300 rounded shadow hover:shadow-lg transition-shadow duration-300"
              onClick={() => handleDocumentClick(doc.fileUrl)}
            >
              <h3 className="m-0 text-xl font-semibold text-gray-800">
                {doc.title}
              </h3>
              <p className="my-2 text-gray-600">{doc.description}</p>
              <RoleChecker
                allowedRoles={["manager"]}
                allowedDepartments={["human-resource"]}
              >
                <a
                  className="text-blue-500 hover:underline"
                  href={`http://192.168.20.11:4001/${doc.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </RoleChecker>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserDocuments;
