import { Incident } from "@/lib/types";
import React from "react";
import { Card } from "@/components/ui/card";
import { IncidentManagementTable } from "@/components/incident-management/incident-management-table";
import { columns } from "@/components/incident-management/column";
const MOCK_INCIDENTS: Incident[] = [
  {
    id: "INC-001",
    reportingPerson: "Sarah Johnson",
    status: "open",
    description: "Database connection timeout on primary server",
    date: new Date("2024-12-05"),
  },
  {
    id: "INC-002",
    reportingPerson: "Mike Chen",
    status: "investigating",
    description: "Memory leak detected in API service",
    date: new Date("2024-12-04"),
  },
  {
    id: "INC-003",
    reportingPerson: "Emily Rodriguez",
    status: "resolved",
    description: "SSL certificate expiration warning",
    date: new Date("2024-12-03"),
  },
  {
    id: "INC-004",
    reportingPerson: "James Wilson",
    status: "escalated",
    description: "Data integrity issue in payment processing",
    date: new Date("2024-12-02"),
  },
  {
    id: "INC-005",
    reportingPerson: "Lisa Park",
    status: "closed",
    description: "Scheduled maintenance completed successfully",
    date: new Date("2024-12-01"),
  },
  {
    id: "INC-006",
    reportingPerson: "David Thompson",
    status: "open",
    description: "CDN performance degradation in Asia region",
    date: new Date("2024-11-30"),
  },
  {
    id: "INC-007",
    reportingPerson: "Amanda Lee",
    status: "investigating",
    description: "Unexpected spike in error rates",
    date: new Date("2024-11-29"),
  },
  {
    id: "INC-008",
    reportingPerson: "Robert Garcia",
    status: "resolved",
    description: "Load balancer configuration issue",
    date: new Date("2024-11-28"),
  },
  {
    id: "INC-009",
    reportingPerson: "Sophie Martin",
    status: "open",
    description: "Authentication service intermittent failures",
    date: new Date("2024-11-27"),
  },
  {
    id: "INC-010",
    reportingPerson: "Chris Anderson",
    status: "escalated",
    description: "Security vulnerability in user input validation",
    date: new Date("2024-11-26"),
  },
  {
    id: "INC-011",
    reportingPerson: "Maria Gonzalez",
    status: "closed",
    description: "Database backup verification completed",
    date: new Date("2024-11-25"),
  },
  {
    id: "INC-012",
    reportingPerson: "Kevin Zhang",
    status: "investigating",
    description: "Network latency issues in EU data center",
    date: new Date("2024-11-24"),
  },
];
const IncidentManagement = () => {
  return (
    <main className="flex-1 p-6 sm:p-8 lg:p-10 h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Incident Management
          </h1>
          <p className="text-muted-foreground">
            Track, manage, and resolve incidents across your infrastructure.
          </p>
        </div>

        <Card className="border border-border bg-card">
          <div className="p-6">
            <IncidentManagementTable columns={columns} data={MOCK_INCIDENTS} />
          </div>
        </Card>
      </div>
    </main>
  );
};

export default IncidentManagement;
