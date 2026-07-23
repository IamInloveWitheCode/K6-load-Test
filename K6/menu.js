const readline = require('readline');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function clearScreen() {
    process.stdout.write('\x1Bc');
}

// Global safety net to log any unexpected crashes or errors to a file
process.on('uncaughtException', (err) => {
    const logMessage = `[${new Date().toISOString()}] CRASH: ${err.stack || err}\n`;
    try {
        fs.appendFileSync(path.join(__dirname, 'crash.log'), logMessage);
    } catch (writeErr) {
        console.error('Failed to write to crash log:', writeErr);
    }
    console.clear();
    console.log("\x1b[31m[!] The console encountered a critical error and crashed.");
    console.log("A crash report has been saved to 'crash.log'.\x1b[0m");
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    const logMessage = `[${new Date().toISOString()}] UNHANDLED REJECTION: ${reason}\n`;
    try {
        fs.appendFileSync(path.join(__dirname, 'crash.log'), logMessage);
    } catch (writeErr) {}
});


function showMenu() {
    clearScreen();
    
    // Clean, aligned TAAG ASCII Art for "K6 TEST LOAD"
    console.log("\x1b[32m             _  ____     _                    _   _____         _   \x1b[0m");
    console.log("\x1b[32m            | |/ / /_   | |    ___   __ _  __| | |_   _|__  ___| |_ \x1b[0m");
    console.log("\x1b[32m            | ' / '_ \\  | |   / _ \\ / _` |/ _` |   | |/ _ \\/ __| __|\x1b[0m");
    console.log("\x1b[32m            | . \\ (_) | | |__| (_) | (_| | (_| |   | |  __/\__ \ \| | \x1b[0m");
    console.log("\x1b[32m            |_|\\_\\___/  |_____\___/ \\__,_|\\__,_ |   |_|\\___||__/| |\x1b[0m");
	console.log("\x1b[32m                                                                                        \x1b[0m");
	console.log("\x1b[32m                                                                                        \x1b[0m");

    console.log("\x1b[33m                 K6 LOAD TESTING INTERACTIVE MANAGEMENT CONSOLE                         \x1b[0m");
 
	console.log("\x1b[33m                                                                                        \x1b[0m");
	console.log("\x1b[33m                                                                                        \x1b[0m");
    console.log("                 [1] Smoke Test   ");
    console.log("                 [2] Load Test    ");
    console.log("                 [3] Stress Test  ");
    console.log("                 [4] Spike Test   ");
    console.log("                 [5] Soak Test    ");
    console.log("\x1b[32m                 [h] Help Guide   \x1b[0m");
    console.log("\x1b[31m                 [q] Quit         \x1b[0m");
	console.log("\x1b[33m                                                                                        \x1b[0m");
	
    rl.question("\x1b[37mSelect an option [1-5, h, q]: \x1b[0m", (choice) => {
        handleChoice(choice.trim().toLowerCase());
    });
}

function runTest(testType, testName) {
    console.log(`\n\x1b[32m[Running ${testName}...]` + '\x1b[0m\n');
    try {
        execSync(`k6 run -e TEST_TYPE="${testType}" load-test.js`, { stdio: 'inherit' });
    } catch (error) {
        console.log(`\x1b[31m\n[!] Test execution failed or was interrupted.\x1b[0m`);
    }
    rl.question("\n\x1b[33mTest complete. Press Enter to return to menu...\x1b[0m", () => {
        showMenu();
    });
}

function handleChoice(choice) {
    switch (choice) {
        case '1':
            runTest('1', 'Smoke Test');
            break;
        case '2':
            runTest('2', 'Load Test');
            break;
        case '3':
            runTest('3', 'Stress Test');
            break;
        case '4':
            runTest('4', 'Spike Test');
            break;
        case '5':
            runTest('5', 'Soak Test');
            break;
        case 'h':
            clearScreen();
            console.log("\x1b[32m========================================================================================");
            console.log("                                HELP & REFERENCE GUIDE                                  ");
            console.log("========================================================================================\x1b[0m");
            
            console.log("\x1b[1m\x1b[32m [1] Smoke Test\x1b[0m");
            console.log("     • What: Quick 30s sanity check (1 VU).");
            console.log("     • Why : Ensures systems are up and responding before running heavy tests.");
            
            console.log("\n\x1b[1m\x1b[33m [2] Load Test\x1b[0m");
            console.log("     • What: Standard daily traffic simulation ramping up to 20 users.");
            console.log("     • Why : Evaluates normal performance, response times, and throughput benchmarks.");
            
            console.log("\n\x1b[1m\x1b[35m [3] Stress Test\x1b[0m");
            console.log("     • What: Gradually increases traffic up to 150+ users.");
            console.log("     • Why : Finds application limits, CPU/memory bottlenecks, and recovery behavior.");
            
            console.log("\n\x1b[1m\x1b[31m [4] Spike Test\x1b[0m");
            console.log("     • What: Sudden massive surge bursting up to 200 users instantly.");
            console.log("     • Why : Tests resilience against flash crowds, viral traffic, or unexpected rushes.");
            
            console.log("\n\x1b[1m\x1b[34m [5] Soak Test\x1b[0m");
            console.log("     • What: Steady, moderate load run continuously over an extended duration.");
            console.log("     • Why : Uncovers hidden memory leaks, connection pool exhaustion, and degradation.");
            
            console.log("\x1b[32m----------------------------------------------------------------------------------------\x1b[0m");

            rl.question("\nPress Enter to return to the main menu", () => {
                showMenu();
            });
            break;
        case 'q':
            console.log("\n\x1b[31mExiting load testing console. Goodbye!\x1b[0m");
            rl.close();
            process.exit(0);
            break;
        default:
            console.log("\n\x1b[31m[!] Invalid choice. Please enter 1-5, h, or q.\x1b[0m");
            setTimeout(() => {
                showMenu();
            }, 1500);
            break;
    }
}

showMenu();