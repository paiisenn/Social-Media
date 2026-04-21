const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

function createDriver() {
    let options = new chrome.Options();

    options.addArguments(
        "--headless",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
    );

    return new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();
}

(async function testLoginAndPost() {
    let driver = await createDriver();

    try {
        console.log("========== LOGIN + POST TEST ==========");

        // ================= LOGIN =================
        console.log("👉 Open login page");
        await driver.get("https://social-media-frontend-94uz.onrender.com/login");

        console.log("👉 Waiting login form...");
        await driver.wait(until.elementLocated(By.id("email")), 10000);

        console.log("👉 Enter email");
        await driver.findElement(By.id("email")).sendKeys("phamxuanhoa@gmail.com");

        console.log("👉 Enter password");
        await driver.findElement(By.id("password")).sendKeys("000");

        console.log("👉 Click login");
        await driver.findElement(By.css('button[type="submit"]')).click();

        await driver.sleep(2000); // đợi toast render
        // check login fail (toast)
        console.log("Checking login result...");

        //  đợi toast xuất hiện (tối đa 5s)
        console.log("Checking login result...");

        // đợi toast xuất hiện
        let toast = await driver.wait(
            until.elementLocated(By.css("div.bg-red-50")),
            5000
        ).catch(() => null);

        if (toast) {
            //  đợi text render
            let text = await driver.wait(async () => {
                let t = await toast.getText();
                return t && t.trim().length > 0 ? t : false;
            }, 5000).catch(() => "");

            console.log("=================================");
            console.log("LOGIN FAIL");

            if (text) {
                console.log("Toast content:", text);
            } else {
                console.log("Toast found but NO TEXT (CI render delay)");
            }

            let currentUrl = await driver.getCurrentUrl();
            console.log("URL:", currentUrl);
            console.log("=================================");

            process.exit(1);
        }

        let currentUrl = await driver.getCurrentUrl();
        console.log("Current URL:", currentUrl);

        if (!currentUrl.includes("/login")) {
            console.log("LOGIN PASS");
        } else {
            console.log("LOGIN FAIL (unknown)");
            process.exit(1);
        }

        // console.log("👉 Waiting redirect khỏi login...");
        // await driver.wait(async () => {
        //     let url = await driver.getCurrentUrl();
        //     return !url.includes("/login");
        // }, 15000);

        // let currentUrl = await driver.getCurrentUrl();
        // console.log("🌐 Current URL:", currentUrl);

        // if (currentUrl.includes("/login")) {

        //     console.log("❌ LOGIN FAIL");

        //     process.exitCode = 1;
        //     return;
        // }

        // console.log("✅ LOGIN PASS");

        // ================= OPEN POST MODAL =================
        console.log("👉 Finding 'Bạn đang nghĩ gì' button");

        const openPostBtn = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'Bạn đang nghĩ gì')]")),
            10000
        );

        await driver.wait(until.elementIsVisible(openPostBtn), 10000);

        console.log("👉 Click open post modal");
        await openPostBtn.click();

        // ================= TEXTAREA =================
        console.log("👉 Waiting textarea...");

        const textarea = await driver.wait(
            until.elementLocated(By.css("textarea")),
            10000
        );

        console.log("👉 Typing content...");
        const content = "Hello from Selenium CI 1";
        await textarea.sendKeys(content);

        // ================= POST BUTTON =================
        console.log("👉 Finding post button...");

        const postBtn = await driver.wait(
            until.elementLocated(
                By.xpath("//button[contains(text(),'Đăng') and not(contains(text(),'Đang đăng'))]")
            ),
            10000
        );

        console.log("👉 Clicking post button");
        await postBtn.click();

        // ================= VERIFY =================
        console.log("👉 Waiting post render...");

        let isPosted = await driver.wait(async () => {
            let body = await driver.findElement(By.css("body")).getText();
            return body.includes(content);
        }, 10000).catch(() => false);

        if (isPosted) {
            console.log("=================================");
            console.log("✅ POST PASS");
            console.log("=================================");
            process.exitCode = 0;
        } else {
            console.log("=================================");
            console.log("❌ POST FAIL");

            let body = await driver.findElement(By.css("body")).getText();
            console.log("📄 Page content:");
            console.log(body);

            console.log("=================================");
            process.exitCode = 1;
        }

    } catch (err) {
        console.error("❌ TEST ERROR:", err);
        process.exitCode = 1;
    } finally {
        console.log("👉 Closing browser...");
        await driver.quit();
    }
})();