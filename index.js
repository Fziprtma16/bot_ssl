require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const { timeout } = require('puppeteer');
const prompt = require('prompt-sync')();
const path = require('path');

const Domain = process.env.DOMAIN;
const Website = process.env.WEB;
async function Login (page){
    await page.click('a[title="Sign in to your account"]');
    console.log('Loading ... ');
    await new Promise(r => setTimeout(r, 5000));
    console.log('Proses Login , Jika Anda Belum Mempunyai Account Silahkan Daftar di https://www.sslforfree.com ');

    const Username = prompt('Email : ');
    const Password = prompt.hide('Password : ');
    await page.type('input[name="login[email]"]', Username);
    await page.type('input[name="login[password]"]', Password);
    await page.click('button[type="submit"]');
}

async function CheckingLimited(page){
    try {
        await page.waitForSelector('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.is_lockable.finalize.open > div > form > div.plans.free_plan_unavailable > div.plan.free > div.bottom_section > a');
        const data =  await page.$eval('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.is_lockable.finalize.open > div > form > div.plans.free_plan_unavailable > div.plan.free > div.bottom_section > a',
        (el)=>getComputedStyle(el,":after").content);
        if(data == '"Limit Reached"'){
              console.log("Akun Anda Sudah Limited Untuk Free SSL");
              process.exit();
        }
    }catch{}

}


async function waitForDownload(page) {
    await page.waitForEvent('download');
  }

  async function moveDownloadedFile(page, targetDirectory) {
    const downloads = await page.browser().contexts()[0].downloads();
    const download = downloads.pop();
    await download.waitForFinished();
    const oldPath = download.path();
    const fileName = download.suggestedFilename();
    const newPath = path.join(targetDirectory, fileName);
    fs.renameSync(oldPath, newPath);
    console.log(' Good Job !!! , Certificate Sudah Di Dapatkan !');
  }

async function ConfirmasiVerif(page){
    const nextStepsVerifikasiData = prompt('Apakah Kamu Ingin Melanjutkan Verifikasi Data ? (ya/tidak)');
      if (nextStepsVerifikasiData.toLowerCase() === 'ya') {

          await page.waitForSelector('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.finalize.open > div > form > div.form_row.submit > a.button.run_validation');
          await page.click('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.finalize.open > div > form > div.form_row.submit > a.button.run_validation');
          console.log('Loading Proses ... ');
          console.log('Proses Verifikasi Memakan Waktu 1 Menit... ');
          await new Promise(r => setTimeout(r, 10000));
          try{
            await page.waitForSelector('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.finalize.open > div > form > div.form_row.verification_summary > table > tbody > tr > td.status > span',{timeout:10000})
          var dataverif = await page.$eval('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.finalize.open > div > form > div.form_row.verification_summary > table > tbody > tr > td.status > span',
          el=>el.innerText);
          console.log(dataverif);
          if(dataverif == "Unknown error "){
              const GagalVerif = prompt('Verifikasi Gagal Ulangi ? (ya/tidak)');
              if(GagalVerif.toLowerCase() === 'ya'){
                  ConfirmasiVerif(page)
              }else{
                process.exit();
              }
          }else if(dataverif == 'To start, click "Verify Domains"'){
            const GagalVerif = prompt('Verifikasi Gagal Ulangi ? (ya/tidak)');
              if(GagalVerif.toLowerCase() === 'ya'){
                  ConfirmasiVerif(page)
              }else{
                process.exit();
              }
          }

        }catch{}
        try{
        await page.waitForSelector('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.open > div > form > div.form_row.server_type > a',{timeout :20000});
        await page.click('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.open > div > form > div.form_row.server_type > a');
        console.log(' Good Job !!! , Certificate Sudah Di Dapatkan Di Directory Download Mu !!');


        }catch{}
      }else{
          console.log('Silahkan Verifikasi di https://manage.sslforfree.com');
          process.exit();
      }
  }

