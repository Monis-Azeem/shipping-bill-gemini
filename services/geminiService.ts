
import { GoogleGenAI, Type } from "@google/genai";
import { ShippingBillData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        csbNumber: { type: Type.STRING, description: "The CSB Number (e.g., CSBV_DEL_...)." },
        fillingDate: { type: Type.STRING, description: "The Filling Date (e.g., DD/MM/YYYY)." },
        courierRegistrationNumber: { type: Type.STRING, description: "The Courier Registration Number." },
        courierName: { type: Type.STRING, description: "The name of the courier (e.g., FEDEX)." },
        hawbNumber: { type: Type.STRING, description: "The HAWB Number." },
        numberOfPackages: { type: Type.INTEGER, description: "The number of packages." },
        declaredWeightKg: { type: Type.NUMBER, description: "The Declared Weight in Kgs." },
        airportOfDestination: { type: Type.STRING, description: "The Airport of Destination (e.g., NYC)." },
        consignorName: { type: Type.STRING, description: "The name of the Consignor." },
        consignorAddress: { type: Type.STRING, description: "The full address of the Consignor." },
        consigneeName: { type: Type.STRING, description: "The name of the Consignee." },
        consigneeAddress: { type: Type.STRING, description: "The full address of the Consignee." },
        invoiceNumber: { type: Type.STRING, description: "The Invoice Number from the INVOICE DETAILS section." },
        invoiceDate: { type: Type.STRING, description: "The Invoice Date from the INVOICE DETAILS section (e.g., DD/MM/YYYY)." },
        fobValueInr: { type: Type.NUMBER, description: "The FOB Value in INR." },
        fobValueForeign: { type: Type.NUMBER, description: "The FOB Value in Foreign Currency." },
        fobCurrency: { type: Type.STRING, description: "The FOB Currency (e.g., USD)." },
        lineItems: {
            type: Type.ARRAY,
            description: "A list of all items from the ITEM DETAILS section.",
            items: {
                type: Type.OBJECT,
                properties: {
                    description: { type: Type.STRING, description: "Goods Description of the item." },
                    sku: { type: Type.STRING, description: "SKU NO of the item." },
                    ctsh: { type: Type.STRING, description: "CTSH of the item." },
                    quantity: { type: Type.INTEGER, description: "Quantity of the item." },
                    unitPrice: { type: Type.NUMBER, description: "Unit Price of the item." },
                    unitPriceCurrency: { type: Type.STRING, description: "Unit Price Currency (e.g., USD)." },
                    totalValue: { type: Type.NUMBER, description: "Total Item Value." },
                    unitOfMeasure: { type: Type.STRING, description: "Unit Of Measure (e.g., UNT)." }
                },
            },
        }
    }
};

const prompt = `You are an expert data extraction AI specializing in logistics documents. Analyze the provided image of a "Courier Shipping Bill (CSB)-V". Extract all available information based on the provided JSON schema. Pay close attention to all sections, including courier details, HAWB details, consignor/consignee information, financial values, and the item details on the second page. If a field or section is not present on the current page, omit it from the output. Some information might be split across two pages.`;


export async function extractDataFromImage(imageBase64: string): Promise<Partial<ShippingBillData>> {
    const base64Data = imageBase64.split(',')[1];
    
    const imagePart = {
        inlineData: {
            data: base64Data,
            mimeType: 'image/jpeg',
        },
    };

    const textPart = {
        text: prompt,
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: [textPart, imagePart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as Partial<ShippingBillData>;
    } catch (e) {
        console.error("Failed to parse JSON response from Gemini:", jsonText);
        throw new Error("Invalid JSON response from AI model.");
    }
}
