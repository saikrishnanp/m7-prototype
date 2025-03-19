import { colorSchemeDark, themeAlpine, iconSetMaterial } from "ag-grid-community";

export   const myTheme = themeAlpine.withParams({
    backgroundColor: 'rgb(249, 245, 227)',
    foregroundColor: 'rgb(126, 46, 132)',
    headerTextColor: 'rgb(204, 245, 172)',
    headerBackgroundColor: 'rgb(209, 64, 129)',
    oddRowBackgroundColor: 'rgb(0, 0, 0, 0.03)',
    headerColumnResizeHandleColor: 'rgb(126, 46, 132)',
    selectedRowBackgroundColor: 'red',
    iconSize: 18
}).withPart(colorSchemeDark).withPart(iconSetMaterial)