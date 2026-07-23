import http from 'k6/http';
import { check, sleep } from 'k6';

// Read the test type passed from the Node.js menu environment variables (Defaults to '1' if not provided)
const TEST_TYPE = __ENV.TEST_TYPE || '1';

/**
 * Define all load testing scenarios mapped to their respective options.
 * This configuration leverages k6 scenarios and executors for flexible execution.
 */
const testScenarios = {
  // 1: Smoke Test - Quick minimal check (1 Virtual User for 30 seconds)
  '1': { 
    executor: 'constant-vus', 
    vus: 1, 
    duration: '30s' 
  },
  // 2: Load Test - Simulates normal expected daily traffic ramping up to 20 VUs
  '2': { 
    executor: 'ramping-vus', 
    startVUs: 0, 
    stages: [
      { duration: '2m', target: 20 }, 
      { duration: '5m', target: 20 }, 
      { duration: '2m', target: 0 }
    ] 
  },
  // 3: Stress Test - Gradually steps up user volume to 150 VUs to find system breaking points
  '3': { 
    executor: 'ramping-vus', 
    startVUs: 0, 
    stages: [
      { duration: '2m', target: 20 }, 
      { duration: '5m', target: 50 }, 
      { duration: '5m', target: 100 }, 
      { duration: '3m', target: 150 }, 
      { duration: '2m', target: 0 }
    ] 
  },
  // 4: Spike Test - Instantly surges traffic up to 200 VUs to test resilience under sudden bursts
  '4': { 
    executor: 'ramping-vus', 
    startVUs: 0, 
    stages: [
      { duration: '1m', target: 10 }, 
      { duration: '30s', target: 200 }, 
      { duration: '2m', target: 200 }, 
      { duration: '30s', target: 10 }, 
      { duration: '1m', target: 0 }
    ] 
  },
  // 5: Soak Test - Maintains a steady, moderate load over an extended period to check for memory/resource leaks
  '5': { 
    executor: 'ramping-vus', 
    startVUs: 0, 
    stages: [
      { duration: '2m', target: 30 }, 
      { duration: '15m', target: 30 }, 
      { duration: '2m', target: 0 }
    ] 
  },
};

/**
 * k6 global options configurations.
 * Dynamically selects the scenario, sets thresholds, and bypasses internal TLS certificate errors.
 */
export const options = {
  scenarios: {
    selected_test: testScenarios[TEST_TYPE] || testScenarios['1'],
  },
  thresholds: {
    // 95% of all HTTP requests must complete in under 500ms
    http_req_duration: ['p(95)<500'],
    // Overall failed HTTP request rate must stay below 1%
    http_req_failed: ['rate<0.01'],
    // 95% of validation checks must pass successfully
    checks: ['rate>0.95'],
  },
  // Tells k6 to ignore expired or untrusted certificate errors on internal/government servers
  insecureSkipTLSVerify: true,
};

// Target list of URLs to test sequentially per loop iteration
const urls = [
  
];

/**
 * Main default export function.
 * Executed repeatedly by each Virtual User (VU) for the duration of the test run.
 */
export default function () {
  // Iterate through each target URL in the array
  urls.forEach((url) => {
    // Send an HTTP GET request with a custom User-Agent header for clear server logging
    let res = http.get(url, { 
      headers: { 'User-Agent': 'k6-load-test' } 
    });
    
    // Validate the server's response against defined performance criteria
    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 500ms': (r) => r.timings.duration < 500,
    });
  });
  
  // Pause for 2 seconds to simulate realistic human think time between request loops
  sleep(2);
}