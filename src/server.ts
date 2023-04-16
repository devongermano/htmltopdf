// src/server.ts
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer-core';
import chromeLambda from 'chrome-aws-lambda';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/generate', async (req: Request, res: Response) => {
    const { url } = req.body;
    if (!url) {
        res.status(400).send('URL is required');
        return;
    }

    try {
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: await chromeLambda.executablePath,
            args: chromeLambda.args,
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${Date.now()}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
