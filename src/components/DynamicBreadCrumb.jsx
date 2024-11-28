import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router"; // Ensure you are using the correct router package

const DynamicBreadCrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb className="border-b w-full bg-gray-50 p-2">
      <BreadcrumbList className="flex items-center space-x-2">
        {/* Home link */}
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/admin/dashboard"
            className="hover:text-blue-500 transition-colors"
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathnames.map((name, index) => {
          const isLast = index === pathnames.length - 1;
          const pathTo = `/${pathnames.slice(0, index + 1).join("/")}`;

          return (
            <BreadcrumbItem key={name}>
              <BreadcrumbSeparator className="text-gray-400" />
              {!isLast ? (
                <BreadcrumbLink
                  href={pathTo}
                  className="hover:text-blue-500 transition-colors"
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="font-semibold text-gray-700">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadCrumb;
