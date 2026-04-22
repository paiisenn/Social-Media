const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

(async function testLogin() {

    //  cấu hình Chrome cho CI
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
        console.log("Open login page");
        await driver.get("https://social-media-frontend-94uz.onrender.com/login");

        console.log("Waiting for email input...");
        await driver.wait(until.elementLocated(By.id("email")), 15000);

        console.log("Enter email");
        await driver.findElement(By.id("email")).sendKeys("phamxuanhoa@gmail.com");

        console.log("Enter password");
        await driver.findElement(By.id("password")).sendKeys("123456781");

        console.log("Click login");
        await driver.findElement(By.css('button[type="submit"]')).click();

        console.log("Checking login result...");


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
            process.exit(0);
        }

        // fallback
        console.log("LOGIN FAIL (unknown)");
        process.exit(1);
                
        // console.log("Waiting for redirect...");
        // await driver.wait(async () => {
        //     let url = await driver.getCurrentUrl();
        //     return !url.includes("/login");
        // }, 15000);

        // let currentUrl = await driver.getCurrentUrl();
        // console.log(" Current URL:", currentUrl);

        // check thành công
        // if (currentUrl === "https://social-media-frontend-94uz.onrender.com/") {
        //     console.log(" LOGIN PASS");
        //     process.exit(0); // SUCCESS
        // } else {
        //     console.log(" LOGIN FAIL");
        //     let body = await driver.findElement(By.css("body")).getText();
        //     console.log("Page content:");
        //     console.log(body);
        //     process.exit(1); // FAIL
        // }

    } catch (err) {
        console.error(" ERROR:", err);
        throw err;
    } finally {
        await driver.quit();
    }
})();