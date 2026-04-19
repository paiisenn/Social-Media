const { By, until } = require("selenium-webdriver");
const { createDriver } = require("../utils/driver");

(async function testLogout() {
    let driver = await createDriver();

    try {
        await driver.get("http://localhost:5000/login");

        // login
        await driver.findElement(By.id("email")).sendKeys("test@gmail.com");
        await driver.findElement(By.id("password")).sendKeys("123456");
        await driver.findElement(By.css('button[type="submit"]')).click();

        await driver.wait(until.urlIs("http://localhost:5000/"), 5000);

        // logout
        await driver.findElement(By.xpath("//*[contains(text(),'Đăng xuất')]")).click();

        await driver.sleep(2000);

        let body = await driver.findElement(By.css("body")).getText();

        if (!body.includes("Test User")) {
            console.log(" TC-008 PASS");
        } else {
            console.log(" TC-008 FAIL");
        }

        // thử truy cập lại
        await driver.get("http://localhost:5000/");
        await driver.sleep(2000);

        let body2 = await driver.findElement(By.css("body")).getText();

        if (!body2.includes("Test User")) {
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