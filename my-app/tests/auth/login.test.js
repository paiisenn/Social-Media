const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

(async function testLogin() {

    // ⚠️ cấu hình Chrome cho CI
    let options = new chrome.Options();
    options.addArguments(
        "--headless",                // chạy không cần UI
        "--no-sandbox",              // fix lỗi GitHub Actions
        "--disable-dev-shm-usage",
        "--disable-gpu"
    );

    let driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    try {
        console.log("👉 Open login page");
        await driver.get("https://social-media-frontend-94uz.onrender.com/login");

        console.log("👉 Waiting for email input...");
        await driver.wait(until.elementLocated(By.id("email")), 15000);

        console.log("👉 Enter email");
        await driver.findElement(By.id("email")).sendKeys("phamxuanhoa@gmail.com");

        console.log("👉 Enter password");
        await driver.findElement(By.id("password")).sendKeys("123456789");

        console.log("👉 Click login");
        await driver.findElement(By.css('button[type="submit"]')).click();

        console.log("👉 Waiting for redirect...");
        await driver.wait(async () => {
            let url = await driver.getCurrentUrl();
            return !url.includes("/login");
        }, 15000);

        let currentUrl = await driver.getCurrentUrl();
        console.log(" Current URL:", currentUrl);

        // 👉 check thành công
        if (currentUrl === "https://social-media-frontend-94uz.onrender.com/") {
            console.log(" LOGIN PASS");
            process.exit(0); // SUCCESS
        } else {
            console.log(" LOGIN FAIL");
            let body = await driver.findElement(By.css("body")).getText();
            console.log("Page content:");
            console.log(body);
            process.exit(1); // FAIL
        }

    } catch (err) {
        console.error(" ERROR:", err);
    } finally {
        await driver.quit();
    }
})();