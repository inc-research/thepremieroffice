/**
 * Model Context Protocol (MCP) Search Handler
 * This script simulates the backend logic for an AI agent to search content.
 * In a live "git push to static site generator" setup, the 'wine_weather_data.json'
 * file would be updated with each git push. This script would then fetch that
 * JSON file to perform searches, rather than using the hardcoded 'database' object.
 */

// Placeholder for your site's data. This would be in a separate JSON file in a live environment.
const database = {
    reports: [
        {
            jsonrpc: "2.0",
            method: "getReport",
            id: { region: "Mendoza Region", country: "Argentina", report_date: "2025-07-26" },
            params: {
                climate_variability_month_to_month_percentage: 4.20,
                primary_driver: "Longwave Solar Radiation",
                primary_driver_share_percent: 10.96,
            }
        },
        {
            jsonrpc: "2.0",
            method: "getReport",
            id: { region: "Marlborough Region", country: "New Zealand", report_date: "2025-07-26" },
            params: {
                climate_variability_month_to_month_percentage: 0.09,
                primary_driver: "Specific Humidity",
                primary_driver_share_percent: 11.33
            }
        },
        {
            jsonrpc: "2.0",
            method: "getReport",
            id: { region: "Western Australia Region", country: "Australia", report_date: "2025-07-26" },
            params: {
                climate_variability_month_to_month_percentage: 0.78,
                primary_driver: "Longwave Solar Radiation",
                primary_driver_share_percent: 11.27
            }
        },
       
        }
    ],
    definitions: {
        jsonrpc: "2.0",
        method: "getDefinitions",
        id: "premier-method-definitions",
        result: {
            "Climate Variability": "A measure of weather condition variance using Information Theory entropy, expressed in 'bits'. Higher bits mean more variability.",
            "Primary Driver": "The single weather measurement (e.g., Temperature, Precipitation) that contributes the most entropy to the total Climate Variability for a region.",
            "Month to Month Change": "The difference in the total 'Climate Variability' from the previous month, indicating a trend."
        }
    }
};

/**
 * Handles search requests from an AI agent.
 * @param {string} searchType - The type of search: "Search by location", "Search most Recent", "Search Definitions".
 * @param {object} [params] - Additional parameters for the search, e.g., { region: "Barossa Valley" }.
 * @returns {object} A JSON-RPC compliant response object.
 */
function mcpSearch(searchType, params = {}) {
    let result = null;
    const jsonrpc = "2.0";
    const id = Date.now(); // Simple unique ID for the response

    switch (searchType) {
        case "Search by location":
            if (!params.region && !params.country) {
                return { jsonrpc, id, error: { code: -32602, message: "Invalid params: 'region' or 'country' is required." } };
            }
            result = database.reports.filter(report => {
                const id = report.id;
                const matchRegion = params.region ? id.region.toLowerCase() === params.region.toLowerCase() : true;
                const matchCountry = params.country ? id.country.toLowerCase() === params.country.toLowerCase() : true;
                return matchRegion && matchCountry;
            });
            break;

        case "Search most Recent":
            result = database.reports
                .sort((a, b) => new Date(b.id.report_date) - new Date(a.id.report_date))
                .slice(0, 3);
            break;

        case "Search Definitions":
            result = database.definitions;
            break;

        default:
            return { jsonrpc, id, error: { code: -32601, message: "Method not found" } };
    }

    return { jsonrpc, id, result };
}

