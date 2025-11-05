import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function exportUsersToCSV(users) {
  if (!Array.isArray(users) || users.length === 0) {
    throw new Error("No hay usuarios para exportar");
  }

  const headers = [
    "name",
    "surname",
    "email",
    "phone",
    "city",
    "state",
    "address",
    "zip",
    "country",
  ];

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const rows = users.map((user) =>
    [
      user.name,
      user.surname,
      user.email,
      user.phone,
      user.city,
      user.state,
      user.address,
      user.zip,
      user.country,
    ]
      .map(escapeCSV)
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `usuarios_${new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, "-")}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
