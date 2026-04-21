const { Builder, By, until } = require("selenium-webdriver");
//const chrome = require("selenium-webdriver/chrome");
const { createDriver } = require("../utils/driver");

(async function testPost() {
    let driver = await createDriver();

    try {
        console.log("========== POST TEST ==========");

        console.log("👉 Open login page");
        await driver.get("https://social-media-frontend-94uz.onrender.com/login");

        console.log("👉 Enter email");
        await driver.findElement(By.id("email")).sendKeys("phamxuanhoa@gmail.com");

        console.log("👉 Enter password");
        await driver.findElement(By.id("password")).sendKeys("123456789");

        console.log("👉 Click login");
        await driver.findElement(By.css('button[type="submit"]')).click();

        console.log("👉 Waiting for home page...");
        await driver.wait(until.urlContains("/"), 10000);

        // ================= OPEN POST MODAL =================
        console.log("👉 Finding 'Bạn đang nghĩ gì' button");

        const openPostBtn = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'Bạn đang nghĩ gì')]")),
            10000
        );

        console.log("👉 Waiting button visible...");
        await driver.wait(until.elementIsVisible(openPostBtn), 10000);

        console.log("👉 Click open post modal");
        await openPostBtn.click();

        // ================= TEXTAREA =================
        console.log("👉 Waiting textarea...");

        const textarea = await driver.wait(
            until.elementLocated(By.css("textarea")),
            10000
        );

        console.log("👉 Waiting textarea visible...");
        await driver.wait(until.elementIsVisible(textarea), 10000);

        console.log("👉 Typing post content");
        await textarea.sendKeys("Hello from Selenium 4");

        // ================= POST BUTTON =================
        console.log("👉 Finding post button");

        const postBtn = await driver.wait(
            until.elementLocated(
                By.xpath("//button[contains(text(),'Đăng') and not(contains(text(),'Đang đăng'))]")
            ),
            10000
        );

        console.log("👉 Clicking post button");
        await postBtn.click();

        // ================= VERIFY =================
        console.log("👉 Waiting 3s for post to appear...");
        await driver.sleep(3000);

        console.log("👉 Reading page content...");
        let body = await driver.findElement(By.css("body")).getText();

        if (body.includes("Hello from Selenium 4")) {
            console.log(" TC-005 PASS");
        } else {
            console.log(" TC-005 FAIL");
        }

    } catch (err) {
        console.log("❌ POST FAIL:", err);
    } finally {
        console.log("👉 Closing browser...");
        await driver.quit();
    }
})();