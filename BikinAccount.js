require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const {timeout} = require('puppeteer');
const prompt = require('prompt-sync')();
const path = require('path');
const Domain = process.env.DOMAIN;
const Website ='https://manage.sslforfree.com/signup';

    (async()=>{
        let fileName = 'account.json'; 
        fs.readFile(fileName,'utf-8', (err,data)=>{
            if (err) {
                console.error('Gagal membaca file:', err);
                return;
            }

                const jsonData = JSON.parse(data);
                jsonData.forEach( async (item, index) => {

                    const browser = await puppeteer.launch({
                        headless:false,
                        executablePath : 'C:\\Users\\HP\\Downloads\\Compressed\\chrome-win\\chrome.exe'
                    });
                
                    const page = await browser.newPage();
                
                    await page.goto(Website);

                    console.log('Loading ... ');
                    await new Promise(r => setTimeout(r, 5000));
                    await page.type('input[name="signup[email]"]', item.email);
                    await page.type('input[name="signup[password]"]', item.password);
                    await page.click('button[type="submit"]');
                    await new Promise(r => setTimeout(r, 5000));

                    try{
                       const alert = await page.waitForSelector('.alert.error');
                        if (alert) {
                            console.log('Login Gagal !');
                        }

                    }catch{}
                    await new Promise(r => setTimeout(r, 5000));
                    console.log("Berhasil Login !");
                    await browser.close();
                });
            
        });
   

       


    })();
