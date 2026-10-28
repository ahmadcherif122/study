# SDIA 2 · Mid-term exam prep

A static study site (plain HTML, CSS and vanilla JS, with no build step) for the IIT SDIA 2nd-year mid-term exams, 3–6 November 2026.

| Page | Subject | Exam |
|---|---|---|
| `index.html` | Home: countdown, schedule, progress per subject | |
| `dmml.html` | Data Mining & Machine Learning | Tue 3 Nov, 9:00 |
| `dl.html` | Deep Learning (QCM only) | Tue 3 Nov, 10:30 |
| `dw.html` | Data Warehouse (1 h) | Wed 4 Nov, 9:00 |
| `pcp.html` | Concurrent & Parallel Programming | Thu 5 Nov, 9:00 |
| `pads.html` | Advanced Python for Data Science | Fri 6 Nov, 9:00 |

Each subject page has visual lessons with mini-quizzes, a QCM bank with instant feedback (on a multi-answer question, any wrong tick scores 0), timed mock exams, a cheat sheet, and links to the course pages on the IIT Moodle.

* English / French toggle, plus a dark / light theme. Both are saved in `localStorage`.
* Progress is stored in the browser's `localStorage`. There is no server and no tracking.
* All links are relative, so the site works from a GitHub Pages sub-path (`.nojekyll` is included).
* University files are **not** copied or hosted here. The "Course materials" cards only open the Moodle course pages, so you need to be logged in.
* Content labelled "tutor" or "assumed" (solutions, the negative-marking rule) is not from the course.

## Structure

```
assets/app.js        shared engine (rendering, QCM, mocks, progress, i18n)
assets/style.css     styles (responsive, dark/light)
assets/subjects.js   subject list and exam schedule
assets/data/*.js     one data file per subject
```

## Run locally

```
python3 -m http.server 8000   # then open http://localhost:8000/
```
