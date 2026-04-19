const { By, until } = require("selenium-webdriver");
const { createDriver } = require("../utils/driver");

(async function testPost() {
    let driver = await createDriver();

    try {
        await driver.get("http://localhost:5000/login");

        // login
        await driver.findElement(By.id("email")).sendKeys("test@gmail.com");
        await driver.findElement(By.id("password")).sendKeys("123456");
        await driver.findElement(By.css('button[type="submit"]')).click();

        await driver.wait(until.urlIs("http://localhost:5000/"), 5000);

        // TC-005: create post
        await driver.findElement(By.xpath("//*[contains(text(),'Bạn đang nghĩ gì')]")).click();

        await driver.sleep(1000);

        await driver.findElement(By.css("textarea")).sendKeys("Hello from Selenium ");

        await driver.findElement(By.xpath("//button[contains(text(),'Đăng')]")).click();

        await driver.sleep(2000);

        let body = await driver.findElement(By.css("body")).getText();

        if (body.includes("Hello from Selenium")) {
            console.log(" TC-005 PASS");
        } else {
            console.log(" TC-005 FAIL");
        }

    } catch (err) {
        console.log(" POST FAIL", err);
    } finally {
        await driver.quit();
    }
})();