import { jsPDF } from "jspdf";
import type { AuthorityReport } from "./reportTypes";

const BRAND_COLOR = "#0066FF";
const TEXT_COLOR = "#0a0a0a";
const MUTED_COLOR = "#666666";
const BORDER_COLOR = "#e5e7eb";
const BG_COLOR = "#f6f3ef";

function makeDoc(): jsPDF {
  return new jsPDF({ format: "a4", orientation: "portrait", unit: "mm" });
}

function addHeader(doc: jsPDF, title: string, name: string) {
  // Background strip
  doc.setFillColor(BG_COLOR);
  doc.rect(0, 0, 210, 25, "F");

  // Wordmark
  doc.setFontSize(11);
  doc.setTextColor(TEXT_COLOR);
  doc.setFont("helvetica", "bold");
  doc.text("authority", 14, 10);

  // User name (top-right)
  if (name) {
    doc.setFontSize(9);
    doc.setTextColor(MUTED_COLOR);
    doc.setFont("helvetica", "normal");
    doc.text(name, 196, 10, { align: "right" });
  }

  // Title
  doc.setFontSize(18);
  doc.setTextColor(TEXT_COLOR);
  doc.setFont("helvetica", "bold");
  doc.text(title, 105, 20, { align: "center" });

  // Divider line
  doc.setDrawColor(BORDER_COLOR);
  doc.setLineWidth(0.3);
  doc.line(14, 26, 196, 26);
}

function addFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(MUTED_COLOR);
    doc.setFont("helvetica", "normal");
    doc.text(
      "authority.fyi  ·  This is a diagnostic tool, not legal advice.",
      105,
      291,
      { align: "center" }
    );
    doc.setDrawColor(BORDER_COLOR);
    doc.setLineWidth(0.2);
    doc.line(14, 288, 196, 288);
  }
}

function addSectionLabel(doc: jsPDF, label: string, y: number) {
  doc.setFontSize(8);
  doc.setTextColor(MUTED_COLOR);
  doc.setFont("helvetica", "bold");
  doc.text(label.toUpperCase(), 14, y);
  return y + 5;
}

function addTable(
  doc: jsPDF,
  headers: string[],
  rows: string[][],
  startY: number,
  colWidths: number[]
): number {
  const rowH = 10;
  const startX = 14;
  let y = startY;

  // Header row
  doc.setFillColor("#f3f4f6");
  doc.rect(startX, y, 182, rowH, "F");
  doc.setDrawColor(BORDER_COLOR);
  doc.rect(startX, y, 182, rowH, "S");

  let x = startX;
  doc.setFontSize(8);
  doc.setTextColor(TEXT_COLOR);
  doc.setFont("helvetica", "bold");
  for (let i = 0; i < headers.length; i++) {
    doc.text(headers[i], x + 2, y + 6.5);
    x += colWidths[i];
    if (i < headers.length - 1) {
      doc.setDrawColor(BORDER_COLOR);
      doc.line(x, y, x, y + rowH);
    }
  }
  y += rowH;

  // Data rows
  doc.setFont("helvetica", "normal");
  doc.setTextColor(MUTED_COLOR);
  for (const row of rows) {
    doc.setDrawColor(BORDER_COLOR);
    doc.rect(startX, y, 182, rowH, "S");
    x = startX;
    for (let i = 0; i < row.length; i++) {
      doc.text(row[i], x + 2, y + 6.5);
      x += colWidths[i];
      if (i < row.length - 1) {
        doc.line(x, y, x, y + rowH);
      }
    }
    y += rowH;
  }

  return y + 4;
}

function addCallout(doc: jsPDF, label: string, text: string, y: number): number {
  doc.setFillColor("#eff6ff");
  doc.setDrawColor(BRAND_COLOR);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, y, 182, 14, 2, 2, "FD");

  doc.setFontSize(8);
  doc.setTextColor(BRAND_COLOR);
  doc.setFont("helvetica", "bold");
  doc.text(label + ": ", 18, y + 5.5);

  const labelWidth = doc.getTextWidth(label + ": ");
  doc.setTextColor(TEXT_COLOR);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(text, 170 - labelWidth);
  doc.text(lines[0] ?? "", 18 + labelWidth, y + 5.5);
  if (lines.length > 1) {
    doc.text(lines[1], 18, y + 10.5);
  }

  return y + 18;
}

// ── WORKSHEET GENERATORS ──

