/* Subject registry. To add a subject:
 *   1. write assets/data/<id>.js  (calls Study.register({...}))
 *   2. add one entry below
 *   3. copy any subject page (e.g. dl.html) to <id>.html and change data-subject="<id>"
 * Exam times are Tunis time (UTC+1, no DST).
 */
window.SITE = {
  title: ["SDIA 2 · Mid-term prep", "SDIA 2 · Révisions DS"],
  student: "Ahmed Cherif",
  school: ["2nd year SDIA, IIT", "2e année SDIA, IIT"],
  moodle: "https://moodle.canadacentral.cloudapp.azure.com/",
  examBank: 1432,
  repo: "ahmadcherif122/study"
};
window.SUBJECTS = [
  { id: "dmml", page: "dmml.html", short: "DM&ML", color: "#6366f1",
    name: ["Data Mining & Machine Learning", "Data Mining & Machine Learning"],
    exam: "2026-11-03T09:00:00+01:00", durationMin: 60, moodle: 1361 },
  { id: "dl", page: "dl.html", short: "DL", color: "#ec4899",
    name: ["Deep Learning", "Deep Learning"],
    exam: "2026-11-03T10:30:00+01:00", durationMin: 60, moodle: 1284 },
  { id: "dw", page: "dw.html", short: "DW", color: "#0ea5e9",
    name: ["Data Warehouse", "Entrepôts de données"],
    exam: "2026-11-04T09:00:00+01:00", durationMin: 60, moodle: 977 },
  { id: "pcp", page: "pcp.html", short: "PCP", color: "#f59e0b",
    name: ["Concurrent & Parallel Programming", "Programmation concurrente et parallèle"],
    exam: "2026-11-05T09:00:00+01:00", durationMin: 60, moodle: 973 },
  { id: "pads", page: "pads.html", short: "PADS", color: "#10b981",
    name: ["Advanced Python for Data Science", "Programmation avancée pour la data science"],
    exam: "2026-11-06T09:00:00+01:00", durationMin: 60, moodle: 1276 }
];
