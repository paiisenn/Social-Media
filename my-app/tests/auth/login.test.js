const { Builder, By, until } = require("selenium-webdriver");

(async function testLogin() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        await driver.get("https://social-media-frontend-94uz.onrender.com/login");

        await driver.wait(until.elementLocated(By.id("email")), 10000);

        await driver.findElement(By.id("email")).sendKeys("phamxuanhoa@gmail.com");
        await driver.findElement(By.id("password")).sendKeys("123456789");

        await driver.findElement(By.css('button[type="submit"]')).click();

        // thử chờ chuyển trang
        try {
            await driver.wait(until.urlIs("https://social-media-frontend-94uz.onrender.com/"), 7000);
            console.log(" LOGIN PASS");
        } catch {
            console.log(" Không vào /home");

            let url = await driver.getCurrentUrl();
            console.log(" Current URL:", url);

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