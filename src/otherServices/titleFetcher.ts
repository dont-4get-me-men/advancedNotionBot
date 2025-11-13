export async function getUrlTitle(url: string, needDomain:boolean = false): Promise<string> {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const hostname = new URL(url).hostname;
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
            const res = needDomain ? hostname+": "+titleMatch[1] : titleMatch[1];
            return res;
        } 
          
        const h1Match = html.match(/<h1.*?>(.*?)<\/h1>/i);
        if (h1Match && h1Match[1]) {
            const res = needDomain ? hostname+": "+h1Match[1] : h1Match[1];
            return res;
        }

        const h2Match = html.match(/<h2.*?>(.*?)<\/h2>/i);
        if (h2Match && h2Match[1]) {
            const res = needDomain ? hostname+": "+h2Match[1] : h2Match[1];
            return res;
        }
        
        return "No title found";
    } catch (error) {
        return `Error fetching URL: ${error}`;
    }
}
   