(async () =>{

    const browser = await puppeteer.launch({
        headless:false,
        executablePath : 'C:\\Users\\HP\\Downloads\\Compressed\\chrome-win\\chrome.exe'
    });

    const page = await browser.newPage();

    await page.goto(Website);


    Login(page);


    await page.waitForSelector('body > div:nth-child(5) > section > div > main > div > div > section.title_section > div > div.action > a');

    await page.click('body > div:nth-child(5) > section > div > main > div > div > section.title_section > div > div.action > a');

    let selector = 'body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.open > div';
    await page.waitForSelector(selector);


    await page.$eval(selector,(el)=> el.scrollIntoView({behavior:'smooth'}));
    await page.keyboard.press('Enter');

    console.log('Loading ... ');
    await new Promise(r => setTimeout(r, 2000));
    console.log('Proses Pengisian Domain ... ');
    // Isi Domain
    await page.waitForSelector('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.open > div > form > div.form_row.domains > div > div > input[type=text]:nth-child(3)');
    await page.type('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.open > div > form > div.form_row.domains > div > div > input[type=text]:nth-child(3)',Domain);

    console.log('Loading ... ');
    await new Promise(r => setTimeout(r, 2000));
    console.log('Proses Validity ... ');
    //Validity
    await page.waitForSelector('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li:nth-child(2)');
    await page.click('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li:nth-child(2)');
    await page.click('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.open > div > form > div:nth-child(2) > label > div');


    console.log('Loading ... ');
    await new Promise(r => setTimeout(r, 2000));
    console.log('Proses CSR Contact ... ');
    //CSR CONTACT
    await page.click('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li:nth-child(3)');

    console.log('Loading ... ');
    await new Promise(r => setTimeout(r, 2000));
    console.log('Proses Final Step ... ');
    //FINAL STEP
    await page.click('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.is_lockable.finalize.locked');

    console.log('Loading ... ');
    console.log('Proses Pengecekan Account ... ');

    CheckingLimited(page);


    let selectornext = 'body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.is_lockable.finalize.open > div > form > div.form_row.checkout > a';
    await page.$eval(selectornext,(el)=> el.scrollIntoView({behavior:'smooth'}));
    await page.waitForSelector('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.is_lockable.finalize.open > div > form > div.form_row.checkout > a');
    await page.click('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.is_lockable.finalize.open > div > form > div.form_row.checkout > a');

    console.log('Loading ... ');
    await new Promise(r => setTimeout(r, 7000));

    console.log('Verifikasi ... ');

    await page.waitForSelector('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.open > div > form > div:nth-child(3) > label > div.radio_button');
    await page.click('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.open > div > form > div:nth-child(3) > label > div.radio_button');

    const c_name = await page.$eval('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.open > div > form > div:nth-child(3) > label > div.verification_box > div:nth-child(2) > ol > li:nth-child(3) > ul > li:nth-child(1) > span',
el=>el.innerText);
    const c_to = await page.$eval('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.open > div > form > div:nth-child(3) > label > div.verification_box > div:nth-child(2) > ol > li:nth-child(3) > ul > li:nth-child(2) > span',
el=>el.innerText);
    const c_ttl = await page.$eval('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.open > div > form > div:nth-child(3) > label > div.verification_box > div:nth-child(2) > ol > li:nth-child(3) > ul > li:nth-child(3) > span',
el=> el.innerText);

console.log("1.Sign in to your DNS provider, typically the registrar of your domain.");
console.log('2.Navigate to the section where DNS records are managed.');
console.log('3.Add the following CNAME record:');

console.log("Cname = "+c_name);
console.log("To = "+ c_to);
console.log("TTL = "+ c_ttl);


reviews = [{
    'name' : c_name,
    'to' : c_to,
    'ttl' : c_ttl
}];
const filePath = './DNS_CNAME.txt';
const newLine = JSON.stringify(reviews);

fs.writeFileSync(filePath, newLine);
console.log('File Add DNS_CNAME.txt');

        const nextStepsPenyocokanData = prompt('Apakah Kamu Ingin Melanjutkan Proses Berikut Nya ? (ya/tidak)');
        if (nextStepsPenyocokanData.toLowerCase() === 'ya') {
          await page.waitForSelector('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.open > div > form > div:nth-child(5) > a', { timeout: 5000 });
          let selectorfinal = 'body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.open > div > form > div:nth-child(5) > a';
          await page.$eval(selectorfinal,(el)=> el.scrollIntoView({behavior:'smooth'}));
          await page.click('body > div:nth-child(5) > section > div > main > div > div > section.steps_container > ul > li.step.open > div > form > div:nth-child(5) > a');


        ConfirmasiVerif(page);





        } else {
          console.log('Anda memilih untuk tidak melanjutkan.');
          console.log('Silahkan Verifikasi di https://manage.sslforfree.com');
          process.exit();
        }

        // Menutup interface untuk mengakhiri program


    // await browser.close();


})();
