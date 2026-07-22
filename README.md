\# K6 Local Performance \& Load Testing Suite



A developer-friendly, interactive command-line interface (CLI) built with \*\*Node.js\*\* and powered by \*\*Grafana k6\*\* to execute comprehensive load testing suites against web applications and APIs.



\## 🚀 Features



\- \*\*Interactive Menu:\*\* Easily switch between different test types via a clean, color-coded terminal UI.

\- \*\*Multiple Test Scenarios:\*\*

&#x20; - \*\*\[1] Smoke Test:\*\* Quick 30-second sanity check to verify basic uptime and routing.

&#x20; - \*\*\[2] Load Test:\*\* Simulates normal daily user traffic (ramping up to 20 VUs).

&#x20; - \*\*\[3] Stress Test:\*\* Incrementally scales up to 150+ VUs to find system bottlenecks and breaking points.

&#x20; - \*\*\[4] Spike Test:\*\* Instantly bursts traffic up to 200 VUs to check sudden traffic resilience.

&#x20; - \*\*\[5] Soak Test:\*\* Sustains steady moderate load over time to catch memory or resource leaks.

\- \*\*Robust Error Handling \& Safety:\*\* Built-in crash logging (`crash.log`), automatic TLS/SSL certificate bypass for internal/staging environments (`--insecure-skip-tls-verify`), and strict performance thresholds.



\## 🛠️ Tech Stack

\- \*\*Node.js\*\* (CLI \& Process Management)

\- \*\*Grafana k6\*\* (Load Generation Engine)

