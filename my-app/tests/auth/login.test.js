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
        // 👉 URL đúng của bạn
        await driver.get("https://social-media-frontend-94uz.onrender.com/login");

        // 👉 chờ input xuất hiện
        await driver.wait(until.elementLocated(By.id("email")), 15000);

        // 👉 nhập dữ liệu
        await driver.findElement(By.id("email")).sendKeys("phamxuanhoa@gmail.com");
        await driver.findElement(By.id("password")).sendKeys("123456789");

        // 👉 click login
        await driver.findElement(By.css('button[type="submit"]')).click();

        // 👉 chờ chuyển trang (dùng contains cho chắc)
        await driver.wait(until.urlContains("/"), 10000);

        let currentUrl = await driver.getCurrentUrl();
        console.log(" Current URL:", currentUrl);

        // 👉 check thành công
        if (currentUrl === "https://social-media-frontend-94uz.onrender.com/") {
            console.log(" LOGIN PASS");
        } else {
            console.log(" LOGIN FAIL");

            let body = await driver.findElement(By.css("body")).getText();
            console.log("Page content:");
            console.log(body);
        }

    } catch (err) {
        console.error(" ERROR:", err);
    } finally {
        await driver.quit();
    }
})();