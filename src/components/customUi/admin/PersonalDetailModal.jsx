/* eslint-disable react/prop-types */
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChevronRight,
  User,
  Folder,
  Circle,
  Filter,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 5;

import { CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
const statusOptions = [
  { value: "Not started", label: "Not Started", icon: Circle },
  { value: "In progress", label: "In Progress", icon: Loader2 },
  { value: "Pending", label: "Pending", icon: Clock },
  { value: "Completed", label: "Completed", icon: CheckCircle2 },
  { value: "Cancelled", label: "Cancelled", icon: XCircle },
];

const TaskList = ({ details, isLoading, error }) => {
  const { data } = details || {};
  const { tasks: allTasks = [], statusSummary = {}, total = 0 } = data || {};
  const [expandedTask, setExpandedTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter tasks based on status
  const filteredTasks =
    statusFilter === "All"
      ? allTasks
      : allTasks.filter((task) => task.status === statusFilter);

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Calculate completion percentage
  const completionPercentage =
    total > 0 ? Math.round(((statusSummary.Completed || 0) / total) * 100) : 0;

  const getStatusBadge = (status) => {
    const option = statusOptions.find((opt) => opt.value === status);
    const Icon = option?.icon || Circle;

    return (
      <Badge
        variant={
          status === "Completed"
            ? "default"
            : status === "In Progress"
            ? "secondary"
            : status === "Cancelled"
            ? "destructive"
            : "outline"
        }
        className="gap-1"
      >
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const toggleExpandTask = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  if (error) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Error Loading Tasks</CardTitle>
          <CardDescription className="text-destructive">
            {error.message || "Failed to load task data"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="space-y-2">
            <Skeleton className="h-8 w-[200px]" />
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-16" />
              ))}
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[40px]" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <CardTitle>Task Management</CardTitle>
            <CardDescription className="mt-1">
              {total} total tasks across all projects
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => {
              const count = statusSummary[option.value] || 0;
              if (count === 0) return null;
              return (
                <div
                  key={option.value}
                  onClick={() => {
                    setStatusFilter(option.value);
                    setCurrentPage(1);
                  }}
                  className={badgeVariants({
                    variant:
                      statusFilter === option.value ? "default" : "secondary",
                    className: "cursor-pointer gap-1",
                  })}
                >
                  <option.icon className="h-3 w-3" />
                  {option.label}: {count}
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Project completion</span>
              <span>{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <AnimatePresence mode="wait">
          {paginatedTasks.length > 0 ? (
            paginatedTasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <div
                  className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleExpandTask(task._id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: expandedTask === task._id ? 90 : 0 }}
                      >
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                      <h3 className="font-medium">{task.task_title}</h3>
                    </div>
                    {getStatusBadge(task.status)}
                  </div>

                  <AnimatePresence>
                    {expandedTask === task._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                        transition={{ duration: 0.2 }}
                      >
                        <div className="mt-3 space-y-2 pl-7">
                          <p className="text-sm text-muted-foreground">
                            {task.task_description ||
                              "No description available"}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>
                                Assigned by:{" "}
                                {task.assigned_by?.name || "Unassigned"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Folder className="h-4 w-4" />
                              <span>
                                Project:{" "}
                                {task.project?.project_name || "No project"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              No tasks found matching your filters
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      {filteredTasks.length > ITEMS_PER_PAGE && (
        <CardFooter className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
            <ChevronRightIcon className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TaskList;
