const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
//const { createDriver } = require("../utils/driver");

(async function testLogout() {
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
        console.log("========== LOGOUT TEST ==========");

        console.log("Open login page");
        await driver.get("https://social-media-frontend-94uz.onrender.com/login");

        console.log("Waiting for login form...");
        await driver.wait(until.elementLocated(By.id("email")), 10000);
        await driver.wait(until.elementLocated(By.id("password")), 10000);

        console.log("Enter email");
        await driver.findElement(By.id("email")).sendKeys("phamxuanhoa@gmail.com");

        console.log("Enter password");
        await driver.findElement(By.id("password")).sendKeys("123456789");

        console.log("Click login");
        await driver.findElement(By.css('button[type="submit"]')).click();

        console.log("Waiting for login success...");
        await driver.wait(async () => {
            let url = await driver.getCurrentUrl();
            return !url.includes("/login");
        }, 15000);

        let loginUrl = await driver.getCurrentUrl();
        console.log("Logged in, current URL:", loginUrl);

        // ================= LOGOUT =================
        console.log("Waiting for logout button...");
        await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'Đăng xuất')]")),
            10000
        );

        console.log("Click logout");
        //await driver.findElement(By.xpath("//*[contains(text(),'Đăng xuất')]")).click();
        let logoutBtn = await driver.findElement(By.xpath("//*[contains(text(),'Đăng xuất')]"));
        await driver.executeScript("arguments[0].click();", logoutBtn);

        console.log("Waiting for confirm modal...");
        await driver.wait(
            until.elementLocated(By.xpath("//button[contains(@class,'bg-red-500')]")),
            10000
        );

        console.log("Confirm logout");
        await driver.findElement(By.xpath("//button[contains(@class,'bg-red-500')]")).click();

        console.log("Waiting redirect to login...");
        await driver.wait(until.urlContains("/login"), 10000);

        let afterLogoutUrl = await driver.getCurrentUrl();
        console.log("After logout URL:", afterLogoutUrl);

        console.log(" TC-008 PASS");

        // ================= VERIFY =================
        console.log("Try access home after logout...");
        await driver.get("https://social-media-frontend-94uz.onrender.com/");
        await driver.sleep(2000);

        let currentUrl = await driver.getCurrentUrl();
        console.log("Current URL after access:", currentUrl);

        if (currentUrl.includes("/")) {
            console.log(" TC-009 PASS");
        } else {
            console.log(" TC-009 FAIL");
        }

    } catch (err) {
        console.error("LOGOUT FAIL:", err);

        try {
            let body = await driver.findElement(By.css("body")).getText();
            console.log("Page content:");
            console.log(body);
        } catch (e) {
            console.log("Cannot get page content");
        }

        process.exit(1); // báo fail cho GitHub Actions
    } finally {
        console.log("Closing browser...");
        await driver.quit();
    }
})();