function genDocumentLocator(doc: jsPDF, name: string): void {
  addHeader(doc, "Document Locator", name);

  let y = 35;
  doc.setFontSize(10);
  doc.setTextColor(MUTED_COLOR);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Where are the things that matter? Complete this before you need it.",
    14,
    y
  );
  y += 10;

  const documents = [
    "Will / Testament",
    "Power of Attorney",
    "Advance Health Directive",
    "Passport(s)",
    "Birth Certificate(s)",
    "Marriage / Divorce Certificate",
    "Life Insurance Policy",
    "Home Insurance Policy",
    "Vehicle Insurance Policy",
    "Property Deeds / Mortgage",
    "Superannuation Details",
    "Investment Accounts",
    "Tax Records (last 3 years)",
    "Business Documents",
    "Other (specify)",
  ];

  const rows = documents.map((d) => [d, "", ""]);
  y = addTable(
    doc,
    ["Document", "Physical Location", "Digital / Cloud Location"],
    rows,
    y,
    [65, 58, 59]
  );
}

function genAccessChecklist(doc: jsPDF, name: string, report: AuthorityReport): void {
  addHeader(doc, "48-Hour Access Checklist", name);

  let y = 35;

  // Personalised callout from top risk
  if (report.risks[0]) {
    y = addCallout(doc, "Your #1 risk", report.risks[0].title, y);
    y += 2;
  }

  doc.setFontSize(10);
  doc.setTextColor(TEXT_COLOR);
  doc.setFont("helvetica", "bold");
  doc.text("First 2 hours", 14, y);
  y += 6;

  const phase1 = [
    "Notify immediate family / household of the situation",
    "Access emergency cash / bank card (location: ____________)",
    "Locate the nominated decision holder — call or message them",
    "Find the Will / POA (physical location: ____________)",
    "Log into primary email to check urgent messages",
    "Call the primary bank to notify and understand next steps",
  ];

  doc.setFont("helvetica", "normal");
  doc.setTextColor(MUTED_COLOR);
  doc.setFontSize(9);
  for (let i = 0; i < phase1.length; i++) {
    doc.setDrawColor(BORDER_COLOR);
    doc.circle(17, y - 1, 2, "S");
    doc.text(`${i + 1}. ${phase1[i]}`, 21, y);
    y += 7;
  }

  y += 4;
  doc.setFontSize(10);
  doc.setTextColor(TEXT_COLOR);
  doc.setFont("helvetica", "bold");
  doc.text("Hours 2–48", 14, y);
  y += 6;

  const phase2 = [
    "Contact superannuation fund to notify (number: ____________)",
    "Contact life insurer — check for death / TPD benefit (number: ____________)",
    "Contact solicitor to review and action the Will",
    "Set up mail forwarding / monitor important accounts",
    "Cancel or redirect recurring payments (direct debits)",
    "Notify employer / relevant institutions",
    "Secure property — change locks if needed",
    "Create a list of all assets and liabilities",
    "Appoint accountant if estate involves business or complex assets",
  ];

  doc.setFont("helvetica", "normal");
  doc.setTextColor(MUTED_COLOR);
  doc.setFontSize(9);
  for (let i = 0; i < phase2.length; i++) {
    doc.setDrawColor(BORDER_COLOR);
    doc.circle(17, y - 1, 2, "S");
    doc.text(`${i + 1}. ${phase2[i]}`, 21, y);
    y += 7;
  }
}

function genKeyAccounts(doc: jsPDF, name: string): void {
  addHeader(doc, "Key Accounts Plan", name);

  let y = 35;
  doc.setFontSize(10);
  doc.setTextColor(MUTED_COLOR);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Email and phone are the keys to everything. Fill this in now.",
    14,
    y
  );
  y += 10;

  const rows = [
    ["Primary Email", "", "", "", ""],
    ["Secondary Email", "", "", "", ""],
    ["Mobile Phone", "", "", "", ""],
    ["Cloud Storage", "", "", "", ""],
    ["Internet Banking", "", "", "", ""],
    ["Superannuation", "", "", "", ""],
    ["Social Media (main)", "", "", "", ""],
    ["Streaming / Subscriptions", "", "", "", ""],
  ];

  y = addTable(
    doc,
    ["Account Type", "Username / ID", "Recovery Email", "2FA Method", "Notes"],
    rows,
    y,
    [42, 38, 38, 32, 32]
  );
}

function genDigitalRecovery(doc: jsPDF, name: string): void {
  addHeader(doc, "Digital Recovery Plan", name);

  let y = 35;

  const sections = [
    {
      label: "Password Manager",
      fields: ["Tool / App name:", "Where master password is stored:", "Emergency access contact:"],
    },
    {
      label: "2FA Recovery Codes",
      fields: [
        "Where recovery codes are stored:",
        "Backup authentication app (if any):",
        "Backup phone number for SMS 2FA:",
      ],
    },
    {
      label: "Device Access",
      fields: [
        "Primary phone PIN / Face ID backup:",
        "Primary laptop / desktop password:",
        "Where device encryption keys are stored:",
      ],
    },
    {
      label: "Backups",
      fields: [
        "Cloud backup service:",
        "External drive location:",
        "Last verified backup date:",
      ],
    },
    {
      label: "Emergency Digital Contact",
      fields: [
        "Person who can assist with digital recovery:",
        "Their phone number:",
        "Their email:",
      ],
    },
  ];

  for (const section of sections) {
    y = addSectionLabel(doc, section.label, y);
    doc.setFillColor("#f9fafb");
    doc.setDrawColor(BORDER_COLOR);
    const sectionHeight = section.fields.length * 10 + 4;
    doc.roundedRect(14, y, 182, sectionHeight, 2, 2, "FD");

    doc.setFontSize(9);
    doc.setTextColor(MUTED_COLOR);
    doc.setFont("helvetica", "normal");
    for (const field of section.fields) {
      doc.text(field, 18, y + 7);
      y += 10;
    }
    y += 6;

    if (y > 250) {
      doc.addPage();
      y = 20;
    }
  }
}

