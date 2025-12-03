module.exports = [
  {
    id: "internal_1",
    name: "Nordsec Internal Services",
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
