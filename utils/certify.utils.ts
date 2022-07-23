import * as puppeteer from "puppeteer";

export class CertifyyUtils {

    public static async startCertification(idDiplome : string, userName: string) {
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: ['--start-maximized', '--incognito', '--no-sandbox']
        }); // à modifier pour ne plus voir chrome
        const page = await browser.newPage();
        await page.goto(`https://diplome.gouv.fr/sanddiplome/verif`, { waitUntil: 'networkidle2' });
        // On attend que le formulaire soit chargé
        await page.waitForSelector("#content > div > sd-verif-home > div.form-connexion-block > div > div:nth-child(2) > div > sd-verif-home-form > form > div.field.field--email.icon-container > input");
        await page.waitForSelector("#content > div > sd-verif-home > div.form-connexion-block > div > div:nth-child(2) > div > sd-verif-home-form > form > div:nth-child(2) > input");
        return await this.fillForm(page, idDiplome, userName, browser);
    }

    public static async fillForm(page:  any, idDiplome : string  , userName: string, browser: any) {
        // On remplit le formulaire
        await page.type("#content > div > sd-verif-home > div.form-connexion-block > div > div:nth-child(2) > div > sd-verif-home-form > form > div.field.field--email.icon-container > input", userName);
        await page.type("#content > div > sd-verif-home > div.form-connexion-block > div > div:nth-child(2) > div > sd-verif-home-form > form > div:nth-child(2) > input", idDiplome);
        await page.click("#content > div > sd-verif-home > div.form-connexion-block > div > div:nth-child(2) > div > sd-verif-home-form > form > input");

        return await this.checkCertification(page, browser);
    }

    public static async checkCertification(page:  any, browser: any) {
        return await page.waitForSelector("#content > div > sd-verif-attestation > div > div.informations-responsive > section:nth-child(2) > article", {timeout: 15000})
        .then(async (page: any) => {
            console.log("Certification validée");
            const nom = await page.evaluate(() => {
                let infoDiplome : string[] = []
                const rechercheTitre = Array.from( document.querySelectorAll("#content > div > sd-verif-attestation > div > div.informations-responsive > section:nth-child(2) > article > div.card-content > div > div > div > div > p.diplome-title"));
                infoDiplome.push(rechercheTitre[0].innerHTML);
                const rechercheOption = Array.from( document.querySelectorAll("#content > div > sd-verif-attestation > div > div.informations-responsive > section:nth-child(2) > article > div.card-content > div > div > div > div > ul > li"));
                infoDiplome.push(rechercheOption[0].innerHTML);
                return infoDiplome;
            });
            await browser.close();
            return nom;
        }).catch(async (e: any) => {
            await browser.close();
            throw new Error(e);
        });
    }
}
