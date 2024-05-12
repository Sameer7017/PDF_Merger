

async function merge()
{
    const pdfInput=document.getElementById('pdfInput')
    const pdfFiles=pdfInput.files;

    if(pdfFiles.length<2){
        alert("Please Select at least two pdfs files")
        return;
    }

    const pdfDoc=await PDFLib.PDFDocument.create()
    for(let i=0;i<pdfFiles.length;i++)
    {
        const pdfFile=pdfFiles[i]
        const pdfBytes=await getPdfBytes(pdfFile)
        const existingPdfDoc=await PDFLib.PDFDocument.load(pdfBytes)
    
        const copiedPages= await pdfDoc.copyPages(existingPdfDoc,existingPdfDoc.getPageIndices())

        copiedPages.forEach(page=>{
            pdfDoc.addPage(page)
            
        });
    }
    const mergedPdfBytes=await pdfDoc.save()
    downloadPdf(mergedPdfBytes,"merged.pdf")
}

function downloadPdf(pdfBytes,filename){
    const blob=new Blob([pdfBytes],{
        type:'application/pdf'
    })
    const link=document.createElement('a')
    link.href=window.URL.createObjectURL(blob)
    link.download=filename
    link.click()
}
function getPdfBytes(pdffile)
{
    return new Promise((resolve,reject)=>{
        const reader=new FileReader()
        reader.onload=()=>resolve(new Uint8Array(reader.result))

        reader.onerror=(error)=>reject(error)
        reader.readAsArrayBuffer(pdffile)
    })
}