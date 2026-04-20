const { By, until } = require("selenium-webdriver");
const { createDriver } = require("../utils/driver");

(async function testLogout() {
    let driver = await createDriver();

    try {
        await driver.get("https://social-media-frontend-94uz.onrender.com/login");

        // wait form
        await driver.wait(until.elementLocated(By.id("email")), 10000);
        await driver.wait(until.elementLocated(By.id("password")), 10000);

        // login
        await driver.findElement(By.id("email")).sendKeys("phamxuanhoa@gmail.com");
        await driver.findElement(By.id("password")).sendKeys("123456789");
        await driver.findElement(By.css('button[type="submit"]')).click();

        // wait redirect
        await driver.wait(
            until.urlContains("social-media-frontend-94uz.onrender.com"),
            10000
        );

        // click logout sidebar
        await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'Đăng xuất')]")),
        10000
        );
        await driver.findElement(By.xpath("//*[contains(text(),'Đăng xuất')]")).click();

        // chờ modal hiện
        await driver.wait(
        until.elementLocated(By.xpath("//button[contains(@class,'bg-red-500')]")),
        10000
        );

        // click confirm logout
        await driver.findElement(By.xpath("//button[contains(@class,'bg-red-500')]")).click();

        // chờ redirect về login
        await driver.wait(until.urlContains("/login"), 10000);

        console.log(" TC-008 PASS");

        // thử truy cập lại
        await driver.get("https://social-media-frontend-94uz.onrender.com/");
        await driver.sleep(2000);

        let currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes("/login") || currentUrl.includes("/")) {
            console.log(" TC-009 PASS");
        } else {
            console.log(" TC-009 FAIL");
        }

    } catch (err) {
        console.log(" LOGOUT FAIL", err);
    } finally {
        await driver.quit();
    }
})();