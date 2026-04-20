const { By, until } = require("selenium-webdriver");
const { createDriver } = require("../utils/driver");

(async function testPost() {
    let driver = await createDriver();

    try {
        await driver.get("https://social-media-frontend-94uz.onrender.com/login");

        // login
        await driver.findElement(By.id("email")).sendKeys("phamxuanhoa@gmail.com");
        await driver.findElement(By.id("password")).sendKeys("123456789");
        await driver.findElement(By.css('button[type="submit"]')).click();

        // wait home
        await driver.wait(until.urlContains("/"), 10000);

        // OPEN MODAL ĐÚNG CÁCH
    
        const openPostBtn = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'Bạn đang nghĩ gì')]")),
            10000
        );

        await driver.wait(until.elementIsVisible(openPostBtn), 10000);
        await openPostBtn.click();

    
        //WAIT MODAL OPEN
    
        const textarea = await driver.wait(
            until.elementLocated(By.css("textarea")),
            10000
        );

        await driver.wait(until.elementIsVisible(textarea), 10000);

    
        // INPUT POST
    
        await textarea.sendKeys("Hello from Selenium 2");

    
        //  CLICK BUTTON ĐĂNG (QUAN TRỌNG: scope modal)
    
        const postBtn = await driver.wait(
            until.elementLocated(By.xpath("//button[contains(text(),'Đăng') and not(contains(text(),'Đang đăng'))]")),
            10000
        );

        await postBtn.click();

    
        // 5. VERIFY
    
        await driver.sleep(3000);

        let body = await driver.findElement(By.css("body")).getText();

        if (body.includes("Hello from Selenium 2")) {
            console.log("TC-005 PASS");
        } else {
            console.log("TC-005 FAIL");
        }

    } catch (err) {
        console.log("POST FAIL", err);
    } finally {
        await driver.quit();
    }
})();