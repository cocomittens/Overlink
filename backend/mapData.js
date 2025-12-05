module.exports = [
  {
    id: "internal_1",
    name: "Nordsec Internal Services",
    securityTier: "low",
    traceProfileId: "high",
    hasTrace: true,
    directory: [
      {
        id: "file_server",
        name: "File Server",
        data: [
          {
            name: "Filename",
            data: [
              "sample_data_334",
              "sample_data_1337",
              "sample_data_42",
              "auth.txt",
            ],
          },
          {
            name: "Reports",
            data: [
              "sample_data_334",
              "sample_data_1337",
              "ledger-final.dat",
              "auth.txt",
            ],
          },
        ],
        folders: [
          {
            id: "reports_folder",
            name: "Reports Folder",
            data: [
              {
                name: "Filename",
                data: ["q3_summary.pdf", "forecast.xlsx"],
              },
              {
                name: "Notes",
                data: ["finance", "next steps"],
              },
            ],
          },
          {
            id: "archives_folder",
            name: "Archives",
            data: [
              {
                name: "Filename",
                data: ["backup_2022.zip", "audit_2021.log"],
              },
            ],
          },
        ],
      },
      {
        id: "view_logs",
        name: "View Logs",
        data: [
          { name: "Date", data: ["2023-10-01", "2023-10-02", "2023-10-03"] },
          {
            name: "Action",
            data: ["log_2023_10_01", "log_2023_10_02", "log_2023_10_03"],
          },
        ],
      },
    ],
  },
  {
    id: "internal_2",
    name: "SilentWave Internal Services",
    securityTier: "low",
    traceProfileId: "high",
    hasTrace: true,
    directory: [
      {
        id: "file_server",
        name: "File Server",
        data: [
          {
            name: "Filename",
            data: [
              "sample_data_334",
              "sample_data_1337",
              "sample_data_42",
              "auth.txt",
            ],
          },
        ],
        folders: [
          {
            id: "reports_folder_sw",
            name: "Internal Reports",
            data: [
              {
                name: "Filename",
                data: ["incident.log", "ops-notes.txt"],
              },
            ],
          },
        ],
      },
      {
        id: "view_logs",
        name: "View Logs",
        data: [
          { name: "Date", data: ["2023-10-01", "2023-10-02", "2023-10-03"] },
          {
            name: "Action",
            data: ["log_2023_10_01", "log_2023_10_02", "log_2023_10_03"],
          },
        ],
      },
    ],
  },
  {
    id: "bank_1",
    name: "Helix Finance Group",
    securityTier: "medium",
    traceProfileId: "medium",
    hasTrace: true,
    directory: [
      {
        id: "file_server",
        name: "File Server",
        data: [
          {
            name: "Filename",
            data: ["balances_q3.csv", "wire_logs.txt", "audit_report.pdf"],
          },
          {
            name: "Notes",
            data: ["q3 projections", "pending wires", "internal audit"],
          },
        ],
        folders: [
          {
            id: "finance_ops",
            name: "Finance Ops",
            data: [
              {
                name: "Filename",
                data: ["ops_checklist.docx", "fraud_watch.csv"],
              },
            ],
          },
        ],
      },
      {
        id: "view_logs",
        name: "View Logs",
        data: [
          { name: "Date", data: ["2023-10-01", "2023-10-02", "2023-10-03"] },
          {
            name: "Action",
            data: ["login_success", "ledger_update", "trace_alert"],
          },
        ],
      },
    ],
  },
  {
    id: "internal_1",
    name: "Nordsec Internal Services",
    securityTier: "low",
    traceProfileId: "high",
    hasTrace: true,
    directory: [
      {
        id: "file_server",
        name: "File Server",
        data: [
          {
            name: "Filename",
            data: [
              "sample_data_334",
              "sample_data_1337",
              "sample_data_42",
              "auth.txt",
            ],
          },
        ],
        folders: [
          {
            id: "internal_archives",
            name: "Internal Archives",
            data: [
              {
                name: "Filename",
                data: ["system_backup.tar", "readme.txt"],
              },
            ],
          },
        ],
      },
      {
        id: "view_logs",
        name: "View Logs",
        data: [
          { name: "Date", data: ["2023-10-01", "2023-10-02", "2023-10-03"] },
          {
            name: "Action",
            data: ["log_2023_10_01", "log_2023_10_02", "log_2023_10_03"],
          },
        ],
      },
    ],
  },
];