function genExecutorBriefing(doc: jsPDF, name: string, report: AuthorityReport): void {
  addHeader(doc, "Executor Briefing Sheet", name);

  let y = 35;

  if (report.actions[0]) {
    y = addCallout(
      doc,
      "Your first priority",
      report.actions[0].title,
      y
    );
    y += 4;
  }

  y = addSectionLabel(doc, "Your Role as Executor", y);
  doc.setFontSize(9);
  doc.setTextColor(MUTED_COLOR);
  doc.setFont("helvetica", "normal");
  const roleText = [
    "As executor, your job is to carry out the wishes in the Will and administer the estate.",
    "This includes: collecting assets, paying debts, filing a final tax return, and distributing",
    "the estate to beneficiaries. You are legally responsible but can get professional help.",
  ];
  for (const line of roleText) {
    doc.text(line, 14, y);
    y += 6;
  }
  y += 4;

  y = addSectionLabel(doc, "What to Do First (Priority Actions)", y);
  const topActions = report.actions.slice(0, 5);
  for (let i = 0; i < topActions.length; i++) {
    const a = topActions[i];
    doc.setFontSize(9);
    doc.setTextColor(TEXT_COLOR);
    doc.setFont("helvetica", "bold");
    doc.text(`${i + 1}. ${a.title}`, 14, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(MUTED_COLOR);
    doc.text(`   Owner: ${a.owner}  |  Effort: ${a.effort}  |  Due: ${a.due}`, 14, y);
    y += 7;
  }

  y += 4;
  y = addSectionLabel(doc, "Key Contacts for the Estate", y);
  const contactRows = [
    ["Solicitor / Lawyer", "", "", ""],
    ["Accountant", "", "", ""],
    ["Financial Adviser", "", "", ""],
    ["Bank (primary)", "", "", ""],
    ["Superannuation Fund", "", "", ""],
    ["Life Insurer", "", "", ""],
  ];
  addTable(
    doc,
    ["Role", "Name", "Phone", "Notes"],
    contactRows,
    y,
    [50, 50, 45, 37]
  );
}

function genCriticalContacts(doc: jsPDF, name: string): void {
  addHeader(doc, "Critical Contacts Sheet", name);

  let y = 35;
  doc.setFontSize(10);
  doc.setTextColor(MUTED_COLOR);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Who to call for what. Keep this updated and share with your executor.",
    14,
    y
  );
  y += 10;

  const rows = [
    ["Internet Banking", "", "", "", ""],
    ["Life Insurance", "", "", "", ""],
    ["Home Insurance", "", "", "", ""],
    ["Superannuation Fund", "", "", "", ""],
    ["Solicitor / Lawyer", "", "", "", ""],
    ["Accountant", "", "", "", ""],
    ["Financial Adviser", "", "", "", ""],
    ["General Practitioner", "", "", "", ""],
    ["Real Estate Agent", "", "", "", ""],
    ["Other (specify)", "", "", "", ""],
  ];

  addTable(
    doc,
    ["Role", "Name", "Phone", "Email", "Notes"],
    rows,
    y,
    [42, 36, 36, 40, 28]
  );
}

// ── PUBLIC ENTRY POINT ──

export function generateWorksheet(id: string, report: AuthorityReport): void {
  const name = report.profile.name;
  const doc = makeDoc();

  switch (id) {
    case "pack_locator":
      genDocumentLocator(doc, name);
      break;
    case "pack_48hr":
      genAccessChecklist(doc, name, report);
      break;
    case "pack_accounts":
      genKeyAccounts(doc, name);
      break;
    case "pack_digital":
      genDigitalRecovery(doc, name);
      break;
    case "pack_executor":
      genExecutorBriefing(doc, name, report);
      break;
    case "pack_contacts":
      genCriticalContacts(doc, name);
      break;
    default:
      return;
  }

  addFooter(doc);

  const titles: Record<string, string> = {
    pack_locator: "document-locator",
    pack_48hr: "48-hour-checklist",
    pack_accounts: "key-accounts-plan",
    pack_digital: "digital-recovery-plan",
    pack_executor: "executor-briefing",
    pack_contacts: "critical-contacts",
  };

  doc.save(`authority-${titles[id] ?? id}.pdf`);
}
