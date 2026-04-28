import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import type { DashboardSummary, Project, ResourceCapacitySummary, User } from "@/types";

interface ExportPayload {
  summary?: DashboardSummary;
  projects: Project[];
  resource?: ResourceCapacitySummary;
  userRoleLabel?: string;
}

const saveBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const buildProjectRows = (projects: Project[]) =>
  projects.map((project) => ({
    Kod: project.code,
    Projekti: project.name,
    Ministrite: project.ministries.join(", "),
    Statusi: project.status,
    Prioriteti: project.priorityLabel,
    Sektori: project.sectorLabel,
    Progresi: `${project.progress}%`,
    OKR: `${project.okrAverage}%`,
    Risku: project.risk,
    Pergjegjesi: project.lead,
    Kapaciteti: `${project.totalCapacityPercent}%`,
    Ritmi: `${project.updateCadenceDays} dite`,
  }));

const buildWordHtml = ({ summary, projects, resource, userRoleLabel }: ExportPayload) => {
  const topProjects = projects.slice(0, 12);
  const statusText = (summary?.statusCards ?? []).map((card) => `${card.label}: ${card.value}`).join(" | ");
  const unitRows = (resource?.unitAllocations ?? [])
    .map((item) => `<tr><td>${item.unit}</td><td>${item.people}</td><td>${item.capacityPercent}%</td></tr>`)
    .join("");
  const projectRows = topProjects
    .map((project) => `<tr><td>${project.code}</td><td>${project.name}</td><td>${project.priorityLabel}</td><td>${project.sectorLabel}</td><td>${project.progress}%</td><td>${project.okrAverage}%</td></tr>`)
    .join("");

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Calibri, Arial, sans-serif; padding: 24px; color: #172033; }
          h1, h2 { margin-bottom: 8px; }
          p { line-height: 1.5; }
          table { border-collapse: collapse; width: 100%; margin-top: 12px; }
          th, td { border: 1px solid #d7dce5; padding: 8px; font-size: 12px; text-align: left; }
          th { background: #eef3f8; }
          .meta { margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>Raport i strukturuar i portofolit Innovation4Albania</h1>
        <div class="meta">
          <p><strong>Roli:</strong> ${userRoleLabel ?? "Përdorues"}</p>
          <p><strong>Data:</strong> ${new Date().toLocaleDateString("sq-AL")}</p>
          <p><strong>Statuset kryesore:</strong> ${statusText}</p>
        </div>
        <h2>Përmbledhja e portofolit</h2>
        <p>Gjithsej projekte: ${summary?.totalProjects ?? projects.length}. OKR mesatar: ${summary?.portfolio.averageOkr ?? 0}%. Projekte në kohë: ${summary?.portfolio.onTimePercentage ?? 0}%. Devijimi mesatar: ${summary?.portfolio.deviationAverage ?? 0}.</p>
        <h2>Burimet dhe kapacitetet</h2>
        <p>Persona të angazhuar: ${resource?.totalPeople ?? 0}. Madhësia mesatare e ekipit: ${resource?.averageTeamSize ?? 0}. Kapaciteti mesatar: ${resource?.averageCapacityUtilization ?? 0}%.</p>
        <table>
          <thead><tr><th>Njësia</th><th>Persona</th><th>Kapaciteti</th></tr></thead>
          <tbody>${unitRows || "<tr><td colspan='3'>Nuk ka të dhëna</td></tr>"}</tbody>
        </table>
        <h2>Projektet kryesore</h2>
        <table>
          <thead><tr><th>Kodi</th><th>Projekti</th><th>Prioriteti</th><th>Sektori</th><th>Progresi</th><th>OKR</th></tr></thead>
          <tbody>${projectRows || "<tr><td colspan='6'>Nuk ka projekte</td></tr>"}</tbody>
        </table>
      </body>
    </html>`;
};

export function exportPortfolioToPdf(payload: ExportPayload) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.setFontSize(18);
  doc.text("Raport i portofolit Innovation4Albania", 40, 42);
  doc.setFontSize(10);
  doc.text(`Data: ${new Date().toLocaleDateString("sq-AL")}`, 40, 62);
  doc.text(`Roli: ${payload.userRoleLabel ?? "Përdorues"}`, 40, 76);

  const summaryRows = [
    ["Gjithsej projekte", String(payload.summary?.totalProjects ?? payload.projects.length)],
    ["OKR mesatar", `${payload.summary?.portfolio.averageOkr ?? 0}%`],
    ["Projekte në kohë", `${payload.summary?.portfolio.onTimePercentage ?? 0}%`],
    ["Devijimi mesatar", String(payload.summary?.portfolio.deviationAverage ?? 0)],
    ["Persona të angazhuar", String(payload.resource?.totalPeople ?? 0)],
    ["Kapaciteti mesatar", `${payload.resource?.averageCapacityUtilization ?? 0}%`],
  ];

  autoTable(doc, {
    startY: 92,
    head: [["Treguesi", "Vlera"]],
    body: summaryRows,
    theme: "grid",
    styles: { fontSize: 9 },
    headStyles: { fillColor: [28, 86, 121] },
  });

  autoTable(doc, {
    startY: (doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ? ((doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? 120) + 18 : 180,
    head: [["Kodi", "Projekti", "Ministritë", "Prioriteti", "Sektori", "Progresi", "OKR"]],
    body: payload.projects.slice(0, 15).map((project) => [
      project.code,
      project.name,
      project.ministries.join(", "),
      project.priorityLabel,
      project.sectorLabel,
      `${project.progress}%`,
      `${project.okrAverage}%`,
    ]),
    theme: "striped",
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [20, 120, 144] },
    columnStyles: { 1: { cellWidth: 120 }, 2: { cellWidth: 120 } },
  });

  doc.save("Innovation4Albania-Raport.pdf");
}

export function exportPortfolioToExcel(payload: ExportPayload) {
  const workbook = XLSX.utils.book_new();
  const overviewSheet = XLSX.utils.json_to_sheet([
    {
      "Gjithsej projekte": payload.summary?.totalProjects ?? payload.projects.length,
      "OKR mesatar": `${payload.summary?.portfolio.averageOkr ?? 0}%`,
      "Projekte në kohë": `${payload.summary?.portfolio.onTimePercentage ?? 0}%`,
      "Devijimi mesatar": payload.summary?.portfolio.deviationAverage ?? 0,
      "Persona të angazhuar": payload.resource?.totalPeople ?? 0,
      "Kapaciteti mesatar": `${payload.resource?.averageCapacityUtilization ?? 0}%`,
      "Role drejtimi": payload.resource?.leadershipRoles ?? 0,
    },
  ]);
  const projectSheet = XLSX.utils.json_to_sheet(buildProjectRows(payload.projects));
  const resourceSheet = XLSX.utils.json_to_sheet((payload.resource?.unitAllocations ?? []).map((item) => ({
    Njesia: item.unit,
    Persona: item.people,
    Kapaciteti: `${item.capacityPercent}%`,
  })));

  XLSX.utils.book_append_sheet(workbook, overviewSheet, "Permbledhje");
  XLSX.utils.book_append_sheet(workbook, projectSheet, "Projektet");
  XLSX.utils.book_append_sheet(workbook, resourceSheet, "Burimet");
  XLSX.writeFile(workbook, "Innovation4Albania-Raport.xlsx");
}

export function exportPortfolioToWord(payload: ExportPayload) {
  const html = buildWordHtml(payload);
  const blob = new Blob([html], { type: "application/msword" });
  saveBlob(blob, "Innovation4Albania-Raport.doc");
}

